'use server';
import db from '@/lib/prisma';
import { User } from 'better-auth';
import { movie } from '@prisma/client';
import { ListType } from '../types/utils';

export const getFavorites = async (user: User) => {
  return await db.movie.findMany({ where: { userId: user.id } });
};

export const addToFavorites = async (type: ListType, movie: movie, user: User) => {
  if (!user || !movie) return null;

  const { id, poster_path, title, vote_average } = movie;
  const userId = user.id;

  await db.movie.create({
    data: {
      id,
      poster_path,
      type,
      title,
      vote_average,
      userId,
    },
  });
};

export const removeFromFavorites = async (id: number) => {
  if (!id) return;
  await db.movie.delete({ where: { id } });
};
