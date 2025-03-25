import { _decorator } from "cc";
import { MenuModalWindowTypes } from "../../Menu/ModalWindows/MenuModalWindowTypes";
import { ModalWindow } from "../../Services/ModalWindowSystem/ModalWindow";
import { ModalWindowManager } from "../../Services/ModalWindowSystem/ModalWindowManager";
import { UIButton } from "../../Services/UI/Button/UIButton";

const { ccclass, property } = _decorator;

@ccclass("PauseModalWindow")
export class PauseModalWindow extends ModalWindow<ModalWindowManager, boolean> {
    @property(UIButton) private continueBtn: UIButton;
    @property(UIButton) private audioSettingsButton: UIButton;
    @property(UIButton) private exitBtn: UIButton;

    private modalWindowManager: ModalWindowManager;

    // 设置窗口参数
    protected setup(modalWindowManager: ModalWindowManager): void {
        this.modalWindowManager = modalWindowManager;

        // 绑定按钮的交互事件
        this.continueBtn.InteractedEvent.on(this.continueGame, this);
        this.audioSettingsButton.InteractedEvent.on(this.openSettingsWindow, this);
        this.exitBtn.InteractedEvent.on(this.exitGame, this);
    }

    // 打开音频设置窗口
    private openSettingsWindow(): void {
        this.modalWindowManager.showModal(MenuModalWindowTypes.AudioSettings, {});
    }

    // 继续游戏
    private continueGame(): void {
        this.dismiss(false);
    }

    // 退出游戏
    private exitGame(): void {
        this.dismiss(true);
    }
}
