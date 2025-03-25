import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UpgradeLevelPointUI")
export class UpgradeLevelPointUI extends Component {
    @property(Node) private upgradedGraphics: Node; // 升级后的图形节点

    // 初始化方法
    public init(): void {
        this.upgradedGraphics.active = false; // 初始状态下隐藏升级后的图形
    }

    // 升级方法
    public upgrade(): void {
        this.upgradedGraphics.active = true; // 显示升级后的图形
    }
}
