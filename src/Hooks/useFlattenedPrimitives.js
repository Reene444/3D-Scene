import { useMemo } from 'react';
import * as twgl from 'twgl.js';

const createFlattenedVertices = (gl, vertices, vertsPerColor) => {
  let last;
  return twgl.createBufferInfoFromArrays(
    gl,
    twgl.primitives.makeRandomVertexColors(
      twgl.primitives.deindexVertices(vertices),
      {
        vertsPerColor: vertsPerColor || 1,
        rand: (ndx, channel) => {
          if (channel === 0) {
            last = 128 + Math.random() * 128 | 0;
          }
          return channel < 3 ? last : 255;
        },
      }
    )
  );
};

const createFlattenedFunc = (createVerticesFunc, vertsPerColor) => {
  return (gl, ...args) => {
    const arrays = createVerticesFunc(...args);
    return createFlattenedVertices(gl, arrays, vertsPerColor);
  };
};

export const useFlattenedPrimitives = () => {
  return useMemo(() => {
    return {
      create3DFBufferInfo: createFlattenedFunc(twgl.primitives.create3DFVertices, 6),
      createCubeBufferInfo: createFlattenedFunc(twgl.primitives.createCubeVertices, 6),
      createSphereBufferInfo: createFlattenedFunc(twgl.primitives.createSphereVertices, 6),
      createPlaneBufferInfo: createFlattenedFunc(twgl.primitives.createPlaneVertices, 6),
      createTruncatedConeBufferInfo: createFlattenedFunc(twgl.primitives.createTruncatedConeVertices, 6),
      createXYQuadBufferInfo: createFlattenedFunc(twgl.primitives.createXYQuadVertices, 6),
      createCylinderBufferInfo: createFlattenedFunc(twgl.primitives.createCylinderVertices, 6),
      createTorusBufferInfo: createFlattenedFunc(twgl.primitives.createTorusVertices, 6),
      createDiscBufferInfo: createFlattenedFunc(twgl.primitives.createDiscVertices, 4),
    };
  }, []);
};
