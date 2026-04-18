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
            trigger:'.mwg_effect004',
            start:'top top',
            end:'top top-=1',
            toggleActions: "play none reverse none"
        }
    })

    // When all the fonts are loaded
    document.fonts.ready.then(() => {
        init()
    })
})

function init() {
    const pinHeight = document.querySelector('.mwg_effect004 .pin-height')
    const container = document.querySelector('.mwg_effect004 .container')
    const paragraph = document.querySelector(".mwg_effect004 .paragraph")
    wrapWordsInSpan(paragraph)

    const words = paragraph.querySelectorAll(".word")

    ScrollTrigger.create({
        trigger: pinHeight, // We listen to .pin-height position
        start: 'top top',
        end: 'bottom bottom',
        pin: container // Progresses with the scroll
    })

    // We will have an array of lines that contain an array of words
    const lines = [[]];
    let lineIndex = 0;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        // Distance of the top outer border of the word to to the top edge of its parent
        const offsetTop = word.offsetTop;

        // If distance is different from previous word we start a new line
        if (i > 0 && offsetTop !== words[i - 1].offsetTop) {
            // We start a new line
            lines.push([]);
            lineIndex++;
        }

        lines[lineIndex].push(word);
    }
    
    lines.forEach(lineWords => {
        gsap.to(lineWords, {
            x: 0, // Animate the 'x' property to 0
            stagger: 0.2, // Stagger the animation of each element by 0.2
            ease: 'power1.inOut',
            scrollTrigger: {
                trigger: '.mwg_effect004', // Element that triggers the animation
                start: 'top top', // Start the animation when the top of the trigger hits the top of the viewport
                end: 'bottom bottom', // End the animation when the bottom of the trigger hits the bottom of the viewport
                scrub: true // Scrub the animation based on scroll position
            }
        })
    });
}

// UTIL METHOD
function wrapWordsInSpan(element) {
    const text = element.textContent;
    element.innerHTML = text
        .split(' ')
        .map(word => `<span class="word">${word}</span>`)
        .join(' ');
}