// src/components/Ground.js
import React from 'react';

const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
    <planeGeometry args={[50, 50]} />
    <meshStandardMaterial color="#f17a67" />
  </mesh>
);

export default Ground;
