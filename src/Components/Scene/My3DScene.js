// src/My3DScene.js
import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

const RotatingBox = () => {
    const ref = React.useRef();
    useFrame(() => {
        ref.current.rotation.y += 0.01; // 每帧旋转
    });

    // 顶点着色器
    const vertexShader = `
        varying vec3 vColor;
        varying vec3 vNormal;

        void main() {
            vNormal = normal;
            vColor = (normal + 1.0) / 2.0; // 使用法线计算颜色
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    // 片元着色器
    const fragmentShader = `
        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor, 1.0); // 使用法线的颜色
        }
    `;

    return (
        <mesh ref={ref} position={[0, 0, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} />

            {/* 添加文本到立方体的每个面 */}
            <Text position={[0, 0, 1.01]} fontSize={0.2} color="black" anchorX="center" anchorY="middle" maxWidth={1.8}>
                Linlin Chen
            </Text>
            <Text position={[0, 0, -1.01]} fontSize={0.2} color="black" anchorX="center" anchorY="middle" rotation={[0, Math.PI, 0]} maxWidth={1.8}>
                Full Stack Developer
            </Text>
            <Text position={[1.01, 0, 0]} fontSize={0.2} color="black" anchorX="center" anchorY="middle" rotation={[0, Math.PI / 2, 0]} maxWidth={1.8}>
                University of Birmingham (UoB)
            </Text>
            <Text position={[-1.01, 0, 0]} fontSize={0.2} color="black" anchorX="center" anchorY="middle" rotation={[0, -Math.PI / 2, 0]} maxWidth={1.8}>
                Interest: Hackathons
            </Text>
            <Text position={[0, 1.01, 0]} fontSize={0.2} color="black" anchorX="center" anchorY="middle" rotation={[Math.PI / 2, 0, 0]} maxWidth={1.8}>
                Advanced Computer Science
            </Text>
            <Text position={[0, -1.01, 0]} fontSize={0.2} color="black" anchorX="center" anchorY="middle" rotation={[-Math.PI / 2, 0, 0]} maxWidth={1.8}>
                Bottom
            </Text>
        </mesh>
    );
};

const My3DScene = () => {
    return (
        <Canvas style={{ height: '100vh' }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls />
            <RotatingBox />
        </Canvas>
    );
};

export default My3DScene;
