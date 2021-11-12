// init stage4
function stage4() {
    initCannon4();
    init4();
    animate4();
}
function initCannon4() {
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
    if (split)
        world.solver = new CANNON.SplitSolver(solver);
    else
        world.solver = solver;

    // set world's gravity
    world.gravity.set(0, -10, 0);
    world.broadphase = new CANNON.NaiveBroadphase();

    physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
        physicsMaterial,
        0.0,// friction coefficient
        0.3 // restitution
    );

    // We must add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);

    // Create a cannonball sphere
    var mass = 5, radius = 1.3;
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
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(groundBody);
}

// setup scene
function init4() {

    // setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // define new scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x2D2D5A, 0, 500);

    // light option
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

    // floor option
    THREE.ImageUtils.crossOrigin = '';
    geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    // set options for ground texture mapping
    material = new THREE.MeshLambertMaterial({ color: 0xDDDDDD });
    var texture = THREE.ImageUtils.loadTexture('images_stage/sand.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(150, 150);
    var material_ground = new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.03
    })

    // set options for object texture mapping
    var texture2 = THREE.ImageUtils.loadTexture('images_stage/tree_texture1.jpg');
    var material2 = new THREE.MeshPhongMaterial({
        color: 0xE75656,
        map: texture2,
        bumpMap: texture2,
        bumpScale: 0.03
    })

    var texture3 = THREE.ImageUtils.loadTexture('images_stage/tree_texture2.jpg');
    var material3 = new THREE.MeshPhongMaterial({
        map: texture3,
        bumpMap: texture3,
        bumpScale: 0.03
    })

    var texture4 = THREE.ImageUtils.loadTexture('images_stage/tree_texture3.jpg');
    var material4 = new THREE.MeshPhongMaterial({
        map: texture4,
        bumpMap: texture4,
        bumpScale: 0.03
    })

    var material5 = new THREE.MeshPhongMaterial({
        map: texture2,
        bumpMap: texture2,
        bumpScale: 0.03
    })

    mesh = new THREE.Mesh(geometry, material_ground);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color, 1);
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    // Add objects
    var halfExtents = new CANNON.Vec3(1, 1, 1);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material4);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-5, 1, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-5, 1, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material4);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-5, 1, -13);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-5, 1, -13);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material2);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-5, 3, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-5, 3, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    // cylinder object
    var size = 1;
    var mass = 1;
    var cylGeometry = new THREE.CylinderGeometry(halfExtents.x, halfExtents.y, halfExtents.z * 2, 10); //윗면, 아랫면, 높이
    var cylinderShape = new CANNON.Cylinder(size, size, 2 * size, 10);
    var cylinderBody = new CANNON.Body({ mass: mass });
    var cylMesh = new THREE.Mesh(cylGeometry, material5);
    cylinderBody.addShape(cylinderShape);
    cylinderBody.position.set(-5, 5, -15);
    cylinderBody.fixedRotation = true;
    cylMesh.position.set(-5, 5, -15);
    cylMesh.castShadow = true;
    cylMesh.receiveShadow = true;
    world.addBody(cylinderBody);
    scene.add(cylMesh);
    cylinders.push(cylinderBody);
    cylMeshes.push(cylMesh);

    // box object
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material4);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(5, 1, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(5, 1, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material4);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(5, 1, -13);
    boxBody.fixedRotation = true;
    boxMesh.position.set(5, 1, -13);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material2);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(5, 3, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(5, 3, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    // cylinder object
    var cylinderShape = new CANNON.Cylinder(size, size, 2 * size, 10);
    var cylinderBody = new CANNON.Body({ mass: mass });
    var cylMesh = new THREE.Mesh(cylGeometry, material5);
    cylinderBody.addShape(cylinderShape);
    cylinderBody.position.set(5, 5, -15);
    cylinderBody.fixedRotation = true;
    cylMesh.position.set(5, 5, -15);
    cylMesh.castShadow = true;
    cylMesh.receiveShadow = true;
    world.addBody(cylinderBody);
    scene.add(cylMesh);
    cylinders.push(cylinderBody);
    cylMeshes.push(cylMesh);

    var halfExtents = new CANNON.Vec3(0.05, 2, 1);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material5);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(0.7, 2, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(0.7, 2, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    var halfExtents = new CANNON.Vec3(0.05, 2, 1);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material5);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(-0.7, 2, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(-0.7, 2, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    var halfExtents = new CANNON.Vec3(0.8, 1, 1);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material4);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(0, 5, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(0, 5, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    var halfExtents = new CANNON.Vec3(7, 0.5, 2);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material3);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(0, 6.5, -15);
    boxBody.fixedRotation = true;
    boxMesh.position.set(0, 6.5, -15);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    // linked box object
    var size = 0.5;
    var he = new CANNON.Vec3(size, size, size * 0.1);
    var boxShape = new CANNON.Box(he);
    var mass = 0;
    var space = 0.05 * size;
    var N = 3, last;
    var boxGeometry = new THREE.BoxGeometry(he.x * 1, he.y * 1, he.z * 1);
    for (var i = 0; i < N; i++) {
        var boxbody = new CANNON.Body({ mass: mass });
        boxbody.addShape(boxShape);
        var boxMesh = new THREE.Mesh(boxGeometry, material3);
        boxbody.position.set(-5, 5, -13);
        boxbody.linearDamping = 0.01;
        boxbody.angularDamping = 0.01;
        // boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        world.addBody(boxbody);
        scene.add(boxMesh);
        boxes.push(boxbody);
        boxMeshes.push(boxMesh);

        if (i != 0) {
            // Connect this body to the last one
            var c1 = new CANNON.PointToPointConstraint(boxbody, new CANNON.Vec3(-size, size + space, 0), last, new CANNON.Vec3(-size, -size - space, 0));
            var c2 = new CANNON.PointToPointConstraint(boxbody, new CANNON.Vec3(size, size + space, 0), last, new CANNON.Vec3(size, -size - space, 0));
            world.addConstraint(c1);
            world.addConstraint(c2);
        } else {
            mass = 0.3;
        }
        last = boxbody;
    }

    // linked box object
    var size = 0.5;
    var he = new CANNON.Vec3(size, size, size * 0.1);
    var boxShape = new CANNON.Box(he);
    var mass = 0;
    var space = 0.1 * size;
    var N = 3, last;
    var boxGeometry = new THREE.BoxGeometry(he.x * 1, he.y * 1, he.z * 1);
    for (var i = 0; i < N; i++) {
        var boxbody = new CANNON.Body({ mass: mass });
        boxbody.addShape(boxShape);
        var boxMesh = new THREE.Mesh(boxGeometry, material3);
        boxbody.position.set(5, 5, -13);
        boxbody.linearDamping = 0.01;
        boxbody.angularDamping = 0.01;
        // boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        world.addBody(boxbody);
        scene.add(boxMesh);
        boxes.push(boxbody);
        boxMeshes.push(boxMesh);

        if (i != 0) {
            // Connect this body to the last one
            var c1 = new CANNON.PointToPointConstraint(boxbody, new CANNON.Vec3(-size, size + space, 0), last, new CANNON.Vec3(-size, -size - space, 0));
            var c2 = new CANNON.PointToPointConstraint(boxbody, new CANNON.Vec3(size, size + space, 0), last, new CANNON.Vec3(size, -size - space, 0));
            world.addConstraint(c1);
            world.addConstraint(c2);
        } else {
            mass = 0.3;
        }
        last = boxbody;
    }
}

// setup window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// setup object movement
var dt = 1 / 60;
function animate4() {
    requestAnimationFrame(animate4);
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

            // clear option
            if (boxMeshes[2].position.y < 1.21111 && boxMeshes[5].position.y < 1.21111) {
                stage_clear = true;
                document.exitPointerLock();
                clear();
            }
        }
        for (var i = 0; i < cylinders.length; i++) {
            cylMeshes[i].position.copy(cylinders[i].position);
            cylMeshes[i].quaternion.copy(cylinders[i].quaternion);
        }
    }
    controls.update(Date.now() - time);
    renderer.render(scene, camera);
    time = Date.now();
}
