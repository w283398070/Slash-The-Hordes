import { Animation, Component, _decorator } from "cc";
import { UIButton } from "../UI/Button/UIButton";
import { delay } from "../Utils/AsyncUtils";

const { property } = _decorator;

export abstract class ModalWindow<TParam, TResult> extends Component {
    @property(Animation) private animation: Animation; // 动画组件
    @property(UIButton) private closeButton: UIButton; // 关闭按钮
    @property(UIButton) private backgroundCloseButton: UIButton; // 背景关闭按钮

    private result: TResult; // 结果
    private isDismissed = false; // 是否已关闭

    private openAnimationName = "open"; // 打开动画名称
    private closeAnimationName = "close"; // 关闭动画名称

    // 异步运行窗口
    public async runAsync(params?: TParam): Promise<TResult> {
        this.closeButton?.InteractedEvent.on(() => this.dismiss(), this);
        this.backgroundCloseButton?.InteractedEvent.on(() => this.dismiss(), this);

        this.setup(params);
        this.animation?.play(this.openAnimationName);
        while (!this.isDismissed) await delay(100);
        this.animation?.play(this.closeAnimationName);

        await delay(this.getCloseAnimationTime() * 1000);
        return this.result;
    }

    // 抽象方法，设置窗口参数
    protected abstract setup(params?: TParam): void;

    // 关闭窗口
    protected dismiss(result?: TResult): void {
        this.result = result;
        this.isDismissed = true;
    }

    // 获取关闭动画时间
    private getCloseAnimationTime(): number {
        const state = this.animation?.getState(this.closeAnimationName);
        if (state != null) {
            return state.duration;
        }

        return 0;
    }
}
