import { Animation, AnimationState, Component, _decorator } from "cc";
import { ISignal } from "../../../../Services/EventSystem/ISignal";
import { Signal } from "../../../../Services/EventSystem/Signal";
import { GameTimer } from "../../../../Services/GameTimer";

import { UpgradableCollider } from "./UpgradableCollider";
const { ccclass, property } = _decorator;

@ccclass("Weapon")
export class Weapon extends Component {
    @property(Animation) private weaponAnimation: Animation; // 武器动画组件
    @property(UpgradableCollider) private upgradableCollider: UpgradableCollider; // 可升级的碰撞器组件

    private weaponStrikeEvent = new Signal<Weapon>(); // 武器攻击事件信号

    private strikeTimer: GameTimer; // 攻击计时器
    private strikeState: AnimationState; // 攻击动画状态
    private damage: number; // 武器伤害

    // 初始化方法
    public init(strikeDelay: number, damage: number): void {
        this.strikeTimer = new GameTimer(strikeDelay); // 初始化攻击计时器
        this.damage = damage; // 设置武器伤害
        this.node.active = false; // 初始状态下武器节点不激活

        this.weaponAnimation.on(Animation.EventType.FINISHED, this.endStrike, this); // 监听动画结束事件
        this.strikeState = this.weaponAnimation.getState(this.weaponAnimation.clips[0].name); // 获取攻击动画状态
        this.strikeState.speed = 1; // 设置动画播放速度

        this.upgradableCollider.init(); // 初始化可升级的碰撞器
    }

    // 游戏每帧调用的方法
    public gameTick(deltaTime: number): void {
        this.strikeTimer.gameTick(deltaTime); // 更新攻击计时器
        if (this.strikeTimer.tryFinishPeriod()) {
            this.strike(); // 如果计时器完成一个周期，执行攻击
        }
    }

    // 获取武器攻击事件
    public get WeaponStrikeEvent(): ISignal<Weapon> {
        return this.weaponStrikeEvent;
    }

    // 获取碰撞器
    public get Collider(): UpgradableCollider {
        return this.upgradableCollider;
    }

    // 获取武器伤害
    public get Damage(): number {
        return this.damage;
    }

    // 升级武器伤害
    public upgradeWeaponDamage(): void {
        this.damage++;
    }

    // 升级武器长度
    public upgradeWeaponLength(): void {
        this.upgradableCollider.upgrade();
    }

    // 执行攻击
    private strike(): void {
        this.node.active = true; // 激活武器节点
        this.weaponAnimation.play(this.strikeState.name); // 播放攻击动画
        this.weaponStrikeEvent.trigger(this); // 触发武器攻击事件
    }

    // 结束攻击
    private endStrike(): void {
        this.node.active = false; // 取消激活武器节点
    }
}
