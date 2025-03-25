import { Component, _decorator } from "cc";
import { UnitHealth } from "../../UnitHealth";
import { PlayerHealthUI } from "./PlayerHealthUI";
const { ccclass, property } = _decorator;

@ccclass("PlayerUI")
export class PlayerUI extends Component {
    @property(PlayerHealthUI) private healthUI: PlayerHealthUI; // 玩家生命值UI组件

    // 初始化方法
    public init(playerHealth: UnitHealth): void {
        this.healthUI.init(playerHealth); // 初始化玩家生命值UI组件
    }
}
