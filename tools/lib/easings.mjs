import gsap from 'gsap';

export function evalEase(name, t) {
  const ease = gsap.parseEase(name);
  if (typeof ease !== 'function') {
    throw new Error(`Unknown ease: ${name}`);
  }
  return ease(t);
}

export function sample(easeName, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    out.push({ t, v: evalEase(easeName, t) });
  }
  return out;
}
