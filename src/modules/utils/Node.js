import {m4} from 'twgl.js';

export class Node{
  constructor(source,name) {
  this.name=name;
  this.source=source;
  this.parent=null;
  this.children=[];
  this.localMatrix=m4.identity();
  this.worldMatrix=m4.identity();
  this.drawables=[];
  }
  setParent(parent){
    if(this.parent){
      this.parent._removeChild(this)  ; //first we remove the node from parents
      this.parent=null;//make this . parent become null
    }
    if(parent){
      parent._addChild(this);//add this to parent.child
      this.parent=parent;//make this . parent become parent
    }
  }
  updateWorldMatrix(parentMatrix){//update current node's worldMatrix
    const source=this.source;
    if(source){
      source.getMatrix(this.localMatrix);
    }

    if(parentMatrix){
      m4.multiply(parentMatrix,this.localMatrix,this.worldMatrix);
    }else{
      m4.copy(this.localMatrix,this.worldMatrix);
    }
    const worldMatrix=this.worldMatrix;
    for(const child  of this.children){
      child.updateWorldMatrix(worldMatrix);
    }
  }
  traverse(fn){
    fn(this);
    for(const child of this.children){
        child.traverse(fn);
    }

  }

  _addChild(child){
    this.children.push(child);
  }

  _removeChild(child){
    const ndx=this.children.indexOf(child);
    this.children.slice(ndx,1);
  }

}