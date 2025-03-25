import { Component, ProgressBar, _decorator } from "cc";
import { UnitHealth } from "../../UnitHealth";
const { ccclass, property } = _decorator;

@ccclass("PlayerHealthUI")
export class PlayerHealthUI extends Component {
    @property(ProgressBar) public healthBar: ProgressBar; // 进度条，用于显示玩家的生命值
    private health: UnitHealth; // 玩家生命值对象

    // 初始化方法
    public init(health: UnitHealth): void {
        this.healthBar.progress = 1; // 初始化进度条为满值
        this.health = health; // 设置玩家生命值对象
        this.health.HealthPointsChangeEvent.on(this.updateHealthBar, this); // 监听生命值变化事件，更新进度条
    }

    // 更新生命值进度条
    private updateHealthBar(): void {
        this.healthBar.progress = this.health.HealthPoints / this.health.MaxHealthPoints; // 根据当前生命值和最大生命值计算进度条进度
    }
}
