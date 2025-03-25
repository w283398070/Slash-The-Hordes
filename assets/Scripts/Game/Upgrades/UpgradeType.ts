// 升级类型枚举
export enum UpgradeType {
    WeaponLength = "WEAPON_LENGTH", // 武器长度
    WeaponDamage = "WEAPON_DAMAGE", // 武器伤害
    HorizontalProjectile = "HORIZONTAL_PROJECTILE", // 水平发射器
    DiagonalProjectile = "DIAGONAL_PROJECTILE", // 对角发射器
    HaloProjectlie = "HALO_PROJECTILE", // 光环发射器
    Regeneration = "REGENERATION" // 恢复能力
}

// 元升级类型枚举
export enum MetaUpgradeType {
    Health = "META_HEALTH", // 生命值
    OverallDamage = "META_OVERALL_DAMAGE", // 总体伤害
    ProjectilePiercing = "META_PROJECTILE_PIERCING", // 弹道穿透
    MovementSpeed = "META_MOVEMENT_SPEED", // 移动速度
    XPGatherer = "META_XP_GATHERER", // 经验值收集
    GoldGatherer = "META_GOLD_GATHERER" // 金币收集
}
