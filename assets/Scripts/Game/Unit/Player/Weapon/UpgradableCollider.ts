import { BoxCollider2D, Collider2D, Component, Contact2DType, _decorator } from "cc";
import { ISignal } from "../../../../Services/EventSystem/ISignal";
import { Signal } from "../../../../Services/EventSystem/Signal";

const { ccclass, property } = _decorator;

@ccclass("UpgradableCollider")
export class UpgradableCollider extends Component {
    @property(BoxCollider2D) private colliders: BoxCollider2D[] = []; // 可升级的碰撞器数组
    private contactBeginEvent: Signal<Collider2D> = new Signal<Collider2D>(); // 碰撞开始事件信号
    private currentUpgradeLevel = 0; // 当前升级等级

    // 初始化方法
    public init(): void {
        this.setUpgradeLevel(); // 设置当前升级等级的碰撞器

        for (const collider of this.colliders) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onColliderContactBegin, this); // 监听碰撞开始事件
        }
    }

    // 获取碰撞开始事件
    public get ContactBeginEvent(): ISignal<Collider2D> {
        return this.contactBeginEvent;
    }

    // 升级方法
    public upgrade(): void {
        if (this.currentUpgradeLevel == this.colliders.length - 1) throw new Error("Already at max upgrade! " + this.currentUpgradeLevel);

        this.currentUpgradeLevel++; // 增加当前升级等级
        this.setUpgradeLevel(); // 设置当前升级等级的碰撞器
    }

    // 设置当前升级等级的碰撞器
    private setUpgradeLevel(): void {
        for (const collider of this.colliders) {
            collider.node.active = false; // 关闭所有碰撞器
        }

        this.colliders[this.currentUpgradeLevel].node.active = true; // 激活当前升级等级的碰撞器
    }

    // 碰撞开始事件处理方法
    private onColliderContactBegin(thisCollider: Collider2D, otherCollider: Collider2D): void {
        this.contactBeginEvent.trigger(otherCollider); // 触发碰撞开始事件
    }
}
