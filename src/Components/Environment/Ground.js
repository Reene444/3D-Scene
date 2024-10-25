import React from 'react';

const Ground = () => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#7CFC00" /> {/* 绿色 */}
    </mesh>
);

export default Ground;
