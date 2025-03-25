import { randomRangeInt, _decorator } from "cc";
import { ModalWindow } from "../../Services/ModalWindowSystem/ModalWindow";
import { UIButton } from "../../Services/UI/Button/UIButton";
import { LevelUpModalWindowParams } from "../UI/LevelUpWindow/LevelUpModalWindow";
import { LevelUpSkill } from "../UI/LevelUpWindow/LevelUpSkill";
import { UpgradeType } from "../Upgrades/UpgradeType";
const { ccclass, property } = _decorator;

@ccclass("ChestModalWindow")
export class ChestModalWindow extends ModalWindow<LevelUpModalWindowParams, UpgradeType> {
    @property(LevelUpSkill) private levelUpSkill: LevelUpSkill;
    @property(UIButton) private okButton: UIButton;

    // 设置窗口参数
    protected setup(params: LevelUpModalWindowParams): void {
        // 随机选择一个可用的升级技能
        const randomIndex = randomRangeInt(0, params.availableUpgrades.length - 1);
        const skillToUpgrade = params.availableUpgrades[randomIndex];
        // 初始化升级技能
        this.levelUpSkill.init(skillToUpgrade, params.translationData);

        // 绑定确定按钮的交互事件
        this.okButton.InteractedEvent.on(() => this.dismiss(skillToUpgrade), this);
    }
}
