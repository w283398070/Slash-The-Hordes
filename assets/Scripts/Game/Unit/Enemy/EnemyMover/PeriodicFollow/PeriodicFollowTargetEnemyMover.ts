import { Node, Vec3 } from "cc";
import { Enemy } from "../../Enemy";
import { EnemyMover } from "../EnemyMover";

export class PeriodicFollowTargetEnemyMover extends EnemyMover {
    // 敌人到跟随状态的映射
    private enemyToFollowState: Map<Enemy, EnemyFollowState> = new Map<Enemy, EnemyFollowState>();
    // 敌人到状态剩余时间的映射
    private enemyToStateTimeLeft: Map<Enemy, number> = new Map<Enemy, number>();

    public constructor(targetNode: Node, private followTime: number, private waitTime: number) {
        super(targetNode);
    }

    // 添加敌人
    public addEnemy(enemy: Enemy): void {
        this.setEnemyFollowState(enemy, EnemyFollowState.Follow, this.followTime);
        super.addEnemy(enemy);
    }

    // 移除敌人
    public removeEnemy(enemy: Enemy): void {
        super.removeEnemy(enemy);
    }

    // 游戏每帧调用的方法
    public gameTick(deltaTime: number): void {
        for (const enemy of this.enemies) {
            const stateTimeLeft: number = this.enemyToStateTimeLeft.get(enemy) - deltaTime;
            if (stateTimeLeft <= 0) {
                this.switchEnemyFollowState(enemy);
            } else {
                this.enemyToStateTimeLeft.set(enemy, stateTimeLeft);
            }
            if (this.enemyToFollowState.get(enemy) === EnemyFollowState.Follow) {
                let direction: Vec3 = new Vec3();
                direction = Vec3.subtract(direction, this.targetNode.worldPosition, enemy.node.worldPosition);
                enemy.gameTick(direction.normalize(), deltaTime);
            } else if (this.enemyToFollowState.get(enemy) === EnemyFollowState.Wait) {
                enemy.gameTick(new Vec3(), deltaTime);
            }
        }
    }

    // 切换敌人的跟随状态
    private switchEnemyFollowState(enemy: Enemy): void {
        const followState: EnemyFollowState = this.enemyToFollowState.get(enemy);
        if (followState === EnemyFollowState.Follow) {
            this.setEnemyFollowState(enemy, EnemyFollowState.Wait, this.waitTime);
        } else if (followState === EnemyFollowState.Wait) {
            this.setEnemyFollowState(enemy, EnemyFollowState.Follow, this.followTime);
        }
    }

    // 设置敌人的跟随状态
    private setEnemyFollowState(enemy: Enemy, followState: EnemyFollowState, stateTimeLeft: number): void {
        this.enemyToFollowState.set(enemy, followState);
        this.enemyToStateTimeLeft.set(enemy, stateTimeLeft);
    }
}

// 敌人跟随状态枚举
export enum EnemyFollowState {
    Follow, // 跟随
    Wait    // 等待
}
