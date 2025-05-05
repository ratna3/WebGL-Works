/**
 * Interactive Kaleidoscope Visualization
 * Author: Ratna Kirti
 * 
 * This program creates a dynamic kaleidoscope visualization that responds
 * to mouse movements and user input. The visualization uses fragment shaders
 * to generate symmetrical patterns with various color schemes.
 */

"use strict";

// WebGL rendering context and shader program
let graphicsContext, shaderProgram;

// Canvas and interaction elements
let canvasElement;
let mousePosition = { x: 0, y: 0 };
let canvasResolution = { width: 0, height: 0 };

// Visual effect configuration
let animationSpeed = 0.5;       // Controls the speed of animation
let segmentCount = 8;           // Controls the symmetry segments
let colorScheme = 0;            // Controls the color theme
let animationStartTime;         // Reference time for animations

// Shader uniform locations for communication with GPU
let timeUniform, resolutionUniform, mouseUniform;
let segmentsUniform, speedUniform, colorSchemeUniform;

/**
 * Initialize the application when page loads
 * Sets up the WebGL context, shaders, and event listeners
 */
window.onload = function() {
    console.log("Initializing kaleidoscope...");
    
    // Set up the WebGL canvas
    canvasElement = document.getElementById("gl-canvas");
    
    // Make canvas fill the window
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize WebGL
    graphicsContext = initWebGL(canvasElement);
    if (!graphicsContext) {
        console.error("WebGL initialization failed");
        return;
    }
    
    try {
        // Create and compile shaders
        const vertexShaderSource = document.getElementById("vertex-shader").textContent;
        const fragmentShaderSource = document.getElementById("fragment-shader").textContent;
        
        const vertexShader = createShader(graphicsContext, graphicsContext.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(graphicsContext, graphicsContext.FRAGMENT_SHADER, fragmentShaderSource);
        
        if (!vertexShader || !fragmentShader) {
            throw new Error("Failed to compile shaders");
        }
        
        // Create and link the shader program
        shaderProgram = createProgram(graphicsContext, vertexShader, fragmentShader);
        
        if (!shaderProgram) {
            throw new Error("Failed to link program");
        }
        
        // Tell WebGL to use our program
        graphicsContext.useProgram(shaderProgram);
        
        // Create a full-screen quad (two triangles)
        const quadVertices = [
            -1.0, -1.0,  // bottom left
             1.0, -1.0,  // bottom right
            -1.0,  1.0,  // top left
             1.0,  1.0   // top right
        ];
        
        // Create vertex buffer
        const positionBuffer = graphicsContext.createBuffer();
        graphicsContext.bindBuffer(graphicsContext.ARRAY_BUFFER, positionBuffer);
        graphicsContext.bufferData(graphicsContext.ARRAY_BUFFER, new Float32Array(quadVertices), graphicsContext.STATIC_DRAW);
        
        // Set up vertex attributes
        const positionLocation = graphicsContext.getAttribLocation(shaderProgram, "aPosition");
        graphicsContext.enableVertexAttribArray(positionLocation);
        graphicsContext.vertexAttribPointer(positionLocation, 2, graphicsContext.FLOAT, false, 0, 0);
        
        // Get uniform locations for later use
        timeUniform = graphicsContext.getUniformLocation(shaderProgram, "uTime");
        resolutionUniform = graphicsContext.getUniformLocation(shaderProgram, "uResolution");
        mouseUniform = graphicsContext.getUniformLocation(shaderProgram, "uMouse");
        segmentsUniform = graphicsContext.getUniformLocation(shaderProgram, "uSegments");
        speedUniform = graphicsContext.getUniformLocation(shaderProgram, "uSpeed");
        colorSchemeUniform = graphicsContext.getUniformLocation(shaderProgram, "uColorScheme");
        
        // Set up event listeners for user interaction
        setupEventListeners();
        
        // Start animation loop
        animationStartTime = performance.now();
        render();
        
        console.log("Kaleidoscope initialized successfully");
    } catch (error) {
        console.error("Error initializing kaleidoscope:", error);
    }
};

/**
 * Set up all event listeners for user interaction
 * Includes mouse tracking and UI controls
 */
function setupEventListeners() {
    // Mouse movement tracking
    canvasElement.addEventListener('mousemove', function(e) {
        mousePosition.x = e.clientX;
        mousePosition.y = e.clientY;
    });
    
    // Touch support for mobile devices
    canvasElement.addEventListener('touchmove', function(e) {
        e.preventDefault();
        mousePosition.x = e.touches[0].clientX;
        mousePosition.y = e.touches[0].clientY;
    }, { passive: false });
    
    // UI controls with error handling
    try {
        // Symmetry segments control
        document.getElementById('segments').addEventListener('input', function() {
            segmentCount = parseInt(this.value);
        });
        
        // Animation speed control
        document.getElementById('speed').addEventListener('input', function() {
            animationSpeed = this.value / 100.0;
        });
        
        // Color scheme selection
        document.getElementById('colorScheme').addEventListener('change', function() {
            colorScheme = parseInt(this.value);
        });
        
        // Reset button to restore default settings
        document.getElementById('resetBtn').addEventListener('click', function() {
            // Reset values to defaults
            segmentCount = 8;
            animationSpeed = 0.5;
            colorScheme = 0;
            
            // Update UI controls to match
            document.getElementById('segments').value = 8;
            document.getElementById('speed').value = 50;
            document.getElementById('colorScheme').value = 0;
        });
    } catch (error) {
        console.error("Error setting up event listeners:", error);
    }
}

/**
 * Adjust the canvas size to fill the window
 * Called on load and window resize
 */
function resizeCanvas() {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
    canvasResolution.width = canvasElement.width;
    canvasResolution.height = canvasElement.height;
    
    // Update viewport if WebGL context exists
    if (graphicsContext) {
        graphicsContext.viewport(0, 0, canvasElement.width, canvasElement.height);
    }
}

/**
 * Main render function - animation loop
 * Updates uniforms and draws the kaleidoscope
 */
function render() {
    try {
        // Clear canvas
        graphicsContext.clearColor(0.0, 0.0, 0.0, 1.0);
        graphicsContext.clear(graphicsContext.COLOR_BUFFER_BIT);
        
        // Calculate elapsed time since start
        const elapsed = performance.now() - animationStartTime;
        
        // Update all shader uniforms
        graphicsContext.uniform1f(timeUniform, elapsed);
        graphicsContext.uniform2f(resolutionUniform, canvasResolution.width, canvasResolution.height);
        graphicsContext.uniform2f(mouseUniform, mousePosition.x, mousePosition.y);
        graphicsContext.uniform1i(segmentsUniform, segmentCount);
        graphicsContext.uniform1f(speedUniform, animationSpeed);
        graphicsContext.uniform1i(colorSchemeUniform, colorScheme);
        
        // Draw full-screen quad (two triangles) to create the kaleidoscope
        graphicsContext.drawArrays(graphicsContext.TRIANGLE_STRIP, 0, 4);
        
        // Request next frame for continuous animation
        requestAnimationFrame(render);
    } catch (error) {
        console.error("Error in render loop:", error);
    }
}
