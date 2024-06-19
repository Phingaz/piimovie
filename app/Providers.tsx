"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { MainCtxProvider } from "./_context/Main";
import dynamic from "next/dynamic";

const Providers = ({ children }: { children: React.ReactNode }) => {
  if (typeof window !== "undefined") {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
    });
  }
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
      },
    },
  });

  return (
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <MainCtxProvider>{children}</MainCtxProvider>
      </QueryClientProvider>
    </PostHogProvider>
  );
};

const P = dynamic(() => Promise.resolve(Providers), {
  ssr: false,
});

export default P;
