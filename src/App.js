// src/App.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import Cube from './Components/Object/Cube';
import Ground from './Components/Environment/Ground';
import Wall from './Components/Environment/Wall';
import { OrbitControls } from '@react-three/drei';

function App() {
    return (
        <div style={{ height: '100vh' }}>
            <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                <Ground />
                <Wall position={[0, 0, -25]} rotation={[0, 0, 0]} />  {/* 背面墙 */}
                <Wall position={[0, 0, 25]} rotation={[0, Math.PI, 0]} />  {/* 前面墙 */}
                <Wall position={[-25, 0, 0]} rotation={[0, Math.PI / 2, 0]} />  {/* 左侧墙 */}
                <Wall position={[25, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />  {/* 右侧墙 */}
                <Cube />
                <OrbitControls />
            </Canvas>
        </div>
    );
}

export default App;
