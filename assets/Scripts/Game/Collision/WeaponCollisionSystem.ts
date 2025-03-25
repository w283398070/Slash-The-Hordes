
import { Collider2D } from "cc";
import { Enemy } from "../Unit/Enemy/Enemy";
import { Weapon } from "../Unit/Player/Weapon/Weapon";

/**
 * 武器碰撞系统
 * 负责处理武器与敌人的碰撞检测和伤害计算
 */
export class WeaponCollisionSystem {
    private weapon: Weapon; // 武器实例

    /**
     * 构造函数
     * @param weapon 武器实例
     */
    public constructor(weapon: Weapon) {
        this.weapon = weapon;
        // 注册武器碰撞开始事件监听器
        weapon.Collider.ContactBeginEvent.on(this.onWeaponContactBegin, this);
    }

    /**
     * 处理武器碰撞开始事件
     * @param otherCollider 与之碰撞的其他碰撞体
     */
    private onWeaponContactBegin(otherCollider: Collider2D): void {
        // 对碰撞到的敌人造成伤害
        otherCollider.getComponent(Enemy).dealDamage(this.weapon.Damage);
    }
}
