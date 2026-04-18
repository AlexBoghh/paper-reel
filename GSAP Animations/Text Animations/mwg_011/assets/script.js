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
            trigger:'.mwg_effect011',
            start:'top top',
            end:'top top-=1',
            toggleActions: "play none reverse none"
        }
    })

    document.fonts.ready.then(() => {
        
        const text = document.querySelector('.mwg_effect011 .text')
        wrapLettersInSpan(text)

        const letters = document.querySelectorAll('.mwg_effect011 .letter')
        const distance = text.clientWidth - document.body.clientWidth

        const scrollTween = gsap.to(text, {
            x: - distance, // Translation on the x-axis
            ease: 'none', // Linear movement
            scrollTrigger: {
                trigger: '.mwg_effect011 .container', // Listen to the container's position
                pin: true, // We pin the division container
                end: '+=' + distance, // We unpin it at the end of the animation
                scrub: true // Progress with scrolling
            }
        });

        letters.forEach(letter => {
            // const values = {
                // y: (Math.floor(Math.random() * (16 - 10 + 1)) + 10) * (Math.random() * 20 - 10),
                // rotation: (Math.floor(Math.random() * (20 - 10 + 1)) + 10) * (Math.random() * 2 - 1)
            // }

            gsap.from(letter, {
                yPercent: (Math.random() - 0.5) * 400, // Between -200 & 200
                rotation: (Math.random() - 0.5) * 60, // Between -30 & 30
                ease: "elastic.out(1.2, 1)", // Will bounce at the end of the animation
                scrollTrigger:{
                    trigger: letter, // Listens to the tween's letter position
                    containerAnimation: scrollTween,
                    start:'left 90%' , // Animation starts when the letter is at the right edge of the viewport
                    end:'left 10%', // Ends when the letter reaches the left edge of the viewport
                    scrub: 0.5 // Progresses with scrolling, with a 0.5s delay
                }
            })
        })
    })
})

// UTIL METHOD
function wrapLettersInSpan(element) {
    const text = element.textContent;
    element.innerHTML = text
        .split('')
        .map(char => char === ' ' ? '<span>&nbsp;</span>' : `<span class="letter">${char}</span>`)
        .join('');
}