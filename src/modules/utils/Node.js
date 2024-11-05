import { m4 } from 'twgl.js';

export class Node {
  constructor(source, name) {
    this.name = name;
    this.source = source;
    this.parent = null;
    this.children = [];
    this.localMatrix = m4.identity();
    this.worldMatrix = m4.identity();
    this.drawables = [];
    this.rotation = [...source.rotation];
  }

  setParent(parent) {
    if (this.parent) {
      this.parent._removeChild(this);  // Remove this node from current parent
      this.parent = null;  // Set the parent to null
    }
    if (parent) {
      parent._addChild(this);  // Add this node to new parent's child list
      this.parent = parent;  // Set this node's parent
    }
  }

  updateWorldMatrix(parentMatrix) {
    const source = this.source;
    
    if (source) {
      this.source.rotation = [...this.rotation];  // Copy the rotation to source
      this.localMatrix = this.source.getMatrix(this.localMatrix);  // Update localMatrix
    }

    // Log the local matrix to ensure it's calculated correctly
    console.log("Local Matrix:", this.localMatrix);

    if (parentMatrix) {
      m4.multiply(parentMatrix, this.localMatrix, this.worldMatrix);  // Combine with parent matrix
    } else {
      m4.copy(this.localMatrix, this.worldMatrix);  // No parent matrix, just copy local matrix
    }

    // Log the world matrix after update
    console.log("World Matrix:", this.worldMatrix);

    // Propagate the worldMatrix update to children
    for (const child of this.children) {
      child.updateWorldMatrix(this.worldMatrix);
    }
  }

  traverse(fn) {
    fn(this);
    for (const child of this.children) {
      child.traverse(fn);
    }
  }

  _addChild(child) {
    this.children.push(child);
  }

  _removeChild(child) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);  // Corrected to splice, not slice
    }
  }
}
