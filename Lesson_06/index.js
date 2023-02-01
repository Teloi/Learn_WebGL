import { Vector3 } from "./Vector3.js";
import { Vector2 } from "./Vector2.js";

let c = document.getElementById("c");

// 二维向量求夹角-点乘应用
// 等腰直角三角形,夹角45度
const v21 = new Vector2(4, 0);
const v22 = new Vector2(4, 4);
c.textContent += '二维夹角:' + Math.round(Math.acos((v21.dot(v22) / (v21.length() * v22.length()))) * 180 / Math.PI);
c.textContent += '\n';

// 三维向量求夹角-点乘应用
// 等腰直角三角形,夹角45度
const v31 = new Vector3(4, 0, 0);
const v32 = new Vector3(4, 4, 0);
c.textContent += '三维夹角:' + Math.round(Math.acos((v31.dot(v32) / (v31.length() * v32.length()))) * 180 / Math.PI);
c.textContent += '\n';

// 二维叉乘-向量组成平行四边形的面积
c.textContent += '二维叉乘:' + v21.cross(v22);
c.textContent += '\n';

// 三维叉乘-法向量
const n = v31.cross(v32);
c.textContent += `三维叉乘:x:${n.x},y:${n.y},z:${n.z}`;
c.textContent += '\n';