
import { Component, SpriteFrame, _decorator } from "cc";
import { UpgradeType } from "../../Upgrades/UpgradeType";

const { ccclass, property } = _decorator;

/**
 * 普通升级图标管理类
 * 管理所有普通升级相关的图标资源
 */
@ccclass("UpgradeIcons")
export class UpgradeIcons extends Component {
    /** 武器长度升级图标 */
    @property(SpriteFrame) 
    private weaponLengthSprite: SpriteFrame;

    /** 武器伤害升级图标 */
    @property(SpriteFrame) 
    private weaponDamageSprite: SpriteFrame;

    /** 水平投射物升级图标 */
    @property(SpriteFrame) 
    private horizontalProjectileSprite: SpriteFrame;

    /** 对角线投射物升级图标 */
    @property(SpriteFrame) 
    private diagonalProjectileSprite: SpriteFrame;

    /** 光环投射物升级图标 */
    @property(SpriteFrame) 
    private haloProjectileSprite: SpriteFrame;

    /** 生命恢复升级图标 */
    @property(SpriteFrame) 
    private regenerationSprite: SpriteFrame;

    /** 升级类型到图标的映射表 */
    private typeToIcon = new Map<UpgradeType, SpriteFrame>();

    /**
     * 初始化升级图标映射关系
     */
    public init(): void {
        this.typeToIcon.set(UpgradeType.WeaponLength, this.weaponLengthSprite);
        this.typeToIcon.set(UpgradeType.WeaponDamage, this.weaponDamageSprite);
        this.typeToIcon.set(UpgradeType.HorizontalProjectile, this.horizontalProjectileSprite);
        this.typeToIcon.set(UpgradeType.DiagonalProjectile, this.diagonalProjectileSprite);
        this.typeToIcon.set(UpgradeType.HaloProjectlie, this.haloProjectileSprite);
        this.typeToIcon.set(UpgradeType.Regeneration, this.regenerationSprite);
    }

    /**
     * 根据升级类型获取对应的图标
     * @param upgradeType 升级类型
     * @returns 对应的图标精灵帧
     * @throws 当请求的升级类型不存在时抛出错误
     */
    public getIcon(upgradeType: UpgradeType): SpriteFrame {
        if (!this.typeToIcon.has(upgradeType)) throw new Error("Does not have upgrade type asset " + upgradeType);
        return this.typeToIcon.get(upgradeType);
    }
}
