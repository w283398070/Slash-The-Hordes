import { _decorator, Component, Node, Vec3, input, Input, EventMouse, Vec2, EventTouch, CCFloat } from "cc";
import { IInput } from "./IInput";
const { ccclass, property } = _decorator;

@ccclass("VirtualJoystic")
export class VirtualJoystic extends Component implements IInput {
    // 最大距离属性
    @property(CCFloat) private maxDistance = 10;
    // 控制杆节点
    @property(Node) private knob: Node;

    // 是否正在使用控制杆
    #isUsingJoystic = false;
    // 默认位置
    #defaultPosition: Vec2 = new Vec2();

    // 初始化方法
    public init(): void {
        // 绑定鼠标事件
        input.on(Input.EventType.MOUSE_DOWN, this.activateMouseJoystic, this);
        input.on(Input.EventType.MOUSE_UP, this.deactivateJoystic, this);
        input.on(Input.EventType.MOUSE_MOVE, this.moveKnobMouse, this);

        // 绑定触摸事件
        input.on(Input.EventType.TOUCH_START, this.activateTouchJoystic, this);
        input.on(Input.EventType.TOUCH_END, this.deactivateJoystic, this);
        input.on(Input.EventType.TOUCH_MOVE, this.moveKnobTouch, this);

        // 初始化时禁用控制杆
        this.deactivateJoystic();
    }

    // 获取轴向输入
    public getAxis(): Vec2 {
        if (this.#isUsingJoystic) {
            return new Vec2(this.knob.position.x / this.maxDistance, this.knob.position.y / this.maxDistance);
        } else {
            return new Vec2();
        }
    }

    // 激活触摸控制杆
    private activateTouchJoystic(e: EventTouch): void {
        this.activateJoystic(e.getUILocation());
    }

    // 激活鼠标控制杆
    private activateMouseJoystic(e: EventMouse): void {
        console.log(e.getUILocation());
        this.activateJoystic(e.getUILocation());
    }

    // 激活控制杆
    private activateJoystic(location: Vec2): void {
        this.#isUsingJoystic = true;
        this.node.active = true;
        this.#defaultPosition = location;

        this.node.setPosition(new Vec3(this.#defaultPosition.x, this.#defaultPosition.y, 0));
        this.knob.position = new Vec3();
    }

    // 禁用控制杆
    private deactivateJoystic(): void {
        this.#isUsingJoystic = false;
        this.node.active = false;
    }

    // 移动触摸控制杆
    private moveKnobTouch(e: EventTouch): void {
        this.moveKnob(e.getUILocation());
    }

    // 移动鼠标控制杆
    private moveKnobMouse(e: EventMouse): void {
        this.moveKnob(e.getUILocation());
    }

    // 移动控制杆
    private moveKnob(location: Vec2): void {
        if (!this.#isUsingJoystic) return;

        const posDelta: Vec2 = location.subtract(this.#defaultPosition);
        let x: number = posDelta.x;
        let y: number = posDelta.y;

        const length: number = Math.sqrt(posDelta.x ** 2 + posDelta.y ** 2);
        if (this.maxDistance < length) {
            const multiplier: number = this.maxDistance / length;

            x *= multiplier;
            y *= multiplier;
        }

        this.knob.position = new Vec3(x, y, 0);
    }
}
