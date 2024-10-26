// src/App.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import Cube from './Components/Object/Cube';
import Ground from './Components/Environment/Ground';
import Wall from './Components/Environment/Wall';
import { OrbitControls, Sky, Cloud } from '@react-three/drei';

function App() {
    return (
      <div style={{ height: '100vh' }}>
          <Canvas shadows> {/* 启用阴影 */}
              <Sky
                distance={450000}
                sunPosition={[100, 20, 100]}
                inclination={0}
                azimuth={0.25}
              />

              <ambientLight intensity={5} />
              <pointLight
                position={[10, 10, 10]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              /> {/* 启用投射阴影 */}

              {/* 添加地面和墙壁 */}
              <Ground />
              <Wall position={[0, 0, -25]} rotation={[0, 0, 0]} />
              <Wall position={[0, 0, 25]} rotation={[0, Math.PI, 0]} />
              <Wall position={[-25, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
              <Wall position={[25, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />

              <Cube />

              {/* 添加云 */}
              <Cloud position={[-10, 15, -20]} speed={0.2} opacity={0.5} />
              <Cloud position={[10, 15, -10]} speed={0.2} opacity={0.6} />
              <Cloud position={[-15, 20, 5]} speed={0.3} opacity={0.5} />
              <Cloud position={[20, 25, 10]} speed={0.3} opacity={0.6} />

              <OrbitControls />
          </Canvas>
      </div>
    );
}

export default App;
