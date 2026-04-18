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
            trigger:'.mwg_effect003',
            start:'top top',
            end:'top top-=1',
            toggleActions: "play none reverse none"
        }
    })

    const pinHeight = document.querySelector('.mwg_effect003 .pin-height')
    const circles = document.querySelectorAll('.circle')

    gsap.fromTo('.mwg_effect003 .circles', {
        y: '5%' // The `circles` div starts at 5% of its height on the y-axis
    }, {
        y: '-5%', // And ends at -5% of its height on the y-axis
        ease: 'none',
        scrollTrigger: {
            trigger: pinHeight, // Monitor the position of pin-height
            start: 'top top',
            end: 'bottom bottom',
            pin: '.mwg_effect003 .container', // Pin the container in place
            scrub: true // Progress linked to scrolling
        }
    })

    // Calculate half of the fan range
    let angle = 3, 
        halfRange = (circles.length - 1) * angle / 2,
        rot = -halfRange

    const distPerCard = (pinHeight.clientHeight - window.innerHeight) / circles.length
        
    circles.forEach( (circle, index) => {
        
        gsap.to(circle, {
            rotation: rot, // The circle starts at 0° and ends at the `rot` value
            ease: 'power1.out',
            scrollTrigger: {
                trigger: pinHeight, // Monitor the position of pin-height
                // Animation starts at distPerCard * the index of the card
                start: 'top top-=' + (distPerCard) * index,
                // And lasts exactly for distPerCard
                end: '+=' + (distPerCard),
                scrub: true // Progress linked to scrolling
            }  
        })
        gsap.to(circle.querySelector('.card'), {
            // Optional: Apply 'rot' to the card to enhance the rotation effect
            rotation: rot,
            y: '-50%', // Positions the card in the center of the viewport
            ease: 'power1.out',
            scrollTrigger: {
                trigger: pinHeight, // Monitor the position of pin-height
                // Animation starts at distPerCard * the index of the card
                start: 'top top-=' + (distPerCard) * index,
                // And lasts exactly for distPerCard
                end: '+=' + (distPerCard),
                scrub: true // Progress linked to scrolling
            }  
        })

        rot += angle
    })
})