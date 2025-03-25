
import { Collider2D, Contact2DType, Node } from "cc";
import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";
import { GameTimer } from "../../Services/GameTimer";
import { GroupType } from "../GroupType";
import { Item } from "../Items/Item";
import { ItemManager } from "../Items/ItemManager";
import { Projectile } from "../Projectile/Projectile";
import { Enemy } from "../Unit/Enemy/Enemy";
import { Player } from "../Unit/Player/Player";

/**
 * 玩家碰撞系统
 * 负责处理玩家与其他游戏对象的碰撞检测和响应
 * 支持处理与敌人、敌人投射物和物品的碰撞
 */
export class PlayerCollisionSystem {
    private playerContacts: Collider2D[] = []; // 当前与玩家发生碰撞的碰撞体列表
    private collisionTimer: GameTimer; // 碰撞处理计时器

    // 碰撞类型与处理方法的映射表
    private groupToResolver: Map<number, (collider: Collider2D) => void> = new Map<number, (collider: Collider2D) => void>();

    private itemPickedUpEvent = new Signal<Node>(); // 物品拾取事件

    /**
     * 构造函数
     * @param player 玩家实例
     * @param collisionDelay 碰撞处理延迟时间
     * @param itemManager 物品管理器实例
     */
    public constructor(private player: Player, collisionDelay: number, private itemManager: ItemManager) {
        this.player = player;

        // 注册碰撞开始和结束事件监听器
        player.Collider.on(Contact2DType.BEGIN_CONTACT, this.onPlayerContactBegin, this);
        player.Collider.on(Contact2DType.END_CONTACT, this.onPlayerContactEnd, this);

        // 初始化碰撞计时器
        this.collisionTimer = new GameTimer(collisionDelay);

        // 初始化碰撞处理映射表
        this.groupToResolver.set(GroupType.ENEMY, this.resolveEnemyContact.bind(this));
        this.groupToResolver.set(GroupType.ENEMY_PROJECTILE, this.resolveEnemyProjectileContact.bind(this));
        this.groupToResolver.set(GroupType.ITEM, this.resolveItemContact.bind(this));
    }

    /**
     * 每帧更新调用
     * @param deltaTime 上一帧到当前帧的时间间隔
     */
    public gameTick(deltaTime: number): void {
        this.collisionTimer.gameTick(deltaTime);
        // 如果计时器完成，处理所有当前碰撞
        if (this.collisionTimer.tryFinishPeriod()) {
            this.resolveAllContacts();
        }
    }

    /**
     * 获取物品拾取事件
     * @returns 物品拾取事件信号
     */
    public get ItemPickedUpEvent(): ISignal<Node> {
        return this.itemPickedUpEvent;
    }

    /**
     * 处理玩家碰撞开始事件
     * @param _selfCollider 玩家自身的碰撞体
     * @param otherCollider 与之碰撞的其他碰撞体
     */
    private onPlayerContactBegin(_selfCollider: Collider2D, otherCollider: Collider2D): void {
        this.playerContacts.push(otherCollider);
        this.resolveContact(otherCollider);
    }

    /**
     * 处理玩家碰撞结束事件
     * @param _selfCollider 玩家自身的碰撞体
     * @param otherCollider 结束碰撞的其他碰撞体
     */
    private onPlayerContactEnd(_selfCollider: Collider2D, otherCollider: Collider2D): void {
        const index: number = this.playerContacts.indexOf(otherCollider);
        if (index != -1) {
            this.playerContacts.splice(index, 1);
        }
    }

    /**
     * 处理所有当前碰撞
     */
    private resolveAllContacts(): void {
        for (let i = 0; i < this.playerContacts.length; i++) {
            this.resolveContact(this.playerContacts[i]);
        }
    }

    /**
     * 处理单个碰撞
     * @param otherCollider 与之碰撞的其他碰撞体
     */
    private resolveContact(otherCollider: Collider2D): void {
        if (!this.player.Health.IsAlive) return; // 如果玩家已死亡，不处理碰撞

        // 根据碰撞体类型调用相应的处理方法
        if (this.groupToResolver.has(otherCollider.group)) {
            this.groupToResolver.get(otherCollider.group)(otherCollider);
        } else {
            console.log("Collided with undefined group: " + otherCollider.group);
        }
    }

    /**
     * 处理与敌人的碰撞
     * @param enemyCollider 敌人的碰撞体
     */
    private resolveEnemyContact(enemyCollider: Collider2D): void {
        const damage: number = enemyCollider.node.getComponent(Enemy).Damage;
        console.log("Collided with enemy: Damage: " + damage);
        this.player.Health.damage(damage);
    }

    /**
     * 处理与敌人投射物的碰撞
     * @param enemyCollider 敌人投射物的碰撞体
     */
    private resolveEnemyProjectileContact(enemyCollider: Collider2D): void {
        const projectile = enemyCollider.node.getComponent(Projectile);
        const damage: number = projectile.Damage;
        projectile.pierce(); // 处理投射物的穿透效果
        console.log("Collided with enemy projectile: Damage: " + damage);

        this.player.Health.damage(damage);
    }

    /**
     * 处理与物品的碰撞
     * @param xpCollider 物品的碰撞体
     */
    private resolveItemContact(xpCollider: Collider2D): void {
        console.log("Collided with item");
        this.itemManager.pickupItem(xpCollider.node.getComponent(Item));
    }
}
