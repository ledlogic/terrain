/* from https://www.youtube.com/watch?v=2AQLMZwQpDo */

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const loader = new THREE.TextureLoader()
const heightImg = loader.load('/height.png')
const textureImg = loader.load('/texture.jpg')
const alphaImg = loader.load('/alpha-02.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const width = 3;
const height = 3;
const widthSegments = 1500;
const heightSegments = 1500;
const geometry = new THREE.PlaneBufferGeometry(width, height, widthSegments, heightSegments)

// Materials
const material = new THREE.MeshStandardMaterial({
	color: 'gray',
	map: textureImg,
	displacementMap: heightImg,
	displacementScale: -0.5,
	alphaMap: alphaImg,
	alphaScale: 1,
	transparent: true,
	depthTest: false
})

// Mesh
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
plane.rotation.x = 181

// Lights
const pointLight = new THREE.PointLight('#dcdcff', 2)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
gui.add(pointLight.position, 'x')
gui.add(pointLight.position, 'y')
gui.add(pointLight.position, 'z')

const col = { color: '#dcdcff' }
gui.addColor(col, 'color').onChange(() => {
	pointLight.color.set(col.color)
})

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
	alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
document.addEventListener("mousewheel", animateTerrain)
let deltaY = 0
function animateTerrain(event) {
    camera.position.z += event.deltaY/500;
}

const clock = new THREE.Clock()
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    plane.rotation.z = .25 * elapsedTime
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
