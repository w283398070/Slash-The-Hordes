
import { director } from "cc";
import { AppRoot } from "../AppRoot/AppRoot";
import { UserData } from "../Game/Data/UserData";
import { Game, GameResult } from "../Game/Game";
import { delay } from "../Services/Utils/AsyncUtils";

/**
 * 游戏运行管理器
 * 负责控制游戏的启动、运行和结束流程
 * 使用单例模式确保全局只有一个实例
 */
export class GameRunner {
    // 单例实例
    private static instance: GameRunner = new GameRunner();

    // 游戏运行状态标志
    private isRunning = false;

    /**
     * 私有构造函数
     * 防止外部直接创建实例
     */
    private constructor() {}

    /**
     * 获取GameRunner单例实例
     */
    public static get Instance(): GameRunner {
        return this.instance;
    }

    /**
     * 获取当前游戏是否正在运行
     */
    public get IsRunning(): boolean {
        return this.isRunning;
    }

    /**
     * 启动并运行游戏
     * 处理游戏的完整生命周期:
     * 1. 加载游戏场景
     * 2. 等待游戏实例初始化
     * 3. 运行游戏并获取结果
     * 4. 更新用户数据
     * 5. 返回主菜单
     */
    public async playGame(): Promise<void> {
        // 设置运行状态
        this.isRunning = true;

        // 加载游戏场景
        director.loadScene("Game");

        // 获取用户数据
        const userData: UserData = AppRoot.Instance.LiveUserData;

        // 等待游戏实例初始化完成
        while (Game.Instance == null) await delay(10);

        // 运行游戏并获取结果
        const result: GameResult = await Game.Instance.play(
            userData, 
            AppRoot.Instance.Settings, 
            AppRoot.Instance.TranslationData
        );

        // 更新金币数量
        userData.game.goldCoins += result.goldCoins;

        // 更新最高分
        if (userData.game.highscore < result.score) {
            userData.game.highscore = result.score;
        }

        // 保存用户数据
        AppRoot.Instance.saveUserData();

        // 返回主菜单场景
        director.loadScene("Menu");

        // 重置运行状态
        this.isRunning = false;
    }
}
