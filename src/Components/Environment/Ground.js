// src/components/Ground.js
import React from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react';

// 定义渐变材质
const GradientMaterial = shaderMaterial(
  { color1: new THREE.Color('#f17a67'), color2: new THREE.Color('#ffe6d1') },
  // 顶点着色器
  `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // 片元着色器
  `
    varying vec2 vUv;
    uniform vec3 color1;
    uniform vec3 color2;

    void main() {
      // 线性插值渐变
      vec3 color = mix(color1, color2, vUv.y * 0.5 + 0.5);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// 让材质在 React Three Fiber 中可用
extend({ GradientMaterial });

const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <gradientMaterial /> {/* 使用自定义的渐变材质 */}
    </mesh>
  );
};

export default Ground;
