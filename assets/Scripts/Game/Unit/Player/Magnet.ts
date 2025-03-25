import { _decorator, Component, Node, Collider2D, CircleCollider2D } from "cc";
import { GameTimer } from "../../../Services/GameTimer";
const { ccclass, property } = _decorator;

@ccclass("Magnet")
export class Magnet extends Component {
    @property(CircleCollider2D) private collider: CircleCollider2D; // 圆形碰撞器

    private timer: GameTimer; // 计时器
    private duration: number; // 磁铁持续时间

    // 获取碰撞器
    public get Collider(): Collider2D {
        return this.collider;
    }

    // 初始化方法
    public init(duration: number): void {
        this.duration = duration; // 设置磁铁持续时间
        this.node.active = false; // 初始状态下磁铁节点不激活
    }

    // 激活磁铁
    public activate(): void {
        this.timer = new GameTimer(this.duration); // 初始化计时器
        this.node.active = true; // 激活磁铁节点
    }

    // 游戏每帧调用的方法
    public gameTick(deltaTime: number): void {
        if (!this.node.active) return; // 如果磁铁未激活，直接返回

        this.timer.gameTick(deltaTime); // 更新计时器
        if (this.timer.tryFinishPeriod()) {
            this.node.active = false; // 如果计时器完成一个周期，取消激活磁铁节点
        }
    }
}
