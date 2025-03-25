/**
 * 输入接口，提供移动输入功能
 * 用于玩家移动和控制系统
 */
import { Vec2 } from "cc";

export interface IInput {
    /**
     * 获取当前输入轴的值
     * @returns 包含x和y轴值的Vec2对象，通常在[-1,1]范围内
     */
    getAxis: () => Vec2;
}
