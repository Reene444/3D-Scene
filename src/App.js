// src/App.js
import React, { useRef } from 'react'
// import { Canvas } from '@react-three/fiber';
// import Cube from './Components/Object/Cube';
// import Ground from './Components/Environment/Ground';
// import Wall from './Components/Environment/Wall';
// import { OrbitControls, Sky, Cloud } from '@react-three/drei';
// import { Physics } from '@react-three/cannon';
import  {Galaxy}  from './Components/Object/galaxy';
const  App=()=>{
  // const canvasRef=useRef(null);
  return (
    // <div style={{ height: '100vh' }}>
    //   <Canvas ref={canvasRef} shadows camera={{ position: [0, 10, 20], fov: 50 }}> {/* 启用阴影和调整相机 */}
    //     <Sky
    //       distance={450000}
    //       sunPosition={[100, 20, 100]}
    //       inclination={0}
    //       azimuth={0.25}
    //     />

    //     {/* 调整光照强度 */}
    //     <ambientLight intensity={3} />
    //     <pointLight
    //       position={[10, 20, 10]}
    //       intensity={1}
    //       castShadow
    //       shadow-mapSize-width={1024}
    //       shadow-mapSize-height={1024}
    //     />

    //     {/* 添加 Physics 包裹 */}
    //     <Physics>
    //       {/* 场景中的物体 */}
    //       <Ground />
    //       <Wall position={[0, 0, -25]} rotation={[0, 0, 0]} />
    //       <Wall position={[0, 0, 25]} rotation={[0, Math.PI, 0]} />
    //       <Wall position={[-25, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
    //       <Wall position={[25, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />

    //       <Cube />
          <Galaxy/>
    //     </Physics>

    //     {/* 添加云 */}
    //     <Cloud position={[-10, 15, -20]} speed={0.2} opacity={0.5} />
    //     <Cloud position={[10, 15, -10]} speed={0.2} opacity={0.6} />
    //     <Cloud position={[-15, 20, 5]} speed={0.3} opacity={0.5} />
    //     <Cloud position={[20, 25, 10]} speed={0.3} opacity={0.6} />

    //     <OrbitControls />
    //   </Canvas>
    // </div>
  );
}

export default App;
