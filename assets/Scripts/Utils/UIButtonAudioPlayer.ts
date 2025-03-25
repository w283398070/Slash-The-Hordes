import { Component, _decorator } from "cc";
import { AppRoot } from "../AppRoot/AppRoot";
import { UIButton } from "../Services/UI/Button/UIButton";
const { ccclass, property } = _decorator;

/**
 * UI按钮音效播放器组件
 * 用于为UI按钮添加点击音效反馈
 */
@ccclass("UIButtonAudioPlayer")
export class UIButtonAudioPlayer extends Component {
    /** 关联的UI按钮组件 */
    @property(UIButton) private button: UIButton;

    /**
     * 组件启动时的初始化
     * 注册按钮交互事件的监听
     */
    public start(): void {
        this.button.InteractedEvent.on(this.playButtonClick, this);
    }

    /**
     * 播放按钮点击音效
     * 从游戏资源管理器中获取音效并通过音频播放器播放
     */
    private playButtonClick(): void {
        const audioClip = AppRoot.Instance.GameAssets.AudioAssets.buttonClick;
        AppRoot.Instance.AudioPlayer.playSound(audioClip);
    }
}