
import { Canvas, Component, KeyCode, Vec2, _decorator, Node, approx } from "cc";
import { AppRoot } from "../AppRoot/AppRoot";
import { requireAppRootAsync } from "../AppRoot/AppRootUtils";
import { delay } from "../Services/Utils/AsyncUtils";
import { GameAudioAdapter } from "./Audio/GameAudioAdapter";
import { Background } from "./Background/Background";
import { MagnetCollisionSystem } from "./Collision/MagnetCollisionSystem";
import { PlayerCollisionSystem } from "./Collision/PlayerCollisionSystem";
import { PlayerProjectileCollisionSystem } from "./Collision/PlayerProjectileCollisionSystem";
import { WeaponCollisionSystem } from "./Collision/WeaponCollisionSystem";
import { GameSettings, PlayerSettings } from "./Data/GameSettings";
import { TranslationData } from "./Data/TranslationData";
import { UserData } from "./Data/UserData";
import { KeyboardInput } from "./Input/KeyboardInput";
import { MultiInput } from "./Input/MultiInput";
import { VirtualJoystic } from "./Input/VirtualJoystic";
import { ItemAttractor } from "./Items/ItemAttractor";
import { ItemManager } from "./Items/ItemManager";
import { GameModalLauncher } from "./ModalWIndows/GameModalLauncher";
import { Pauser } from "./Pauser";
import { TestValues } from "./TestGameRunner";
import { GameUI } from "./UI/GameUI";
import { EnemyDeathEffectSpawner } from "./Unit/Enemy/EnemyDeathEffectSpawner/EnemyDeathEffectSpawner";
import { EnemyManager } from "./Unit/Enemy/EnemyManager";
import { EnemyProjectileLauncher } from "./Unit/Enemy/ProjectileLauncher.cs/EnemyProjectileLauncher";
import { MetaUpgrades } from "./Unit/MetaUpgrades/MetaUpgrades";
import { Player, PlayerData } from "./Unit/Player/Player";
import { HaloProjectileLauncher } from "./Projectile/ProjectileLauncher/HaloProjectileLauncher";
import { ProjectileData } from "./Projectile/ProjectileLauncher/ProjectileData";
import { ProjectileLauncher } from "./Projectile/ProjectileLauncher/ProjectileLauncher";
import { WaveProjectileLauncher } from "./Projectile/ProjectileLauncher/WaveProjectileLauncher";
import { Upgrader } from "./Upgrades/Upgrader";
import { MetaUpgradeType } from "./Upgrades/UpgradeType";

const { ccclass, property } = _decorator;

/**
 * 游戏主逻辑类
 * 负责管理游戏的核心流程和各个系统
 */
@ccclass("Game")
export class Game extends Component {
    private static instance: Game; // 单例实例，用于全局访问

    // 各种游戏组件的属性绑定
    @property(VirtualJoystic) private virtualJoystic: VirtualJoystic;
    @property(Player) private player: Player;
    @property(ProjectileLauncher) private haloProjectileLauncherComponent: ProjectileLauncher;
    @property(ProjectileLauncher) private horizontalProjectileLauncherComponent: ProjectileLauncher;
    @property(ProjectileLauncher) private diagonalProjectileLauncherComponent: ProjectileLauncher;
    @property(ProjectileLauncher) private enemyAxeProjectileLauncherComponent: ProjectileLauncher;
    @property(ProjectileLauncher) private enemyMagicOrbProjectileLauncherComponent: ProjectileLauncher;
    @property(EnemyManager) private enemyManager: EnemyManager;
    @property(EnemyDeathEffectSpawner) private deathEffectSpawner: EnemyDeathEffectSpawner;
    @property(ItemManager) private itemManager: ItemManager;
    @property(GameUI) private gameUI: GameUI;
    @property(Canvas) private gameCanvas: Canvas;
    @property(Background) private background: Background;
    @property(GameAudioAdapter) private gameAudioAdapter: GameAudioAdapter;
    @property(Node) private blackScreen: Node;

    // 游戏系统组件
    private playerCollisionSystem: PlayerCollisionSystem;
    private haloProjectileLauncher: HaloProjectileLauncher;
    private horizontalProjectileLauncher: WaveProjectileLauncher;
    private diagonalProjectileLauncher: WaveProjectileLauncher;
    private enemyAxeProjectileLauncher: EnemyProjectileLauncher;
    private enemyMagicOrbProjectileLauncher: EnemyProjectileLauncher;
    private itemAttractor: ItemAttractor;

    // 游戏状态管理
    private gamePauser: Pauser = new Pauser();
    private gameResult: GameResult;
    private timeAlive = 0; // 游戏存活时间

    /**
     * 获取游戏单例实例
     */
    public static get Instance(): Game {
        return this.instance;
    }

    /**
     * 组件启动时的初始化
     */
    public start(): void {
        this.gamePauser.pause(); // 初始化时暂停游戏
        Game.instance = this; // 设置单例实例
        this.blackScreen.active = true; // 激活黑屏效果
    }

    /**
     * 开始游戏主循环
     * @param userData 用户数据
     * @param settings 游戏设置
     * @param translationData 本地化数据
     * @param testValues 测试用数据（可选）
     * @returns 游戏结果
     */
    public async play(userData: UserData, settings: GameSettings, translationData: TranslationData, testValues?: TestValues): Promise<GameResult> {
        await this.setup(userData, settings, translationData, testValues);

        AppRoot.Instance.Analytics.gameStart(); // 记录游戏开始事件

        this.gamePauser.resume(); // 恢复游戏
        this.blackScreen.active = false; // 关闭黑屏
        AppRoot.Instance.ScreenFader.playClose(); // 播放屏幕淡入效果

        // 游戏主循环，直到玩家死亡或手动退出
        while (!this.gameResult.hasExitManually && this.player.Health.IsAlive) await delay(100);

        this.gamePauser.pause(); // 暂停游戏
        Game.instance = null; // 清除单例实例
        this.gameResult.score = this.timeAlive; // 记录最终得分

        // 处理游戏结束逻辑
        if (!this.gameResult.hasExitManually) {
            AppRoot.Instance.Analytics.goldPerRun(this.gameResult.goldCoins);
            AppRoot.Instance.Analytics.gameEnd(this.gameResult.score);

            await delay(2000); // 等待2秒
        } else {
            AppRoot.Instance.Analytics.gameExit(this.timeAlive);
        }

        return this.gameResult;
    }

    /**
     * 手动退出游戏
     */
    public exitGame(): void {
        this.gameResult.hasExitManually = true;
    }

    /**
     * 每帧更新
     * @param deltaTime 帧时间差
     */
    public update(deltaTime: number): void {
        if (this.gamePauser.IsPaused) return;

        // 更新各个游戏系统
        this.player.gameTick(deltaTime);
        this.playerCollisionSystem.gameTick(deltaTime);
        this.enemyManager.gameTick(deltaTime);
        this.haloProjectileLauncher.gameTick(deltaTime);
        this.horizontalProjectileLauncher.gameTick(deltaTime);
        this.diagonalProjectileLauncher.gameTick(deltaTime);
        this.enemyAxeProjectileLauncher.gameTick(deltaTime);
        this.enemyMagicOrbProjectileLauncher.gameTick(deltaTime);
        this.itemAttractor.gameTick(deltaTime);
        this.background.gameTick();

        // 更新存活时间
        this.timeAlive += deltaTime;
        this.gameUI.updateTimeAlive(this.timeAlive);

        // 更新相机和UI位置
        AppRoot.Instance.MainCamera.node.setWorldPosition(this.player.node.worldPosition);
        this.gameUI.node.setWorldPosition(this.player.node.worldPosition);
    }

    /**
     * 初始化游戏设置
     * @param userData 用户数据
     * @param settings 游戏设置
     * @param translationData 本地化数据
     * @param testValues 测试用数据
     */
    private async setup(userData: UserData, settings: GameSettings, translationData: TranslationData, testValues: TestValues): Promise<void> {
        await requireAppRootAsync();
        this.gameCanvas.cameraComponent = AppRoot.Instance.MainCamera;

        this.gameResult = new GameResult();
        const metaUpgrades = new MetaUpgrades(userData.game.metaUpgrades, settings.metaUpgrades);

        this.virtualJoystic.init();

        // 初始化输入系统
        const wasd = new KeyboardInput(KeyCode.KEY_W, KeyCode.KEY_S, KeyCode.KEY_A, KeyCode.KEY_D);
        const arrowKeys = new KeyboardInput(KeyCode.ARROW_UP, KeyCode.ARROW_DOWN, KeyCode.ARROW_LEFT, KeyCode.ARROW_RIGHT);
        const multiInput: MultiInput = new MultiInput([this.virtualJoystic, wasd, arrowKeys]);

        // 初始化玩家和敌人系统
        this.player.init(multiInput, this.createPlayerData(settings.player, metaUpgrades));
        this.enemyManager.init(this.player.node, settings.enemyManager);
        this.deathEffectSpawner.init(this.enemyManager);

        // 初始化碰撞系统
        this.playerCollisionSystem = new PlayerCollisionSystem(this.player, settings.player.collisionDelay, this.itemManager);
        new WeaponCollisionSystem(this.player.Weapon);

        // 初始化弹道系统
        const projectileData = new ProjectileData();
        projectileData.damage = 1 + metaUpgrades.getUpgradeValue(MetaUpgradeType.OverallDamage);
        projectileData.pierces = 1 + metaUpgrades.getUpgradeValue(MetaUpgradeType.ProjectilePiercing);

        this.haloProjectileLauncher = new HaloProjectileLauncher(
            this.haloProjectileLauncherComponent,
            this.player.node,
            settings.player.haloLauncher,
            projectileData
        );

        this.horizontalProjectileLauncher = new WaveProjectileLauncher(
            this.horizontalProjectileLauncherComponent,
            this.player.node,
            [new Vec2(0, 1), new Vec2(-0.1, 0.8), new Vec2(0.1, 0.8)],
            settings.player.horizontalLauncher,
            projectileData
        );

        this.diagonalProjectileLauncher = new WaveProjectileLauncher(
            this.diagonalProjectileLauncherComponent,
            this.player.node,
            [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5)],
            settings.player.diagonalLauncher,
            projectileData
        );

        this.enemyAxeProjectileLauncher = new EnemyProjectileLauncher(
            this.enemyAxeProjectileLauncherComponent,
            this.player.node,
            this.enemyManager,
            settings.enemyManager.axeLauncher
        );

        this.enemyMagicOrbProjectileLauncher = new EnemyProjectileLauncher(
            this.enemyMagicOrbProjectileLauncherComponent,
            this.player.node,
            this.enemyManager,
            settings.enemyManager.magicOrbLauncher
        );

        new PlayerProjectileCollisionSystem([this.haloProjectileLauncher, this.horizontalProjectileLauncher, this.diagonalProjectileLauncher]);

        // 初始化物品系统
        this.itemAttractor = new ItemAttractor(this.player.node, 100);
        new MagnetCollisionSystem(this.player.Magnet, this.itemAttractor);

        // 初始化升级系统
        const upgrader = new Upgrader(
            this.player,
            this.horizontalProjectileLauncher,
            this.haloProjectileLauncher,
            this.diagonalProjectileLauncher,
            settings.upgrades
        );
        const modalLauncher = new GameModalLauncher(AppRoot.Instance.ModalWindowManager, this.player, this.gamePauser, upgrader, translationData);

        // 初始化物品管理和UI
        this.itemManager.init(this.enemyManager, this.player, this.gameResult, modalLauncher, settings.items);
        this.gameUI.init(this.player, modalLauncher, this.itemManager, this.gameResult);
        this.background.init(this.player.node);

        // 处理测试数据
        if (testValues) {
            this.timeAlive += testValues.startTime;
            this.player.Level.addXp(testValues.startXP);
        }

        // 初始化音频适配器
        this.gameAudioAdapter.init(
            this.player,
            this.enemyManager,
            this.itemManager,
            this.horizontalProjectileLauncher,
            this.diagonalProjectileLauncher,
            this.haloProjectileLauncher
        );
    }

    /**
     * 创建玩家数据
     * @param settings 玩家设置
     * @param metaUpgrades 元升级数据
     * @returns 玩家数据对象
     */
    private createPlayerData(settings: PlayerSettings, metaUpgrades: MetaUpgrades): PlayerData {
        const playerData: PlayerData = Object.assign(new PlayerData(), settings);

        // 应用元升级效果
        playerData.maxHp = metaUpgrades.getUpgradeValue(MetaUpgradeType.Health) + settings.defaultHP;
        playerData.requiredXP = settings.requiredXP;
        playerData.speed = metaUpgrades.getUpgradeValue(MetaUpgradeType.MovementSpeed) + settings.speed;
        playerData.regenerationDelay = settings.regenerationDelay;
        playerData.xpMultiplier = metaUpgrades.getUpgradeValue(MetaUpgradeType.XPGatherer) + 1;
        playerData.goldMultiplier = metaUpgrades.getUpgradeValue(MetaUpgradeType.GoldGatherer) + 1;

        playerData.damage = metaUpgrades.getUpgradeValue(MetaUpgradeType.OverallDamage) + settings.weapon.damage;
        playerData.strikeDelay = settings.weapon.strikeDelay;

        playerData.magnetDuration = settings.magnetDuration;

        return playerData;
    }
}

/**
 * 游戏结果类
 * 用于存储游戏结束时的各种数据
 */
export class GameResult {
    public hasExitManually = false; // 是否手动退出
    public goldCoins = 0; // 获得的金币数量
    public score = 0; // 游戏得分
}
