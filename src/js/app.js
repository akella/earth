import * as THREE from 'three';
import {TimelineMax} from 'gsap';
import Draggable from 'gsap/Draggable';

let OrbitControls = require('three-orbit-controls')(THREE);



var nullObject = document.createElement('div');
$('#container').append(nullObject);
$(nullObject).addClass('is-null');

Draggable.create(nullObject, {

  type:'x,y',
  trigger:$('#container'),
  onDrag:doDrag,
  throwProps:true,
  onThrowUpdate:doDrag,
  bounds: {minY: 40, maxY: 480} 

});

function doDrag(e) {
 
  var posX = nullObject._gsTransform.x;
  var posY = nullObject._gsTransform.y;

  TweenLite.to('#one', 1.5, {
    x:posX,
    y:posY
  });

  TweenLite.to(group.rotation, 1.5, {
    x:posY/100,
    y:posX/100
  });
}





let canvas = document.getElementById('myscene');
let width = window.innerWidth;
let height = window.innerHeight;
var mouse = new THREE.Vector2(), INTERSECTED;
let renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});


let points = [
  {
  	title: 'Bali',
  	lat: -8.409518,
  	long: 115.188919
  },
  {
  	title: 'Yevpatoriya',
  	lat: 45.20091,
  	long: 33.36655
  },
  {
  	title: 'Kyiv',
  	lat: 50.431782,
  	long: 30.516382
  },
  {
  	title: 'New York',
  	lat: 40.730610,
  	long: -73.968285
  },
  {
  	title: 'Managua',
  	lat: 12.136389,
  	long: -86.251389
  },
  {
  	title: 'Sydney',
  	lat: -33.865143,
  	long: 151.215256
  },
  {
  	title: 'Berlin',
  	lat: 52.520645,
  	long: 13.409779
  },
  {
  	title: 'Lisboa',
  	lat: 38.736946,
  	long:-9.142685
  }
];




renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
var camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);


// SCENE
let scene = new THREE.Scene();

let group = new THREE.Group();
scene.add(group);
camera.position.set(0, -100, 10);
camera.lookAt(10, 20, 30);
var controls = new OrbitControls(camera, renderer.domElement);

var light = new THREE.AmbientLight( 0x404040,3 ); // soft white light
scene.add( light );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );


function randn_bm() {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function calcPosFromLatLonRad(lat,lon,radius) {
	
  var phi   = (90-lat)*(Math.PI/180);
  var theta = (lon+180)*(Math.PI/180);

  let x = -((radius) * Math.sin(phi)*Math.cos(theta));
  let z = ((radius) * Math.sin(phi)*Math.sin(theta));
  let y = ((radius) * Math.cos(phi));
    
    
  console.log([x,y,z]);
  return [x,y,z];
}


// DO SOMETHING

var geometry = new THREE.SphereGeometry( 25, 132, 132 );
var material = new THREE.MeshPhongMaterial( {
  map: THREE.ImageUtils.loadTexture('img/earth-small.jpg'),
  displacementMap: THREE.ImageUtils.loadTexture('img/earthbump1k.jpg'),
  displacementScale: 10,
  // wireframe: true
} );
var sphere = new THREE.Mesh( geometry, material );
group.add( sphere );

let R = 26;
let planes = [];

// for (var i = 0; i < 20; i++) {

//   let geometry = new THREE.PlaneGeometry( 1,1 );
//   let material = new THREE.MeshBasicMaterial( {
//     color: 0x00ff00,
//     side: THREE.DoubleSide,

//     // wireframe: true
//   } );
//   let material1 = new THREE.RawShaderMaterial( {
//   	uniforms: {
//   		time: {value: 0},
//   		hover: {value: 0}
//   	},
//   	transparent: true,
//     vertexShader: document.getElementById('vertexShader').textContent,
//     fragmentShader: document.getElementById('fragmentShader').textContent
//   } );
//   let plane = new THREE.Mesh(geometry,material1);


//   let x = randn_bm();
//   let y = randn_bm();
//   let z = randn_bm();
//   let sq = 1/Math.sqrt(x*x + y*y + z*z);

//   plane.position.x = R*x*sq;
//   plane.position.y = R*y*sq;
//   plane.position.z = R*z*sq;


//   group.add(plane);
//   planes.push(plane);


// }

points.forEach(p => {

  let pos = calcPosFromLatLonRad(p.lat,p.long,R);
  let geometry = new THREE.PlaneGeometry( 1,1 );
  let material = new THREE.MeshBasicMaterial( {
	  color: 0x00ff00,
	  side: THREE.DoubleSide,

	  // wireframe: true
  } );
  let material1 = new THREE.RawShaderMaterial( {
    uniforms: {
      time: {value: 0},
      hover: {value: 0}
    },
    transparent: true,
	  vertexShader: document.getElementById('vertexShader').textContent,
	  fragmentShader: document.getElementById('fragmentShader').textContent
  } );
  let plane = new THREE.Mesh(geometry,material1);




  plane.position.x = pos[0];
  plane.position.y = pos[1];
  plane.position.z = pos[2];


  group.add(plane);
  planes.push(plane);


});





let time = 0;
function Render() {
  time++;
  // group.rotation.x = time/100;
  planes.forEach(e => {
  	let conj = new THREE.Quaternion();
  	conj.copy(group.quaternion);
  	conj.conjugate();

  	e.quaternion.multiplyQuaternions(
  		conj,
  		camera.quaternion
  	);

  	// e.quaternion.copy(camera.quaternion);
  });
  renderer.render(scene, camera);
  window.requestAnimationFrame(Render);
}
Render();


function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = (window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize, false);



