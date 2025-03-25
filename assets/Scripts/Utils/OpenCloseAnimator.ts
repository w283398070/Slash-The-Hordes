import { Animation, Component, _decorator } from "cc";
import { delay } from "../Services/Utils/AsyncUtils";
const { ccclass, property } = _decorator;

@ccclass("OpenCloseAnimator")
export class OpenCloseAnimator extends Component {
    @property(Animation) private animation: Animation; // 动画组件

    private readonly openStateName = "Open"; // 打开状态名称
    private readonly closeStateName = "Close"; // 关闭状态名称

    private openDuration = 0; // 打开动画持续时间
    private closeDuration = 0; // 关闭动画持续时间

    // 初始化方法
    public init(): void {
        this.openDuration = this.animation.getState(this.openStateName).duration;
        this.closeDuration = this.animation.getState(this.closeStateName).duration;
    }

    // 播放打开动画
    public async playOpen(): Promise<void> {
        this.node.active = true;
        this.animation.play(this.openStateName);
        await delay(this.openDuration * 1000);
    }

    // 播放关闭动画
    public async playClose(): Promise<void> {
        this.node.active = true;
        this.animation.play(this.closeStateName);
        await delay(this.closeDuration * 1000);
        this.node.active = false;
    }
}
