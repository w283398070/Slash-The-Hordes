import { Component, random, randomRange, Vec3, _decorator } from "cc";
import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";
import { ItemSettings } from "../Data/GameSettings";
import { GameResult } from "../Game";
import { GameModalLauncher } from "../ModalWIndows/GameModalLauncher";
import { Enemy } from "../Unit/Enemy/Enemy";
import { EnemyManager } from "../Unit/Enemy/EnemyManager";
import { Player } from "../Unit/Player/Player";
import { Item } from "./Item";
import { ItemSpawner } from "./ItemSpawner";
import { ItemType } from "./ItemType";
import { PickupEffectManager } from "./PickupEffect/PickupEffectManager";

const { ccclass, property } = _decorator;

@ccclass("ItemManager")
export class ItemManager extends Component {
    @property(ItemSpawner) private xpSpawner: ItemSpawner;
    @property(ItemSpawner) private goldSpawner: ItemSpawner;
    @property(ItemSpawner) private healthPotionSpawner: ItemSpawner;
    @property(ItemSpawner) private magnetSpawner: ItemSpawner;
    @property(ItemSpawner) private chestSpawner: ItemSpawner;
    @property(PickupEffectManager) private pickupEffectManager: PickupEffectManager;

    private player: Player;
    private gameResult: GameResult;
    private modalLauncher: GameModalLauncher;
    private healthPerPotion: number;

    private pickupEvent = new Signal<ItemType>();

    private itemTypeToAction = new Map<ItemType, () => void>();

    // 初始化方法
    public init(enemyManager: EnemyManager, player: Player, gameResult: GameResult, modalLauncher: GameModalLauncher, settings: ItemSettings): void {
        this.player = player;
        this.gameResult = gameResult;
        this.modalLauncher = modalLauncher;
        this.healthPerPotion = settings.healthPerPotion;

        enemyManager.EnemyAddedEvent.on(this.addEnemyListeners, this);
        enemyManager.EnemyRemovedEvent.on(this.removeEnemyListeners, this);

        this.xpSpawner.init();
        this.goldSpawner.init();
        this.healthPotionSpawner.init();
        this.magnetSpawner.init();
        this.chestSpawner.init();

        this.pickupEffectManager.init();

        this.itemTypeToAction.set(ItemType.XP, this.addXP.bind(this));
        this.itemTypeToAction.set(ItemType.Gold, this.addGold.bind(this));
        this.itemTypeToAction.set(ItemType.HealthPotion, this.useHealthPotion.bind(this));
        this.itemTypeToAction.set(ItemType.Magnet, this.activateMagnet.bind(this));
        this.itemTypeToAction.set(ItemType.Chest, this.openChest.bind(this));
    }

    // 获取拾取事件信号
    public get PickupEvent(): ISignal<ItemType> {
        return this.pickupEvent;
    }

    // 拾取物品
    public pickupItem(item: Item): void {
        if (!this.itemTypeToAction.has(item.ItemType)) throw new Error("Does not have behaviour set for " + item.ItemType);

        this.pickupEffectManager.showEffect(item.node.worldPosition);
        this.itemTypeToAction.get(item.ItemType)();
        this.pickupEvent.trigger(item.ItemType);

        item.pickup();
    }

    // 增加经验值
    private addXP(): void {
        this.player.Level.addXp(1);
    }

    // 增加金币
    private addGold(): void {
        this.gameResult.goldCoins++;
    }

    // 使用生命药水
    private useHealthPotion(): void {
        this.player.Health.heal(this.healthPerPotion);
    }

    // 激活磁铁
    private activateMagnet(): void {
        this.player.Magnet.activate();
    }

    // 打开宝箱
    private openChest(): void {
        this.modalLauncher.showChestModal();
    }

    // 添加敌人监听器
    private addEnemyListeners(enemy: Enemy): void {
        enemy.DeathEvent.on(this.trySpawnItems, this);
    }

    // 移除敌人监听器
    private removeEnemyListeners(enemy: Enemy): void {
        enemy.DeathEvent.off(this.trySpawnItems);
    }

    // 尝试生成物品
    private trySpawnItems(enemy: Enemy): void {
        this.trySpawnXP(enemy);
        this.trySpawnGold(enemy);
        ItemManager.trySpawnOnce(enemy.HealthPotionRewardChance, this.healthPotionSpawner, this.getRandomPosition(enemy));
        ItemManager.trySpawnOnce(enemy.MagnetRewardChance, this.magnetSpawner, this.getRandomPosition(enemy));
        ItemManager.trySpawnOnce(enemy.ChestRewardChance, this.chestSpawner, this.getRandomPosition(enemy));
    }

    // 尝试生成经验值物品
    private trySpawnXP(enemy: Enemy): void {
        for (let index = 0; index < enemy.XPReward; index++) {
            this.xpSpawner.spawn(this.getRandomPosition(enemy));
        }
    }

    // 尝试生成金币物品
    private trySpawnGold(enemy: Enemy): void {
        if (enemy.GoldReward <= 0) return;

        if (enemy.GoldReward < 1) {
            if (random() < enemy.GoldReward) {
                this.goldSpawner.spawn(enemy.node.worldPosition);
            }
        } else {
            for (let i = 0; i < enemy.GoldReward; i++) {
                this.goldSpawner.spawn(this.getRandomPosition(enemy));
            }
        }
    }

    // 尝试生成一次物品
    private static trySpawnOnce(chance: number, itemSpawner: ItemSpawner, worldPosition: Vec3): void {
        if (random() < chance) {
            itemSpawner.spawn(worldPosition);
        }
    }

    // 获取敌人随机位置
    private getRandomPosition(enemy: Enemy): Vec3 {
        const position: Vec3 = enemy.node.worldPosition;
        position.x += randomRange(-15, 15);
        position.y += randomRange(-15, 15);

        return position;
    }
}
