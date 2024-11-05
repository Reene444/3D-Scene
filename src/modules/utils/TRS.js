import { m4 } from 'twgl.js';

export class TRS {
  constructor(position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
    this.position = position;
    this.rotation = rotation; // This should now be used in your transformation matrix
    this.scale = scale;
  }

  getMatrix(dst) {
    
    // Create rotation matrix from the rotation vector
    const rotationMatrix = m4.rotationZ(this.rotation[1]); // Assuming Z rotation
    // rotationMatrix=m4.multiply(m4.multiply(m4.rotateX(this.rotation[0]),m4.rotateY(this.rotation[1])));
    const scaleMatrix = m4.scaling(this.scale);
    const translationMatrix = m4.translation(this.position);

    // Combine transformations: T * S * R
    m4.multiply(translationMatrix, m4.multiply(rotationMatrix, scaleMatrix), dst);

    return dst;
  }
}
