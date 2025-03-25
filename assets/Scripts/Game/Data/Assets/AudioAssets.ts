
import { AudioClip, Component, _decorator } from "cc";

const { ccclass, property } = _decorator;

/**
 * 音频资源管理类
 * 用于管理和存储游戏中使用的音频资源
 */
@ccclass("AudioAssets")
export class AudioAssets extends Component {
    /**
     * 按钮点击音效
     * 当用户点击按钮时播放的音效
     */
    @property(AudioClip) 
    public buttonClick: AudioClip;
}
