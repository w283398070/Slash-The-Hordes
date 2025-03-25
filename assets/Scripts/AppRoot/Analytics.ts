
import { Y8 } from "../../Plugins/Y8/Scripts/Y8";

/**
 * 数据分析类
 * 用于收集和发送游戏中的各种统计数据
 */
export class Analytics {
    // 总游戏时间（秒）
    private totalTime = 0;
    // 游戏分钟数统计（从0开始）
    private minutesInGame = -1; // 跟踪0分钟
    // 当前会话中的游戏次数
    private gamesPerSession = 0;

    /**
     * 构造函数
     * @param y8 Y8分析平台实例
     */
    public constructor(private y8: Y8) {}

    /**
     * 更新统计信息
     * @param deltaTime 自上次更新以来的时间间隔（秒）
     */
    public update(deltaTime: number): void {
        this.totalTime += deltaTime;
        this.trySendTotalTime();
    }

    /**
     * 游戏开始时调用
     * 记录并发送当前会话中的游戏次数
     */
    public gameStart(): void {
        this.y8.sendCustomEvent(EventName.GAMES_PER_SESSION, ++this.gamesPerSession);
    }

    /**
     * 游戏结束时调用
     * @param time 本次游戏时长（秒）
     */
    public gameEnd(time: number): void {
        this.y8.sendCustomEvent(EventName.GAME_TIME, Math.floor(time));
    }

    /**
     * 游戏退出时调用
     * @param time 本次游戏时长（秒）
     */
    public gameExit(time: number): void {
        this.y8.sendCustomEvent(EventName.GAME_EXIT, Math.floor(time));
    }

    /**
     * 记录每次游戏获得的金币数量
     * @param goldEarned 本次游戏获得的金币数量
     */
    public goldPerRun(goldEarned: number): void {
        this.y8.sendCustomEvent(EventName.GOLD_PER_RUN, Math.floor(goldEarned));
    }

    /**
     * 尝试发送总游戏时间
     * 每当游戏时间达到新的整分钟时发送事件
     */
    private trySendTotalTime(): void {
        if (this.minutesInGame < Math.floor(this.totalTime / 60)) {
            this.y8.sendCustomEvent(EventName.TOTAL_TIME, ++this.minutesInGame);
        }
    }
}

/**
 * 事件名称枚举
 * 用于标识不同类型的数据分析事件
 */
enum EventName {
    TOTAL_TIME = "Minutes_total_v0.2", // 总游戏时间（分钟）
    GOLD_PER_RUN = "Gold_per_run_v0.2", // 每次游戏获得的金币
    GAMES_PER_SESSION = "Games_per_session_v0.2", // 当前会话中的游戏次数
    GAME_TIME = "Game_time_seconds_v0.2", // 单次游戏时长（秒）
    GAME_EXIT = "Game_exit_v0.2" // 游戏退出事件
}
