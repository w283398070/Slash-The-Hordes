import { approx, Component, Label, NodeEventType, Sprite, _decorator } from "cc";
import { AppRoot } from "../../../AppRoot/AppRoot";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { Signal } from "../../../Services/EventSystem/Signal";
import { TranslationData } from "../../Data/TranslationData";
import { UpgradeType } from "../../Upgrades/UpgradeType";
const { ccclass, property } = _decorator;

@ccclass("LevelUpSkill")
export class LevelUpSkill extends Component {
    @property(Label) private skillTitle: Label;
    @property(Label) private skillDescription: Label;
    @property(Sprite) private skillIcon: Sprite;
    private chooseSkillEvent: Signal<UpgradeType> = new Signal<UpgradeType>();
    private skillType: UpgradeType;

    // 初始化技能
    public init(skillType: UpgradeType, translationData: TranslationData): void {
        this.skillType = skillType;
        this.skillTitle.string = `${translationData[`${skillType}_TITLE`]}`;
        this.skillDescription.string = `${translationData[`${skillType}_DESC`]}`;
        this.skillIcon.spriteFrame = AppRoot.Instance.GameAssets.UpgradeIcons.getIcon(skillType);
        this.node.on(NodeEventType.TOUCH_START, this.chooseSkill, this);
    }

    // 获取选择技能事件
    public get ChooseSkillEvent(): ISignal<UpgradeType> {
        return this.chooseSkillEvent;
    }

    // 选择技能
    private chooseSkill(): void {
        this.chooseSkillEvent.trigger(this.skillType);
    }
}
