function stage3() {
    initCannon3();
    init3();
    animate3();
}
function initCannon3() {
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
    world.gravity.set(0, -9, 0);
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
    sphereBody.position.set(0, 5, 3);
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

function init3() {
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x3770EB, 0, 500);
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

    THREE.ImageUtils.crossOrigin = '';
    var texture = THREE.ImageUtils.loadTexture('image/ground_grass.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(50, 50);

    var material_floor = new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.03
    })

    var texture_wall_stone = THREE.ImageUtils.loadTexture('image/wall-gad.jpg');
    var material_wall = new THREE.MeshPhongMaterial({
        map: texture_wall_stone,
        bumpMap: texture_wall_stone,
        bumpScale: 0.03
    })

    var texture_door_wood = THREE.ImageUtils.loadTexture('image/wood_door.jpg');
    var material_door = new THREE.MeshPhongMaterial({
        map: texture_door_wood,
        bumpMap: texture_door_wood,
        bumpScale: 0.03
    })

    //material fall bomb
    material = new THREE.MeshLambertMaterial({ color: 0x885F8F });
    material_green = new THREE.MeshLambertMaterial({ color: 0x3FAB7A });
    material_red = new THREE.MeshLambertMaterial({ color: 0xAC170B });

    // floor
    geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    mesh = new THREE.Mesh(geometry, material_floor);
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

    //box


    // Add boxes
    var halfExtents = new CANNON.Vec3(1, 1, 1);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(
        halfExtents.x * 2,
        halfExtents.y * 2,
        halfExtents.z * 2
    );
    // 1st floor
    // box 1-1
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_wall);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-6, 1, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-6, 1, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    // 1st floor
    // box 1-1
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_wall);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-6, 1, -3);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-6, 1, -3);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    // box 1-1
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_wall);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-4, 1, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-4, 1, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    // box 1-1
    var boxBody = new CANNON.Body({ mass: 0.1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_door);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-2, 1, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-2, 1, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    //left box
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_door);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(0, 1, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(0, 1, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    //right box
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_door);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(2, 1, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(2, 1, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    //right box
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_wall);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(4, 1, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(4, 1, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    //right box
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_wall);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(6, 1, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(6, 1, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    //right box
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_wall);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(6, 1, -3);
    boxBody.fixedRotation = true;
    boxMesh.position.set(6, 1, -3);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    ////////////////////////////////////////////////////////////////////////
    //2nd floor


    // box 2-1
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_wall);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-5, 3, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-5, 3, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    // box 1-1

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_wall);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-3, 3, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-3, 3, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    //left box
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_door);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-1, 3, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-1, 3, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    //right box
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_door);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(1, 3, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(1, 3, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    //right box
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_wall);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(3, 3, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(3, 3, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    //right box
    var boxGeometry = new THREE.BoxGeometry(
        halfExtents.x * 2,
        halfExtents.y * 2,
        halfExtents.z * 2
    );
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_wall);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(5, 3, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(5, 3, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    //////////////////////////////////////////////////////////////////////////////////////////////////

    //3rd floor

    // left cylinder
    var size = 1;
    var mass = 1;
    var cylGeometry = new THREE.CylinderGeometry(0, 1, 2, 16); //윗면, 아랫면, 높이
    var cylinderShape = new CANNON.Cylinder(size, size, 2 * size, 10);
    var cylinderBody = new CANNON.Body({ mass: mass });
    var cylMesh = new THREE.Mesh(cylGeometry, material_red);
    cylinderBody.addShape(cylinderShape);
    cylinderBody.position.set(-5, 5, -5);
    cylinderBody.fixedRotation = true;
    cylMesh.position.set(-5, 5, -5);
    cylMesh.castShadow = true;
    cylMesh.receiveShadow = true;
    world.addBody(cylinderBody);
    scene.add(cylMesh);
    cylMeshes = [], cylinders = [];
    cylinders.push(cylinderBody);
    cylMeshes.push(cylMesh);

    // box 3-0

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_wall);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-3, 5, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-3, 5, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes = [], boxMeshes = [];
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    // box 3-1
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_wall);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-1, 5, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-1, 5, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    // box 3-2
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_wall);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(1, 5, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(1, 5, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    //right box
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material_wall);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(3, 5, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(3, 5, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    // Right cylinder
    var size = 1;
    var mass = 1;
    var cylGeometry = new THREE.CylinderGeometry(0, 1, 2, 16); //윗면, 아랫면, 높이
    var cylinderShape = new CANNON.Cylinder(size, size, 2 * size, 10);
    var cylinderBody = new CANNON.Body({ mass: mass });
    var cylMesh = new THREE.Mesh(cylGeometry, material_red);
    cylinderBody.addShape(cylinderShape);
    cylinderBody.position.set(5, 5, -5);
    cylinderBody.fixedRotation = true;
    cylMesh.position.set(5, 5, -5);
    cylMesh.castShadow = true;
    cylMesh.receiveShadow = true;
    world.addBody(cylinderBody);
    scene.add(cylMesh);
    cylinders.push(cylinderBody);
    cylMeshes.push(cylMesh);
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //4th floor


    // center cylinder
    var size = 1;
    var mass = 2;
    var cylGeometry = new THREE.CylinderGeometry(0, 1, 2, 16); //윗면, 아랫면, 높이
    var cylinderShape = new CANNON.Cylinder(size, size, 2 * size, 10);
    var cylinderBody = new CANNON.Body({ mass: mass });
    var cylMesh = new THREE.Mesh(cylGeometry, material_red);
    cylinderBody.addShape(cylinderShape);
    cylinderBody.position.set(0, 7, -5);
    cylinderBody.fixedRotation = true;
    cylMesh.position.set(0, 7, -5);
    cylMesh.castShadow = true;
    cylMesh.receiveShadow = true;
    world.addBody(cylinderBody);
    scene.add(cylMesh);
    cylinders.push(cylinderBody);
    cylMeshes.push(cylMesh);

    ///////////////////////////////////////////////////////////////

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
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

        }
        //cylMeshes = [], cylinders = [];
        for (var i = 0; i < cylinders.length; i++) {
            cylMeshes[i].position.copy(cylinders[i].position);
            cylMeshes[i].quaternion.copy(cylinders[i].quaternion);
            // remove cones if it fall
            // console.log(cylMeshes[0].position.y);
            if (cylMeshes[0].position.y < 1.21111 && cylMeshes[1].position.y < 1.21111 && cylMeshes[2].position.y < 1.21111) {
                //scene.remove(boxMeshes[2]);
                stage_clear = true;
                document.exitPointerLock();
                clear();
            }
        }
    }
    controls.update(Date.now() - time);
    renderer.render(scene, camera);
    time = Date.now();
}
