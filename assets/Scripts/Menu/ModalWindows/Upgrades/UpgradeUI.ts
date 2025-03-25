import { Component, instantiate, Label, Node, Prefab, Sprite, _decorator } from "cc";
import { AppRoot } from "../../../AppRoot/AppRoot";
import { MetaUpgradeSettings } from "../../../Game/Data/GameSettings";
import { TranslationData } from "../../../Game/Data/TranslationData";
import { MetaUpgradeType } from "../../../Game/Upgrades/UpgradeType";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { Signal } from "../../../Services/EventSystem/Signal";
import { UIButton } from "../../../Services/UI/Button/UIButton";
import { formatString } from "../../../Services/Utils/StringUtils";
import { UpgradeLevelPointUI } from "./UpgradeLevelPointUI";
const { ccclass, property } = _decorator;

@ccclass("UpgradeUI")
export class UpgradeUI extends Component {
    @property(Prefab) private levelPointPrefab: Prefab; // 等级点预制件
    @property(Node) private levelPointsParent: Node; // 等级点父节点
    @property(Label) private title: Label; // 标题标签
    @property(Label) private description: Label; // 描述标签
    @property(Label) private cost: Label; // 花费标签
    @property(Label) private maxLevel: Label; // 最大等级标签
    @property(Sprite) private icon: Sprite; // 图标

    @property(UIButton) private uiButton: UIButton; // UI按钮

    private interactedEvent = new Signal<MetaUpgradeType>(); // 交互事件信号

    private upgradeType: MetaUpgradeType; // 升级类型
    private upgradeSettings: MetaUpgradeSettings; // 升级设置
    private translationData: TranslationData; // 翻译数据

    private levelPointUIs: UpgradeLevelPointUI[] = []; // 等级点UI数组

    // 初始化方法
    public init(upgradeType: MetaUpgradeType, upgradeSettings: MetaUpgradeSettings, level: number, translationData: TranslationData): void {
        this.upgradeType = upgradeType;
        this.upgradeSettings = upgradeSettings;
        this.translationData = translationData;

        this.icon.spriteFrame = AppRoot.Instance.GameAssets.MetaUpgradeIcons.getIcon(upgradeType); // 设置图标
        this.title.string = `${translationData[`${upgradeType}_TITLE`]}`; // 设置标题
        this.uiButton.InteractedEvent.on(() => this.interactedEvent.trigger(upgradeType), this); // 监听按钮交互事件

        for (let i = 0; i < this.upgradeSettings.bonuses.length; i++) {
            const node: Node = instantiate(this.levelPointPrefab); // 实例化等级点预制件
            node.setParent(this.levelPointsParent); // 设置父节点

            const levelPointUI = node.getComponent(UpgradeLevelPointUI); // 获取等级点UI组件
            levelPointUI.init(); // 初始化等级点UI

            this.levelPointUIs.push(levelPointUI); // 添加到数组
        }

        this.updateLevel(level); // 更新等级
    }

    // 更新等级
    public updateLevel(level: number): void {
        for (let i = 0; i < this.levelPointUIs.length; i++) {
            if (i < level) {
                this.levelPointUIs[i].upgrade(); // 升级等级点
            }
        }

        if (level < this.upgradeSettings.bonuses.length) {
            this.maxLevel.node.active = false; // 隐藏最大等级标签
            this.description.string = formatString(`${this.translationData[`${this.upgradeType}_DESC`]}`, [
                this.upgradeSettings.bonuses[level].toString()
            ]); // 设置描述
            this.cost.string = this.upgradeSettings.costs[level].toString(); // 设置花费
        } else {
            // 达到最大等级
            this.maxLevel.node.active = true; // 显示最大等级标签
            this.cost.node.active = false; // 隐藏花费标签
            this.description.node.active = false; // 隐藏描述标签
        }
    }

    // 获取交互事件
    public get InteractedEvent(): ISignal<MetaUpgradeType> {
        return this.interactedEvent;
    }
}
