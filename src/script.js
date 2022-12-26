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
	displacementScale: 0.5,
	depthTest: true
})

// Mesh
const planeMesh = new THREE.Mesh(geometry, material);
scene.add(planeMesh);
planeMesh.rotation.x = -Math.PI/2

// Lights
const pointLight = new THREE.PointLight('#dcdcff', 2)
pointLight.position.x = 3
pointLight.position.y = 3
pointLight.position.z = 3
scene.add(pointLight)

// Sizes
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

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.y = 1
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Cylinder
var gridMin = -1.4 
var gridMax = 1.4
var gridDelta = 0.2
var vector = new THREE.Vector3(0, 0, -1)
for (var x=gridMin;x<gridMax;x+=gridDelta) {
	for (var z=gridMin;z<gridMax;z+=gridDelta) {
		const cylinderGeometry = new THREE.CylinderGeometry( 0.01, 0.01, 0.05, 20 );
		const cylinderMaterial = new THREE.MeshStandardMaterial( {color: 'gray'} );
		const cylinderMesh = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
		cylinderMesh.position.x = x
		cylinderMesh.position.y = 0.5
		cylinderMesh.position.z = z
		
		// fix y positions.
		/*
		var raycaster = new THREE.Raycaster();
		raycaster.set(cylinderMesh.position, vector);
		var velocity = new THREE.Vector3();
		var intersects = raycaster.intersectObject(planeMesh);
		if (intersects.length) {
			var d = intersects[0].distance;
			//cylinderMesh.translateY(-d);
		}
		*/
		scene.add(cylinderMesh);
	}
}

var mwdelta = 0;
document.addEventListener( 'mousewheel', (event) => {
    mwdelta +=event.deltaY;
});

// Clock
let cameraRadius = 3
const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
	
	var t = 0.125 * elapsedTime
	var zoomRadius = cameraRadius + mwdelta / 500 
    camera.position.x = zoomRadius * Math.sin(t)
    camera.position.z = zoomRadius * Math.cos(t)
    camera.rotation.y = t
        
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()
