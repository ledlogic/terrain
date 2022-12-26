/* from https://www.youtube.com/watch?v=2AQLMZwQpDo */

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const loader = new THREE.TextureLoader()
const heightImg = loader.load('/height.png')
const textureImg = loader.load('/cargo.jpg')
const alphaImg = loader.load('/alpha-02.png')

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
let startTime = 0
let lastTruncTime = 0
const gridMin = 0.2
const gridDistance = width/20

// balance ratio is rougthly 42.5 security to 8 ohgma raiders
const numSecurity = 40  

// Materials
const material = new THREE.MeshStandardMaterial({
	color: 'gray',
	map: textureImg,
	depthTest: true
})

// Mesh
const planeMesh = new THREE.Mesh(geometry, material);
scene.add(planeMesh);
planeMesh.rotation.x = -Math.PI/2

// Lights
var pointLight = new THREE.PointLight('#dcdcff', 2)
pointLight.position.x = 3
pointLight.position.y = 3
pointLight.position.z = 3
scene.add(pointLight)

pointLight = new THREE.PointLight('#dcdcff', 1)
pointLight.position.x = -9
pointLight.position.y = 3
pointLight.position.z = 3
scene.add(pointLight)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: Math.min(window.innerHeight,600)
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight-120

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

// Team cylinders
var teamColors = ['#606030', '#C0A878']
var vector = new THREE.Vector3(0, 0, -1)
var cylinderMeshes = []
var gridDelta = 0.2
for (var team=0; team<teamColors.length; team++) {
	if (team === 0) {
		var amnt = numSecurity/6;
		for (var i=0; i<amnt; i++) {
			var x = -1.4 + Math.random() * gridDistance	
			var z = -15/20 + Math.random() * gridDistance		
			var tx = x + Math.random() * gridDelta * 0.25
			var tz = z + Math.random() * gridDelta * 0.25
			const cylinderMesh = initCylinder(team, tx, tz)
			scene.add(cylinderMesh)
			cylinderMeshes.push(cylinderMesh)
		}
		for (; i<amnt*2; i++) {
			var x = -1.4 + Math.random() * gridDistance
			var z = 12/20 + Math.random() * gridDistance			
			var tx = x + Math.random() * gridDelta * 0.25
			var tz = z + Math.random() * gridDelta * 0.25
			const cylinderMesh = initCylinder(team, tx, tz)			
			scene.add(cylinderMesh)
			cylinderMeshes.push(cylinderMesh)
		}
		for (; i<amnt*3; i++) {
			var x = -15/20 + Math.random() * gridDistance
			var z = 1.2 + Math.random() * gridDistance			
			var tx = x + Math.random() * gridDelta * 0.25
			var tz = z + Math.random() * gridDelta * 0.25
			const cylinderMesh = initCylinder(team, tx, tz)			
			scene.add(cylinderMesh)
			cylinderMeshes.push(cylinderMesh)
		}
		for (; i<amnt*4; i++) {
			var x = 12/20 + Math.random() * gridDistance
			var z = 1.2 + Math.random() * gridDistance			
			var tx = x + Math.random() * gridDelta * 0.25
			var tz = z + Math.random() * gridDelta * 0.25
			const cylinderMesh = initCylinder(team, tx, tz)			
			scene.add(cylinderMesh)
			cylinderMeshes.push(cylinderMesh)
		}
		for (; i<amnt*5; i++) {
			var x = 1.2 + Math.random() * gridDistance	
			var z = -15/20 + Math.random() * gridDistance		
			var tx = x + Math.random() * gridDelta * 0.25
			var tz = z + Math.random() * gridDelta * 0.25
			const cylinderMesh = initCylinder(team, tx, tz)
			scene.add(cylinderMesh)
			cylinderMeshes.push(cylinderMesh)
		}
		for (; i<amnt*6; i++) {
			var x = 1.2 + Math.random() * gridDistance
			var z = 12/20 + Math.random() * gridDistance			
			var tx = x + Math.random() * gridDelta * 0.25
			var tz = z + Math.random() * gridDelta * 0.25
			const cylinderMesh = initCylinder(team, tx, tz)			
			scene.add(cylinderMesh)
			cylinderMeshes.push(cylinderMesh)
		}
	}
	
	if (team === 1) {
		for (var i=0; i<4; i++) {
			var x = -15/20 + Math.random() * gridDistance
			var z = -1.4 + Math.random() * gridDistance			
			var tx = x + Math.random() * gridDelta * 0.25
			var tz = z + Math.random() * gridDelta * 0.25
			const cylinderMesh = initCylinder(team, tx, tz)			
			scene.add(cylinderMesh)
			cylinderMeshes.push(cylinderMesh)
		}
		for (var i=0; i<4; i++) {
			var x = 12/20 + Math.random() * gridDistance
			var z = -1.4 + Math.random() * gridDistance			
			var tx = x + Math.random() * gridDelta * 0.25
			var tz = z + Math.random() * gridDelta * 0.25
			const cylinderMesh = initCylinder(team, tx, tz)			
			scene.add(cylinderMesh)
			cylinderMeshes.push(cylinderMesh)
		}
	}
}

var mwdelta = 0;
document.addEventListener( 'mousewheel', (event) => {
    mwdelta +=event.deltaY;
});

// Clock
let cameraRadius = 3
let secondsPerTurn = 3
const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    
	var t = 0.125 * elapsedTime
	var zoomRadius = cameraRadius + mwdelta / 500 
    camera.position.x = zoomRadius * Math.sin(t)
    camera.position.z = zoomRadius * Math.cos(t)
    camera.rotation.y = t
        
	// Turn
    if (startTime == 0) {
    	startTime = Math.floor(elapsedTime)    	
    	lastTruncTime = Math.floor(elapsedTime)
   	}
   	
   	for (var i=0; i<cylinderMeshes.length; i++) {
	   	var cylinder = cylinderMeshes[i]
		move(cylinder)
	}	
   	
   	const elapsedSinceTruncTime = elapsedTime - lastTruncTime
   	const deltaTime = Math.floor(elapsedSinceTruncTime)
   	if (deltaTime > secondsPerTurn) {
   		lastTruncTime = Math.floor(elapsedTime)

	    // Sort cylinders by initiative
	    for (var i=0; i<cylinderMeshes.length; i++) {
	    	var cylinder = cylinderMeshes[i]
	    	if(!isDead(cylinder)) {
	    		cylinder.initiative = Math.random();
	    	}
	    }
	    cylinderMeshes.sort(sortInitiative);
	    
	    // Move cylinders
	    var gridMin = 0.2
	    for (var i=0; i<cylinderMeshes.length; i++) {
	    	var cylinder = cylinderMeshes[i]
	    	
	    	var b = checkDead(cylinder)
	    	if (!b) {
			    closestEnemy(cylinder)
		    	
		    	// move
			    move(cylinder)  
			    
			    // attack
			    attack(cylinder)
		    }
	    }
   	}
    
    // Render
    renderer.render(scene, camera)
    renderScore()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()

function closestEnemy(cylinder) {
	// det closest
	if (cylinder.closestEnemy == null) {
		cylinder.char.closestEnemy = getClosestEnemy(cylinder);
	} else if (isDead(cylinder.closestEnemy)) {
		cylinder.char.closestEnemy = getClosestEnemy(cylinder);
	}
}

function renderScore() {
    var v0 = countTeam(0)
    var v1 = countTeam(1)
    $(".score-team-0").html(v0)
    $(".score-team-1").html(v1)
}

function sortInitiative( a, b ) {
	if ( a.initiative < b.initiative ){
		return -1;
	}
	if ( a.initiative > b.initiative ){
		return 1;
	}
	return 0;
}

function isDead(cylinder) {
	return getHp(cylinder) <= 0
}

function getHp(cylinder) {
	return cylinder.char.str + cylinder.char.dex + cylinder.char.end 
}

function getClosestEnemy(cylinder) {
	var team = cylinder.char.team
	var minDist = 10000000
	var minCylinder = null
    for (var i=0; i<cylinderMeshes.length; i++) {
    	var testCylinder = cylinderMeshes[i]
    	if (testCylinder.char.team != team && !isDead(testCylinder)) {
    		var dist = getDistance(cylinder, testCylinder)
    		if (dist < minDist) {
    			minCylinder = testCylinder
    			minDist = dist
    		}
    	}    	
    }
    return minCylinder;
}

function checkDead(cylinder) {
	if (isDead(cylinder)) {
		if (!cylinder.char.dead) {
			cylinder.char.dead = true
			cylinder.material.color.setHex( 0xff0000 );
			cylinder.geometry.dispose();
			cylinder.geometry = getDeadCylinder();
		}
		return true;
	}
	return false;
}

function getDeadCylinder() {
	return new THREE.CylinderGeometry( 0.02, 0.02, 0.005, 20);
}

// distances for 20x20m map roughly 1:10 ratio
function getDistance(cylinder1, cylinder2) {
	var ret = Math.sqrt(Math.pow(cylinder1.position.x - cylinder2.position.x, 2)
	     + Math.pow(cylinder1.position.z - cylinder2.position.z, 2))
	return ret  
}

function attack(cylinder) {
	var closestEnemy = cylinder.char.closestEnemy
	if (closestEnemy) {
    	var distance = getDistance(cylinder, closestEnemy)
    	var damage = 0
    	if (distance < gridDistance) {
    		damage = getMeleeDamage(cylinder)
    	} else {    	
			damage = getShootDamage(cylinder)
		}
		console.log(cylinder + " hit " + closestEnemy  + " for " + damage)
		if (damage > 0) {
			damageCylinder(closestEnemy, damage)
  		}
	}
}

function charMod(cylinder, char) {
	var score = cylinder.char[char]
	switch(score) {
		case 0: 
			return -3
		case 1:
		case 2:
			return -2
		case 3:
		case 4:
		case 5:
			return -1
		case 6:
		case 7:
		case 8:
			return 0
		case 9:
		case 10:
		case 11:
			return 1
		case 12:
		case 13:
		case 14:
			return 2
		default:
			return 3		
	}
}

function getMeleeDamage(cylinder) {
	var ret = 0
	var strMod = charMod(cylinder, 'str')
	var meleeMod = cylinder.char.blades + strMod
	var meleeHit = die(2,6,meleeMod)
	var effect = meleeHit - 8
	var team = cylinder.char.team
	if (effect >= 0) {
		if (team === 0) {
			ret = die(2, 6, 0 + effect)
		}
		if (team === 1) {
			ret = die(2, 6, 0 + effect)
		}
	}
	return ret
}

function getShootDamage(cylinder) {
	var ret = 0
	var dexMod = charMod(cylinder, 'dex')
	var slugMod = cylinder.char.slug + dexMod
	var slugHit = die(2,6,slugMod)
	var effect = slugHit - 8
	var team = cylinder.char.team
	if (effect >= 0) {
		if (team === 0) {
			ret = die(3, 6, -3 + effect)
		}
		if (team === 1) {
			ret = die(3, 6, 0 + effect)
		}
	}
	return ret
}

function damageCylinder(cylinder, damage) {
	// armour
	if (cylinder.char.armour) {
		var deltaArmour = Math.min(cylinder.char.armour, damage)
		damage -= deltaArmour
	}	
	
	// end
	if (cylinder.char.end) {
		var deltaEnd = Math.min(cylinder.char.end, damage)
		cylinder.char.end -= deltaEnd
		damage -= deltaEnd
	}
	
	// str
	if (cylinder.char.str) {
		var deltaStr = Math.min(cylinder.char.str, damage)
		cylinder.char.str -= deltaStr
		damage -= deltaStr
	}
	
	// dex
	if (cylinder.char.dex) {
		var deltaDex = Math.min(cylinder.char.dex, damage)
		cylinder.char.dex -= deltaDex
		damage -= deltaDex
	}
}

function countTeam(team) {
	var ret = 0;
    for (var i=0; i<cylinderMeshes.length; i++) {
    	var testCylinder = cylinderMeshes[i]
    	if (testCylinder.char.team == team && !isDead(testCylinder)) {
    		ret++
    	}
    }
	return ret;
}

function soldierCylinderGeometry() {
	return new THREE.CylinderGeometry( 0.01, 0.01, 0.05, 20 );
}

function initCylinder(team, tx, tz) {
	var teamColor = teamColors[team] 

	const cylinderGeometry = soldierCylinderGeometry();
	const cylinderMaterial = new THREE.MeshStandardMaterial( {color: teamColor} );
	const cylinderMesh = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
	cylinderMesh.position.x = tx
	cylinderMesh.position.y = 0
	cylinderMesh.position.z = tz

	var char = {
		closestEnemy: null,
		team: team		
	}
	cylinderMesh.char = char
	
	// Station Security
	// Mysteries on Acturus Station
	if (team === 0) {
		char.str = 9 
		char.dex = 7
		char.end = 8
		char.int = 8
		char.edu = 6
		char.soc = 6
		char.armour = 2
		char.slug = 1
		char.melee = 2
	}
	// Ohgman raider
	if (team === 1) {
		char.str = 10
		char.dex = 9
		char.end = 10
		char.int = 6
		char.edu = 6
		char.soc = 8
		char.armour = 10
		char.slug = 2
		char.blades = 3
		char.melee = 2
	}
			
	return cylinderMesh
}

function dieN(die) {
	return Math.floor(Math.random() * die) + 1;
}

function die(qty, die, mod) {
	var ret = mod;
	for (var i = 0; i < qty; i++) {
		ret += dieN(die);
	}
	return ret;
}

function move(cylinder) {
	if (isDead(cylinder)) {
		return;
	}
	
	var closestCylinder = getClosest(cylinder)
	if (closestCylinder != null) {
		var deltaX = (closestCylinder.position.x - cylinder.position.x)
		var deltaZ = (closestCylinder.position.z - cylinder.position.z)
		var deltaDistance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2))
		if (deltaDistance < gridDistance) {
			var unitDeltaX = deltaX / deltaDistance
			var unitDeltaZ = deltaZ / deltaDistance
			var mvDeltaX = -unitDeltaX * gridDistance / 50
			var mvDeltaZ = -unitDeltaZ * gridDistance / 50
			cylinder.position.x += mvDeltaX / 0.667
			cylinder.position.z += mvDeltaZ / 0.667
			constrain(cylinder)
	    }
	}	
	
	var closestEnemy = cylinder.char.closestEnemy
	if (closestEnemy && !isDead(closestEnemy)) {
		var deltaX = (closestEnemy.position.x - cylinder.position.x)
		var deltaZ = (closestEnemy.position.z - cylinder.position.z)
		var deltaDistance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2))
		if (deltaDistance >= gridDistance) {
			var unitDeltaX = deltaX / deltaDistance
			var unitDeltaZ = deltaZ / deltaDistance
			var mvDeltaX = unitDeltaX * gridDistance / 50
			var mvDeltaZ = unitDeltaZ * gridDistance / 50
			cylinder.position.x += mvDeltaX
			cylinder.position.z += mvDeltaZ
			constrain(cylinder)
	    }
	}
}

function constrain(cylinder) {
	cylinder.position.x = Math.max(cylinder.position.x, -1.5 + gridDistance)
	cylinder.position.x = Math.min(cylinder.position.x, 1.5 - gridDistance)
	cylinder.position.z = Math.max(cylinder.position.z, -1.5 + gridDistance)
	cylinder.position.z = Math.min(cylinder.position.z, 1.5 - gridDistance)
}

function getClosest(cylinder) {
	var minDist = 10000000
	var minCylinder = null
    for (var i=0; i<cylinderMeshes.length; i++) {
    	var testCylinder = cylinderMeshes[i]
    	if (testCylinder != cylinder && !isDead(testCylinder)) {
    		var dist = getDistance(cylinder, testCylinder)
    		if (dist < minDist) {
    			minCylinder = testCylinder
    			minDist = dist
    		}
    	}    	
    }
    return minCylinder;
}
