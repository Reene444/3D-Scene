import {m4} from 'twgl.js';

export class TRS{
  constructor(position=[0,0,0],rotation=[0,0,0,1],scale=[1,1,1]) {
    this.position=position;
    this.rotation=rotation;
    this.scale=scale;
  }

  getMatrix(dst){
    dst=dst||new Float32Array(16);
    m4.compose(this.position,this.rotation,this.scale,dst);
    return dst;
  }

}