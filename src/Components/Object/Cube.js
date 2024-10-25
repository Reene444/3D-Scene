// src/Cube.js
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const RotatingBox = () => {
    const ref = useRef();
    const position = useRef([0, 0, 0]); // 存储立方体位置

    useFrame(() => {
        ref.current.rotation.y += 0.01; // 每帧旋转
        ref.current.position.set(...position.current); // 更新立方体位置
    });

    const handleKeyDown = (event) => {
        const speed = 0.1; // 控制移动速度
        switch (event.key) {
            case 'ArrowUp':
                position.current[2] -= speed; // 前移
                break;
            case 'ArrowDown':
                position.current[2] += speed; // 后移
                break;
            case 'ArrowLeft':
                position.current[0] -= speed; // 左移
                break;
            case 'ArrowRight':
                position.current[0] += speed; // 右移
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
                text
            </Text>
            <Text position={[0, 0, -1.01]} fontSize={0.2} color="black" anchorX="center" anchorY="middle" rotation={[0, Math.PI, 0]} maxWidth={1.8}>
                text
            </Text>
            <Text position={[1.01, 0, 0]} fontSize={0.2} color="black" anchorX="center" anchorY="middle" rotation={[0, Math.PI / 2, 0]} maxWidth={1.8}>
                text
            </Text>
            <Text position={[-1.01, 0, 0]} fontSize={0.2} color="black" anchorX="center" anchorY="middle" rotation={[0, -Math.PI / 2, 0]} maxWidth={1.8}>
                text
            </Text>
            <Text position={[0, 1.01, 0]} fontSize={0.2} color="black" anchorX="center" anchorY="middle" rotation={[Math.PI / 2, 0, 0]} maxWidth={1.8}>
                text
            </Text>
            <Text position={[0, -1.01, 0]} fontSize={0.2} color="black" anchorX="center" anchorY="middle" rotation={[-Math.PI / 2, 0, 0]} maxWidth={1.8}>
                Tech
            </Text>
        </mesh>
    );
};

const Cube = () => {
    return <RotatingBox />;
};

export default Cube;
