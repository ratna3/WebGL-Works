"use strict";

var gl, program, canvas;

// Missing variables
var positions = [];
var colors = [];
var theta = [0, 0, 0];
var axis = 0;

// ... Keep existing declarations
var cameraPos = vec3(0.0, 0.5, 3.0);
var cameraFront = vec3(0.0, 0.0, -1.0);
var cameraUp = vec3(0.0, 1.0, 0.0);
var yaw = -90.0, pitch = 0.0;

// Matrix uniforms
var modelLoc, viewLoc, projectionLoc;

// New object counters
var numCubePositions, numPyramidPositions, numGroundPositions;

// Movement flags
var keys = {};

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = initWebGL(canvas);

    // Load shaders and initialize attribute buffers
    var vertexShaderSource = document.getElementById("vertex-shader").textContent;
    var fragmentShaderSource = document.getElementById("fragment-shader").textContent;

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Initialize positions and colors arrays
    positions = [];
    colors = [];

    // New matrix uniform locations
    modelLoc = gl.getUniformLocation(program, "uModel");
    viewLoc = gl.getUniformLocation(program, "uView");
    projectionLoc = gl.getUniformLocation(program, "uProjection");

    // Generate multiple objects
    createMuseumScene(); // Replaces colorCube()

    // Set up attribute locations
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    
    var vColor = gl.getAttribLocation(program, "vColor");
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);

    // Event listeners for camera
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    document.addEventListener('keydown', handleRotationKeys);

    // Attach button event listeners
    document.getElementById("xButton").onclick = function() {
        axis = 0;
    };
    document.getElementById("yButton").onclick = function() {
        axis = 1;
    };
    document.getElementById("zButton").onclick = function() {
        axis = 2;
    };

    render();
};

function createMuseumScene() {
    // Central rotating cube (artifact)
    colorCube();
    numCubePositions = positions.length;

    // Display pyramid
    createPyramid(0, 1, -2); // Positioned above ground
    numPyramidPositions = positions.length - numCubePositions;

    // Museum floor
    createGround();
    numGroundPositions = positions.length - numCubePositions - numPyramidPositions;

    // Create buffers
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
}

function createPyramid(x, y, z) {
    var vertices = [
        vec4(x+0.0, y+1.0, z+0.0, 1.0),  // Top
        vec4(x-1.0, y-1.0, z+1.0, 1.0),  // Base
        vec4(x+1.0, y-1.0, z+1.0, 1.0),
        vec4(x+1.0, y-1.0, z-1.0, 1.0),
        vec4(x-1.0, y-1.0, z-1.0, 1.0)
    ];

    var indices = [0,1,2, 0,2,3, 0,3,4, 0,4,1];
    for(var i = 0; i < indices.length; i++) {
        positions.push(vertices[indices[i]]);
        colors.push(vec4(1.0, 0.8, 0.0, 1.0)); // Gold color
    }
}

function createGround() {
    var size = 10.0;
    var vertices = [
        vec4(-size, -1.0, -size, 1.0),
        vec4(-size, -1.0, size, 1.0),
        vec4(size, -1.0, size, 1.0),
        vec4(size, -1.0, -size, 1.0)
    ];
    
    var indices = [0,1,2, 0,2,3];
    for(var i = 0; i < indices.length; i++) {
        positions.push(vertices[indices[i]]);
        colors.push(vec4(0.3, 0.3, 0.3, 1.0)); // Dark gray
    }
}

function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function quad(a, b, c, d) {
    var vertices = [
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
    ];

    var vertexColors = [
        vec4(0.0, 0.0, 0.0, 1.0),  // black
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(1.0, 1.0, 1.0, 1.0),  // white
        vec4(0.0, 1.0, 1.0, 1.0)   // cyan
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it. In this case, we create two
    // triangles from the quad indices

    // Vertex indices for the two triangles making up a quad
    var indices = [a, b, c, a, c, d];
    for (var i = 0; i < indices.length; ++i) {
        positions.push(vertices[indices[i]]);
        colors.push(vertexColors[indices[i]]);
    }
}

function keyDown(event) {
    keys[event.key.toLowerCase()] = true;
}

function keyUp(event) {
    keys[event.key.toLowerCase()] = false;
}

function handleRotationKeys(event) {
    var speed = 0.1;
    switch(event.key) {
        case 'ArrowUp': pitch += speed; break;
        case 'ArrowDown': pitch -= speed; break;
        case 'ArrowLeft': yaw -= speed; break;
        case 'ArrowRight': yaw += speed; break;
    }
}

function updateCamera() {
    // Update front vector
    var front = vec3(
        Math.cos(yaw) * Math.cos(pitch),
        Math.sin(pitch),
        Math.sin(yaw) * Math.cos(pitch)
    );
    cameraFront = normalize(front);

    // Update camera position
    var speed = 0.1;
    if(keys['w']) cameraPos = add(cameraPos, scale(speed, cameraFront));
    if(keys['s']) cameraPos = subtract(cameraPos, scale(speed, cameraFront));
    if(keys['a']) {
        var right = normalize(cross(cameraFront, cameraUp));
        cameraPos = subtract(cameraPos, scale(speed, right));
    }
    if(keys['d']) {
        var right = normalize(cross(cameraFront, cameraUp));
        cameraPos = add(cameraPos, scale(speed, right));
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    updateCamera();
    theta[axis] += 2.0;

    // Set up matrices
    var view = lookAt(cameraPos, add(cameraPos, cameraFront), cameraUp);
    var projection = perspective(45, canvas.width/canvas.height, 0.1, 100.0);

    gl.uniformMatrix4fv(viewLoc, false, flatten(view));
    gl.uniformMatrix4fv(projectionLoc, false, flatten(projection));

    // Draw ground
    gl.uniformMatrix4fv(modelLoc, false, flatten(mat4()));
    gl.drawArrays(gl.TRIANGLES, numCubePositions + numPyramidPositions, numGroundPositions);

    // Draw pyramid (floating animation)
    var pyramidModel = translate(0, Math.sin(Date.now()*0.002)*0.5 + 1.0, -2);
    gl.uniformMatrix4fv(modelLoc, false, flatten(pyramidModel));
    gl.drawArrays(gl.TRIANGLES, numCubePositions, numPyramidPositions);

    // Draw rotating cube
    var cubeModel = rotate(mat4(), theta[0], [1,0,0]);
    cubeModel = rotate(cubeModel, theta[1], [0,1,0]);
    cubeModel = rotate(cubeModel, theta[2], [0,0,1]);
    gl.uniformMatrix4fv(modelLoc, false, flatten(cubeModel));
    gl.drawArrays(gl.TRIANGLES, 0, numCubePositions);

    requestAnimationFrame(render);
}
