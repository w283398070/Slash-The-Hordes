
import { _decorator, Component, Node } from "cc";
import { AudioAssets } from "./AudioAssets";
import { MetaUpgradeIcons } from "./MetaUpgradeIcons";
import { UpgradeIcons } from "./UpgradeIcons";
const { ccclass, property } = _decorator;

/**
 * 游戏资源管理类
 * 统一管理游戏中的各类资源，包括升级图标、元升级图标和音频资源
 */
@ccclass("GameAssets")
export class GameAssets extends Component {
    /** 普通升级图标管理器 */
    @property(UpgradeIcons) 
    private upgradeIcons: UpgradeIcons;

    /** 元升级图标管理器 */
    @property(MetaUpgradeIcons) 
    private metaUpgradeIcons: MetaUpgradeIcons;

    /** 音频资源管理器 */
    @property(AudioAssets) 
    private audioAssets: AudioAssets;

    /**
     * 初始化游戏资源
     * 调用各个资源管理器的初始化方法
     */
    public init(): void {
        this.upgradeIcons.init();
        this.metaUpgradeIcons.init();
    }

    /** 获取普通升级图标管理器 */
    public get UpgradeIcons(): UpgradeIcons {
        return this.upgradeIcons;
    }

    /** 获取元升级图标管理器 */
    public get MetaUpgradeIcons(): MetaUpgradeIcons {
        return this.metaUpgradeIcons;
    }

    /** 获取音频资源管理器 */
    public get AudioAssets(): AudioAssets {
        return this.audioAssets;
    }
}
