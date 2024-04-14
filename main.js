function showError(errorText) {
    const errorBoxDiv = document.getElementById('error-box');
    const errorSpan = document.createElement('p');
    errorSpan.innerText = errorText;
    errorBoxDiv.appendChild(errorSpan);
    console.error(errorText);
}

showError("Hello Test error 1");

function helloTriangle() {
    const canvas = document.getElementById("IDcanvas");
    if (!canvas) {
        showError("Can't find canvas reference");
        return;
    }
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        showError("Can't find webgl2 support");
        return;
    }

    const triangleVertices = [
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ];

    const triangleVerticesCpuBuffer = new Float32Array(triangleVertices);

    const triangleGeoBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVerticesCpuBuffer, gl.STATIC_DRAW);


    const vertexShaderSourceCode = `
    precision mediump float;
    
    attribute vec3 vertexPosition;

    //Step2
    uniform mat4 u_Matrix; //Add uniform

    void main() {

        //Step3 add the uniform to multiply the vec4
       gl_Position = u_Matrix * vec4(vertexPosition, 1.0);

    }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const compileError = gl.getShaderInfoLog(vertexShader);
        showError('compile vertex error: ' + compileError);
        return;
    }

    const fragmentShaderSourceCode = `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(0.8,0,0,1);
    }`;


    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const compileError = gl.getShaderInfoLog(fragmentShader);
        showError('compile fragment error: ' + compileError);
        return;
    }

    const triangleShaderProgram = gl.createProgram();
    gl.attachShader(triangleShaderProgram, vertexShader);
    gl.attachShader(triangleShaderProgram, fragmentShader);

    gl.linkProgram(triangleShaderProgram);
    if (!gl.getProgramParameter(triangleShaderProgram, gl.LINK_STATUS)) {
        const linkError = gl.getProgramInfoLog(triangleShaderProgram);
        showError('link program error:' + linkError);
        return;
    }

    const vertexPositionAttributLocation = gl.getAttribLocation(triangleShaderProgram, 'vertexPosition');
    if (vertexPositionAttributLocation < 0) {
        showError('failed to get attribute location for vertexPosition');
        return;
    }

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.useProgram(triangleShaderProgram);
    gl.enableVertexAttribArray(vertexPositionAttributLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
    gl.vertexAttribPointer(vertexPositionAttributLocation, 2, gl.FLOAT, false, 0, 0);


    //Step1
    function multiplyMatrices(matrixA, matrixB) {
        let result = new Array(16).fill(0);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    result[i * 4 + j] += matrixA[i * 4 + k] * matrixB[k * 4 + j];
                }
            }
        }
        return result;
    }

    //Step2 Uniform
    const uMatrix = gl.getUniformLocation(triangleShaderProgram, 'u_Matrix')

    // Animation loop
    //Step4 define theta and make an animation loop
    var theta = Math.PI / 70;
    function animate() {
        requestAnimationFrame(animate);
        theta = theta + Math.PI / 500;

        //Step5 make the matrix for each rotation this must be in the animation loop funciton
        const matrixX = [
            1, 0, 0, 0,
            0, Math.cos(theta), -Math.sin(theta), 0,
            0, Math.sin(theta), Math.cos(theta), 0,
            0, 0, 0, 1
        ]
        const matrixY = [
            Math.cos(theta), 0, Math.sin(theta), 0,
            0, 1, 0, 0,
            -Math.sin(theta), 0, Math.cos(theta), 0,
            0, 0, 0, 1
        ]
        const matrixZ = [
            Math.cos(theta), -Math.sin(theta), 0, 0,
            Math.sin(theta), Math.cos(theta), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]

        //Step6 use the multiplyMatrix function to multiply all your matrices together
        var matrixXY = multiplyMatrices(matrixX, matrixY);
        var matrixXYZ = multiplyMatrices(matrixXY, matrixZ);

        //Step7 Send the final matrix to the uniform in the vertexShader 
        
            //just uncomment 1 of the gl.uniformMatrix4fv lines
        gl.uniformMatrix4fv(uMatrix, false, matrixXYZ); //All rotations
        // gl.uniformMatrix4fv(uMatrix, false, matrixX); //Just X
        // gl.uniformMatrix4fv(uMatrix, false, matrixY); //Just Y
        // gl.uniformMatrix4fv(uMatrix, false, matrixZ); //Just Z
        // gl.uniformMatrix4fv(uMatrix, false, matrixXY); //Just X and Y

        gl.clearColor(0.1, 0.3, 0.3, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    animate();
}

try {
    helloTriangle();
} catch (e) {
    showError(`Uncaught JavaScript exception: ${e}`);
}
