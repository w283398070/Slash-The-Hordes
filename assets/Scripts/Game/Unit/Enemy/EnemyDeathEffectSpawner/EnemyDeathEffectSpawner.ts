import { _decorator, Component, Node, Prefab } from "cc";

import { ObjectPool } from "../../../../Services/ObjectPool";
import { delay } from "../../../../Services/Utils/AsyncUtils";
import { Enemy } from "../Enemy";
import { EnemyManager } from "../EnemyManager";
import { EnemyDeathEffect } from "./EnemyDeathEffect";
const { ccclass, property } = _decorator;

@ccclass("EnemyDeathEffectSpawner")
export class EnemyDeathEffectSpawner extends Component {
    @property(Prefab) private deathEffectPrefab: Prefab;

    private effectPool: ObjectPool<EnemyDeathEffect>;

    // 初始化方法
    public init(enemyManager: EnemyManager): void {
        enemyManager.EnemyAddedEvent.on(this.onEnemyAdded, this);
        enemyManager.EnemyRemovedEvent.on(this.onEnemyRemoved, this);

        this.effectPool = new ObjectPool(this.deathEffectPrefab, this.node, 5, "EnemyDeathEffect");
    }

    // 当敌人添加时调用
    private onEnemyAdded(enemy: Enemy): void {
        enemy.DeathEvent.on(this.animateDeathEffect, this);
    }

    // 当敌人移除时调用
    private onEnemyRemoved(enemy: Enemy): void {
        enemy.DeathEvent.off(this.animateDeathEffect);
    }

    // 播放死亡效果动画
    private async animateDeathEffect(enemy: Enemy): Promise<void> {
        const deathEffect = this.effectPool.borrow();
        deathEffect.setup(enemy.node.worldPosition);

        await delay(360);

        this.effectPool.return(deathEffect);
    }
}
