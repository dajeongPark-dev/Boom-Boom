function stage2() {
    // Init Stage2
    init2(); 
    animate2();
}



function init2() {

    // setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // define new scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xADD8FF, 0, 500);

    // Setup our world
    world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;
    var solver = new CANNON.GSSolver();
    world.defaultContactMaterial.contactEquationStiffness = 5e8;
    world.defaultContactMaterial.contactEquationRelaxation = 10;
    solver.iterations = 7;
    solver.tolerance = 0.1;
    var split = true;
    if (split)
        world.solver = new CANNON.SplitSolver(solver);
    else
        world.solver = solver;

    // set gravity    
    world.gravity.set(0, -5, 0);
    world.broadphase = new CANNON.NaiveBroadphase();

    physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
        physicsMaterial,
        0.0,// friction coefficient
        0.3 // restitution

    );

    // We must add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);

    // Create a cannon ball sphere
    var mass = 5, radius = 1.3;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({ mass: mass });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0, 5, 0);
    sphereBody.linearDamping = 0.9;
    world.addBody(sphereBody);

    //Create a plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0, mesh: mesh });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(groundBody);

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

    // load floor texture
    THREE.ImageUtils.crossOrigin = '';
    var texture = THREE.ImageUtils.loadTexture('images_stage/grass2.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(50, 50);

    // floor option
    geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    // object color1
    material = new THREE.MeshLambertMaterial({ color: 0xdddddd });
    // object color2
    material2 = new THREE.MeshLambertMaterial({ color: 0x9999 });
    // object color4
    material3 = new THREE.MeshLambertMaterial({ color: 0x000000 });
    // object texture1
    var material4 = new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.03
    }) // texture mapping
    // object texture2
    var grass = THREE.ImageUtils.loadTexture('images_stage/rocks.jpg');
    var material5 = new THREE.MeshPhongMaterial({
        map: grass,
        bumpMap: grass,
        bumpScale: 0.03
    })
    // object texture3
    var tree = THREE.ImageUtils.loadTexture('images_stage/tree_texture3.jpg');
    var material6 = new THREE.MeshPhongMaterial({
        map: tree,
        bumpMap: tree,
        bumpScale: 0.03
    })


    mesh = new THREE.Mesh(geometry, material4);
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


    // Add boxes
    var halfExtents = new CANNON.Vec3(0.2, 0.2, 0.2);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);

    var halfExtents2 = new CANNON.Vec3(0.5, 0.5, 0.5);
    var boxShape2 = new CANNON.Box(halfExtents2);
    var boxGeometry2 = new THREE.BoxGeometry(halfExtents2.x * 2, halfExtents2.y * 2, halfExtents2.z * 2);

    var halfExtents3 = new CANNON.Vec3(1.2, 0.1, 1);
    var boxShape3 = new CANNON.Box(halfExtents3);
    var boxGeometry3 = new THREE.BoxGeometry(halfExtents3.x * 2, halfExtents3.y * 2, halfExtents3.z * 2);


    // object
    var count = 0;
    for (var i = 0.5; i <= 2.5; i += 1) {
        for (var j = 0; j <= 2; j += 1.2) {
            for (var k = -5; k >= -7; k -= 1.01) {
                var boxBody = new CANNON.Body({ mass: 1 });
                boxBody.addShape(boxShape2);

                var boxMesh = new THREE.Mesh(boxGeometry2, material5);


                world.addBody(boxBody);
                scene.add(boxMesh);
                boxBody.position.set(j, i, k);
                boxBody.fixedRotation = true;
                boxMesh.position.set(j, i, k);
                boxMesh.castShadow = true;
                boxMesh.receiveShadow = true;
                boxes.push(boxBody);
                boxMeshes.push(boxMesh);
                count += 1;

            }

        }
    }
    console.log(count);
    var boxBody = new CANNON.Body({ mass: 0.5 });
    boxBody.addShape(boxShape3);
    var boxMesh = new THREE.Mesh(boxGeometry3, material6);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(0.6, 3.1, -5.5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(0.6, 3.1, -5.5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    count += 1;


    for (var i = 3.5; i <= 4; i += 0.4) {
        for (var j = 0; j <= 0.8; j += 1.3) {
            for (var k = -5; k >= -6; k -= 1) {
                var boxBody = new CANNON.Body({ mass: 0.4 });
                boxBody.addShape(boxShape);

                var boxMesh = new THREE.Mesh(boxGeometry, material5);


                world.addBody(boxBody);
                scene.add(boxMesh);
                boxBody.position.set(j, i, k);
                boxBody.fixedRotation = true;
                boxMesh.position.set(j, i, k);
                boxMesh.castShadow = true;
                boxMesh.receiveShadow = true;
                boxes.push(boxBody);
                boxMeshes.push(boxMesh);
                count += 1;

            }

        }
    }
    console.log(count);

    for (var i = 3.5; i <= 4; i += 0.4) {
        for (var j = 1.2; j <= 2; j += 1.3) {
            for (var k = -5; k >= -6; k -= 1) {
                var boxBody = new CANNON.Body({ mass: 0.4 });
                boxBody.addShape(boxShape);

                var boxMesh = new THREE.Mesh(boxGeometry, material5);


                world.addBody(boxBody);
                scene.add(boxMesh);
                boxBody.position.set(j, i, k);
                boxBody.fixedRotation = true;
                boxMesh.position.set(j, i, k);
                boxMesh.castShadow = true;
                boxMesh.receiveShadow = true;
                boxes.push(boxBody);
                boxMeshes.push(boxMesh);
                count += 1;
                console.log(j, i, k);

            }

        }
    }
    console.log(count);

    var boxBody = new CANNON.Body({ mass: 0.2 });
    boxBody.addShape(boxShape3);
    var boxMesh = new THREE.Mesh(boxGeometry3, material5);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(0.6, 4.5, -5.5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(0.6, 4.5, -5.5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
    count += 1;
   
}

// setup window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
//setup object movement
var dt = 1 / 60;
function animate2() {
    requestAnimationFrame(animate2);
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
            if (boxMeshes[12].position.y < 1.21111) {
                scene.remove(boxMeshes[12]);
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
