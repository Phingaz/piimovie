'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Link2, Linkedin } from 'lucide-react';
import { movieCat, tvShowsCat } from '@/lib/constants';
import useCookies from '@/app/_hooks/useCookies';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { setCookie } = useCookies();

  return (
    <footer className="w-full bg-black text-gray-400 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex gap-8 flex-col md:flex-row">
          <div className="space-y-4 flex-[4]">
            <Link
              href="/"
              onClick={() => {
                if (!window) return;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-bold text-lg text-gray-300 flex gap-3 items-start"
            >
              <Image
                priority
                src="/logo.png"
                width={60}
                height={60}
                alt="logo"
                unoptimized
                className="object-contain size-[60px] object-top"
              />
              PiiMovie
            </Link>
            <p className="text-sm max-w-[300px]">
              Your ultimate destination for movie information, reviews, and recommendations.
            </p>
            <div className="flex space-x-4">
              <Link target="_blank" href="https://github.com/Phingaz" className="hover:text-white transition-colors">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link target="_blank" href="https://pnoya.com" className="hover:text-white transition-colors">
                <Link2 size={20} />
                <span className="sr-only">Portfolio</span>
              </Link>
              <Link
                target="_blank"
                href="https://www.linkedin.com/in/piinoya"
                className="hover:text-white transition-colors"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div className="flex-[6] flex justify-between flex-wrap gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-300">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    onClick={() => {
                      if (!window) return;
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    href="/"
                    className="hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => {
                      if (!window) return;
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    href="/movie"
                    className="hover:text-white transition-colors"
                  >
                    Movies
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => {
                      if (!window) return;
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    href="/tv"
                    className="hover:text-white transition-colors"
                  >
                    TV Shows
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-300">Movies</h3>
              <ul className="space-y-2 text-sm">
                {movieCat.map((el) => {
                  return (
                    <li key={el.href} onClick={() => setCookie('t', 'movie')}>
                      <Link
                        href={el.href}
                        onClick={() => {
                          if (!window) return;
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="hover:text-white transition-colors"
                      >
                        {el.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-300">Tv Shows</h3>
              <ul className="space-y-2 text-sm">
                {tvShowsCat.map((el) => {
                  return (
                    <li key={el.href} onClick={() => setCookie('t', 'tv')}>
                      <Link
                        href={el.href}
                        onClick={() => {
                          if (!window) return;
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="hover:text-white transition-colors"
                      >
                        {el.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
              onClick={() => {
                if (!window) return;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="text-[10px] text-gray-500">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
              </span>
            </Link>
          </div>
          <div className="text-xs">© {currentYear} PiiMovie. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
