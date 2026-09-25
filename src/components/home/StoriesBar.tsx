'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';
import { STORIES_DATA } from '@/data/catalog';

export const StoriesBar: React.FC = () => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const activeStory = activeStoryIndex !== null ? STORIES_DATA[activeStoryIndex] : null;

  // Auto advance story progress
  useEffect(() => {
    if (activeStoryIndex === null) {
      setProgress(0);
      return;
    }

    const interval = 50; // Update every 50ms
    const step = 100 / (5000 / interval); // 5 seconds per story

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next story or close
          if (activeStoryIndex < STORIES_DATA.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activeStoryIndex]);

  const handleNext = () => {
    if (activeStoryIndex !== null && activeStoryIndex < STORIES_DATA.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setProgress(0);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setProgress(0);
    }
  };

  return (
    <div className="py-4 border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
          {STORIES_DATA.map((story, index) => (
            <button
              key={story.id}
              onClick={() => {
                setActiveStoryIndex(index);
                setProgress(0);
              }}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none"
              aria-label={`Ver historia de ${story.title}`}
            >
              {/* Outer gradient border ring */}
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-brand-red via-brand-gold to-brand-green group-hover:scale-105 transition-transform duration-300">
                <div className="p-0.5 bg-white rounded-full">
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={story.thumbnail}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {story.badge && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-brand-red text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter shadow-sm whitespace-nowrap">
                    {story.badge}
                  </span>
                )}
              </div>

              <span className="text-xs font-semibold text-gray-700 group-hover:text-brand-red transition-colors truncate max-w-[76px] text-center">
                {story.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
          {/* Close button */}
          <button
            onClick={() => setActiveStoryIndex(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 z-50"
            aria-label="Cerrar historia"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Container */}
          <div className="relative w-full max-w-sm h-[600px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/10">
            {/* Progress Bar Header */}
            <div className="absolute top-0 left-0 right-0 p-3 z-30 space-y-2 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex gap-1.5">
                {STORIES_DATA.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-white transition-all duration-75"
                      style={{
                        width:
                          i === activeStoryIndex
                            ? `${progress}%`
                            : i < activeStoryIndex!
                            ? '100%'
                            : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/60">
                    <Image src={activeStory.thumbnail} alt={activeStory.title} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-none">{activeStory.title}</p>
                    <p className="text-[10px] text-white/70">OK Shop Promociones</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold bg-brand-red text-white px-2 py-0.5 rounded-full">
                  {activeStory.badge || 'PROMO'}
                </span>
              </div>
            </div>

            {/* Main Story Image */}
            <div className="relative w-full h-full">
              <Image
                src={activeStory.highlightImage}
                alt={activeStory.title}
                fill
                className="object-cover"
                priority
              />

              {/* Click navigation zones */}
              <div
                className="absolute inset-y-0 left-0 w-1/3 cursor-pointer z-20"
                onClick={handlePrev}
                title="Historia anterior"
              />
              <div
                className="absolute inset-y-0 right-0 w-1/3 cursor-pointer z-20"
                onClick={handleNext}
                title="Siguiente historia"
              />
            </div>

            {/* Bottom Caption & CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent text-white z-30 space-y-3">
              <p className="text-sm font-medium text-white/95 leading-snug">
                {activeStory.caption}
              </p>

              <div className="pt-1 flex gap-2">
                <Link
                  href={activeStory.link}
                  onClick={() => setActiveStoryIndex(null)}
                  className="flex-1 py-3 px-4 bg-brand-red hover:bg-brand-red-dark text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-red-900/50"
                >
                  <span>{activeStory.cta}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={`https://wa.me/573017777760?text=${encodeURIComponent(
                    `Hola OK Shop! Vi la historia sobre "${activeStory.title}" y quiero más información.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-brand-whatsapp hover:bg-green-600 text-white rounded-xl font-bold text-xs flex items-center justify-center transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Navigation arrows */}
            {activeStoryIndex !== null && activeStoryIndex > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-1 rounded-full bg-black/30 hover:bg-black/60 z-30"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {activeStoryIndex !== null && activeStoryIndex < STORIES_DATA.length - 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-1 rounded-full bg-black/30 hover:bg-black/60 z-30"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
