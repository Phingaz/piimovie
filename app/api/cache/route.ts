import { NextRequest, NextResponse } from 'next/server';
import CacheManager from '@/lib/cache-manager';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'stats':
        return NextResponse.json({
          success: true,
          data: CacheManager.getStats(),
        });

      case 'debug':
        return NextResponse.json({
          success: true,
          data: CacheManager.getDebugInfo(),
        });

      case 'monitor':
        return NextResponse.json({
          success: true,
          data: CacheManager.monitorPerformance(),
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            stats: CacheManager.getStats(),
            size: CacheManager.getSize(),
            performance: CacheManager.monitorPerformance(),
          },
        });
    }
  } catch (error) {
    logger.error('Cache API error', {}, error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve cache information',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, pattern } = body;

    switch (action) {
      case 'clear':
        CacheManager.clearAll();
        return NextResponse.json({
          success: true,
          message: 'Cache cleared successfully',
        });

      case 'clearPattern':
        if (!pattern) {
          return NextResponse.json(
            {
              success: false,
              message: 'Pattern is required for clearPattern action',
            },
            { status: 400 },
          );
        }
        const deletedCount = CacheManager.clearByPattern(pattern);
        return NextResponse.json({
          success: true,
          message: `Cleared ${deletedCount} entries matching pattern`,
          data: { deletedCount },
        });

      case 'cleanup':
        const cleanedCount = CacheManager.cleanup();
        return NextResponse.json({
          success: true,
          message: `Cleaned up ${cleanedCount} expired entries`,
          data: { cleanedCount },
        });

      case 'resetStats':
        CacheManager.resetStats();
        return NextResponse.json({
          success: true,
          message: 'Cache statistics reset successfully',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid action',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    logger.error('Cache API POST error', {}, error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to perform cache action',
      },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    CacheManager.clearAll();
    return NextResponse.json({
      success: true,
      message: 'All cache entries deleted successfully',
    });
  } catch (error) {
    logger.error('Cache API DELETE error', {}, error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete cache entries',
      },
      { status: 500 },
    );
  }
}
