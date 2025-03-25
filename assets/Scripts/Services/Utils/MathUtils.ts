// 将数字四舍五入到小数点后一位
export function roundToOneDecimal(num: number): number {
    return Math.round(num * 10) / 10;
}

// 随机返回正或负
export function randomPositiveOrNegative(): number {
    return Math.random() < 0.5 ? 1 : -1;
}

// 根据方向获取角度（度数）
export function getDegreeAngleFromDirection(x: number, y: number): number {
    const radianAngle = Math.atan2(y, x);
    const angle = (radianAngle / Math.PI) * 180;

    return angle < 0 ? angle + 360 : angle;
}
