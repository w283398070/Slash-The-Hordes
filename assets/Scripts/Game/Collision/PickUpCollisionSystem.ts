import { Collider2D, Contact2DType } from "cc";
import { Item } from "../Items/Item";
import { ItemAttractor } from "../Items/ItemAttractor";
import { PickUp } from "../Unit/Player/PickUp";

/**
 * 拾取碰撞系统
 * 负责处理拾取器与物品的碰撞检测
 * 当拾取器接触到物品时，将物品添加到吸引器中进行吸引
 */
export class PickUpCollisionSystem {
    /**
     * 构造函数
     * @param pickup 拾取器实例
     * @param itemAttractor 物品吸引器实例
     */
    public constructor(pickup: PickUp, private itemAttractor: ItemAttractor) {
        // 注册拾取器碰撞开始事件监听器
        pickup.Collider.on(Contact2DType.BEGIN_CONTACT, this.onPickupContactBegin, this);
    }

    /**
     * 处理拾取器碰撞开始事件
     * @param _selfCollider 拾取器自身的碰撞体
     * @param otherCollider 与之碰撞的其他碰撞体
     */
    private onPickupContactBegin(_selfCollider: Collider2D, otherCollider: Collider2D): void {
        // 获取碰撞到的物品组件
        const item = otherCollider.getComponent(Item);
        
        // 检查物品组件是否存在
        if (item) {
            console.log(`拾取到物品: ${otherCollider.node.name}`);
            this.itemAttractor.addItem(item);
        } else {
            console.warn(`碰撞对象 ${otherCollider.node.name} 不是有效的物品`);
        }
    }
}
