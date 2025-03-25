import { Component, Node, _decorator } from "cc";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { EnemyManagerSettings } from "../../Data/GameSettings";
import { Enemy } from "./Enemy";
import { EnemyMovementType } from "./EnemyMovementType";
import { IEnemyMover } from "./EnemyMover/EnemyMover";
import { FollowTargetEnemyMover } from "./EnemyMover/FollowTargetEnemyMover";
import { PeriodicFollowMovers } from "./EnemyMover/PeriodicFollow/PeriodicFollowMovers";
import { WaveEnemyMover } from "./EnemyMover/WaveEnemyMover";
import { CircularEnemySpawner } from "./EnemySpawner/CircularEnemySpawner";
import { DelayedEnemySpawner } from "./EnemySpawner/DelayedEnemySpawner";
import { EnemySpawner } from "./EnemySpawner/EnemySpawner";
import { IndividualEnemySpawner } from "./EnemySpawner/IndividualEnemySpawner";
import { WaveEnemySpawner } from "./EnemySpawner/WaveEnemySpawner";

const { ccclass, property } = _decorator;

@ccclass("EnemyManager")
export class EnemyManager extends Component {
    @property(EnemySpawner) private enemySpawner: EnemySpawner;

    // 移动类型到移动器的映射
    private movementTypeToMover: Map<EnemyMovementType, IEnemyMover> = new Map<EnemyMovementType, IEnemyMover>();

    // 敌人生成器数组
    private spawners: DelayedEnemySpawner[] = [];

    // 初始化敌人管理器
    public init(targetNode: Node, settings: EnemyManagerSettings): void {
        this.enemySpawner.init(targetNode, settings.enemies);
        this.enemySpawner.EnemyAddedEvent.on(this.onEnemyAdded, this);
        this.enemySpawner.EnemyRemovedEvent.on(this.onEnemyRemoved, this);

        // 初始化个体敌人生成器
        for (const individualSpawnerSettings of settings.individualEnemySpawners) {
            const individualSpawner = new IndividualEnemySpawner(this.enemySpawner, individualSpawnerSettings);
            this.spawners.push(individualSpawner);
        }

        // 初始化圆形敌人生成器
        for (const circularSpawnerSettings of settings.circularEnemySpawners) {
            const circularSpawner = new CircularEnemySpawner(this.enemySpawner, circularSpawnerSettings);
            this.spawners.push(circularSpawner);
        }

        // 初始化波浪敌人生成器
        for (const waveSpawnerSettings of settings.waveEnemySpawners) {
            const waveSpawner = new WaveEnemySpawner(this.enemySpawner, waveSpawnerSettings);
            this.spawners.push(waveSpawner);
        }

        // 初始化敌人移动器
        this.movementTypeToMover.set(EnemyMovementType.Follow, new FollowTargetEnemyMover(targetNode));
        this.movementTypeToMover.set(EnemyMovementType.Launch, new WaveEnemyMover(targetNode));
        this.movementTypeToMover.set(EnemyMovementType.PeriodicFollow, new PeriodicFollowMovers(targetNode, settings.periodicFollowMovers));
    }

    // 游戏每帧调用的方法
    public gameTick(deltaTime: number): void {
        // 更新所有敌人生成器
        for (const spawner of this.spawners) {
            spawner.gameTick(deltaTime);
        }

        // 更新所有敌人移动器
        for (const kvp of this.movementTypeToMover) {
            kvp[1].gameTick(deltaTime);
        }
    }

    // 获取敌人添加事件
    public get EnemyAddedEvent(): ISignal<Enemy> {
        return this.enemySpawner.EnemyAddedEvent;
    }

    // 获取敌人移除事件
    public get EnemyRemovedEvent(): ISignal<Enemy> {
        return this.enemySpawner.EnemyRemovedEvent;
    }

    // 当敌人添加时调用
    private onEnemyAdded(enemy: Enemy): void {
        this.getEnemyMover(enemy).addEnemy(enemy);
    }

    // 当敌人移除时调用
    private onEnemyRemoved(enemy: Enemy): void {
        this.getEnemyMover(enemy).removeEnemy(enemy);
    }

    // 获取敌人的移动器
    private getEnemyMover(enemy: Enemy): IEnemyMover {
        if (this.movementTypeToMover.has(enemy.MovementType)) {
            return this.movementTypeToMover.get(enemy.MovementType);
        }

        throw new Error("Does not have mover of type " + enemy.MovementType);
    }
}
