import {m4} from 'twgl.js';

export  class MeshRenderer {
  constructor(mesh) {
  this.mesh=mesh;
  }
  render(node,projection,view,sharedUniforms){
    const {mesh}=this;
    gl.useProgram(meshProgramInfo.program);
    for(const primitive of mesh.primitives){
      gl.bindVertexArray(primitive.vao);
      twgl.setUniforms(meshProgramInfom,{
        u_projection:projection,
        u_view:view,
        u_world:node.worldMatrix,
      },primitive.material.uniforms,sharedUniforms);
    twgl.drawBufferInfo(gl,primitive.bufferInfo);
    }
  }
}