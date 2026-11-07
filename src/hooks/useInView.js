import { useEffect, useState } from 'react';

export default function useInView(ref, { threshold = 0.2, initial = false } = {}) {
  const [inView, setInView] = useState(initial);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return inView;
}
