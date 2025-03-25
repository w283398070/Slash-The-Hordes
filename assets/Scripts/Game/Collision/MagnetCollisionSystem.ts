
import { Collider2D, Contact2DType } from "cc";
import { Item } from "../Items/Item";
import { ItemAttractor } from "../Items/ItemAttractor";
import { Magnet } from "../Unit/Player/Magnet";

/**
 * 磁铁碰撞系统
 * 负责处理磁铁与物品的碰撞检测
 * 当磁铁接触到物品时，将物品添加到吸引器中进行吸引
 */
export class MagnetCollisionSystem {
    /**
     * 构造函数
     * @param magnet 磁铁实例
     * @param itemAttractor 物品吸引器实例
     */
    public constructor(magnet: Magnet, private itemAttractor: ItemAttractor) {
        // 注册磁铁碰撞开始事件监听器
        magnet.Collider.on(Contact2DType.BEGIN_CONTACT, this.onMagnetContactBegin, this);
    }

    /**
     * 处理磁铁碰撞开始事件
     * @param _selfCollider 磁铁自身的碰撞体
     * @param otherCollider 与之碰撞的其他碰撞体
     */
    private onMagnetContactBegin(_selfCollider: Collider2D, otherCollider: Collider2D): void {
        // 获取碰撞到的物品组件并添加到吸引器中
        this.itemAttractor.addItem(otherCollider.getComponent(Item));
    }
}
