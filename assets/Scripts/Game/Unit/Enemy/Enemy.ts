import { BoxCollider2D, Component, Material, randomRange, Sprite, Vec3, _decorator } from "cc";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { Signal } from "../../../Services/EventSystem/Signal";
import { delay } from "../../../Services/Utils/AsyncUtils";
import { EnemySettings } from "../../Data/GameSettings";
import { UnitHealth } from "../UnitHealth";
import { EnemyMovementType } from "./EnemyMovementType";

const { ccclass, property } = _decorator;

@ccclass("Enemy")
export class Enemy extends Component {
    @property(BoxCollider2D) private collider: BoxCollider2D; // 敌人的碰撞器
    @property(Sprite) private sprite: Sprite; // 敌人的精灵
    @property(Material) private defaultMaterial: Material; // 默认材质
    @property(Material) private whiteMaterial: Material; // 受伤时的白色材质

    private deathEvent: Signal<Enemy> = new Signal<Enemy>(); // 敌人死亡事件
    private lifetimeEndedEvent: Signal<Enemy> = new Signal<Enemy>(); // 敌人生命周期结束事件

    private id: string; // 敌人ID
    private movementType: EnemyMovementType; // 敌人移动类型
    private health: UnitHealth; // 敌人生命值
    private damage: number; // 敌人伤害
    private speedX: number; // 敌人X轴速度
    private speedY: number; // 敌人Y轴速度
    private lifetimeLeft: number; // 敌人剩余生命周期

    private xpReward: number; // 经验奖励
    private goldReward: number; // 金币奖励
    private healthPotionRewardChance: number; // 生命药水掉落几率
    private magnetRewardChance: number; // 磁铁掉落几率
    private chestRewardChance: number; // 宝箱掉落几率

    private endOfLifetimeTriggered = false; // 生命周期结束标志

    // 设置敌人属性
    public setup(position: Vec3, settings: EnemySettings): void {
        this.id = settings.id;
        this.movementType = <EnemyMovementType>settings.moveType;
        this.health = new UnitHealth(settings.health);
        this.damage = settings.damage;
        this.speedX = randomRange(settings.speed / 2, settings.speed);
        this.speedY = randomRange(settings.speed / 2, settings.speed);
        this.lifetimeLeft = settings.lifetime;

        this.xpReward = settings.xpReward;
        this.goldReward = settings.goldReward;
        this.healthPotionRewardChance = settings.healthPotionRewardChance;
        this.magnetRewardChance = settings.magnetRewardChance;
        this.chestRewardChance = settings.chestRewardChance;

        this.node.setWorldPosition(position);
        this.node.active = true;

        this.health.HealthPointsChangeEvent.on(this.animateHurt, this);
        this.endOfLifetimeTriggered = false;
    }

    public get Id(): string {
        return this.id;
    }

    public get MovementType(): EnemyMovementType {
        return this.movementType;
    }

    public get Collider(): BoxCollider2D {
        return this.collider;
    }

    public get Damage(): number {
        return this.damage;
    }

    public get Health(): UnitHealth {
        return this.health;
    }

    public get DeathEvent(): ISignal<Enemy> {
        return this.deathEvent;
    }

    public get XPReward(): number {
        return this.xpReward;
    }

    public get GoldReward(): number {
        return this.goldReward;
    }

    public get HealthPotionRewardChance(): number {
        return this.healthPotionRewardChance;
    }

    public get MagnetRewardChance(): number {
        return this.magnetRewardChance;
    }

    public get ChestRewardChance(): number {
        return this.chestRewardChance;
    }

    public get LifetimeEndedEvent(): ISignal<Enemy> {
        return this.lifetimeEndedEvent;
    }

    // 处理敌人受到的伤害
    public dealDamage(points: number): void {
        this.health.damage(points);
        if (!this.health.IsAlive) {
            this.deathEvent.trigger(this);
        }
    }

    // 游戏每帧调用的方法
    public gameTick(move: Vec3, deltaTime: number): void {
        // 获取当前节点的位置
        const newPosition: Vec3 = this.node.worldPosition;
        
        // 根据移动向量和速度计算新的位置
        newPosition.x += move.x * this.speedX * deltaTime;
        newPosition.y += move.y * this.speedY * deltaTime;

        // 根据移动方向设置精灵的缩放（翻转）
        if (move.x < 0) {
            this.sprite.node.setScale(-1, 1, 1); // 向左移动时翻转精灵
        } else if (0 < move.x) {
            this.sprite.node.setScale(1, 1, 1); // 向右移动时恢复精灵方向
        }

        // 更新节点的位置
        this.node.setWorldPosition(newPosition);

        // 检查敌人的生命周期
        if (0 < this.lifetimeLeft) {
            this.lifetimeLeft -= deltaTime; // 减少剩余生命周期
            if (this.lifetimeLeft <= 0) {
                // 如果生命周期结束，触发生命周期结束事件
                this.lifetimeEndedEvent.trigger(this);
            } else if (this.lifetimeLeft <= 2) {
                // 如果剩余生命周期小于等于2秒，播放生命结束动画
                this.animateEndOfLifetime();
            }
        }
    }

    // 动画：敌人生命结束
    private async animateEndOfLifetime(): Promise<void> {
        if (this.endOfLifetimeTriggered) return;

        this.endOfLifetimeTriggered = true;

        while (this.node?.active) {
            this.sprite.node.active = false;
            await delay(200);

            if (this.sprite == null) break; // 退出场景

            this.sprite.node.active = true;
            await delay(200);
        }
    }

    // 动画：敌人受伤
    private async animateHurt(): Promise<void> {
        this.sprite.material = this.whiteMaterial;
        await delay(100);
        this.sprite.material = this.defaultMaterial;
    }
}
