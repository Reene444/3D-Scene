import {m4} from 'twgl.js';
import * as twgl from 'twgl.js'

export class MeshRenderer {
  constructor(mesh,gl,meshProgramInfo) {
  this.mesh=mesh;
  this.gl=gl;
  this.meshProgramInfo=meshProgramInfo;
  }
  render(node,projection,view,sharedUniforms){
    const {mesh,gl,meshProgramInfo}=this;
    gl.useProgram(meshProgramInfo.program);
    for(const primitive of mesh.primitives){
      gl.bindVertexArray(primitive.vao);
      twgl.setUniforms(meshProgramInfo,{
        u_projection:projection,
        u_view:view,
        u_world:node.worldMatrix,
      },primitive.material.uniforms,sharedUniforms);
    twgl.drawBufferInfo(gl,primitive.bufferInfo);
    }
  }
}