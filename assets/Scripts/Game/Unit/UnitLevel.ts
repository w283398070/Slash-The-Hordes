import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";

export class UnitLevel {
    private xp = 0; // 当前经验值

    private currentLevel = 0; // 当前等级
    private levelUpEvent: Signal<number> = new Signal<number>(); // 升级事件
    private xpAddedEvent: Signal<number> = new Signal<number>(); // 经验值增加事件

    public constructor(private requiredXPs: number[], private xpMultiplier: number) {}

    // 增加经验值
    public addXp(points: number): void {
        this.xp += points * this.xpMultiplier; // 根据经验值倍率增加经验值
        this.xpAddedEvent.trigger(this.xp); // 触发经验值增加事件
        this.tryLevelUp(); // 尝试升级
    }

    // 获取当前经验值
    public get XP(): number {
        return this.xp;
    }

    // 获取当前等级所需经验值
    public get RequiredXP(): number {
        return this.requiredXPs[this.currentLevel];
    }

    // 获取升级事件
    public get LevelUpEvent(): ISignal<number> {
        return this.levelUpEvent;
    }

    // 获取经验值增加事件
    public get XpAddedEvent(): ISignal<number> {
        return this.xpAddedEvent;
    }

    // 尝试升级
    private tryLevelUp(): void {
        if (this.requiredXPs.length <= this.currentLevel) return; // 如果已达到最高等级，直接返回
        if (this.xp < this.requiredXPs[this.currentLevel]) return; // 如果经验值不足，直接返回

        this.xp -= this.requiredXPs[this.currentLevel]; // 减去当前等级所需经验值
        this.currentLevel++; // 等级提升

        this.levelUpEvent.trigger(this.currentLevel); // 触发升级事件

        this.tryLevelUp(); // 递归检查是否可以再次升级
    }
}
