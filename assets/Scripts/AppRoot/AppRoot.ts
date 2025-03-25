
import { Camera, Component, director, instantiate, JsonAsset, Prefab, _decorator } from "cc";
import { GameSettings } from "../Game/Data/GameSettings";
import { GameAssets } from "../Game/Data/Assets/GameAssets";
import { TranslationData } from "../Game/Data/TranslationData";
import { UserData } from "../Game/Data/UserData";
import { AudioPlayer } from "../Services/AudioPlayer/AudioPlayer";
import { SaveSystem } from "./SaveSystem";
import { ModalWindowManager } from "../Services/ModalWindowSystem/ModalWindowManager";
import { OpenCloseAnimator } from "../Utils/OpenCloseAnimator";
import { Y8 } from "../../Plugins/Y8/Scripts/Y8";
import { Analytics } from "./Analytics";
const { ccclass, property } = _decorator;

/**
 * 应用程序根组件
 * 负责管理全局单例和核心系统
 */
@ccclass("AppRoot")
export class AppRoot extends Component {
    // 组件属性绑定
    @property(AudioPlayer) private audio: AudioPlayer; // 音频播放器
    @property(JsonAsset) private settingsAsset: JsonAsset; // 游戏设置配置文件
    @property(JsonAsset) private engTranslationAsset: JsonAsset; // 英文翻译文件
    @property(Prefab) private gameAssetsPrefab: Prefab; // 游戏资源预制体
    @property(Camera) private mainCamera: Camera; // 主摄像机
    @property(ModalWindowManager) private modalWindowManager: ModalWindowManager; // 模态窗口管理器
    @property(OpenCloseAnimator) private screenFader: OpenCloseAnimator; // 屏幕淡入淡出动画
    @property(Y8) private y8: Y8; // Y8平台集成

    private static instance: AppRoot; // 单例实例
    private saveSystem: SaveSystem; // 存档系统
    private liveUserData: UserData; // 当前用户数据
    private gameAssets: GameAssets; // 游戏资源管理器
    private analytics: Analytics; // 分析系统

    /**
     * 获取AppRoot单例实例
     */
    public static get Instance(): AppRoot {
        return this.instance;
    }

    /**
     * 获取音频播放器
     */
    public get AudioPlayer(): AudioPlayer {
        return this.audio;
    }

    /**
     * 获取游戏资源管理器
     */
    public get GameAssets(): GameAssets {
        return this.gameAssets;
    }

    /**
     * 获取当前用户数据
     */
    public get LiveUserData(): UserData {
        return this.liveUserData;
    }

    /**
     * 获取游戏设置
     */
    public get Settings(): GameSettings {
        return <GameSettings>this.settingsAsset.json;
    }

    /**
     * 获取翻译数据
     */
    public get TranslationData(): TranslationData {
        return <TranslationData>this.engTranslationAsset.json;
    }

    /**
     * 获取模态窗口管理器
     */
    public get ModalWindowManager(): ModalWindowManager {
        return this.modalWindowManager;
    }

    /**
     * 获取主摄像机
     */
    public get MainCamera(): Camera {
        return this.mainCamera;
    }

    /**
     * 获取屏幕淡入淡出动画控制器
     */
    public get ScreenFader(): OpenCloseAnimator {
        return this.screenFader;
    }

    /**
     * 获取Y8平台集成实例
     */
    public get Y8(): Y8 {
        return this.y8;
    }

    /**
     * 获取分析系统
     */
    public get Analytics(): Analytics {
        return this.analytics;
    }

    /**
     * 保存用户数据
     */
    public saveUserData(): void {
        this.saveSystem.save(this.liveUserData);
    }

    /**
     * 组件启动时的初始化
     */
    public start(): void {
        if (AppRoot.Instance == null) {
            AppRoot.instance = this;
            director.addPersistRootNode(this.node); // 设置为常驻节点
            this.init();
        } else {
            this.node.destroy(); // 防止重复实例
        }
    }

    /**
     * 每帧更新
     * @param deltaTime 帧时间差
     */
    public update(deltaTime: number): void {
        if (this.analytics) this.analytics.update(deltaTime);
    }

    /**
     * 初始化应用程序
     */
    private async init(): Promise<void> {
        this.saveSystem = new SaveSystem(); // 初始化存档系统
        this.liveUserData = this.saveSystem.load(); // 加载用户数据

        // 初始化游戏资源
        const gameAssetsNode = instantiate(this.gameAssetsPrefab);
        gameAssetsNode.setParent(this.node);
        this.gameAssets = gameAssetsNode.getComponent(GameAssets);
        this.gameAssets.init();

        // 初始化音频系统
        this.audio.init(this.LiveUserData.soundVolume, this.LiveUserData.musicVolume);

        // 初始化屏幕淡入淡出效果
        this.screenFader.init();
        this.screenFader.node.active = false;

        // 初始化Y8平台集成
        await this.y8.init();

        // 初始化分析系统
        this.analytics = new Analytics(this.y8);
    }
}
