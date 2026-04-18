window.addEventListener("DOMContentLoaded", () => {

    let incr = 0
    
    const root = document.querySelector('.mwg_effect045 .root')
    const slides = document.querySelectorAll('.mwg_effect045 .slide')
    const slideContent = document.querySelectorAll('.mwg_effect045 .content')
    const deltaObject = {delta: 0}

    const baseDuration = slides.length / 2; // Total duration for the slide animation
    const staggerEach = 0.5; // Delay between each element
    const repeatDelay = baseDuration - staggerEach; // Délai avant répétition


    // Tied to delta from deltaObject
    const deltaTo = gsap.quickTo(deltaObject, 'delta', { 
        duration: 0.8,  // Will take 0.8 sec to reach its new value
        ease: "power1", // Non linear
        onUpdate: () => {
            // As soon as it changes, we progress the timeline
            tl.time(deltaObject.delta)
        }
    })
    const rotY = gsap.quickTo(root, "rotationY", {duration: 0.3, ease: 'power3'})
    const rotX = gsap.quickTo(root, "rotationX", {duration: 0.3, ease: 'power3'})


    // Timeline GSAP
    const tl = gsap.timeline({ paused: true })

    // Animation principale des slides
    tl.from(slides, {
        y: '-15vw',
        z: '-60vw',
        ease: "none", // Linear movement
        duration: baseDuration, // baseDuration / slides.length = 0.5
        stagger: {
            each: staggerEach,
            repeat: -1 // Infinite repeat
        }
    })

    // Content entry animation
    tl.fromTo(slideContent, {
        y: '10vh' // Start slightly off-center on the y-axis
    }, {
        y: 0, // Quickly return to 0 to center it in its parent slide
        ease: "back.out(1.05)",
        duration: staggerEach, // 0.5
        stagger: {
            each: staggerEach, // 0.5
            repeat: -1, // Infinite repeat
            repeatDelay: repeatDelay, // baseDuration - staggerEach
            onRepeat() {
                // Target the repeated slide and move it off-screen
                this.targets()[0].style.transform = "translateY(100vh)";
            }
        }
    }, '<') // Means the animation starts at the start of the previous tween

    // Content exit animation
    tl.fromTo(slideContent, {
        y: 0, // Start at the center on the y-axis
    }, {
        y: '200vh', // Quickly move below the viewport
        ease: "power3.in",
        duration: staggerEach, // 0.5
        delay: repeatDelay, // baseDuration - staggerEach
        stagger: {
            each: staggerEach, // 0.5
            repeat: -1,
            repeatDelay: repeatDelay, // baseDuration - staggerEach
            onRepeat() {
                // Target the repeated slide and center it in its parent
                this.targets()[0].style.transform = "translateY(0vh)";
            }
        }
    }, '<') // Means the animation starts at the start of the previous tween
    
    const beginDistance = slides.length * 100
    
    tl.time(beginDistance)

    // Animates from beginDistance + 0.01 to beginDistance
    deltaTo(beginDistance + 0.01, beginDistance)
    

    // Establish the value to snap to a certain increment here for each item, so baseDuration / slides.length
    const snap = gsap.utils.snap(baseDuration / slides.length)
    
    window.addEventListener("wheel", (e) => {
        incr += e.deltaY / 1000 // Divided per 1000 to slow it down
        // Change deltaObject.delta, takes the snapped value as a parameter
        deltaTo(snap(incr + beginDistance))
    }, {passive: true})
    root.addEventListener("mousemove", e => {
        const valX = (e.clientY / window.innerHeight - 0.5) * 5
        const valY = (e.clientX / window.innerWidth - 0.5) * 10

        rotX(-valX)
        rotY(valY)
    })
})