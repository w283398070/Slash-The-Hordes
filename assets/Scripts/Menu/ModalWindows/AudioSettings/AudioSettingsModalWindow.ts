import { Slider, _decorator } from "cc";
import { AppRoot } from "../../../AppRoot/AppRoot";
import { ModalWindow } from "../../../Services/ModalWindowSystem/ModalWindow";
import { UIButton } from "../../../Services/UI/Button/UIButton";
import { Empty } from "../Upgrades/UpgradesModalWindow";

const { ccclass, property } = _decorator;

@ccclass("AudioSettingsModalWindow")
export class AudioSettingsModalWindow extends ModalWindow<Empty, Empty> {
    @property(Slider) private soundVolumeSlider: Slider; // 音效音量滑块
    @property(Slider) private musicVolumeSlider: Slider; // 音乐音量滑块
    @property(UIButton) private okButton: UIButton; // 确认按钮

    protected setup(): void {
        this.soundVolumeSlider.progress = AppRoot.Instance.AudioPlayer.SoundVolume; // 初始化音效音量滑块进度
        this.musicVolumeSlider.progress = AppRoot.Instance.AudioPlayer.MusicVolume; // 初始化音乐音量滑块进度

        this.soundVolumeSlider.node.on("slide", this.updateSoundVolume, this); // 监听音效音量滑块滑动事件
        this.musicVolumeSlider.node.on("slide", this.updateMusicVolume, this); // 监听音乐音量滑块滑动事件

        this.okButton.InteractedEvent.on(this.dismiss, this); // 监听确认按钮点击事件
    }

    private updateSoundVolume(): void {
        AppRoot.Instance.AudioPlayer.setSoundVolume(this.soundVolumeSlider.progress); // 更新音效音量
    }

    private updateMusicVolume(): void {
        AppRoot.Instance.AudioPlayer.setMusicVolume(this.musicVolumeSlider.progress); // 更新音乐音量
    }

    protected dismiss(result?: Empty): void {
        super.dismiss(result);
        const userData = AppRoot.Instance.LiveUserData;
        userData.musicVolume = this.musicVolumeSlider.progress; // 保存音乐音量设置
        userData.soundVolume = this.soundVolumeSlider.progress; // 保存音效音量设置
        AppRoot.Instance.saveUserData(); // 保存用户数据
    }
}
