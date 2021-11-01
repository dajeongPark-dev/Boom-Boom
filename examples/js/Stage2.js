function stage2() {
    initCannon2();
    init2();
    animate2();
}

function initCannon2() {
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
    if (split)
        world.solver = new CANNON.SplitSolver(solver);
    else
        world.solver = solver;

    world.gravity.set(0, -20, 0);
    world.broadphase = new CANNON.NaiveBroadphase();

    // Create a slippery material (friction coefficient = 0.0)
    physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
        physicsMaterial,
        0.0, // friction coefficient
        0.3  // restitution
    );
    // We must add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);

    // Create a sphere
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

function init2() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

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
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));

    material = new THREE.MeshLambertMaterial({ color: 0xdddddd });
    material2 = new THREE.MeshLambertMaterial({ color: 0x9999 });
    material3 = new THREE.MeshLambertMaterial({ color: 0xff1111 });

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

    window.addEventListener('resize', onWindowResize, false);

    // Add boxes
    var halfExtents = new CANNON.Vec3(1, 1, 1);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
    // for(var i=0; i<7; i++){
    //     var x = (Math.random()-0.5)*20;
    //     var y = 1 + (Math.random()-0.5)*1;
    //     var z = (Math.random()-0.5)*20;
    //
    //     var boxBody = new CANNON.Body({ mass: 5 });
    //     boxBody.addShape(boxShape);
    //     var boxMesh = new THREE.Mesh( boxGeometry, material );
    //     world.addBody(boxBody);
    //     scene.add(boxMesh);
    //     boxBody.position.set(x,y,z);
    //     boxMesh.position.set(x,y,z);
    //     boxMesh.castShadow = true;
    //     boxMesh.receiveShadow = true;
    //     boxes.push(boxBody);
    //     boxMeshes.push(boxMesh);
    // }


    //left box
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(0, 1, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(0, 1, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    //right box
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(2, 1, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(2, 1, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

    //center box
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
    var boxBody = new CANNON.Body({ mass: 1 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material3);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(1, 3, -5);
    boxBody.fixedRotation = true;
    boxMesh.position.set(1, 3, -5);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);


    // // Add linked boxes
    // var size = 0.5;
    // var he = new CANNON.Vec3(size,size,size*0.1);
    // var boxShape = new CANNON.Box(he);
    // var mass = 0;
    // var space = 0.1 * size;
    // var N = 5, last;
    // var boxGeometry = new THREE.BoxGeometry(he.x*1,he.y*1,he.z*1);
    // for(var i=0; i<N; i++){
    //     var boxbody = new CANNON.Body({ mass: mass });
    //     boxbody.addShape(boxShape);
    //     var boxMesh = new THREE.Mesh(boxGeometry, material);
    //     boxbody.position.set(5,(N-i)*(size*2+2*space) + size*2+space,0);
    //     boxbody.linearDamping = 0.01;
    //     boxbody.angularDamping = 0.01;
    //     // boxMesh.castShadow = true;
    //     boxMesh.receiveShadow = true;
    //     world.addBody(boxbody);
    //     scene.add(boxMesh);
    //     boxes.push(boxbody);
    //     boxMeshes.push(boxMesh);
    //
    //     if(i!=0){
    //         // Connect this body to the last one
    //         var c1 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(-size,size+space,0),last,new CANNON.Vec3(-size,-size-space,0));
    //         var c2 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(size,size+space,0),last,new CANNON.Vec3(size,-size-space,0));
    //         world.addConstraint(c1);
    //         world.addConstraint(c2);
    //     } else {
    //         mass=0.3;
    //     }
    //     last = boxbody;
    // }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

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

            // remove box if it fall
            // console.log(boxMeshes[0].position.y);
            if (boxMeshes[2].position.y < 1.21111) {
                scene.remove(boxMeshes[2]);
                stage_clear = true;
                // console.log(stage_clear);
                clear();
            }
        }

    }

    controls.update(Date.now() - time);
    renderer.render(scene, camera);
    time = Date.now();

}