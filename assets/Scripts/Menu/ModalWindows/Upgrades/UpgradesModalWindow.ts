import { AudioClip, instantiate, Label, Node, Prefab, _decorator } from "cc";
import { AppRoot } from "../../../AppRoot/AppRoot";
import { MetaUpgradeSettings } from "../../../Game/Data/GameSettings";
import { MetaUpgradesData, UserData } from "../../../Game/Data/UserData";
import { MetaUpgradeType } from "../../../Game/Upgrades/UpgradeType";
import { ModalWindow } from "../../../Services/ModalWindowSystem/ModalWindow";
import { UpgradeUI } from "./UpgradeUI";

const { ccclass, property } = _decorator;

@ccclass("UpgradesModalWindow")
export class UpgradesModalWindow extends ModalWindow<Empty, Empty> {
    @property(Prefab) private upgradeButtonPrefab: Prefab; // 升级按钮预制件
    @property(Node) private upgradeButtonParent: Node; // 升级按钮父节点
    @property(Label) private goldCoinsLabel: Label; // 金币标签
    @property(AudioClip) private upgradeAudioClip: AudioClip; // 升级音效

    private typeToLevel = new Map<MetaUpgradeType, number>(); // 升级类型到当前等级的映射
    private typeToCosts = new Map<MetaUpgradeType, number[]>(); // 升级类型到花费的映射
    private typeToLevelKey = new Map<MetaUpgradeType, keyof MetaUpgradesData>(); // 升级类型到等级键的映射
    private typeToUpgradeUI = new Map<MetaUpgradeType, UpgradeUI>(); // 升级类型到升级UI的映射

    private userData: UserData; // 用户数据

    public setup(): void {
        this.userData = AppRoot.Instance.LiveUserData;
        const settings = AppRoot.Instance.Settings.metaUpgrades;

        this.createUpgradeButton(MetaUpgradeType.Health, settings.health, "healthLevel");
        this.createUpgradeButton(MetaUpgradeType.OverallDamage, settings.overallDamage, "overallDamageLevel");
        this.createUpgradeButton(MetaUpgradeType.ProjectilePiercing, settings.projectilePiercing, "projectilePiercingLevel");
        this.createUpgradeButton(MetaUpgradeType.MovementSpeed, settings.movementSpeed, "movementSpeedLevel");
        this.createUpgradeButton(MetaUpgradeType.XPGatherer, settings.xpGatherer, "xpGathererLevel");
        this.createUpgradeButton(MetaUpgradeType.GoldGatherer, settings.goldGatherer, "goldGathererLevel");

        this.goldCoinsLabel.string = this.userData.game.goldCoins.toString(); // 更新金币标签
    }

    private createUpgradeButton<T extends keyof MetaUpgradesData>(
        upgradeType: MetaUpgradeType,
        upgradeSettings: MetaUpgradeSettings,
        levelKey: T
    ): void {
        const upgradeButton: Node = instantiate(this.upgradeButtonPrefab); // 实例化升级按钮预制件
        const upgradeUI: UpgradeUI = upgradeButton.getComponent(UpgradeUI); // 获取升级UI组件

        upgradeUI.init(upgradeType, upgradeSettings, this.userData.game.metaUpgrades[levelKey], AppRoot.Instance.TranslationData);
        upgradeUI.InteractedEvent.on(this.tryUpgrade, this); // 监听升级按钮点击事件
        upgradeButton.setParent(this.upgradeButtonParent); // 将升级按钮设置为父节点的子节点

        this.typeToLevel.set(upgradeType, this.userData.game.metaUpgrades[levelKey]); // 设置当前等级
        this.typeToCosts.set(upgradeType, upgradeSettings.costs); // 设置升级花费
        this.typeToLevelKey.set(upgradeType, levelKey); // 设置等级键
        this.typeToUpgradeUI.set(upgradeType, upgradeUI); // 设置升级UI
    }

    private tryUpgrade(upgradeType: MetaUpgradeType): void {
        console.log("Trying to upgrade " + upgradeType);

        const costs: number[] = this.typeToCosts.get(upgradeType);
        const currentLevel: number = this.typeToLevel.get(upgradeType);

        if (costs.length <= currentLevel) return; // 已达到最大等级
        if (this.userData.game.goldCoins < costs[currentLevel]) return; // 金币不足

        AppRoot.Instance.AudioPlayer.playSound(this.upgradeAudioClip); // 播放升级音效

        this.userData.game.goldCoins -= costs[currentLevel]; // 扣除金币
        const level = ++this.userData.game.metaUpgrades[this.typeToLevelKey.get(upgradeType)]; // 增加当前等级
        this.typeToUpgradeUI.get(upgradeType).updateLevel(level); // 更新升级UI
        this.typeToLevel.set(upgradeType, level); // 设置当前等级

        this.goldCoinsLabel.string = this.userData.game.goldCoins.toString(); // 更新金币标签
        AppRoot.Instance.saveUserData(); // 保存用户数据
    }
}

export class Empty {}
