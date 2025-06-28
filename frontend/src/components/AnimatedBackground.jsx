import React from 'react';
import '../estilos/AnimatedBackground.css';

export default function AnimatedBackground() {
  return (
    <div className="App">
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}vw`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s, 4s`,
              width: `${5 + Math.random() * 10}px`,
              height: `${5 + Math.random() * 10}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
