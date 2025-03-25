
import { _decorator, Component, Node, AudioClip } from "cc";
import { AppRoot } from "../../AppRoot/AppRoot";
import { AudioPlayer } from "../../Services/AudioPlayer/AudioPlayer";
import { ItemManager } from "../Items/ItemManager";
import { ItemType } from "../Items/ItemType";
import { Enemy } from "../Unit/Enemy/Enemy";
import { EnemyManager } from "../Unit/Enemy/EnemyManager";
import { Player } from "../Unit/Player/Player";
import { HaloProjectileLauncher } from "../Projectile/ProjectileLauncher/HaloProjectileLauncher";
import { WaveProjectileLauncher } from "../Projectile/ProjectileLauncher/WaveProjectileLauncher";
const { ccclass, property } = _decorator;

/**
 * 游戏音频适配器
 * 负责管理游戏中的各种音效播放
 * 通过监听游戏事件来触发相应的音效
 */
@ccclass("GameAudioAdapter")
export class GameAudioAdapter extends Component {
    // 背景音乐
    @property(AudioClip) private music: AudioClip;
    // 敌人被击中音效
    @property(AudioClip) private enemyHit: AudioClip;
    // 玩家被击中音效
    @property(AudioClip) private playerHit: AudioClip;
    // 玩家死亡音效
    @property(AudioClip) private playerDeath: AudioClip;
    // 武器挥动音效
    @property(AudioClip) private weaponSwing: AudioClip;
    // 经验值拾取音效
    @property(AudioClip) private xpPickup: AudioClip;
    // 金币拾取音效
    @property(AudioClip) private goldPickup: AudioClip;
    // 血瓶拾取音效
    @property(AudioClip) private healthPotionPickup: AudioClip;
    // 磁铁拾取音效
    @property(AudioClip) private magnetPickup: AudioClip;
    // 宝箱拾取音效
    @property(AudioClip) private chestPickup: AudioClip;
    // 升级音效
    @property(AudioClip) private levelUp: AudioClip;
    // 水平弹幕发射音效
    @property(AudioClip) private horizontalProjectileLaunch: AudioClip;
    // 斜向弹幕发射音效
    @property(AudioClip) private diagonalProjectileLaunch: AudioClip;
    // 光环弹幕发射音效
    @property(AudioClip) private haloProjectileLaunch: AudioClip;

    private audioPlayer: AudioPlayer; // 音频播放器实例
    private player: Player; // 玩家实例

    /**
     * 初始化音频适配器
     * @param player 玩家实例
     * @param enemyManager 敌人管理器
     * @param itemManager 物品管理器
     * @param horizontalLauncher 水平弹幕发射器
     * @param diagonalLauncher 斜向弹幕发射器
     * @param haloLauncher 光环弹幕发射器
     */
    public init(
        player: Player,
        enemyManager: EnemyManager,
        itemManager: ItemManager,
        horizontalLauncher: WaveProjectileLauncher,
        diagonalLauncher: WaveProjectileLauncher,
        haloLauncher: HaloProjectileLauncher
    ): void {
        // 播放背景音乐
        AppRoot.Instance.AudioPlayer.playMusic(this.music);

        this.audioPlayer = AppRoot.Instance.AudioPlayer;
        this.player = player;

        // 绑定各种事件监听器
        player.Weapon.WeaponStrikeEvent.on(() => this.audioPlayer.playSound(this.weaponSwing), this);
        player.Level.LevelUpEvent.on(() => this.audioPlayer.playSound(this.levelUp), this);
        player.Health.HealthPointsChangeEvent.on(this.tryPlayPlayerHitSound, this);

        enemyManager.EnemyAddedEvent.on(this.addEnemyListeners, this);
        enemyManager.EnemyRemovedEvent.on(this.removeEnemyListeners, this);

        itemManager.PickupEvent.on(this.playPickupItemSound, this);

        horizontalLauncher.ProjectileLaunchedEvent.on(() => this.audioPlayer.playSound(this.horizontalProjectileLaunch), this);
        diagonalLauncher.ProjectileLaunchedEvent.on(() => this.audioPlayer.playSound(this.diagonalProjectileLaunch), this);
        haloLauncher.ProjectilesLaunchedEvent.on(() => this.audioPlayer.playSound(this.haloProjectileLaunch), this);
    }

    /**
     * 为敌人添加事件监听器
     * @param enemy 敌人实例
     */
    private addEnemyListeners(enemy: Enemy): void {
        enemy.Health.HealthPointsChangeEvent.on(this.playEnemyHitSound, this);
    }

    /**
     * 移除敌人的事件监听器
     * @param enemy 敌人实例
     */
    private removeEnemyListeners(enemy: Enemy): void {
        enemy.Health.HealthPointsChangeEvent.off(this.playEnemyHitSound);
    }

    /**
     * 尝试播放玩家受伤音效
     * @param healthChange 生命值变化量
     */
    private tryPlayPlayerHitSound(healthChange: number): void {
        if (healthChange < 0) {
            this.audioPlayer.playSound(this.playerHit);
        }

        if (!this.player.Health.IsAlive) {
            this.audioPlayer.playSound(this.playerDeath);
        }
    }

    /**
     * 播放敌人被击中音效
     */
    private playEnemyHitSound(): void {
        this.audioPlayer.playSound(this.enemyHit);
    }

    /**
     * 播放物品拾取音效
     * @param itemType 物品类型
     */
    private playPickupItemSound(itemType: ItemType): void {
        let clipToPlay: AudioClip;
        switch (itemType) {
            case ItemType.XP:
                clipToPlay = this.xpPickup;
                break;
            case ItemType.Gold:
                clipToPlay = this.goldPickup;
                break;
            case ItemType.HealthPotion:
                clipToPlay = this.healthPotionPickup;
                break;
            case ItemType.Magnet:
                clipToPlay = this.magnetPickup;
                break;
            case ItemType.Chest:
                clipToPlay = this.chestPickup;
                break;
            default:
                break;
        }

        this.audioPlayer.playSound(clipToPlay);
    }
}
