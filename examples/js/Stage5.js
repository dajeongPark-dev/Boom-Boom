function stage5() {
    initCannon5();
    init5();
    animate5();
}
function initCannon5() {
    // Setup our world
    world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;
    var solver = new CANNON.GSSolver();
    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;
    solver.iterations = 7;
    solver.tolerance = 0.1;
    var split = true;
    if (split) world.solver = new CANNON.SplitSolver(solver);
    else world.solver = solver;
    world.gravity.set(0, -20, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    // Create a slippery material (friction coefficient = 0.0)
    physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(
        physicsMaterial,
        physicsMaterial,
        0.0,// friction coefficient
        0.3 // restitution
    );
    // We must add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);
    // Create a sphere
    var mass = 5,
        radius = 1.3;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({ mass: mass });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0, 5, 0);
    sphereBody.linearDamping = 0.9;
    world.addBody(sphereBody);
    // Create a plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        -Math.PI / 2
    );
    world.addBody(groundBody);
}
function init5() {
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 0, 500);
    var ambient = new THREE.AmbientLight(0x111111);
    scene.add(ambient);
    light = new THREE.SpotLight(0xffffff);
    light.position.set(10, 30, 20);
    light.target.position.set(0, 0, 0);
    if (true) {
        light.castShadow = true;
        light.shadowCameraNear = 20;
        light.shadowCameraFar = 50;//camera.far;
        light.shadowCameraFov = 40;
        light.shadowMapBias = 0.1;
        light.shadowMapDarkness = 0.7;
        light.shadowMapWidth = 2 * 512;
        light.shadowMapHeight = 2 * 512;
        //light.shadowCameraVisible = true;
    }
    scene.add(light);
    controls = new PointerLockControls(camera, sphereBody);
    scene.add(controls.getObject());
    // floor
    geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    material = new THREE.MeshLambertMaterial({ color: 0xdddddd });
    material2 = new THREE.MeshLambertMaterial({ color: 0x8888 });
    mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color, 1);
    document.body.appendChild(renderer.domElement);
    window.addEventListener("resize", onWindowResize, false);
    // Add boxes
    var halfExtents = new CANNON.Vec3(1, 1, 1);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(
        halfExtents.x * 2,
        halfExtents.y * 2,
        halfExtents.z * 2
    );
    
	 var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(1, 1, -12);
    boxBody.fixedRotation = true;
    boxMesh.position.set(1, 1, -12);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
	
	    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-1, 1, -12);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-1, 1, -12);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(3, 1, -12);
    boxBody.fixedRotation = true;
    boxMesh.position.set(3, 1, -12);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(1, 1, -10);
    boxBody.fixedRotation = true;
    boxMesh.position.set(1, 1, -10);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
	
	    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-1, 1, -10);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-1, 1, -10);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(3, 1, -10);
    boxBody.fixedRotation = true;
    boxMesh.position.set(3, 1, -10);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
	
	var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(1, 1, -8);
    boxBody.fixedRotation = true;
    boxMesh.position.set(1, 1, -8);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
	
	    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-1, 1, -8);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-1, 1, -8);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(3, 1, -8);
    boxBody.fixedRotation = true;
    boxMesh.position.set(3, 1, -8);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
	
	var boxGeometry = new THREE.BoxGeometry(
        halfExtents.x * 0.3,
        halfExtents.y * 2,
        halfExtents.z * 2
    );
	
	var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(2, 3, -10);
    boxBody.fixedRotation = true;
    boxMesh.position.set(2, 3, -10);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
	
	var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(0, 3, -10);
    boxBody.fixedRotation = true;
    boxMesh.position.set(0, 3, -10);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
	
	var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(1, 7, -10);
    boxBody.fixedRotation = true;
    boxMesh.position.set(1, 7, -10);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
	
	var boxGeometry = new THREE.BoxGeometry(
        halfExtents.x * 6,
        halfExtents.y * 2,
        halfExtents.z * 2
    );
	
	var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(1, 5, -10);
    boxBody.fixedRotation = true;
    boxMesh.position.set(1, 5, -10);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
		
    //center box
    var boxGeometry = new THREE.BoxGeometry(
        halfExtents.x * 2,
        halfExtents.y * 2,
        halfExtents.z * 2
    );
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material2);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(1, 9, -10);
    boxBody.fixedRotation = true;
    boxMesh.position.set(1, 9, -10);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
	
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
var dt = 1 / 60;
function animate5() {
    requestAnimationFrame(animate1);
    if (controls.enabled) {
        world.step(dt);
        // Update ball positions
        for (var i = 0; i < balls.length; i++) {
            ballMeshes[i].position.copy(balls[i].position);
            ballMeshes[i].quaternion.copy(balls[i].quaternion);
            if (Math.abs(ballMeshes[i].position.z) > 20) {
                scene.remove(ballMeshes[i]);
            }
        }
        // Update box positions
        for (var i = 0; i < boxes.length; i++) {
            boxMeshes[i].position.copy(boxes[i].position);
            boxMeshes[i].quaternion.copy(boxes[i].quaternion);
            // remove box if it fall
            // console.log(boxMeshes[0].position.y);
            if (boxMeshes[2].position.y < 1.21111) {
                //scene.remove(boxMeshes[2]);
                stage_clear = true;
                // console.log(stage_clear);
                document.exitPointerLock();
                clear();
                //stage2();
            }
            if (boxMeshes[3].position.y < 1.21111) {
                //scene.remove(boxMeshes[3]);
            }
        }
    }
    controls.update(Date.now() - time);
    renderer.render(scene, camera);
    time = Date.now();
}