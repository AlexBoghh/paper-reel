
gsap.registerPlugin(ScrollTrigger);
window.addEventListener('DOMContentLoaded', () => {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ duration: 1.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }


const paragraph_mwg_005 = document.querySelector('.mwg_effect005 .paragraph');
wrapWordsInSpan(paragraph_mwg_005);

const pinHeight_mwg_005 = document.querySelector('.mwg_effect005 .pin-height');
const container_mwg_005 = document.querySelector('.mwg_effect005 .container');
const words_mwg_005 = document.querySelectorAll('.mwg_effect005 .word');

gsap.to(words_mwg_005, {
  x: 0,
  stagger: 0.02,
  ease: 'power4.inOut',
  scrollTrigger: {
    trigger: pinHeight_mwg_005,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    pin: container_mwg_005
  }
});


const root_mwg_042 = document.querySelector('.mwg_effect042');
const pinHeight_mwg_042 = root_mwg_042.querySelector('.pin-height');
const container_mwg_042 = root_mwg_042.querySelector('.container');

ScrollTrigger.create({
  trigger: pinHeight_mwg_042,
  start: 'top top',
  end: 'bottom bottom',
  pin: container_mwg_042
});

let gap_mwg_042 = 30;
const medias_mwg_042 = root_mwg_042.querySelectorAll('.media');
const distPerMedia_mwg_042 = (pinHeight_mwg_042.clientHeight - window.innerHeight) / medias_mwg_042.length;

gsap.set(medias_mwg_042, {
  y: gap_mwg_042 * (medias_mwg_042.length - 1),
  z: -gap_mwg_042 * (medias_mwg_042.length - 1)
});

medias_mwg_042.forEach((media, index) => {
  const tl_mwg_042 = gsap.timeline({
    scrollTrigger: {
      trigger: pinHeight_mwg_042,
      start: 'top top+=' + (distPerMedia_mwg_042 * index),
      end: 'bottom bottom+=' + (distPerMedia_mwg_042 * index),
      scrub: 0.5
    }
  });

  for (let i = 0; i < medias_mwg_042.length - 1; i++) {
    tl_mwg_042.to(media, {
      y: '-=' + gap_mwg_042,
      z: '+=' + gap_mwg_042,
      ease: 'back.inOut(3)'
    });
  }

  tl_mwg_042.to(media, {
    yPercent: -80,
    y: '-50vh',
    scale: 1.2,
    rotation: (Math.random() - 0.5) * 50,
    ease: 'power4.in'
  });
});


  requestAnimationFrame(() => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 100);
});
window.addEventListener('load', () => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });

function wrapLettersInSpan(element) {
  const text = element.textContent;
  element.innerHTML = text.split('')
    .map(c => c === ' ' ? '<span>&nbsp;</span>' : '<span class="letter">' + c + '</span>').join(' ');
}

function wrapWordsInSpan(element) {
  const text = element.textContent;
  element.innerHTML = text
    .split(' ')
    .map(word => '<span class="word">' + word + '</span>')
    .join(' ');
}
