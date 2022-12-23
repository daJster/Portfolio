let worldToggle, presentScene;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const loader = document.querySelector('.loader-wrapper');
const worldIcon = document.querySelector('.world-icon');

let zoomLevel = 2.6;
let worldRadius ;

camera.position.set(40, 0, 0);

class Scene{
	constructor(image, camera){
		this.image = image;
		this.points = [];
		this.sprites = [];
		this.scene = null;
		this.camera = camera;
	}


	createScene(scene){
		// sphere 
		this.scene = scene;
		const geometry = new THREE.SphereGeometry(9.9, 64, 32 );
		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load(this.image);
		texture.repeat.x = -1;
		texture.wrapS = THREE.RepeatWrapping;


		const material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );
		this.sphere = new THREE.Mesh( geometry, material );
		this.scene.add( this.sphere );
		this.points.forEach(this.addToolTip.bind(this));
	}

	addToolTip(point){
		let spriteMap = new THREE.TextureLoader().load( './assets/view/sprite.png' );
		let spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap } );
		let sprite = new THREE.Sprite( spriteMaterial );
		sprite.about = point.about;
		sprite.position.copy(point.position.clone().normalize().multiplyScalar(10));
		sprite.scale.multiplyScalar(0.7);
		sprite.isWorldPoint = point.isWorldPoint;
		scene.add( sprite );
		this.sprites.push(sprite);

		// onClick sprite function
		sprite.onClick = () => {
			this.destroy();
			setTimeout(() => {point.nextScene.createScene(scene)}, 200);
			setTimeout(() => {point.nextScene.appear()}, 200);
			presentScene = point.nextScene;
		};
	}

	destroy(){
		this.sprites.forEach( (sprite, index) =>{
			gsap.to(sprite.scale, 0.1, {
			x: 0,
			y: 0,
			z: 0,
			onComplete: () => {
				this.scene.remove(sprite);
			}
			});
		});
	}

	appear(){
		this.sprites.forEach( (sprite) =>{
			sprite.scale.set(0, 0, 0);
			gsap.to(sprite.scale, 0.1, {
				x: .05,
				y: .05,
				z: .05
		}).delay(4 + Math.random()*3);
		});
	}


	addPoint(point){
		this.points.push(point);
	}
}

/** Initiate Databases */
let DataCities = [];

class City {
	constructor(pathNumber, numberOfScenes, aboutScenes, phi, theta, ro = 4.2, scenes = [], point = null){
        this.pathNumber = pathNumber;
        this.numberOfScenes = numberOfScenes;
		this.position = convertEuclidian(ro, phi, theta);
		this.scenes = scenes;
		this.aboutScenes = aboutScenes;
		this.point = point;
	}

    addScenes(){
        for (let i = 0; i < this.numberOfScenes; i++){
            this.scenes.push(new Scene('./assets/view/city'+ this.pathNumber +'/asset'+ (i + 1) +'.jpg', camera));
        }

        this.scenes.forEach((scene, index) => {
            scene.addPoint({
                position : new THREE.Vector3(0, 0, 0),
                about: this.aboutScenes[index],
                nextScene: this.scenes[index + 1]
            });
        });
        
        this.scenes[this.scenes.length - 1].points[0].nextScene = this.scenes[0];
    }

    show(scene){
        let currentScene = this.scenes[0];
        if (this.scenes.length > 0) {
            currentScene.createScene(scene);
            currentScene.appear();
        }
    }
}

const BOD = new City(1, 8, aboutScenesBOD, 44.76487, 89.52815);
const PAR = new City(2, 1, aboutScenesPAR, 44.836, 89.56415);
const ARC = new City(4, 1, aboutScenesARC, 44.75887, 89.52115);
const ROC = new City(3, 1, aboutScenesROC, 44.78787, 89.52115);
const GNV = new City(5, 1, aboutScenesGNV, 44.79287, 89.61015);
const BDP = new City(6, 1, aboutScenesBDP, 44.84107, 89.7578);
const MHD = new City(7, 1, aboutScenesMHD, 44.577, 89.43);


DataCities.push(BOD);
DataCities.push(PAR);
DataCities.push(ROC);
DataCities.push(ARC);
DataCities.push(GNV);
DataCities.push(BDP);
DataCities.push(MHD);


DataCities.forEach( (City) => {
    City.addScenes();
});

/**Maths**/
const radianQuota = Math.PI/180;
function convertEuclidian(ro, phi, theta){
	return {x: ro*Math.sin(theta)*Math.cos(phi), y: ro*Math.sin(theta)*Math.sin(phi) , z: ro*Math.cos(theta)}
}

/** Initiate world view */
let worldScene = new Scene('./assets/view/world.jpg', camera);

let worldPoints = [{
		position : new THREE.Vector3(BOD.position.x, BOD.position.y, BOD.position.z),
		about: 'Bordeaux',
		nextScene: BOD.scenes[0],
		isWorldPoint: true
	},
	{
		position : new THREE.Vector3(PAR.position.x, PAR.position.y, PAR.position.z),
		about: 'Paris',
		nextScene: PAR.scenes[0],
		isWorldPoint: true
	},
	{
		position : new THREE.Vector3(ROC.position.x, ROC.position.y, ROC.position.z),
		about: 'La Rochelle',
		nextScene: ROC.scenes[0],
		isWorldPoint: true
	},
	{
		position : new THREE.Vector3(ARC.position.x, ARC.position.y, ARC.position.z),
		about: 'Arcachon',
		nextScene: ARC.scenes[0],
		isWorldPoint: true
	},
	{
		position : new THREE.Vector3(GNV.position.x, GNV.position.y, GNV.position.z),
		about: 'Geneve',
		nextScene: GNV.scenes[0],
		isWorldPoint: true
	},
	{
		position : new THREE.Vector3(BDP.position.x, BDP.position.y, BDP.position.z),
		about: 'Budapest',
		nextScene: BDP.scenes[0],
		isWorldPoint: true
	},
	{
		position : new THREE.Vector3(MHD.position.x, MHD.position.y, MHD.position.z),
		about: 'Mohamedia',
		nextScene: MHD.scenes[0],
		isWorldPoint: true
	}
];

function worldInit(scene){
	worldToggle = 'on';

	worldPoints.forEach( (worldPoint) => {
		worldScene.addPoint(worldPoint);
	});

	worldScene.createScene(scene);
	worldScene.appear();
	presentScene = worldScene;
}
