
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { useGLTF } from '@react-three/drei';
import './App.css';

import {
  Environment,
  OrbitControls,
  Html,
  useProgress,
} from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";

// 加载进度指示器
function Loader() {
  const { active, progress, errors, item, loaded, total } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

// 模型加载和显示
const Model = () => {
  const gltf = useLoader(GLTFLoader, "/bomb.gltf"); // 修改成你自己的GLB路径
  return <primitive object={gltf.scene} scale={0.315} position={[0, -0.55, 0]} />;

  // const { scene } = useGLTF('/models/sci_fi_hallway_free/scene.gltf');

  // return <primitive object={scene} />;
};

export default function App() {
  return (
    // <div className="App">
      <Canvas>
        <Suspense fallback={<Loader />}>
          <Model />
          <OrbitControls />
          <Environment preset="sunset" background />
        </Suspense>
      </Canvas>
    // </div>
  );
}
