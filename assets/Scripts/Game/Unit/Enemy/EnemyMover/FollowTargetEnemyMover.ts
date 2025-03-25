import { Vec3 } from "cc";
import { EnemyMover } from "./EnemyMover";

// FollowTargetEnemyMover 类继承自 EnemyMover
// 实现了敌人跟随目标节点的逻辑
export class FollowTargetEnemyMover extends EnemyMover {
    // 游戏每帧调用的方法
    public gameTick(deltaTime: number): void {
        // 遍历所有敌人
        this.enemies.forEach((enemy) => {
            // 计算目标节点与敌人节点之间的方向向量
            let direction: Vec3 = new Vec3();
            direction = Vec3.subtract(direction, this.targetNode.worldPosition, enemy.node.worldPosition);
            // 调用敌人的 gameTick 方法，传入归一化的方向向量和 deltaTime
            enemy.gameTick(direction.normalize(), deltaTime);
        });
    }
}
