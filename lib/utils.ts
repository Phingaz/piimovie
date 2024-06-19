import { MovieResponse } from "@/app/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomMovie(data: MovieResponse | undefined) {
  if (!data) return null;

  const random = Math.floor(Math.random() * 20);
  return data.results[random];
}

export const cleanDate = (date: string) => {
  const dateObject = new Date(date);
  const formattedDate = dateObject.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formattedDate;
};

export const runTimeInHourAndMin = (runtime: number) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return `${hours}h ${minutes}m`;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};
