
import { IProjectileLauncherSignaler } from "../Projectile/IProjectileLauncherSignaler";
import { ProjectileCollision } from "../Projectile/ProjectileCollision";
import { Enemy } from "../Unit/Enemy/Enemy";

/**
 * 玩家投射物碰撞系统
 * 负责处理玩家发射的投射物与敌人的碰撞检测和伤害计算
 */
export class PlayerProjectileCollisionSystem {
    /**
     * 构造函数
     * @param collisionSignalers 投射物发射器的信号器数组
     */
    public constructor(collisionSignalers: IProjectileLauncherSignaler[]) {
        // 为每个投射物发射器注册碰撞事件监听器
        for (const collisionSignaler of collisionSignalers) {
            collisionSignaler.ProjectileCollisionEvent.on(this.onProjectileCollision, this);
        }
    }

    /**
     * 处理投射物碰撞事件
     * @param projectileCollision 包含碰撞信息的对象
     */
    private onProjectileCollision(projectileCollision: ProjectileCollision): void {
        // 对碰撞到的敌人造成伤害
        projectileCollision.otherCollider.getComponent(Enemy).dealDamage(projectileCollision.projectile.Damage);
        // 处理投射物的穿透效果
        projectileCollision.projectile.pierce();
    }
}
