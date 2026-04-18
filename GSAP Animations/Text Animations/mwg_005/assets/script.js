gsap.registerPlugin(ScrollTrigger)

window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LIENIS SMOOTH SCROLL (OPTIONAL) */

    gsap.to('.scroll', {
        autoAlpha:0,
        duration:0.2,
        scrollTrigger: {
            trigger:'.mwg_effect005',
            start:'top top',
            end:'top top-=1',
            toggleActions: "play none reverse none"
        }
    })

    const paragraph = document.querySelector(".mwg_effect005 .paragraph")
    wrapWordsInSpan(paragraph)

    const pinHeight = document.querySelector(".mwg_effect005 .pin-height")
    const container = document.querySelector(".mwg_effect005 .container")
    const words = document.querySelectorAll(".mwg_effect005 .word")

    gsap.to(words, {
        x: 0, // Animate the 'x' property to 0
        stagger: 0.02, // Stagger the animation of each element by 0.02 seconds
        ease: 'power4.inOut', // Use a power4 easing function for smooth start and end
        scrollTrigger: {
            trigger: pinHeight, // We listen to pinHeight position
            start: 'top top', // Start the animation when the top of the trigger hits the top of the viewport
            end: 'bottom bottom', // End the animation when the bottom of the trigger hits the bottom of the viewport
            scrub: true, // Smoothly scrub the animation based on scroll position
            pin: container, // Let's pin our container while all the words animate
        }
    })
})

// UTIL METHOD
function wrapWordsInSpan(element) {
    const text = element.textContent;
    element.innerHTML = text
        .split(' ')
        .map(word => `<span class="word">${word}</span>`)
        .join(' ');
}