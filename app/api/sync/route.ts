import { NextResponse } from 'next/server';
import db from '@/lib/prisma';
import { getDetails } from '@/app/_queries/queries';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const h = await headers();
    const key = h.get('x-api-key');

    if (key !== process.env.SYNC_KEY) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const maxAge = 24;
    const batchSize = 10;
    const maxAgeMs = maxAge * 60 * 60 * 1000;
    const cutoffTime = new Date(Date.now() - maxAgeMs);

    const staleMovies = await db.movie.findMany({
      where: { lastRatingSync: { lt: cutoffTime } },
      take: batchSize,
      orderBy: { lastRatingSync: 'asc' },
    });

    if (staleMovies.length === 0) {
      console.log('No movies need rating sync');
      return NextResponse.json({
        success: true,
        data: { synced: 0, failed: 0 },
        message: 'No movies needed rating sync',
      });
    }

    console.log(`Syncing ratings for ${staleMovies.length} movies`, {
      movieCount: staleMovies.length,
    });

    let synced = 0;
    let failed = 0;
    const updatePromises: Promise<void>[] = [];

    for (let i = 0; i < staleMovies.length; i += 3) {
      const batch = staleMovies.slice(i, i + 3);

      const batchPromises = batch.map(async (movie) => {
        try {
          // Fetch current movie data from TMDB
          const response = await getDetails({
            id: movie.id.toString(),
            type: movie.type as 'movie' | 'tv',
          });

          if (!response.success || !response.data) {
            console.warn('Failed to fetch movie data from TMDB', {
              movieId: movie.id,
              error: response.message,
            });
            failed++;
            return;
          }

          const tmdbData = response.data;
          const newRating = Number(tmdbData.vote_average.toFixed()) || 0;

          // Always update lastRatingSync to prevent infinite syncing
          const updateData: { vote_average: number; lastRatingSync: Date } = {
            vote_average: newRating,
            lastRatingSync: new Date(),
          };

          updatePromises.push(
            db.movie
              .update({
                where: { id: movie.id },
                data: updateData,
              })
              .then(() => {
                const hasChanged = movie.vote_average !== newRating;
                console.log('Synced movie rating', {
                  movieId: movie.id,
                  title: movie.title,
                  oldRating: movie.vote_average,
                  newRating,
                  changed: hasChanged,
                });
              }),
          );

          synced++;
        } catch (error) {
          console.error('Failed to sync movie rating', {
            movieId: movie.id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          failed++;
        }
      });

      await Promise.allSettled(batchPromises);

      if (i + 3 < staleMovies.length) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }

    if (updatePromises.length > 0) {
      await Promise.allSettled(updatePromises);
    }

    console.log('Rating sync completed', {
      synced,
      failed,
      total: staleMovies.length,
      updated: updatePromises.length,
    });

    return NextResponse.json({
      success: true,
      data: { synced, failed },
      message: `Successfully synced ${synced} movie ratings`,
    });
  } catch (error) {
    console.error('Error syncing movie ratings:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sync movie ratings',
      },
      { status: 500 },
    );
  }
}
