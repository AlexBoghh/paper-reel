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
            trigger:'.mwg_effect010',
            start:'top top',
            end:'top top-=1',
            toggleActions: "play none reverse none"
        }
    })

    document.fonts.ready.then(() => {

        const text = document.querySelector('.mwg_effect010 .text')
        wrapLettersInSpan(text)
        const letters = document.querySelectorAll('.mwg_effect010 .letter')

        const distance = text.clientWidth - document.body.clientWidth
        let sinusIncr = 0

        const scrollTween = gsap.to(text, {
            x: - distance + 'px', // Translation on the x-axis
            ease: 'none', // Linear movement
            scrollTrigger: {
                trigger: '.mwg_effect010 .container', // Listen to the container's position
                pin: true, // We pin the container division
                end: '+=' + distance, // We unpin it at the end of the animation
                scrub: true // Progress with scrolling
            }
        });

        letters.forEach(letter => {
            gsap.set(letter, {
                y: Math.sin(sinusIncr) * (window.innerHeight * 0.2), // Set the y position along the sinusoid
                yPercent: (Math.random() - 0.5) * 100, // Between -50 & 50
                rotation: (Math.random() - 0.5) * 32, // Between -16 & 16
                autoAlpha:1, // Make the letter appear
                immediateRender:false, // To not erase the initial state
                scrollTrigger:{
                    trigger:letter, // Listen to the letter’s position
                    containerAnimation: scrollTween, // Contains the translation tween
                    toggleActions: "play reverse play reverse",
                    start:'right 90%', // Letter appears when its right edge is at 90% of the screen
                    end:'left 10%', // Letter disappears when its left edge is at 10% of the screen
                }
            })

            // Control the frequency of the sinusoid
            sinusIncr += 0.3;
        })
    })
})

// UTIL METHOD
function wrapLettersInSpan(element) {
    const text = element.textContent;
    element.innerHTML = text
        .split('')
        .map(char => char === ' ' ? '<span>&nbsp;</span>' : `<span class="letter">${char}</span>`)
        .join(' ');
}