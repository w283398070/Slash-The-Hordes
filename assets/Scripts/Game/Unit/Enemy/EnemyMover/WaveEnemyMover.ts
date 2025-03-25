import { Vec3 } from "cc";
import { Enemy } from "../Enemy";
import { EnemyMover } from "./EnemyMover";

// WaveEnemyMover 类继承自 EnemyMover
// 实现了敌人以波浪形式移动的逻辑
export class WaveEnemyMover extends EnemyMover {
    // 敌人到方向向量的映射
    private enemyToDirection: Map<Enemy, Vec3> = new Map<Enemy, Vec3>();
    // 上一次目标位置
    private lastTargetPosition: Vec3 = new Vec3();
    // 上一次方向向量
    private lastDirection: Vec3 = new Vec3();

    // 添加敌人
    public addEnemy(enemy: Enemy): void {
        let direction: Vec3 = new Vec3();

        // 如果敌人足够快地被添加，则作为一个整体朝一个方向移动
        if (Vec3.equals(this.lastTargetPosition, this.targetNode.worldPosition)) {
            direction = this.lastDirection;
        } else {
            direction = Vec3.subtract(direction, this.targetNode.worldPosition, enemy.node.worldPosition);
            this.lastDirection = direction;
            this.lastTargetPosition = this.targetNode.worldPosition.clone();
        }

        this.enemyToDirection.set(enemy, direction.normalize());
        super.addEnemy(enemy);
    }

    // 移除敌人
    public removeEnemy(enemy: Enemy): void {
        this.enemyToDirection.delete(enemy);
        super.removeEnemy(enemy);
    }

    // 游戏每帧调用的方法
    public gameTick(deltaTime: number): void {
        for (const enemyAndDirection of this.enemyToDirection) {
            enemyAndDirection[0].gameTick(enemyAndDirection[1], deltaTime);
        }
    }
}
