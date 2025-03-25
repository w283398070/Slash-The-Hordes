import { CCInteger, Component, _decorator } from "cc";
import { AppRoot } from "../AppRoot/AppRoot";
import { GameRunner } from "../Menu/GameRunner";
import { delay } from "../Services/Utils/AsyncUtils";
import { GameSettings, ISpawner } from "./Data/GameSettings";
import { UserData } from "./Data/UserData";
import { Game } from "./Game";
const { ccclass, property } = _decorator;

@ccclass("TestGameRunner")
export class TestGameRunner extends Component {
    @property(CCInteger) private startTime = 0; // 游戏开始时间
    @property(CCInteger) private startXP = 0; // 游戏开始经验值

    @property(CCInteger) private maxHpLevel = 0; // 最大生命值等级
    @property(CCInteger) private bonusDamageLevel = 0; // 额外伤害等级
    @property(CCInteger) private projectilePiercingLevel = 0; // 弹道穿透等级
    @property(CCInteger) private movementSpeedLevel = 0; // 移动速度等级
    @property(CCInteger) private xpGathererLevel = 0; // 经验值收集等级
    @property(CCInteger) private goldGathererLevel = 0; // 金币收集等级

    public start(): void {
        if (GameRunner.Instance.IsRunning) return; // 如果游戏正在运行，直接返回
        this.playTestGameAsync(); // 启动测试游戏
    }

    public async playTestGameAsync(): Promise<void> {
        while (Game.Instance == null || AppRoot.Instance == null) await delay(100); // 等待游戏和应用根实例初始化

        const testUserData = new UserData();
        testUserData.game.metaUpgrades.healthLevel = this.maxHpLevel;
        testUserData.game.metaUpgrades.overallDamageLevel = this.bonusDamageLevel;
        testUserData.game.metaUpgrades.projectilePiercingLevel = this.projectilePiercingLevel;
        testUserData.game.metaUpgrades.movementSpeedLevel = this.movementSpeedLevel;
        testUserData.game.metaUpgrades.xpGathererLevel = this.xpGathererLevel;
        testUserData.game.metaUpgrades.goldGathererLevel = this.goldGathererLevel;

        const settings = this.getTimeModifiedSettings(AppRoot.Instance.Settings);
        Game.Instance.play(testUserData, settings, AppRoot.Instance.TranslationData, { startTime: this.startTime, startXP: this.startXP });
    }

    private getTimeModifiedSettings(settings: GameSettings): GameSettings {
        const spawners: ISpawner[] = [
            ...settings.enemyManager.circularEnemySpawners,
            ...settings.enemyManager.individualEnemySpawners,
            ...settings.enemyManager.waveEnemySpawners
        ];

        for (const spawner of spawners) {
            spawner.common.startDelay -= this.startTime; // 减少生成器的开始延迟时间
            spawner.common.stopDelay -= this.startTime; // 减少生成器的停止延迟时间
        }

        return settings;
    }
}

export class TestValues {
    public startTime = 0; // 开始时间
    public startXP = 0; // 开始经验值
}
