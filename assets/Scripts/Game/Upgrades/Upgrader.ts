import { UpgradeSettings } from "../Data/GameSettings";
import { Player } from "../Unit/Player/Player";
import { HaloProjectileLauncher } from "../Projectile/ProjectileLauncher/HaloProjectileLauncher";
import { WaveProjectileLauncher } from "../Projectile/ProjectileLauncher/WaveProjectileLauncher";
import { UpgradeType } from "./UpgradeType";

export class Upgrader {
    private typeToAction: Map<UpgradeType, () => void> = new Map<UpgradeType, () => void>(); // 升级类型到升级动作的映射
    private typeToLevel: Map<UpgradeType, number> = new Map<UpgradeType, number>(); // 升级类型到当前等级的映射
    private typeToMaxLevel: Map<UpgradeType, number> = new Map<UpgradeType, number>(); // 升级类型到最大等级的映射

    public constructor(
        private player: Player,
        private horizontalProjectileLauncher: WaveProjectileLauncher,
        private haloProjectileLauncher: HaloProjectileLauncher,
        private diagonalProjectileLauncher: WaveProjectileLauncher,
        settings: UpgradeSettings
    ) {
        // 设置各类升级的映射
        this.setTypeMaps(UpgradeType.WeaponLength, this.upgradeWeaponLength.bind(this), settings.maxWeaponLengthUpgrades);
        this.setTypeMaps(UpgradeType.WeaponDamage, this.upgradeWeaponDamage.bind(this), settings.maxWeaponDamageUpgrades);
        this.setTypeMaps(
            UpgradeType.HorizontalProjectile,
            this.upgradeHorizontalProjectileLauncher.bind(this),
            settings.maxHorizontalProjectileUpgrades
        );
        this.setTypeMaps(UpgradeType.DiagonalProjectile, this.upgradeDiagonalProjectileLauncher.bind(this), settings.maxDiagonalProjectileUpgrades);
        this.setTypeMaps(UpgradeType.HaloProjectlie, this.upgradeHaloProjectileLauncher.bind(this), settings.maxHaloProjectileUpgrades);
        this.setTypeMaps(UpgradeType.Regeneration, this.upgradeRegeneration.bind(this), settings.maxRegenerationUpgrades);
    }

    // 升级技能
    public upgradeSkill(type: UpgradeType): void {
        if (!this.typeToAction.has(type)) throw new Error("Upgrade does not have " + type);
        if (this.isMaxLevel(type)) throw new Error("Upgrade is already at max level " + type);

        this.typeToAction.get(type)(); // 执行升级动作
        const level: number = this.typeToLevel.get(type);
        this.typeToLevel.set(type, level + 1); // 增加当前等级
    }

    // 获取可用的升级类型
    public getAvailableUpgrades(): Set<UpgradeType> {
        const availableUpgrades: Set<UpgradeType> = new Set<UpgradeType>();
        for (const key of this.typeToAction.keys()) {
            if (!this.isMaxLevel(key)) {
                availableUpgrades.add(key);
            }
        }

        return availableUpgrades;
    }

    // 设置升级类型的映射
    private setTypeMaps(upgradeType: UpgradeType, action: () => void, maxLevel: number): void {
        this.typeToAction.set(upgradeType, action);
        this.typeToLevel.set(upgradeType, 0);
        this.typeToMaxLevel.set(upgradeType, maxLevel);
    }

    // 升级武器长度
    private upgradeWeaponLength(): void {
        this.player.Weapon.upgradeWeaponLength();
    }

    // 升级武器伤害
    private upgradeWeaponDamage(): void {
        this.player.Weapon.upgradeWeaponDamage();
    }

    // 升级水平发射器
    private upgradeHorizontalProjectileLauncher(): void {
        this.horizontalProjectileLauncher.upgrade();
    }

    // 升级对角发射器
    private upgradeDiagonalProjectileLauncher(): void {
        this.diagonalProjectileLauncher.upgrade();
    }

    // 升级光环发射器
    private upgradeHaloProjectileLauncher(): void {
        this.haloProjectileLauncher.upgrade();
    }

    // 升级恢复能力
    private upgradeRegeneration(): void {
        this.player.Regeneration.upgrade();
    }

    // 判断是否达到最大等级
    private isMaxLevel(type: UpgradeType): boolean {
        return this.typeToMaxLevel.get(type) <= this.typeToLevel.get(type);
    }
}
