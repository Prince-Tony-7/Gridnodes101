"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Clock, Play } from "lucide-react";
import { useState } from "react";
import { withBasePath } from "@/lib/basePath";
import type { DemoVideo, VideoSource } from "@/lib/types";
import { DemoPoster } from "./DemoPoster";

function embedUrl(source: Exclude<VideoSource, { kind: "file" }>): string {
  switch (source.kind) {
    case "youtube":
      return `https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&rel=0&modestbranding=1`;
    case "vimeo":
      return `https://player.vimeo.com/video/${source.id}?autoplay=1&title=0&byline=0`;
    case "loom":
      return `https://www.loom.com/embed/${source.id}?autoplay=1&hide_owner=true`;
  }
}

/**
 * Click-to-play player. Nothing third-party loads until the visitor presses
 * play, which keeps the page fast and avoids tracking cookies up front.
 */
export function VideoPlayer({ demo }: { demo: DemoVideo }) {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const { source } = demo;

  return (
    <div className="pop relative aspect-video w-full overflow-hidden rounded-card bg-deep">
      {playing && source ? (
        source.kind === "file" ? (
          <video
            className="absolute inset-0 h-full w-full bg-black"
            src={withBasePath(source.src)}
            poster={demo.poster ? withBasePath(demo.poster) : undefined}
            controls
            autoPlay
            playsInline
          />
        ) : (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedUrl(source)}
            title={demo.title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          />
        )
      ) : (
        <button
          type="button"
          onClick={() => source && setPlaying(true)}
          disabled={!source}
          aria-label={source ? `Play demo: ${demo.title}` : `${demo.title}: recording coming soon`}
          className="group absolute inset-0 cursor-pointer disabled:cursor-default"
        >
          <DemoPoster demo={demo} />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" aria-hidden />

          {/* play button */}
          <span className="absolute inset-0 flex items-center justify-center pt-[14%]" aria-hidden>
            {source ? (
              <span className="relative flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
                {!reduce && <span className="absolute inset-0 animate-ping rounded-full bg-coral/30 [animation-duration:2s]" />}
                <motion.span
                  whileHover={{ scale: 1.08 }}
                  className="relative flex h-full w-full items-center justify-center rounded-full bg-coral text-white shadow-[0_12px_32px_-8px_rgb(242_107_29/0.7)] transition-transform group-hover:scale-105"
                >
                  <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
                </motion.span>
              </span>
            ) : (
              <span className="rounded-full border border-white/20 bg-ink/70 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                Recording coming soon
              </span>
            )}
          </span>

{demo.duration && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-ink/75 px-2 py-1 font-mono text-xs text-white backdrop-blur sm:bottom-4 sm:left-4">
            <Clock className="h-3 w-3" aria-hidden />
            {demo.duration}
          </span>
          )}
        </button>
      )}
    </div>
  );
}
