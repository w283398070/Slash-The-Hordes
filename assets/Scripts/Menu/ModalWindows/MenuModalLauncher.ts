import { ModalWindowManager } from "../../Services/ModalWindowSystem/ModalWindowManager";
import { MenuModalWindowTypes } from "./MenuModalWindowTypes";

export class MenuModalLauncher {
    public constructor(private modalWindowManager: ModalWindowManager) {}

    // 打开升级窗口
    public async openUpgradesWindow(): Promise<void> {
        await this.modalWindowManager.showModal(MenuModalWindowTypes.Upgrades, {});
    }

    // 打开音频设置窗口
    public async openAudioSettingsWindow(): Promise<void> {
        await this.modalWindowManager.showModal(MenuModalWindowTypes.AudioSettings, {});
    }
}
