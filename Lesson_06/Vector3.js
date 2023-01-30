import * as MathUtils from './MathUtils.js';
import { Quaternion } from './Quaternion.js';

// 向量
class Vector3 {

  // 默认x,y,z = 0
  constructor(x = 0, y = 0, z = 0) {

    // 用于测试这个类或者派生类是否为Vector3，默认为true。
    Vector3.prototype.isVector3 = true;

    this.x = x;
    this.y = y;
    this.z = z;

  }

  set(x, y, z) {

    if (z === undefined) z = this.z; // sprite.scale.set(x,y)

    this.x = x;
    this.y = y;
    this.z = z;

    return this;

  }

  // 将该向量的x、y和z值同时设置为等于传入的scalar。也很简单。
  setScalar(scalar) {

    this.x = scalar;
    this.y = scalar;
    this.z = scalar;

    return this;

  }

  setX(x) {

    this.x = x;

    return this;

  }

  setY(y) {

    this.y = y;

    return this;

  }

  setZ(z) {

    this.z = z;

    return this;

  }

  // 若index为 0 则设置 x 值为 value。若index为 1 则设置 y 值为 value。若index为 2 则设置 z 值为 value。
  setComponent(index, value) {

    switch (index) {

      case 0: this.x = value; break;
      case 1: this.y = value; break;
      case 2: this.z = value; break;
      default: throw new Error('index is out of range: ' + index);

    }

    return this;

  }

  // 如果index值为0返回x值。如果index值为1返回y值。如果index值为2返回z值。就不多讲。
  getComponent(index) {

    switch (index) {

      case 0: return this.x;
      case 1: return this.y;
      case 2: return this.z;
      default: throw new Error('index is out of range: ' + index);

    }

  }

  // 返回一个新的Vector3，其具有和当前这个向量相同的x、y和z。
  clone() {

    return new this.constructor(this.x, this.y, this.z);

  }

  // 将所传入Vector3的x、y和z属性复制给这一Vector3。
  copy(v) {

    this.x = v.x;
    this.y = v.y;
    this.z = v.z;

    return this;

  }

  // 将传入的向量v和这个向量相加。
  add(v) {

    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;

  }

  // 将传入的标量s和这个向量的x值、y值以及z值相加
  addScalar(s) {

    this.x += s;
    this.y += s;
    this.z += s;

    return this;

  }

  // 将该向量设置为a + b。
  addVectors(a, b) {

    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;

    return this;

  }

  // 将所传入的v与s相乘所得的乘积和这个向量相加。
  addScaledVector(v, s) {

    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;

    return this;

  }

  // 从该向量减去向量v。
  sub(v) {

    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;

  }

  // 从该向量减去标量s
  subScalar(s) {

    this.x -= s;
    this.y -= s;
    this.z -= s;

    return this;

  }

  // 将该向量设置为a - b。
  subVectors(a, b) {

    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;

    return this;

  }

  // 将该向量与所传入的向量v进行相乘。
  multiply(v) {

    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;

    return this;

  }

  // 将该向量与所传入的标量s进行相乘。
  multiplyScalar(scalar) {

    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;

    return this;

  }

  // 按照分量顺序，将该向量设置为和a * b相等。
  multiplyVectors(a, b) {

    this.x = a.x * b.x;
    this.y = a.y * b.y;
    this.z = a.z * b.z;

    return this;

  }

  applyEuler(euler) {

    return this.applyQuaternion(_quaternion.setFromEuler(euler));

  }

  applyAxisAngle(axis, angle) {

    return this.applyQuaternion(_quaternion.setFromAxisAngle(axis, angle));

  }

  applyMatrix3(m) {

    const x = this.x, y = this.y, z = this.z;
    const e = m.elements;

    this.x = e[0] * x + e[3] * y + e[6] * z;
    this.y = e[1] * x + e[4] * y + e[7] * z;
    this.z = e[2] * x + e[5] * y + e[8] * z;

    return this;

  }

  applyNormalMatrix(m) {

    return this.applyMatrix3(m).normalize();

  }

  applyMatrix4(m) {

    const x = this.x, y = this.y, z = this.z;
    const e = m.elements;

    const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

    this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
    this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
    this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

    return this;

  }

  applyQuaternion(q) {

    const x = this.x, y = this.y, z = this.z;
    const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

    // calculate quat * vector

    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = - qx * x - qy * y - qz * z;

    // calculate result * inverse quat

    this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
    this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
    this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

    return this;

  }

  project(camera) {

    return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);

  }

  unproject(camera) {

    return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);

  }

  transformDirection(m) {

    // input: THREE.Matrix4 affine matrix
    // vector interpreted as a direction

    const x = this.x, y = this.y, z = this.z;
    const e = m.elements;

    this.x = e[0] * x + e[4] * y + e[8] * z;
    this.y = e[1] * x + e[5] * y + e[9] * z;
    this.z = e[2] * x + e[6] * y + e[10] * z;

    return this.normalize();

  }

  divide(v) {

    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;

    return this;

  }

  divideScalar(scalar) {

    return this.multiplyScalar(1 / scalar);

  }

  min(v) {

    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    this.z = Math.min(this.z, v.z);

    return this;

  }

  max(v) {

    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    this.z = Math.max(this.z, v.z);

    return this;

  }

  clamp(min, max) {

    // assumes min < max, componentwise

    this.x = Math.max(min.x, Math.min(max.x, this.x));
    this.y = Math.max(min.y, Math.min(max.y, this.y));
    this.z = Math.max(min.z, Math.min(max.z, this.z));

    return this;

  }

  clampScalar(minVal, maxVal) {

    this.x = Math.max(minVal, Math.min(maxVal, this.x));
    this.y = Math.max(minVal, Math.min(maxVal, this.y));
    this.z = Math.max(minVal, Math.min(maxVal, this.z));

    return this;

  }

  clampLength(min, max) {

    const length = this.length();

    return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));

  }

  floor() {

    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);

    return this;

  }

  ceil() {

    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);

    return this;

  }

  round() {

    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);

    return this;

  }

  roundToZero() {

    this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
    this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
    this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);

    return this;

  }

  negate() {

    this.x = - this.x;
    this.y = - this.y;
    this.z = - this.z;

    return this;

  }

  // 计算该vector和所传入v的点积（dot product）。对应维度相乘然后求和，请回归高数课本。
  // 点乘的几何意义是可以用来表征或计算两个向量之间的夹角，以及在b向量在a向量方向上的投影，有公式：
  // a dot b= |a| |b| cos \theta
  dot(v) {

    return this.x * v.x + this.y * v.y + this.z * v.z;

  }

  // TODO lengthSquared?

  lengthSq() {

    return this.x * this.x + this.y * this.y + this.z * this.z;

  }

  length() {

    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

  }

  manhattanLength() {

    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);

  }

  // 将该向量转换为单位向量（unit vector）， 也就是说，将该向量的方向设置为和原向量相同，但是其长度（length）为1。就是将向量归一化。
  normalize() {

    return this.divideScalar(this.length() || 1);

  }

  // 将该向量的方向设置为和原向量相同，但是长度（length）为l。
  setLength(length) {

    return this.normalize().multiplyScalar(length);

  }

  lerp(v, alpha) {

    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;

    return this;

  }

  lerpVectors(v1, v2, alpha) {

    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;
    this.z = v1.z + (v2.z - v1.z) * alpha;

    return this;

  }

  // 数学中又称外积、叉积，物理中称矢积、叉乘，是一种在向量空间中向量的二元运算。
  // 与点积不同，它的运算结果是一个向量而不是一个标量。其应用也十分广泛，通常应用于物理学光学和计算机图形学中。
  // 两个向量的叉乘，又叫向量积、外积、叉积，叉乘的运算结果是一个向量而不是一个标量。并且两个向量的叉积与这两个向量组成的坐标平面垂直。
  // 在三维几何中，向量a和向量b的叉乘结果是一个向量，更为熟知的叫法是法向量，该向量垂直于a和b向量构成的平面。
  // 在3D图像学中，叉乘的概念非常有用，可以通过两个向量的叉乘，生成第三个垂直于a，b的法向量，从而构建X、Y、Z坐标系。如下图所示：
  // 在二维空间中，叉乘还有另外一个几何意义就是：a×b等于由向量a和向量b构成的平行四边形的面积。
  cross(v) {

    return this.crossVectors(this, v);

  }

  crossVectors(a, b) {

    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;

    return this;

  }

  projectOnVector(v) {

    const denominator = v.lengthSq();

    if (denominator === 0) return this.set(0, 0, 0);

    const scalar = v.dot(this) / denominator;

    return this.copy(v).multiplyScalar(scalar);

  }

  projectOnPlane(planeNormal) {

    _vector.copy(this).projectOnVector(planeNormal);

    return this.sub(_vector);

  }

  reflect(normal) {

    // reflect incident vector off plane orthogonal to normal
    // normal is assumed to have unit length

    return this.sub(_vector.copy(normal).multiplyScalar(2 * this.dot(normal)));

  }

  angleTo(v) {

    const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());

    if (denominator === 0) return Math.PI / 2;

    const theta = this.dot(v) / denominator;

    // clamp, to handle numerical problems

    return Math.acos(MathUtils.clamp(theta, - 1, 1));

  }

  distanceTo(v) {

    return Math.sqrt(this.distanceToSquared(v));

  }

  distanceToSquared(v) {

    const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

    return dx * dx + dy * dy + dz * dz;

  }

  manhattanDistanceTo(v) {

    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);

  }

  setFromSpherical(s) {

    return this.setFromSphericalCoords(s.radius, s.phi, s.theta);

  }

  setFromSphericalCoords(radius, phi, theta) {

    const sinPhiRadius = Math.sin(phi) * radius;

    this.x = sinPhiRadius * Math.sin(theta);
    this.y = Math.cos(phi) * radius;
    this.z = sinPhiRadius * Math.cos(theta);

    return this;

  }

  setFromCylindrical(c) {

    return this.setFromCylindricalCoords(c.radius, c.theta, c.y);

  }

  setFromCylindricalCoords(radius, theta, y) {

    this.x = radius * Math.sin(theta);
    this.y = y;
    this.z = radius * Math.cos(theta);

    return this;

  }

  setFromMatrixPosition(m) {

    const e = m.elements;

    this.x = e[12];
    this.y = e[13];
    this.z = e[14];

    return this;

  }

  setFromMatrixScale(m) {

    const sx = this.setFromMatrixColumn(m, 0).length();
    const sy = this.setFromMatrixColumn(m, 1).length();
    const sz = this.setFromMatrixColumn(m, 2).length();

    this.x = sx;
    this.y = sy;
    this.z = sz;

    return this;

  }

  setFromMatrixColumn(m, index) {

    return this.fromArray(m.elements, index * 4);

  }

  setFromMatrix3Column(m, index) {

    return this.fromArray(m.elements, index * 3);

  }

  setFromEuler(e) {

    this.x = e._x;
    this.y = e._y;
    this.z = e._z;

    return this;

  }

  equals(v) {

    return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));

  }

  fromArray(array, offset = 0) {

    this.x = array[offset];
    this.y = array[offset + 1];
    this.z = array[offset + 2];

    return this;

  }

  toArray(array = [], offset = 0) {

    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;

    return array;

  }

  fromBufferAttribute(attribute, index) {

    this.x = attribute.getX(index);
    this.y = attribute.getY(index);
    this.z = attribute.getZ(index);

    return this;

  }

  random() {

    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();

    return this;

  }

  randomDirection() {

    // Derived from https://mathworld.wolfram.com/SpherePointPicking.html

    const u = (Math.random() - 0.5) * 2;
    const t = Math.random() * Math.PI * 2;
    const f = Math.sqrt(1 - u ** 2);

    this.x = f * Math.cos(t);
    this.y = f * Math.sin(t);
    this.z = u;

    return this;

  }

  *[Symbol.iterator]() {

    yield this.x;
    yield this.y;
    yield this.z;

  }

}

const _vector = /*@__PURE__*/ new Vector3();
const _quaternion = /*@__PURE__*/ new Quaternion();

export { Vector3 };
