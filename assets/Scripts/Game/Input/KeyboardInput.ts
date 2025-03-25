import { EventKeyboard, Input, input, KeyCode, Vec2 } from "cc";
import { IInput } from "./IInput";

/**
 * 键盘输入实现类，用于处理玩家移动
 * 实现IInput接口，处理键盘事件并计算移动轴
 */
export class KeyboardInput implements IInput {
    // X轴当前值（-1 = 左，0 = 中立，1 = 右）
    private xAxis = 0;

    // Y轴当前值（-1 = 下，0 = 中立，1 = 上）
    private yAxis = 0;

    // 上方向键
    private up: KeyCode;

    // 下方向键
    private down: KeyCode;

    // 左方向键
    private left: KeyCode;

    // 右方向键
    private right: KeyCode;

    /**
     * 构造函数
     * @param up 上方向键
     * @param down 下方向键
     * @param left 左方向键
     * @param right 右方向键
     */
    public constructor(up: KeyCode, down: KeyCode, left: KeyCode, right: KeyCode) {
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;

        // 注册键盘按下和抬起事件
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    /**
     * 获取当前输入轴的值
     * @returns 包含x和y轴值的Vec2对象，已归一化
     */
    public getAxis(): Vec2 {
        return new Vec2(this.xAxis, this.yAxis).normalize();
    }

    /**
     * 处理键盘按下事件
     * @param event 键盘事件对象
     */
    private onKeyDown(event: EventKeyboard): void {
        switch (event.keyCode) {
            case this.up:
                this.yAxis = 1;
                break;
            case this.down:
                this.yAxis = -1;
                break;
            case this.left:
                this.xAxis = -1;
                break;
            case this.right:
                this.xAxis = 1;
                break;
        }
    }

    /**
     * 处理键盘抬起事件
     * @param event 键盘事件对象
     */
    private onKeyUp(event: EventKeyboard): void {
        switch (event.keyCode) {
            case this.up:
                this.yAxis = this.yAxis === 1 ? 0 : this.yAxis;
                break;
            case this.down:
                this.yAxis = this.yAxis === -1 ? 0 : this.yAxis;
                break;
            case this.left:
                this.xAxis = this.xAxis === -1 ? 0 : this.xAxis;
                break;
            case this.right:
                this.xAxis = this.xAxis === 1 ? 0 : this.xAxis;
                break;
        }
    }
}
