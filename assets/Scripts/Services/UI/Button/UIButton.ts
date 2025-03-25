
import { _decorator, Component, Node, NodeEventType } from "cc";
import { ISignal } from "../../EventSystem/ISignal";
import { Signal } from "../../EventSystem/Signal";
const { ccclass, property } = _decorator;

/**
 * UI按钮组件
 * 用于处理按钮交互事件，提供统一的按钮点击事件接口
 */
@ccclass("UIButton")
export class UIButton extends Component {
    // 按钮交互事件信号
    private interactedEvent = new Signal<UIButton>();

    /**
     * 组件启动时的初始化
     * 注册触摸开始事件监听
     */
    public start(): void {
        this.node.on(NodeEventType.TOUCH_START, this.interact, this);
    }

    /**
     * 获取按钮交互事件信号
     * @returns 返回ISignal接口，用于订阅按钮交互事件
     */
    public get InteractedEvent(): ISignal<UIButton> {
        return this.interactedEvent;
    }

    /**
     * 处理按钮交互
     * 当按钮被点击时触发，会派发交互事件
     */
    private interact(): void {
        console.log("interact"); // 调试日志
        this.interactedEvent.trigger(this); // 触发交互事件
    }
}
