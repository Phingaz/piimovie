'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Link2, Linkedin } from 'lucide-react';
import { movieCat, tvShowsCat } from '@/lib/arrays';
import useCookies from '@/app/_hooks/useCookies';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { setCookie } = useCookies();

  // Reusable scroll to top function
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Component for footer links with consistent behavior
  const FooterLink = ({
    href,
    children,
    external = false,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    external?: boolean;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={() => {
        if (!external) scrollToTop();
        onClick?.();
      }}
      className="hover:text-white transition-colors"
    >
      {children}
    </Link>
  );

  return (
    <footer className="w-full bg-black text-gray-400 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex gap-8 flex-col md:flex-row">
          <div className="space-y-4 flex-[4]">
            <FooterLink href="/" onClick={() => {}}>
              <span className="font-bold text-lg text-gray-300 flex gap-3 items-start">
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
              </span>
            </FooterLink>
            <p className="text-sm max-w-[300px]">
              Your ultimate destination for movie information, reviews, and recommendations.
            </p>
            <div className="flex space-x-4">
              <FooterLink href="https://github.com/Phingaz" external>
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </FooterLink>
              <FooterLink href="https://pnoya.com" external>
                <Link2 size={20} />
                <span className="sr-only">Portfolio</span>
              </FooterLink>
              <FooterLink href="https://www.linkedin.com/in/piinoya" external>
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </FooterLink>
            </div>
          </div>

          <div className="flex-[6] flex justify-between flex-wrap gap-8">
            <div className="space-y-4">
              <h2 className="font-bold text-lg text-gray-300">Quick Links</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <FooterLink href="/">Home</FooterLink>
                </li>
                <li>
                  <FooterLink href="/movie">Movies</FooterLink>
                </li>
                <li>
                  <FooterLink href="/tv">TV Shows</FooterLink>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-bold text-lg text-gray-300">Movies</h2>
              <ul className="space-y-2 text-sm">
                {movieCat.map((el) => (
                  <li key={el.href}>
                    <FooterLink href={el.href} onClick={() => setCookie('t', 'movie')}>
                      {el.title}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-bold text-lg text-gray-300">TV Shows</h2>
              <ul className="space-y-2 text-sm">
                {tvShowsCat.map((el) => (
                  <li key={el.href}>
                    <FooterLink href={el.href} onClick={() => setCookie('t', 'tv')}>
                      {el.title}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <FooterLink href="https://www.themoviedb.org/" external>
              <span className="text-[10px] text-gray-400">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
              </span>
            </FooterLink>
          </div>
          <div className="text-xs">© {currentYear} PiiMovie. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
