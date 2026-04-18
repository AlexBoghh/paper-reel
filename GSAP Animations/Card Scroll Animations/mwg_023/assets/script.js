window.addEventListener("DOMContentLoaded", () => {
    gsap.set('.mwg_effect023 .media', {yPercent: -50})
    
    // Rotate each media evenly
    const medias = document.querySelectorAll('.mwg_effect023 .inner-media')
    const mediasTotal = medias.length

    medias.forEach((media, index) => {
        media.classList.add('media-' + (Math.floor(Math.random() * 3) + 1))
        gsap.set(media, {
            rotation: 360 / mediasTotal * index
        })
    })

    // We listen to the rotation property of the container
    const rotTo = gsap.quickTo('.mwg_effect023 .container', 'rotation', {
        duration: 0.8, // The movement will last 0.8
        ease: 'power4'
    })

    // EXTRA
    const yTo1 = gsap.quickTo('.mwg_effect023 .media-1 .media', 'yPercent', {
        duration: 1,
        ease: 'power3'
    })
    const yTo2 = gsap.quickTo('.mwg_effect023 .media-2 .media', 'yPercent', {
        duration: 2,
        ease: 'power3'
    })
    const yTo3 = gsap.quickTo('.mwg_effect023 .media-3 .media', 'yPercent', {
        duration: 3,
        ease: 'power3'
    })
    // END EXTRA

    let incr = 0;
    window.addEventListener('wheel', (e) => {
        const deltaY = e.deltaY
        incr -= deltaY / 40 // Divided by a number to slow incrementation's speed
        rotTo(incr) // Our quickTo() method
        
        // EXTRA
        const val = -Math.abs(deltaY/4) - 50 // Minus 50 to keep the image vertically cen
        yTo1(val)
        yTo2(val)
        yTo3(val)
        // END EXTRA
    }, {passive: true})
})