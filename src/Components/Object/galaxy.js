import { Node } from '../../Modules/Utils/Node';
import { useEffect, useState, useRef } from 'react';
import * as twgl from 'twgl.js';
import { TRS } from '../../Modules/Utils/TRS';
import { useFlattenedPrimitives } from '../../Hooks/useFlattenedPrimitives';
const { m4 } = twgl;

export const Galaxy = () => {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const [objectsToDraw, setObjectsToDraw] = useState([]);
  const [objects, setObjects] = useState([]);

  const vs = `#version 300 es
    in vec4 a_position;
    in vec4 a_color;
    uniform mat4 u_matrix;
    out vec4 v_color;

    void main() {
      gl_Position = u_matrix * a_position;
      v_color = a_color;
    }
  `;

  const fs = `#version 300 es
    precision highp float;
    in vec4 v_color;
    uniform vec4 u_colorMult;
    uniform vec4 u_colorOffset;
    out vec4 outColor;

    void main() {
      outColor = v_color * u_colorMult + u_colorOffset;
    }
  `;

  const degToRad = (d) => {
    return d * Math.PI / 180;
  };

  let sunNode, earthNode, moonNode;
  const flattenedPrimitives = useFlattenedPrimitives();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas element not found!');
      return;
    }

    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("WebGL2 context cannot be used");
      return;
    }

    glRef.current = gl;
    twgl.setAttributePrefix("a_");
    
    // Create sphere buffer info
    var sphereBufferInfo = flattenedPrimitives.createSphereBufferInfo(gl, 10, 12, 6);
    if (!sphereBufferInfo) {
      console.error("Failed to create sphere buffer info.");
      return;
    }

    // Create program info
    var programInfo = twgl.createProgramInfo(gl, [vs, fs]);
    if (!programInfo) {
      console.error("Failed to create program info.");
      return;
    }

    var sphereVAO = twgl.createVAOFromBufferInfo(gl, programInfo, sphereBufferInfo);
    if (!sphereVAO) {
      console.error("Failed to create VAO from buffer info.");
      return;
    }

    // Define positions, rotations, and scales for sun, earth, and moon
    const sunTranslation = [0, 0, 0];
    const sunRotation = [0, 0, 0];
    const sunScale = [1, 1, 1];

    const earthTranslation = [50, 0, 0];
    const earthRotation = [0, 0, 0];
    const earthScale = [0.5, 0.5, 0.5];

    const moonTranslation = [20, 0, 0];
    const moonRotation = [1, 1, 1];
    const moonScale = [0.3, 0.3, 0.3];

    sunNode = new Node(new TRS(sunTranslation, sunRotation, sunScale), 'sun');
    sunNode.drawInfo = {
      uniforms: {
        u_colorOffset: [0.6, 0.6, 0, 1], // yellow
        u_colorMult: [0.4, 0.4, 0, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
    };

    earthNode = new Node(new TRS(earthTranslation, earthRotation, earthScale), 'earth');
    earthNode.drawInfo = {
      uniforms: {
        u_colorOffset: [0.2, 0.5, 0.8, 1], // blue
        u_colorMult: [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
    };

    moonNode = new Node(new TRS(moonTranslation, moonRotation, moonScale), 'moon');
    moonNode.drawInfo = {
      uniforms: {
        u_colorOffset: [0.6, 0.6, 0.6, 1], // gray
        u_colorMult: [0.1, 0.1, 0.1, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
    };

    moonNode.setParent(earthNode);
    earthNode.setParent(sunNode);

    setObjects([sunNode, earthNode, moonNode]);
    setObjectsToDraw([sunNode.drawInfo, earthNode.drawInfo, moonNode.drawInfo]);

    const updateProjectionMatrix = () => {
      const gl = glRef.current;
      const canvas = canvasRef.current;
      if (!gl || !canvas) return;
      return m4.perspective(degToRad(30), gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 2000);
    };

    let sunAngle = 0;
    let earthAngle = 0;
    let moonAngle = 0;

    const drawScene = (time) => {
      const gl = glRef.current;
      if (!gl) return;

      twgl.resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const cameraPosition = [0, -200, 10];
      const target = [0, 0, 0];
      const up = [0, 0, 1];
      const cameraMatrix = m4.lookAt(cameraPosition, target, up);
      const viewMatrix = m4.inverse(cameraMatrix);
      const projectionMatrix = updateProjectionMatrix();
      const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

      // Update angles
      sunAngle += 0.01;
      earthAngle += 0.02;
      moonAngle += 0.03;

      // Set world matrices
      sunNode.worldMatrix = m4.rotationZ(sunAngle);

      // Earth: Combine translation, rotation, and scale
      const earthTranslationMatrix = m4.translation(earthTranslation);
      const earthRotationMatrix = m4.rotationZ(earthAngle);
      const earthScaleMatrix = m4.scaling(earthScale); // Add scaling for Earth
      earthNode.worldMatrix = m4.multiply(
        m4.multiply(earthRotationMatrix, earthTranslationMatrix), // Rotation and Translation
        earthScaleMatrix // Apply scaling
      );

      earthNode.worldMatrix=m4.multiply(sunNode.worldMatrix,earthNode.worldMatrix)
      // Moon: Combine translation, rotation, and scale
      const moonTranslationMatrix = m4.translation(moonTranslation);
      const moonRotationMatrix = m4.rotationZ(moonAngle);
      const moonScaleMatrix = m4.scaling(moonScale); // Add scaling for Moon
      moonNode.worldMatrix = m4.multiply(
        m4.multiply(moonRotationMatrix, moonTranslationMatrix), // Rotation and Translation
        moonScaleMatrix // Apply scaling
      );
      moonNode.worldMatrix=m4.multiply(earthNode.worldMatrix,moonNode.worldMatrix)
      // Update uniforms
      objects.forEach((object) => {
        object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);
      });

      // Draw objects
      twgl.drawObjectList(gl, objectsToDraw);
      requestAnimationFrame(drawScene);
    };

    requestAnimationFrame(drawScene);
  },[]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};
