import { MenuModalWindowTypes } from "../../Menu/ModalWindows/MenuModalWindowTypes";
import { Empty } from "../../Menu/ModalWindows/Upgrades/UpgradesModalWindow";
import { ModalWindowManager } from "../../Services/ModalWindowSystem/ModalWindowManager";
import { TranslationData } from "../Data/TranslationData";
import { Game } from "../Game";
import { Pauser } from "../Pauser";
import { LevelUpModalWindowParams } from "../UI/LevelUpWindow/LevelUpModalWindow";
import { Player } from "../Unit/Player/Player";
import { Upgrader } from "../Upgrades/Upgrader";
import { UpgradeType } from "../Upgrades/UpgradeType";
import { GameModalWindowTypes } from "./GameModalWindowTypes";

export class GameModalLauncher {
    public constructor(
        private modalWindowManager: ModalWindowManager,
        private player: Player,
        private gamePauser: Pauser,
        private upgrader: Upgrader,
        private translationData: TranslationData
    ) {
        // 监听玩家升级事件，显示升级窗口
        this.player.Level.LevelUpEvent.on(this.showLevelUpModal, this);
    }

    // 显示升级窗口
    private async showLevelUpModal(): Promise<void> {
        this.gamePauser.pause();
        const skillToUpgrade: UpgradeType = await this.modalWindowManager.showModal<LevelUpModalWindowParams, UpgradeType>(
            GameModalWindowTypes.LevelUp,
            { availableUpgrades: Array.from(this.upgrader.getAvailableUpgrades()), translationData: this.translationData }
        );
        this.upgrader.upgradeSkill(skillToUpgrade);
        this.gamePauser.resume();
    }

    // 显示宝箱窗口
    public async showChestModal(): Promise<void> {
        this.gamePauser.pause();
        const skillToUpgrade: UpgradeType = await this.modalWindowManager.showModal<LevelUpModalWindowParams, UpgradeType>(
            GameModalWindowTypes.Chest,
            { availableUpgrades: Array.from(this.upgrader.getAvailableUpgrades()), translationData: this.translationData }
        );
        this.upgrader.upgradeSkill(skillToUpgrade);
        this.gamePauser.resume();
    }

    // 显示暂停窗口
    public async showPauseModal(): Promise<void> {
        this.gamePauser.pause();
        const shouldExit = await this.modalWindowManager.showModal<ModalWindowManager, boolean>(GameModalWindowTypes.Pause, this.modalWindowManager);

        if (shouldExit) {
            Game.Instance.exitGame();
        } else {
            this.gamePauser.resume();
        }
    }
}
