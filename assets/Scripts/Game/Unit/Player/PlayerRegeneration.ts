import { GameTimer } from "../../../Services/GameTimer";
import { UnitHealth } from "../UnitHealth";

export class PlayerRegeneration {
    private currentRegenerationAmount = 0; // 当前恢复量
    private regenerationDelay: number; // 恢复延迟时间
    private regenerationTimer: GameTimer = new GameTimer(0); // 恢复计时器
    private health: UnitHealth; // 生命值对象

    public constructor(health: UnitHealth, regenerationDelay: number) {
        this.health = health;
        this.regenerationDelay = regenerationDelay;
    }

    // 升级恢复能力
    public upgrade(): void {
        this.currentRegenerationAmount++; // 增加当前恢复量
        this.regenerationTimer = new GameTimer(this.regenerationDelay / this.currentRegenerationAmount); // 更新恢复计时器
    }

    // 游戏每帧调用的方法
    public gameTick(deltaTime: number): void {
        if (this.currentRegenerationAmount <= 0) return; // 如果当前恢复量小于等于0，直接返回

        this.regenerationTimer.gameTick(deltaTime); // 更新恢复计时器
        if (this.regenerationTimer.tryFinishPeriod()) {
            this.health.heal(1); // 如果计时器完成一个周期，恢复1点生命值
        }
    }
}
