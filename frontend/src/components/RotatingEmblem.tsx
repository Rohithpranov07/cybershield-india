import React from 'react';
import emblemImage from 'figma:asset/c676f7b079899a84b0511549e8ec56744952e077.png';

export function RotatingEmblem() {
  return (
    <div className="flex justify-center items-center">
      <div 
        className="emblem-container"
        style={{
          perspective: '3000px',
          width: '900px',
          height: '900px'
        }}
      >
        <div 
          className="emblem-3d"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            animation: 'rotateEmblem 8s linear infinite'
          }}
        >
          <img 
            src={emblemImage} 
            alt="National Emblem of India"
            className="emblem-image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backfaceVisibility: 'visible'
            }}
          />
        </div>
      </div>
      
      <style>{`
        @keyframes rotateEmblem {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
        
        .emblem-3d {
          transform-origin: center center;
        }
        
        .emblem-container:hover .emblem-3d {
          animation-play-state: paused;
        }
        
        .emblem-image {
          filter: drop-shadow(0 30px 75px rgba(0, 0, 0, 0.3));
          mix-blend-mode: multiply;
        }
      `}</style>
    </div>
  );
}