# Adding Rotation Matrices to a Triangle in WebGL

1. **Create a Function to Multiply Matrices**: This function takes two matrices as input and returns the result of their multiplication.

2. **Define Uniform for Matrix**: In your vertex shader, define a uniform mat4 variable. This will be used to apply the rotation matrix to each vertex of the triangle.

3. **Get Uniform Location**: In your JavaScript code, get the location of the uniform variable you defined in the vertex shader.

4. **Define Rotation Angle**: Define a variable to hold the rotation angle. This will be incremented in your animation loop to create the rotation effect.

5. **Create Rotation Matrices**: In your animation loop, create the rotation matrices. You'll need separate matrices for rotation around the X, Y, and Z axes.

6. **Multiply Matrices**: Still in your animation loop, use the multiplyMatrices function to multiply your rotation matrices together. This will give you a final rotation matrix that combines the rotations around all three axes.

7. **Send Matrix to Uniform**: Finally, send the final rotation matrix to the uniform variable in the vertex shader using the gl.uniformMatrix4fv function. This applies the rotation to each vertex of the triangle, causing the triangle to rotate in your WebGL scene.

Remember, you can control which rotations are applied by choosing which matrices to multiply and send to the uniform. For example, if you only want to rotate around the X-axis, only send the X rotation matrix to the uniform.
