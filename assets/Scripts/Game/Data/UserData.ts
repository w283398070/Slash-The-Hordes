/**
 * 用户数据类，存储用户设置和游戏进度
 * 包含音效/音乐偏好和游戏数据
 */
export class UserData {
    /**
     * 音效音量级别 (0-1)
     * 0 = 静音, 1 = 最大音量
     */
    public soundVolume = 1;

    /**
     * 背景音乐音量级别 (0-1)
     * 0 = 静音, 1 = 最大音量
     */
    public musicVolume = 1;

    /**
     * 游戏进度和统计数据
     */
    public game = new GameData();
}

/**
 * 游戏数据类，存储玩家进度
 * 包含货币、升级和成就
 */
export class GameData {
    /**
     * 玩家拥有的金币数量
     * 用于购买物品和升级
     */
    public goldCoins = 0;

    /**
     * 元升级数据，包含永久升级等级
     */
    public metaUpgrades = new MetaUpgradesData();

    /**
     * 玩家获得的最高分数
     */
    public highscore = 0;
}

/**
 * 元升级数据类，存储永久升级等级
 * 包含各种角色增强等级
 */
export class MetaUpgradesData {
    /**
     * 生命值升级等级
     * 增加玩家的最大生命值
     */
    public healthLevel = 0;

    /**
     * 整体伤害升级等级
     * 增加玩家造成的所有伤害
     */
    public overallDamageLevel = 0;

    /**
     * 子弹穿透升级等级
     * 增加子弹的穿透能力
     */
    public projectilePiercingLevel = 0;

    /**
     * 移动速度升级等级
     * 增加玩家的移动速度
     */
    public movementSpeedLevel = 0;

    /**
     * 经验收集器升级等级
     * 提高经验值收集效率
     */
    public xpGathererLevel = 0;

    /**
     * 金币收集器升级等级
     * 提高金币收集效率
     */
    public goldGathererLevel = 0;
}
