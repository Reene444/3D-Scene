// src/components/Wall.js
import React from 'react';

const Wall = ({ position, rotation }) => (
    <mesh position={position} rotation={rotation}>
        <planeGeometry args={[50, 10]} />
        <meshStandardMaterial color="#D3D3D3" />
    </mesh>
);

export default Wall;
