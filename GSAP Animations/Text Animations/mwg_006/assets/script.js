gsap.registerPlugin(ScrollTrigger)

window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LIENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect006')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    const paragraphs = root.querySelectorAll('.paragraph')

    paragraphs.forEach(paragraph => {
        wrapWordsInSpan(paragraph)
    })
    
    ScrollTrigger.create({
        trigger: pinHeight,  // Listening to pinHeight
        start: 'top top',
        end: 'bottom bottom',
        pin: container, // The pinned section
        scrub: true // Syncs with scrolling
    })

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger:root,
            start:'top top',
            end:'bottom bottom',
            scrub: true // progresses with the scroll
        }
    })

    paragraphs.forEach((paragraph, index) => {
        if(paragraphs[index+1]) {
            tl.to(paragraphs[index].querySelectorAll('.word span'), {
                y:'100%', // Hiding words of paragraphs[index]
                stagger:0.2,
                duration:1,
                ease:'power4.in',
            })
            tl.to(paragraphs[index+1].querySelectorAll('.word span'), {
                y:'0%', // Revealing words of paragraphs[index+1]
                duration:1,
                delay:1.4,
                stagger:0.2,
                ease:'power4.out',
            }, '<') // Means that the animation starts at the same time as the previous tween
        }
    })
})

// UTIL METHOD
function wrapWordsInSpan(element) {
    const text = element.textContent;
    element.innerHTML = text
        .split(' ')
        .map(word => `<span class="word"><span>${word}</span></span>`)
        .join(' ');
}