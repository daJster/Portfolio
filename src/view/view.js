// scene & control
const scene = new THREE.Scene();
const contain = document.body;
const rayCaster = new THREE.Raycaster();



const toolTip = document.querySelector('.tool-tip');
const guide = document.querySelector('.guide');
const question = document.querySelector('.question');
const swipe = document.querySelector('.swipe-guide');

let spriteActive = false;

/** creating a scene and scenes management */

//BOD.show(scene);



const renderer = new THREE.WebGLRenderer({antialias: true, alpha:true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x000000, .82);

contain.appendChild( renderer.domElement );


const controls = new THREE.OrbitControls( camera, renderer.domElement );

controls.rotateSpeed = 0.7;
controls.enableZoom = false;

controls.update();


// animation
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();

worldInit(scene);

gsap.to(camera.position, 4, {
	x: 20,
	y: 0,
	z: 0
});

function onScroll(event){
	if ( event.deltaY > 0 ){
		gsap.to(camera, 0.5, {
			zoom: 1,
			onUpdate: () => {
				camera.updateProjectionMatrix();
			}
			});
		controls.rotateSpeed = .7;
	} else {
		gsap.to(camera, 0.5, {
			zoom: zoomLevel,
			onUpdate: () => {
				camera.updateProjectionMatrix();
			}
		});
		controls.rotateSpeed = .1;
	}
}

let buttonActive = false;

function unfadeGuide(){
	buttonActive = true;
	swipe.classList.remove('isFading')
	swipe.classList.add('isNotFading');
	question.classList.remove('isNotFading');
	question.classList.add('isFading');
	guide.classList.remove('isFading');
	guide.classList.add('isNotFading');
}

function fadeGuide(){
	setTimeout(() => {
		swipe.classList.remove('isNotFading')
		swipe.classList.add('isFading');
	}, 1000);
	question.classList.remove('isFading');
	question.classList.add('isNotFading');
	guide.classList.remove('isNotFading');
	guide.classList.add('isFading');
}

function onClick(event){
	let mouse = new THREE.Vector2(
	( event.clientX / window.innerWidth ) * 2 - 1,
	- ( event.clientY / window.innerHeight ) * 2 + 1
	);
	
	rayCaster.setFromCamera(mouse, camera);

	let intersect = rayCaster.intersectObjects(scene.children);
	intersect.forEach( (element) => {
		// console.log(element);
		if (element.object.type === 'Sprite'){
			worldToggle = 'off';
			gsap.to(camera.position, 1, {
				x: -1,
				y: 0,
				z: 0
			});

			intersect[0].object.onClick();
			worldIcon.classList.add('isActive');
		}
		if ( element.object.type === 'Mesh' && !buttonActive){
			fadeGuide();
		}
	});
	buttonActive = false;
}

function onMouseMove(event){
	let mouse = new THREE.Vector2(
		( event.clientX / window.innerWidth ) * 2 - 1,
		- ( event.clientY / window.innerHeight ) * 2 + 1
		);
	
	rayCaster.setFromCamera(mouse, camera);

	let foundSprite = false;
	let intersect = rayCaster.intersectObjects(scene.children);
	intersect.forEach( (element) => {
		if (element.object.type === 'Sprite'){
			let projection = intersect[0].object.position.clone().project(camera);
			toolTip.style.top = ((-1 * projection.y +1) * window.innerHeight / 2)+ 'px';
			toolTip.style.left = ((projection.x + 1) * window.innerWidth / 2)+ 'px';
			toolTip.classList.add('isActive');
			toolTip.innerHTML = intersect[0].object.about;
			spriteActive = intersect[0].object;
			foundSprite = true;

			if (worldToggle === 'on'){
				gsap.to(camera.position, 0.3, {
					x: intersect[0].object.position.x*1.2,
					y: intersect[0].object.position.y*1.2,
					z: intersect[0].object.position.z*1.2
				});
			}
				gsap.to(intersect[0].object.scale, 0.2, {
					x: .1,
					y: .1,
					z: .1
				});
			
		}
	});

	if ( foundSprite === false && spriteActive !== false){
		toolTip.classList.remove('isActive');

			gsap.to(spriteActive.scale, 0.2, {
				x: .05,
				y: .05,
				z: .05
			});
	} 
}

function worldReload(){
	worldToggle = 'on';
	loader.classList.add('isActive');
	presentScene.destroy();

	setTimeout( () => {
		worldScene.createScene(scene);
	}, 500);

	setTimeout( () => {
		worldScene.appear();
	}, 500);

	gsap.to(camera.position, 1.3, {
		x: 20,
		y: 0,
		z: 0,
		onComplete: () => {	
			question.classList.add('isFading');
			setTimeout( () => {
				loader.classList.remove('isActive');
			}, 3000);
			swipe.classList.add('isNotFading');
			guide.classList.add('isNotFading');
			alert('Please, click and drag your mouse so the world view appears.\n bug...');
		}
	});
	worldIcon.classList.remove('isActive');
}


setTimeout(() => {
	question.classList.add('isFading');
	guide.classList.add('isNotFading');
	swipe.classList.add('isNotFading');
}, 1000);

window.addEventListener('click', onClick);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('wheel', onScroll);
worldIcon.addEventListener('click', worldReload);
/** guide */