import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import * as dat from 'dat.gui'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DoubleSide } from 'three';



// TEXTURE LOADER
const loader = new THREE.TextureLoader();
const texture = loader.load('');
// const height = loader.load('/NormalMap (1).png');
const height = loader.load('/abstract-white-vortex-isolated-black-background-83860090.jpg');
const cross = loader.load('./particle-3.png')
const alpha = loader.load('/alpha-4.png')

// GSAP ANIMATIONS

gsap.registerPlugin(ScrollTrigger);
gsap.timeline().from('.logo , .name', { duration: 1, opacity: 0, yPercent: -100 })
    .from('.label, .nav-link', { duration: .5, opacity: 0, yPercent: 100 })
    .from('.webgl', { opacity: 0 })


gsap.fromTo('.logo', {
    ease: 'sine',
    x: 0,
    y: 0,
    opacity: 1.2,
}, {
    scrollTrigger: {
        trigger: '.logo',
        start: 'top 100px',
        scrub: 1,
    },
    x: -200,
    opacity: 0,
    zIndex: 3,
})

gsap.fromTo('.name', {
    ease: 'sine',
    x: 0,
    y: 0,
    opacity: 1.2,
}, {
    scrollTrigger: {
        trigger: '.logo',
        start: 'top 100px',
        scrub: 1,
    },
    x: 200,
    opacity: 0,
    zIndex: 3,
})

gsap.fromTo('.webgl', {
    ease: 'sine',
    duration: 50,
    y: 0,
    x: 0,
}, {
    scrollTrigger: {
        start: 'top -50px',
        trigger: '.webgl',
        scrub: 2,
    },
    x: 0,
    y: -75,

})

gsap.fromTo('.webgl', {
    duration: 1,
    ease: 'sine',
}, {
    scrollTrigger: {
        trigger: '.about-card',
        start: 'bottom bottom',
        scrub: 3,
    },
    opacity: 0,
    y: -600,
})

gsap.fromTo('.about-card', {
    ease: 'sine',
    x: 0,
    y: 0,
}, {
    scrollTrigger: {
        trigger: '.about-card',
        start: 'top bottom',
        end: '+=10vh',
        scrub: 1,
    },
    // backgroundColor:'#27272723',
    x: 0,
    y: -100,
})

gsap.fromTo('.about-bg', {
    duration:50,
    ease: 'sine',
    x: 0,
    yPercent: -5,
    opacity: 0,
}, {
    scrollTrigger: {
        trigger: '.webgl',
        start: 'top -20px',
        end: '+=15vh',
        scrub: 2,
    },
    opacity: 1,
    y: -300,
})

gsap.fromTo('.about-bg', {
    ease: 'sine',
    duration: 1,
}, {
    scrollTrigger: {
        trigger: '.about-card',
        start: 'bottom bottom',
        scrub: 1,
    },
    opacity: 0,
    y: -750
})



// THREE JS!!!!!!!!!!!!!!!!!
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0xaaccff, 0.0007)

// Objects
const planeGeometry = new THREE.RingBufferGeometry(0.035, 1.5, 900, 900, 100, 6.2833);
const particlesGeometry = new THREE.BufferGeometry;
const particlesCount = 700;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 5);
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute('#aeff2c', 3))

// Materials
const planeMaterial = new THREE.MeshStandardMaterial({
    color: '#cbfd7b',
    // color: '#000000',
    fog: true,
    alphaMap: alpha,
    transparent: true,
    depthTest: true,
    // roughness:0,
    
    // map: texture,
    displacementMap: height,
    displacementScale: -.25,
    side:THREE.DoubleSide,
})
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.0066,
    map: cross,
    transparent: true,
    color: '#cbfd7b',
    depthTest: true,
    sizeAttenuation: true,
    fog: true,
})

// Mesh
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.y = -.33;
plane.rotation.x = 174.5;
plane.receiveShadow = true;
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
particlesMesh.rotation.x = 174.5;
scene.add(particlesMesh, plane)

// Lights
// const ambient = new THREE.AmbientLight(0x404040);
const pointLight1 = new THREE.PointLight(0xffffff, 0.1);
pointLight1.position.x = 2
pointLight1.position.y = 3
pointLight1.position.z = 4

const pointLight2 = new THREE.PointLight(0xffffff, 2);
pointLight2.position.x = 0
pointLight2.position.y = 0.14
pointLight2.position.z = 4

const pointLight3 = new THREE.PointLight(0xcbfd7b, 0.5);
pointLight3.position.x = 0
pointLight3.position.y = -.33

pointLight3.position.z = 0

scene.add(pointLight1, pointLight2, pointLight3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // preserveDrawingBuffer: true 
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#010004'), 1)
// renderer.autoClearColor = false;
// Mouse
document.addEventListener('mousemove', animate)
let mouseX = 0
let mouseY = 0

function animate(event) {
    mouseY = event.clientY
    mouseX = event.clientX
}

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // Update objects
    plane.rotation.z = -.1 * elapsedTime
    if (mouseX > 0) {
        plane.rotation.z = -mouseX * (elapsedTime * 0.00005)
    }
    particlesMesh.rotation.z = -.1 * elapsedTime
    if (mouseX > 0) {
        particlesMesh.rotation.z = -mouseX * (elapsedTime * 0.00005)
        // particlesMesh.rotation.y = -mouseY * (elapsedTime * 0.00002)
        // particlesMesh.rotation.x = mouseY * (elapsedTime * 0.00002)
    }

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()