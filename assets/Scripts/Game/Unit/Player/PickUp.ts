import { _decorator, Component, Node, Collider2D, CircleCollider2D } from "cc";
import { GameTimer } from "../../../Services/GameTimer";
const { ccclass, property } = _decorator;

@ccclass("PickUp")
export class PickUp extends Component {
    @property(CircleCollider2D) private collider: CircleCollider2D; // 圆形碰撞器


    // 获取碰撞器
    public get Collider(): Collider2D {
        return this.collider;
    }

    // 初始化方法
    public init(radius: number): void {
        this.collider.radius += radius; // 设置磁铁半径
        this.node.active = true; // 初始状态下磁铁节点不激活
    }


    // 游戏每帧调用的方法
    public gameTick(deltaTime: number): void {
    }
}
