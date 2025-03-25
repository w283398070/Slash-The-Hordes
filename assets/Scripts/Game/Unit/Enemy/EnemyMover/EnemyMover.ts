import { Node } from "cc";
import { Enemy } from "../Enemy";

// 抽象类 EnemyMover 实现了 IEnemyMover 接口
export abstract class EnemyMover implements IEnemyMover {
    // 目标节点
    protected targetNode: Node;
    // 敌人数组
    protected enemies: Enemy[] = [];

    public constructor(targetNode: Node) {
        this.targetNode = targetNode;
    }

    // 添加敌人
    public addEnemy(enemy: Enemy): void {
        this.enemies.push(enemy);
    }

    // 移除敌人
    public removeEnemy(enemy: Enemy): void {
        const index: number = this.enemies.indexOf(enemy);
        if (index != -1) {
            this.enemies.splice(index, 1);
        }
    }

    // 游戏每帧调用的方法
    public abstract gameTick(deltaTime: number): void;
}

// IEnemyMover 接口定义了敌人移动器的基本方法
export interface IEnemyMover {
    addEnemy(enemy: Enemy): void;
    removeEnemy(enemy: Enemy): void;
    gameTick(deltaTime: number): void;
}
