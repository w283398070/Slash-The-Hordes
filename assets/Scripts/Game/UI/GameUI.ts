
import { Component, Label, ProgressBar, _decorator } from "cc";
import { UIButton } from "../../Services/UI/Button/UIButton";
import { GameResult } from "../Game";
import { ItemManager } from "../Items/ItemManager";
import { ItemType } from "../Items/ItemType";
import { GameModalLauncher } from "../ModalWIndows/GameModalLauncher";
import { Player } from "../Unit/Player/Player";
import { UnitLevel } from "../Unit/UnitLevel";

const { ccclass, property } = _decorator;

/**
 * 游戏界面UI管理类
 * 负责管理和更新游戏中的各种UI元素
 */
@ccclass("GameUI")
export class GameUI extends Component {
    // UI组件引用
    @property(ProgressBar) private xpBar: ProgressBar; // 经验值进度条
    @property(Label) private timeAliveText: Label; // 存活时间文本
    @property(Label) private goldLabel: Label; // 金币数量文本
    @property(UIButton) private pauseBtn: UIButton; // 暂停按钮

    // 游戏系统引用
    private playerLevel: UnitLevel; // 玩家等级系统
    private modalLauncher: GameModalLauncher; // 模态窗口启动器
    private gameResult: GameResult; // 游戏结果数据

    /**
     * 初始化游戏UI
     * @param player 玩家实例
     * @param modalLauncher 模态窗口启动器
     * @param itemManager 物品管理器
     * @param gameResult 游戏结果数据
     */
    public init(player: Player, modalLauncher: GameModalLauncher, itemManager: ItemManager, gameResult: GameResult): void {
        // 保存系统引用
        this.playerLevel = player.Level;
        this.modalLauncher = modalLauncher;
        this.gameResult = gameResult;

        // 注册经验值相关事件
        this.playerLevel.XpAddedEvent.on(this.updateProgressBar, this);
        this.playerLevel.LevelUpEvent.on(this.updateProgressBar, this);

        // 注册物品拾取事件
        itemManager.PickupEvent.on(this.tryUpdateGoldLabel, this);

        // 初始化经验值进度条
        this.xpBar.progress = 0;

        // 注册暂停按钮点击事件
        this.pauseBtn.InteractedEvent.on(this.showPauseWindow, this);
    }

    /**
     * 更新经验值进度条
     * 根据当前经验值和升级所需经验值计算进度
     */
    private updateProgressBar(): void {
        this.xpBar.progress = this.playerLevel.XP / this.playerLevel.RequiredXP;
    }

    /**
     * 尝试更新金币数量显示
     * 只有在拾取金币时才会更新
     * @param itemType 拾取的物品类型
     */
    private tryUpdateGoldLabel(itemType: ItemType): void {
        if (itemType !== ItemType.Gold) return;

        this.goldLabel.string = this.gameResult.goldCoins.toString();
    }

    /**
     * 显示暂停窗口
     */
    private showPauseWindow(): void {
        console.log("Show pause window");
        this.modalLauncher.showPauseModal();
    }

    /**
     * 更新存活时间显示
     * @param timeAlive 存活时间（秒）
     */
    public updateTimeAlive(timeAlive: number): void {
        this.timeAliveText.string = `${Math.floor(timeAlive)}`;
    }
}
