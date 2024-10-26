// src/components/Wall.js
import React from 'react';

const Wall = ({ position, rotation }) => (
  <mesh position={position} rotation={rotation} receiveShadow castShadow>
    <planeGeometry args={[50, 10]} />
    <meshStandardMaterial color="#f17a67" />
  </mesh>
);

export default Wall;
