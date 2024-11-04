import React, { useEffect, useRef } from 'react';
import * as twgl from 'twgl.js'; // 确保已安装并导入 twgl.js
import * as util from '../../Modules/Utils'; // 导入 util 目录下的所有类

const fs = `#version 300 es
precision highp float;

in vec3 v_normal;

uniform vec4 u_diffuse;
uniform vec3 u_lightDirection;

out vec4 outColor;

void main () {
  vec3 normal = normalize(v_normal);
  float light = dot(u_lightDirection, normal) * .5 + .5;
  outColor = vec4(u_diffuse.rgb * light, u_diffuse.a);
}
`;

const meshVS = `#version 300 es
in vec4 a_POSITION;
in vec3 a_NORMAL;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;

out vec3 v_normal;

void main() {
  gl_Position = u_projection * u_view * u_world * a_POSITION;
  v_normal = mat3(u_world) * a_NORMAL;
}
`;

const Whale = ({ url, canvas }) => {
  const glRef = useRef(null);
  const gltfRef = useRef(null);

  useEffect(() => {
    const initWebGL = async () => {
      const gl = canvas.current.getContext('webgl2');
      if (!gl) {
        console.error("Unable to initialize WebGL.");
        return;
      }
      glRef.current = gl;

      await loadGLTF();
      requestAnimationFrame(render);
    };

    const loadGLTF = async () => {
      const gl = glRef.current;
      gltfRef.current = await util.loadJSON(url); // 使用 util 中的 loadJSON

      const baseURL = new URL(url, location.href);
      gltfRef.current.buffers = await Promise.all(gltfRef.current.buffers.map((buffer) => {
        const url = new URL(buffer.uri, baseURL.href);
        return util.loadBinary(url.href); // 使用 util 中的 loadBinary
      }));

      const defaultMaterial = {
        uniforms: {
          u_diffuse: [.5, .8, 1, 1],
        },
      };

      setupMeshes(defaultMaterial);
      setupNodes();
      setupScenes();
    };

    const setupMeshes = (defaultMaterial) => {
      // 同之前的实现
    };

    const setupNodes = () => {
      // 同之前的实现
    };

    const setupScenes = () => {
      // 同之前的实现
    };

    const render = (time) => {
      const gl = glRef.current;
      time *= 0.001; // convert to seconds
      twgl.resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.clearColor(.1, .1, .1, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const fieldOfViewRadians = util.degToRad(60); // 使用 util 中的 degToRad
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const projection = util.m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
      const cameraRadius = 10;
      const cameraPosition = [Math.cos(time * .1) * cameraRadius, 0, Math.sin(time * .1) * cameraRadius];
      const target = [0, 0, -2];
      const up = [0, 1, 0];
      const camera = util.m4.lookAt(cameraPosition, target, up);
      const view = util.m4.inverse(camera);
      const sharedUniforms = {
        u_lightDirection: util.m4.normalize([-1, 3, 5]),
      };

      function renderDrawables(node) {
        for (const drawable of node.drawables) {
          drawable.render(node, projection, view, sharedUniforms);
        }
      }

      for (const scene of gltfRef.current.scenes) {
        scene.root.updateWorldMatrix();
        scene.root.traverse(renderDrawables);
      }

      requestAnimationFrame(render);
    };

    initWebGL();

    return () => {
      // 清理工作，例如取消动画循环、释放资源等
    };
  }, [url, canvas]);

  return null; // 因为canvas已经通过props传递
};

export default Whale;
