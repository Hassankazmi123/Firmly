import React, { useEffect, useRef, useState } from "react";

const ScrollReveal = ({ children, direction = "up", delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Safely unobserve the target once revealed
          if (entry.target instanceof Element) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% is visible
    });

    const currentRef = domRef.current;
    if (currentRef && currentRef instanceof Element) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef && currentRef instanceof Element) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  const directionClass = `reveal-${direction}`;

  return (
    <div
      ref={domRef}
      className={`reveal ${directionClass} ${isVisible ? "active" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
