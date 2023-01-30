// 矩阵
class Matrix3 {

  constructor() {

    // 用于判定此对象或者此类的派生对象是否是三维矩阵。默认值为 true。
    Matrix3.prototype.isMatrix3 = true;

    // var matrix3 = new THREE.Matrix3().set( 1,2,3,4,5,6,7,8,9);
    // 而其内部elements则展示为：
    // matrix3.elements = [1,4,7,2,5,8,3,6,9];
    // 矩阵列优先column-major列表
    this.elements = [

      1, 0, 0,
      0, 1, 0,
      0, 0, 1

    ];

  }

  // 三维矩阵不能在构造函数中直接设置参数值，需要通过set()方法设置，set()方法参数采用行优先row-major， 而它们在内部是用列优先column-major顺序存储在数组当中。代码如上面所示。
  set(n11, n12, n13, n21, n22, n23, n31, n32, n33) {

    const te = this.elements;

    te[0] = n11; te[1] = n21; te[2] = n31;
    te[3] = n12; te[4] = n22; te[5] = n32;
    te[6] = n13; te[7] = n23; te[8] = n33;

    return this;

  }

  // 将此矩阵重置为3x3单位矩阵。
  identity() {

    this.set(

      1, 0, 0,
      0, 1, 0,
      0, 0, 1

    );

    return this;

  }

  // 将矩阵m的元素复制到当前矩阵中。不多说。
  copy(m) {

    const te = this.elements;
    const me = m.elements;

    te[0] = me[0]; te[1] = me[1]; te[2] = me[2];
    te[3] = me[3]; te[4] = me[4]; te[5] = me[5];
    te[6] = me[6]; te[7] = me[7]; te[8] = me[8];

    return this;

  }

  // 将此矩阵的基提取到提供的三个轴向量中。
  // var matrix = new THREE.Matrix3();
  // matrix.set( 1,2,3,4,5,6,7,8,9)
  // var a = new THREE.Vector3();
  // var b = new THREE.Vector3();
  // var c = new THREE.Vector3();
  // matrix.extractBasis(a, b, c);
  // console.log(a,b,c);//返回Vector3 {x: 1, y: 4, z: 7} Vector3 {x: 2, y: 5, z: 8} Vector3 {x: 3, y: 6, z: 9}
  extractBasis(xAxis, yAxis, zAxis) {

    xAxis.setFromMatrix3Column(this, 0);
    yAxis.setFromMatrix3Column(this, 1);
    zAxis.setFromMatrix3Column(this, 2);

    return this;

  }

  // 将当前矩阵设置为4X4矩阵m左上3X3，
  setFromMatrix4(m) {

    const me = m.elements;

    this.set(

      me[0], me[4], me[8],
      me[1], me[5], me[9],
      me[2], me[6], me[10]

    );

    return this;

  }

  // 将当前矩阵乘以矩阵m。
  multiply(m) {

    return this.multiplyMatrices(this, m);

  }

  // 将矩阵m乘以当前矩阵。和上面相比这是左乘和右乘的问题，不多说。
  premultiply(m) {

    return this.multiplyMatrices(m, this);

  }

  // 设置当前矩阵为矩阵a x 矩阵b。和上面的方法差不多，不多说。
  multiplyMatrices(a, b) {

    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;

    const a11 = ae[0], a12 = ae[3], a13 = ae[6];
    const a21 = ae[1], a22 = ae[4], a23 = ae[7];
    const a31 = ae[2], a32 = ae[5], a33 = ae[8];

    const b11 = be[0], b12 = be[3], b13 = be[6];
    const b21 = be[1], b22 = be[4], b23 = be[7];
    const b31 = be[2], b32 = be[5], b33 = be[8];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31;
    te[3] = a11 * b12 + a12 * b22 + a13 * b32;
    te[6] = a11 * b13 + a12 * b23 + a13 * b33;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31;
    te[4] = a21 * b12 + a22 * b22 + a23 * b32;
    te[7] = a21 * b13 + a22 * b23 + a23 * b33;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31;
    te[5] = a31 * b12 + a32 * b22 + a33 * b32;
    te[8] = a31 * b13 + a32 * b23 + a33 * b33;

    return this;

  }

  // 当前矩阵所有的元素乘以该缩放值s
  multiplyScalar(s) {

    const te = this.elements;

    te[0] *= s; te[3] *= s; te[6] *= s;
    te[1] *= s; te[4] *= s; te[7] *= s;
    te[2] *= s; te[5] *= s; te[8] *= s;

    return this;

  }

  // 计算并返回矩阵的行列式determinant 。
  determinant() {

    const te = this.elements;

    const a = te[0], b = te[1], c = te[2],
      d = te[3], e = te[4], f = te[5],
      g = te[6], h = te[7], i = te[8];

    return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

  }

  // 求逆矩阵的方法有很多，可以通过伴随矩阵求逆矩阵，也可以行做差来构造逆矩阵。
  // 求传入矩阵m的逆矩阵，使用解析法将该矩阵设置为传递矩阵m的逆矩阵。行列式为零的矩阵不能求逆。如果您尝试这样做，该方法将返回一个零矩阵。
  // var matrix1 = new THREE.Matrix3();
  // var matrix2 = new THREE.Matrix3();
  // matrix1.set(1,2,3,4,5,6,7,8,9)；
  // matrix2.set(1,1,0,0,1,1,0,0,1)； 
  // new THREE.Matrix3().getInverse(matrix1)//因为行列式的值为0，所以返回零矩阵elements: (9) [0, 0, 0, 0, 0, 0, 0, 0, 0]
  // new THREE.Matrix3().getInverse(matrix2)//因为行列式的值不为0，所以返回elements: (9) [1, 0, 0, -1, 1, 0, 1, -1, 1]
  invert() {

    const te = this.elements,

      n11 = te[0], n21 = te[1], n31 = te[2],
      n12 = te[3], n22 = te[4], n32 = te[5],
      n13 = te[6], n23 = te[7], n33 = te[8],

      t11 = n33 * n22 - n32 * n23,
      t12 = n32 * n13 - n33 * n12,
      t13 = n23 * n12 - n22 * n13,

      det = n11 * t11 + n21 * t12 + n31 * t13;

    if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);

    const detInv = 1 / det;

    te[0] = t11 * detInv;
    te[1] = (n31 * n23 - n33 * n21) * detInv;
    te[2] = (n32 * n21 - n31 * n22) * detInv;

    te[3] = t12 * detInv;
    te[4] = (n33 * n11 - n31 * n13) * detInv;
    te[5] = (n31 * n12 - n32 * n11) * detInv;

    te[6] = t13 * detInv;
    te[7] = (n21 * n13 - n23 * n11) * detInv;
    te[8] = (n22 * n11 - n21 * n12) * detInv;

    return this;

  }

  // 将该矩阵转置。
  transpose() {

    let tmp;
    const m = this.elements;

    tmp = m[1]; m[1] = m[3]; m[3] = tmp;
    tmp = m[2]; m[2] = m[6]; m[6] = tmp;
    tmp = m[5]; m[5] = m[7]; m[7] = tmp;

    return this;

  }

  // 将这个矩阵设置为给定矩阵的正规矩阵normal matrix（左上角的3x3）。 正规矩阵是矩阵m的逆矩阵inverse 的转置transpose。
  getNormalMatrix(matrix4) {

    return this.setFromMatrix4(matrix4).invert().transpose();

  }

  // 将当前矩阵的转置Transposes存入给定的数组array : Array但不改变当前矩阵， 并返回当前矩阵。
  transposeIntoArray(r) {

    const m = this.elements;

    r[0] = m[0];
    r[1] = m[3];
    r[2] = m[6];
    r[3] = m[1];
    r[4] = m[4];
    r[5] = m[7];
    r[6] = m[2];
    r[7] = m[5];
    r[8] = m[8];

    return this;

  }

  // tx - x偏移量
  // ty - y偏移量
  // sx - x方向的重复比例
  // sy - y方向的重复比例
  // rotation - 旋转（弧度）
  // cx - 旋转中心x
  // cy - 旋转中心y
  // 使用偏移，重复，旋转和中心点位置设置UV变换矩阵。
  setUvTransform(tx, ty, sx, sy, rotation, cx, cy) {

    const c = Math.cos(rotation);
    const s = Math.sin(rotation);

    this.set(
      sx * c, sx * s, - sx * (c * cx + s * cy) + cx + tx,
      - sy * s, sy * c, - sy * (- s * cx + c * cy) + cy + ty,
      0, 0, 1
    );

    return this;

  }

  //

  scale(sx, sy) {

    this.premultiply(_m3.makeScale(sx, sy));

    return this;

  }

  rotate(theta) {

    this.premultiply(_m3.makeRotation(- theta));

    return this;

  }

  translate(tx, ty) {

    this.premultiply(_m3.makeTranslation(tx, ty));

    return this;

  }

  // for 2D Transforms

  makeTranslation(x, y) {

    this.set(

      1, 0, x,
      0, 1, y,
      0, 0, 1

    );

    return this;

  }

  makeRotation(theta) {

    // counterclockwise

    const c = Math.cos(theta);
    const s = Math.sin(theta);

    this.set(

      c, - s, 0,
      s, c, 0,
      0, 0, 1

    );

    return this;

  }

  makeScale(x, y) {

    this.set(

      x, 0, 0,
      0, y, 0,
      0, 0, 1

    );

    return this;

  }

  // 如果矩阵m 与当前矩阵所有对应元素相同则返回true。

  equals(matrix) {

    const te = this.elements;
    const me = matrix.elements;

    for (let i = 0; i < 9; i++) {

      if (te[i] !== me[i]) return false;

    }

    return true;

  }

  // 使用基于列优先格式column-major的数组来设置该矩阵。
  // var matrix = new THREE.Matrix3();
  // matrix.fromArray([1,4,7,2,5,8,3,6,9]);//因为是基于列优先原则，所以设置的数组和elements属性相同，不需转置。
  fromArray(array, offset = 0) {

    for (let i = 0; i < 9; i++) {

      this.elements[i] = array[i + offset];

    }

    return this;

  }

  // 使用列优先column-major格式将此矩阵的元素写入数组中。这是fromArray的逆运算。
  toArray(array = [], offset = 0) {

    const te = this.elements;

    array[offset] = te[0];
    array[offset + 1] = te[1];
    array[offset + 2] = te[2];

    array[offset + 3] = te[3];
    array[offset + 4] = te[4];
    array[offset + 5] = te[5];

    array[offset + 6] = te[6];
    array[offset + 7] = te[7];
    array[offset + 8] = te[8];

    return array;

  }

  // 创建一个新的矩阵，元素 elements 与该矩阵相同。不多说。
  clone() {

    return new this.constructor().fromArray(this.elements);

  }

}

const _m3 = /*@__PURE__*/ new Matrix3();

export { Matrix3 };
