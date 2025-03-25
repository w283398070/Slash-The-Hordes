
import { Component, SpriteFrame, _decorator } from "cc";
import { MetaUpgradeType, UpgradeType } from "../../Upgrades/UpgradeType";

const { ccclass, property } = _decorator;

/**
 * 元升级图标管理类
 * 管理所有元升级相关的图标资源
 */
@ccclass("MetaUpgradeIcons")
export class MetaUpgradeIcons extends Component {
    /** 生命值升级图标 */
    @property(SpriteFrame) 
    private healthSprite: SpriteFrame;

    /** 整体伤害升级图标 */
    @property(SpriteFrame) 
    private overallDamageSprite: SpriteFrame;

    /** 投射物穿透升级图标 */
    @property(SpriteFrame) 
    private projectilePiercingSprite: SpriteFrame;

    /** 移动速度升级图标 */
    @property(SpriteFrame) 
    private movementSpeedSprite: SpriteFrame;

    /** 经验收集升级图标 */
    @property(SpriteFrame) 
    private xpGathererSprite: SpriteFrame;

    /** 金币收集升级图标 */
    @property(SpriteFrame) 
    private goldGathererSprite: SpriteFrame;

    /** 升级类型到图标的映射表 */
    private typeToIcon = new Map<MetaUpgradeType, SpriteFrame>();

    /**
     * 初始化元升级图标映射关系
     */
    public init(): void {
        this.typeToIcon.set(MetaUpgradeType.Health, this.healthSprite);
        this.typeToIcon.set(MetaUpgradeType.OverallDamage, this.overallDamageSprite);
        this.typeToIcon.set(MetaUpgradeType.ProjectilePiercing, this.projectilePiercingSprite);
        this.typeToIcon.set(MetaUpgradeType.MovementSpeed, this.movementSpeedSprite);
        this.typeToIcon.set(MetaUpgradeType.XPGatherer, this.xpGathererSprite);
        this.typeToIcon.set(MetaUpgradeType.GoldGatherer, this.goldGathererSprite);
    }

    /**
     * 根据升级类型获取对应的图标
     * @param upgradeType 元升级类型
     * @returns 对应的图标精灵帧
     * @throws 当请求的升级类型不存在时抛出错误
     */
    public getIcon(upgradeType: MetaUpgradeType): SpriteFrame {
        if (!this.typeToIcon.has(upgradeType)) throw new Error("Does not have upgrade type asset " + upgradeType);
        return this.typeToIcon.get(upgradeType);
    }
}
