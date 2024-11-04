// src/components/Car.js
import React, { useRef, useEffect } from 'react';
import { useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '../../Hooks/useKeyboardControls';
import * as THREE from 'three';

const Car = () => {
  // 控制车体和四个轮子的物理体
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [0, 0.5, 0],
    args: [1.5, 0.5, 3], // 小车的尺寸
  }));

  // 控制小车移动的速度
  const speed = useRef(new THREE.Vector3());
  const { forward, backward, left, right } = useKeyboardControls();

  useFrame(() => {
    // 处理小车的控制逻辑
    speed.current.set(
      (right - left) * 0.1, // 水平移动
      0,
      (backward - forward) * 0.1 // 前后移动
    );
    api.velocity.set(speed.current.x, 0, speed.current.z);
  });

  return (
    <group ref={ref}>
      {/* 小车主体 */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 0.5, 3]} />
        <meshStandardMaterial color="#f17a67" />
      </mesh>
      {/* 小车的轮子 */}
      {[-0.75, 0.75].map((x) =>
        [-1.25, 1.25].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.25, z]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        ))
      )}
    </group>
  );
};

export default Car;
