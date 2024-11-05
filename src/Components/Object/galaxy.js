import { Node } from '../../Modules/Utils/Node';
import { useEffect, useState, useRef } from 'react';
import * as twgl from 'twgl.js';
const { m4 } = twgl;

export const Galaxy = () => {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const [objectsToDraw, setObjectsToDraw] = useState([]);
  const [objects, setObjects] = useState([]);

  var vs = `#version 300 es
  in vec4 a_position;
  in vec4 a_color;
  uniform mat4 u_matrix;
  out vec4 v_color;

  void main() {
      gl_Position = u_matrix * a_position;
      v_color = a_color; 
  }`;

  var fs = `#version 300 es
  precision highp float;
  in vec4 v_color;
  uniform vec4 u_colorMult;
  uniform vec4 u_colorOffset;
  out vec4 outColor;

  void main() {
      outColor = v_color * u_colorMult + u_colorOffset;
  }`;

  const degToRad = (d) => {
    return d * Math.PI / 180;
  };

  
  let sunNode, earthNode, moonNode;

  useEffect(() => {
    const canvas = canvasRef.current; //
    if (!canvas) {
      console.error('未找到 canvas 元素!');
      return;
    }

    const gl = canvas.getContext("webgl2");  //  WebGL2 
    if (!gl) {
      console.error("WebGL2 上下文不可用");
      return;
    }
    
    glRef.current = gl; 
    twgl.setAttributePrefix("a_");
    const flattenedPrimitives = twgl.primitives;

    // sphereBufferInfo 和 programInfo
    var sphereBufferInfo = flattenedPrimitives.createSphereBufferInfo(gl, 10, 12, 6);
    if (!sphereBufferInfo) {
      console.error("Failed to create sphere buffer info.");
      return;
    }

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

    // 在这里创建节点
    sunNode = new Node();
    sunNode.drawInfo = {
      uniforms: {
        u_colorOffset: [0.6, 0.6, 0, 1], // yellow
        u_colorMult: [0.4, 0.4, 0, 1]
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
    };

    earthNode = new Node();
    earthNode.localMatrix = m4.translation(100, 0, 0);
    earthNode.drawInfo = {
      uniforms: {
        u_colorOffset: [0.2, 0.5, 0.8, 1], // blue added green 
        u_colorMult: [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
    };

    moonNode = new Node();
    moonNode.localMatrix = m4.translation(20, 0, 0);
    moonNode.drawInfo = {
      uniforms: {
        u_colorOffset: [0.6, 0.6, 0.6, 1], // gray
        u_colorMult: [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO,
    };

    moonNode.setParent(earthNode);
    earthNode.setParent(sunNode);

    setObjects([sunNode, earthNode, moonNode]);

    setObjectsToDraw([sunNode.drawInfo, earthNode.drawInfo, moonNode.drawInfo]);

    requestAnimationFrame(drawScene);
  }, []);

  const updateProjectionMatrix = () => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    if (!gl || !canvas) return;
    return m4.perspective(degToRad(60), canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  };

  const drawScene = (time) => {
    const gl = glRef.current;
    if (!gl) return;

    time *= 0.001;

   
    twgl.resizeCanvasToDisplaySize(canvasRef.current);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var cameraPosition = [0, -200, 0];
    var target = [0, 0, 0];
    var up = [0, 0, 1];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
    var viewMatrix = m4.inverse(cameraMatrix);
    var projectionMatrix = updateProjectionMatrix(); 
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    m4.multiply(m4.rotationY(0.01), sunNode.localMatrix, sunNode.localMatrix);
    m4.multiply(m4.rotationY(0.01), earthNode.localMatrix, earthNode.localMatrix);
    m4.multiply(m4.rotationY(0.01), moonNode.localMatrix, moonNode.localMatrix);

    sunNode.updateWorldMatrix();

    objects.forEach((object) => {
      object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);
    });

    twgl.drawObjectList(gl, objectsToDraw);
    requestAnimationFrame(drawScene);
  };

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};
