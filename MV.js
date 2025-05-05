// Matrix and Vector operations for WebGL

function vec2(x, y) {
    return [x, y];
}

function vec3(x, y, z) {
    return [x, y, z];
}

function vec4(x, y, z, w) {
    return [x, y, z, w];
}

function mat4() {
    var v = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ];
    return v;
}

function flatten(v) {
    if (v.matrix === true) {
        v = transpose(v);
    }

    var n = v.length;
    var elemsAreArrays = false;

    if (Array.isArray(v[0])) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array(n);

    if (elemsAreArrays) {
        var idx = 0;
        for (var i = 0; i < v.length; ++i) {
            for (var j = 0; j < v[i].length; ++j) {
                floats[idx++] = v[i][j];
            }
        }
    } else {
        for (var i = 0; i < v.length; ++i) {
            floats[i] = v[i];
        }
    }

    return floats;
}

function lookAt(eye, at, up) {
    var n = normalize(subtract(eye, at)); // Forward
    var u = normalize(cross(up, n));      // Right
    var v = normalize(cross(n, u));       // Up

    var result = mat4();
    result[0][0] = u[0];
    result[0][1] = u[1];
    result[0][2] = u[2];
    result[1][0] = v[0];
    result[1][1] = v[1];
    result[1][2] = v[2];
    result[2][0] = n[0];
    result[2][1] = n[1];
    result[2][2] = n[2];
    result[0][3] = -dot(u, eye);
    result[1][3] = -dot(v, eye);
    result[2][3] = -dot(n, eye);

    return result;
}

function perspective(fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy * Math.PI / 360.0);
    var d = far - near;

    var result = mat4();
    result[0][0] = f / aspect;
    result[1][1] = f;
    result[2][2] = -(near + far) / d;
    result[2][3] = -2 * near * far / d;
    result[3][2] = -1;
    result[3][3] = 0.0;

    return result;
}

function transpose(m) {
    var result = [];
    for (var i = 0; i < m[0].length; i++) {
        result.push([]);
        for (var j = 0; j < m.length; j++) {
            result[i].push(m[j][i]);
        }
    }
    return result;
}

function add(u, v) {
    var result = [];
    for (var i = 0; i < u.length; i++) {
        result.push(u[i] + v[i]);
    }
    return result;
}

function subtract(u, v) {
    var result = [];
    for (var i = 0; i < u.length; i++) {
        result.push(u[i] - v[i]);
    }
    return result;
}

function scale(s, v) {
    var result = [];
    for (var i = 0; i < v.length; i++) {
        result.push(s * v[i]);
    }
    return result;
}

function dot(u, v) {
    var sum = 0;
    for (var i = 0; i < u.length; i++) {
        sum += u[i] * v[i];
    }
    return sum;
}

function cross(u, v) {
    return [
        u[1] * v[2] - u[2] * v[1],
        u[2] * v[0] - u[0] * v[2],
        u[0] * v[1] - u[1] * v[0]
    ];
}

function normalize(v) {
    var length = Math.sqrt(dot(v, v));
    if (length > 0.0001) {
        return scale(1.0 / length, v);
    } else {
        return [0, 0, 0];
    }
}

function rotate(m, angle, axis) {
    var c = Math.cos(angle * Math.PI / 180.0);
    var s = Math.sin(angle * Math.PI / 180.0);
    var omc = 1.0 - c;
    
    var x = axis[0];
    var y = axis[1];
    var z = axis[2];

    var result = mat4();
    result[0][0] = x * x * omc + c;
    result[0][1] = x * y * omc - z * s;
    result[0][2] = x * z * omc + y * s;
    result[1][0] = y * x * omc + z * s;
    result[1][1] = y * y * omc + c;
    result[1][2] = y * z * omc - x * s;
    result[2][0] = z * x * omc - y * s;
    result[2][1] = z * y * omc + x * s;
    result[2][2] = z * z * omc + c;
    
    return result;
}

function translate(x, y, z) {
    var result = mat4();
    result[0][3] = x;
    result[1][3] = y;
    result[2][3] = z;
    return result;
}
