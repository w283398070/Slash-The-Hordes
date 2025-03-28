
import { approx, Canvas, Component, Label, Node, _decorator } from "cc";
import { AppRoot } from "../AppRoot/AppRoot";
import { requireAppRootAsync } from "../AppRoot/AppRootUtils";
import { MetaUpgradeSettings } from "../Game/Data/GameSettings";
import { MetaUpgradesData } from "../Game/Data/UserData";
import { UIButton } from "../Services/UI/Button/UIButton";
import { GameRunner } from "./GameRunner";
import { MenuModalLauncher } from "./ModalWindows/MenuModalLauncher";

const { ccclass, property } = _decorator;

/**
 * 主菜单界面管理类
 * 负责处理主菜单的UI交互和逻辑
 */
@ccclass("Menu")
export class Menu extends Component {
    // UI组件引用
    @property(UIButton) private playBtn: UIButton; // 开始游戏按钮
    @property(UIButton) private upgradeBtn: UIButton; // 升级按钮
    @property(Node) private upgradeAvailableIndicator: Node; // 可升级提示标志
    @property(Node) private goldCounter: Node; // 金币计数器
    @property(Label) private goldLabel: Label; // 金币数量显示
    @property(UIButton) private audioSettingsBtn: UIButton; // 音频设置按钮
    @property(Canvas) private menuCanvas: Canvas; // 菜单画布
    @property(Label) private highscoreLabel: Label; // 最高分显示

    private menuModalLauncher: MenuModalLauncher; // 菜单模态窗口启动器

    /**
     * 组件启动时的初始化
     */
    public async start(): Promise<void> {
        requireAppRootAsync();
        this.menuCanvas.cameraComponent = AppRoot.Instance.MainCamera;

        // 注册按钮点击事件
        this.playBtn.InteractedEvent.on(this.startGame, this);
        this.upgradeBtn.InteractedEvent.on(this.openUpgradesWindow, this);
        this.audioSettingsBtn.InteractedEvent.on(this.openAudioSettingsWindow, this);

        // 初始化模态窗口启动器
        this.menuModalLauncher = new MenuModalLauncher(AppRoot.Instance.ModalWindowManager);

        // 更新最高分显示
        this.highscoreLabel.string = `Highscore: ${Math.floor(AppRoot.Instance.LiveUserData.game.highscore)}`;

        // 更新金币相关UI
        this.updateGoldIndicators();
    }

    /**
     * 更新金币相关UI显示
     */
    private updateGoldIndicators(): void {
        // 更新可升级提示标志
        this.upgradeAvailableIndicator.active = this.isUpgradeAffordable();

        // 更新金币数量和显示状态
        const goldCoins = AppRoot.Instance.LiveUserData.game.goldCoins;
        this.goldCounter.active = 0 < goldCoins;
        this.goldLabel.string = goldCoins.toString();
    }

    /**
     * 判断是否有可负担的升级
     * @returns 如果有可负担的升级返回true，否则返回false
     */
    private isUpgradeAffordable(): boolean {
        const goldCoins: number = AppRoot.Instance.LiveUserData.game.goldCoins;
        const metaUpgrades: MetaUpgradesData = AppRoot.Instance.LiveUserData.game.metaUpgrades;

        const metaUpgradesSettings = AppRoot.Instance.Settings.metaUpgrades;

        // 收集所有可升级项的最低成本
        const costs: number[] = [];
        this.tryPushLowestCost(metaUpgrades.goldGathererLevel, metaUpgradesSettings.goldGatherer, costs);
        this.tryPushLowestCost(metaUpgrades.healthLevel, metaUpgradesSettings.health, costs);
        this.tryPushLowestCost(metaUpgrades.movementSpeedLevel, metaUpgradesSettings.movementSpeed, costs);
        this.tryPushLowestCost(metaUpgrades.overallDamageLevel, metaUpgradesSettings.overallDamage, costs);
        this.tryPushLowestCost(metaUpgrades.projectilePiercingLevel, metaUpgradesSettings.projectilePiercing, costs);
        this.tryPushLowestCost(metaUpgrades.xpGathererLevel, metaUpgradesSettings.xpGatherer, costs);
        this.tryPushLowestCost(metaUpgrades.rangLevel, metaUpgradesSettings.rang, costs);

        // 判断是否有可负担的升级
        return 0 < costs.length ? Math.min(...costs) <= goldCoins : false;
    }

    /**
     * 尝试将最低升级成本加入成本数组
     * @param upgradeLevel 当前升级等级
     * @param metaUpgradeSettings 升级设置
     * @param costs 成本数组
     */
    private tryPushLowestCost(upgradeLevel: number, metaUpgradeSettings: MetaUpgradeSettings, costs: number[]): void {
        if (upgradeLevel < metaUpgradeSettings.costs.length) {
            costs.push(metaUpgradeSettings.costs[upgradeLevel]);
        }
    }

    /**
     * 开始游戏
     */
    private startGame(): void {
        AppRoot.Instance.ScreenFader.playOpen(); // 播放屏幕淡出效果
        GameRunner.Instance.playGame(); // 启动游戏
    }

    /**
     * 打开升级窗口
     */
    private async openUpgradesWindow(): Promise<void> {
        await this.menuModalLauncher.openUpgradesWindow(); // 打开升级窗口
        this.updateGoldIndicators(); // 更新金币相关UI
    }

    /**
     * 打开音频设置窗口
     */
    private openAudioSettingsWindow(): void {
        this.menuModalLauncher.openAudioSettingsWindow(); // 打开音频设置窗口
    }
}
