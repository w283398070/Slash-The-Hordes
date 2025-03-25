// 标志，移位必须与 ProjectSettings > Physics 中的索引匹配

export enum GroupType {
    DEFAULT = 1 << 0, // 默认组
    PLAYER = 1 << 1, // 玩家组
    ENEMY = 1 << 2, // 敌人组
    WEAPON = 1 << 3, // 武器组
    ITEM = 1 << 4, // 物品组
    PLAYER_PROJECTILE = 1 << 5, // 玩家弹道组
    ENEMY_PROJECTILE = 1 << 6, // 敌人弹道组
    MAGNET_RANGE = 1 << 7 // 磁铁范围组
}
