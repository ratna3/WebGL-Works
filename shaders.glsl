// Vertex Shader
attribute vec4 vPosition;
attribute vec4 vColor;
varying vec4 fColor;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
    gl_Position = uProjection * uView * uModel * vPosition;
    fColor = vColor;
}

// Fragment Shader
precision mediump float;
varying vec4 fColor;

void main() {
    gl_FragColor = fColor;
}
