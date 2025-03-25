import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";

export class UnitHealth {
    private healthPoints: number; // 当前生命值
    private maxHealthPoints: number; // 最大生命值
    private healthPointsChangeEvent: Signal<number> = new Signal<number>(); // 生命值变化事件

    public constructor(maxHealth: number) {
        this.maxHealthPoints = maxHealth; // 设置最大生命值
        this.healthPoints = maxHealth; // 初始化当前生命值为最大生命值
    }

    // 判断是否存活
    public get IsAlive(): boolean {
        return 0 < this.healthPoints;
    }

    // 获取当前生命值
    public get HealthPoints(): number {
        return this.healthPoints;
    }

    // 获取最大生命值
    public get MaxHealthPoints(): number {
        return this.maxHealthPoints;
    }

    // 获取生命值变化事件
    public get HealthPointsChangeEvent(): ISignal<number> {
        return this.healthPointsChangeEvent;
    }

    // 恢复生命值
    public heal(points: number): void {
        this.healthPoints = Math.min(this.maxHealthPoints, this.healthPoints + points); // 恢复生命值但不超过最大生命值
        this.healthPointsChangeEvent.trigger(points); // 触发生命值变化事件
    }

    // 受到伤害
    public damage(points: number): void {
        this.healthPoints -= points; // 减少生命值
        this.healthPointsChangeEvent.trigger(-points); // 触发生命值变化事件
    }

    // 设置最大生命值
    public setMaxHealth(maxHealth: number): void {
        this.maxHealthPoints = maxHealth;
    }
}
