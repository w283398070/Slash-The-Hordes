import { Animation, Component, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PickupEffect")
export class PickupEffect extends Component {
    // 动画组件
    @property(Animation) private animation: Animation;

    // 初始化方法
    public init(): void {
        // 播放拾取奖励动画
        this.animation.play("PickBonus");
    }
}
