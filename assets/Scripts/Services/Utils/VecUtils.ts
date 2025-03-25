import { Vec3 } from "cc";

/**
 * 获取方向向量
 * @param targetPosition 目标位置
 * @param sourcePosition 源位置
 * @returns 归一化的方向向量
 */
export function getDirection(targetPosition: Vec3, sourcePosition: Vec3): Vec3 {
    const direction: Vec3 = new Vec3();
    return Vec3.subtract(direction, targetPosition, sourcePosition).normalize();
}
