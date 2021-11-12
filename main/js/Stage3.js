//init stage3
function stage3() {
    initCannon3();
    init3();
    animate3();
}

function initCannon3() {
    // Setup new world
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

    // set world's gravity
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

    // create a cannonball sphere
    var mass = 5,
        radius = 1.3;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({ mass: mass });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0, 5, 0);
    sphereBody.linearDamping = 0.9;
    world.addBody(sphereBody);

    // create a plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        -Math.PI / 2
    );
    world.addBody(groundBody);
}

// setup scene
function init3() {

    // setup camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // define new sene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xA2F6FF, 0, 500);

    // light option
    var ambient = new THREE.AmbientLight(0x111111);
    scene.add(ambient);
    light = new THREE.SpotLight(0xB5B2FF);
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

    // floor option
    THREE.ImageUtils.crossOrigin = '';

    // set options for ground texture mapping
    var texture = THREE.ImageUtils.loadTexture('images_stage/grass2.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(50, 50);

    var floorMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.03
    })

    // floor option
    geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    mesh = new THREE.Mesh(geometry, floorMaterial);
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

    // set options for object texture mapping
    var stone = THREE.ImageUtils.loadTexture('images_stage/thumbnail.png');
    var stoneMaterial = new THREE.MeshPhongMaterial({
        map: stone,
        bumpMap: stone,
        bumpScale: 0.03
    })

    var magma = THREE.ImageUtils.loadTexture('images_stage/magma.jpg');
    var magmaMaterial = new THREE.MeshPhongMaterial({
        map: magma,
        bumpMap: magma,
        bumpScale: 0.03
    })

    // Add boxes
    var halfExtents = new CANNON.Vec3(1, 1, 1);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(
        halfExtents.x * 2,
        halfExtents.y * 2,
        halfExtents.z * 2
    );

    //objects
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, stoneMaterial);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-2, 1, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-2, 1, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, stoneMaterial);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(2, 1, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(2, 1, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, stoneMaterial);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(0, 1, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(0, 1, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    // other size of object
    var boxGeometry = new THREE.BoxGeometry(
        halfExtents.x * 0.3,
        halfExtents.y * 2,
        halfExtents.z * 2
    );

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, stoneMaterial);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-1, 3, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-1, 3, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, stoneMaterial);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(1, 3, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(1, 3, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    // other size of object
    var boxGeometry = new THREE.BoxGeometry(
        halfExtents.x * 2,
        halfExtents.y * 2,
        halfExtents.z * 2
    );

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, stoneMaterial);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-1, 5, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-1, 5, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, stoneMaterial);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(1, 5, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(1, 5, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    //other size of object
    var boxGeometry = new THREE.BoxGeometry(
        halfExtents.x * 0.3,
        halfExtents.y * 2,
        halfExtents.z * 2
    );

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, stoneMaterial);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(0, 7, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(0, 7, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    //other size of object
    var boxGeometry = new THREE.BoxGeometry(
        halfExtents.x * 2,
        halfExtents.y * 2,
        halfExtents.z * 2
    );

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, magmaMaterial);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(0, 9, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(0, 9, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

}

// setup window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// setup object movement
var dt = 1 / 60;
function animate3() {
    requestAnimationFrame(animate3);
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

            //clear option
            if (boxMeshes[7].position.y < 1.21111) {
                stage_clear = true;
                console.log(stage_clear);
                document.exitPointerLock();
                clear();
            }
        }
    }
    controls.update(Date.now() - time);
    renderer.render(scene, camera);
    time = Date.now();
}
