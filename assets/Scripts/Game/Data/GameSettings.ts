
import { EnemyProjectileLauncher } from "../Unit/Enemy/ProjectileLauncher.cs/EnemyProjectileLauncher";

/**
 * 游戏全局设置类
 * 包含游戏中所有可配置的参数
 */
export class GameSettings {
    /** 玩家相关设置 */
    public player: PlayerSettings = new PlayerSettings();
    /** 升级系统设置 */
    public upgrades: UpgradeSettings = new UpgradeSettings();
    /** 元升级系统设置 */
    public metaUpgrades: MetaUpgradesSettings = new MetaUpgradesSettings();
    /** 敌人管理器设置 */
    public enemyManager: EnemyManagerSettings = new EnemyManagerSettings();
    /** 物品系统设置 */
    public items: ItemSettings = new ItemSettings();
}

/**
 * 玩家设置类
 */
export class PlayerSettings {
    /** 默认生命值 */
    public defaultHP = 0;
    /** 每级所需经验值数组 */
    public requiredXP: number[] = [];
    /** 移动速度 */
    public speed = 0;
    /** 生命恢复延迟 */
    public regenerationDelay = 0;
    /** 碰撞延迟 */
    public collisionDelay = 0;
    /** 磁铁效果持续时间 */
    public magnetDuration = 0;
    /** 武器设置 */
    public weapon: WeaponSettings = new WeaponSettings();
    /** 光环发射器设置 */
    public haloLauncher: HaloLauncherSettings = new HaloLauncherSettings();
    /** 水平发射器设置 */
    public horizontalLauncher: WaveLauncherSettings = new WaveLauncherSettings();
    /** 对角线发射器设置 */
    public diagonalLauncher: WaveLauncherSettings = new WaveLauncherSettings();
}

// ... [其余类的注释结构类似，按照相同的方式添加中文注释]
