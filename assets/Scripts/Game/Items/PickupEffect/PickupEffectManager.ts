import { _decorator, Component, Node, Prefab, Vec3 } from "cc";
import { ObjectPool } from "../../../Services/ObjectPool";
import { delay } from "../../../Services/Utils/AsyncUtils";
import { PickupEffect } from "./PickupEffect";
const { ccclass, property } = _decorator;

@ccclass("PickupEffectManager")
export class PickupEffectManager extends Component {
    // 拾取效果的预制件
    @property(Prefab) private pickupEffect: Prefab;

    // 效果对象池
    private effectPool: ObjectPool<PickupEffect>;

    // 初始化方法
    public init(): void {
        // 初始化对象池，池中初始有5个对象
        this.effectPool = new ObjectPool(this.pickupEffect, this.node, 5, "PickupEffect");
    }

    // 显示效果
    public async showEffect(position: Vec3): Promise<void> {
        // 从对象池中借用一个效果对象
        const effect = this.effectPool.borrow();
        // 设置效果对象的位置
        effect.node.setWorldPosition(position);
        // 激活效果对象
        effect.node.active = true;

        // 等待450毫秒
        await delay(450);

        // 将效果对象归还到对象池中
        this.effectPool?.return(effect);
    }
}
