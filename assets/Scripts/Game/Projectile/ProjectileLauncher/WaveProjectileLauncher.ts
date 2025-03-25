import { Node, Vec2 } from "cc";
import { Empty } from "../../../Menu/ModalWindows/Upgrades/UpgradesModalWindow";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { GameTimer } from "../../../Services/GameTimer";
import { delay } from "../../../Services/Utils/AsyncUtils";
import { WaveLauncherSettings } from "../../Data/GameSettings";
import { IProjectileLauncherSignaler } from "../IProjectileLauncherSignaler";
import { ProjectileCollision } from "../ProjectileCollision";
import { ProjectileData } from "./ProjectileData";
import { ProjectileLauncher } from "./ProjectileLauncher";

export class WaveProjectileLauncher implements IProjectileLauncherSignaler {
    // 当前升级等级
    private currentUpgrade = 0;
    // 每次升级后的波数
    private wavesToShootPerUpgrade = 0;
    // 发射计时器
    private fireTimer: GameTimer;
    // 要发射的波数
    private wavesToShoot: number;
    // 波之间的延迟时间（毫秒）
    private wavesDelayMs: number;

    public constructor(
        private launcher: ProjectileLauncher,
        private playerNode: Node,
        private directions: Vec2[],
        settings: WaveLauncherSettings,
        projectileData: ProjectileData
    ) {
        this.wavesToShootPerUpgrade = settings.wavesToShootPerUpgrade;

        this.fireTimer = new GameTimer(settings.launcher.cooldown);
        this.wavesToShoot = settings.launcher.wavesToShoot;
        this.wavesDelayMs = settings.launcher.wavesDelayMs;

        launcher.init(settings.launcher.projectileLifetime, settings.launcher.projectileSpeed, projectileData.damage, projectileData.pierces);
    }

    // 获取投射物碰撞事件信号
    public get ProjectileCollisionEvent(): ISignal<ProjectileCollision> {
        return this.launcher.ProjectileCollisionEvent;
    }

    // 获取投射物发射事件信号
    public get ProjectileLaunchedEvent(): ISignal {
        return this.launcher.ProjectileLaunchedEvent;
    }

    // 游戏每帧调用的方法
    public gameTick(deltaTime: number): void {
        if (this.currentUpgrade == 0) return;

        this.launcher.gameTick(deltaTime);
        this.fireTimer.gameTick(deltaTime);

        if (this.fireTimer.tryFinishPeriod()) {
            this.fireProjectiles();
        }
    }

    // 升级方法
    public upgrade(): void {
        this.currentUpgrade++;
        this.wavesToShoot += this.wavesToShootPerUpgrade;
    }

    // 发射投射物
    private async fireProjectiles(): Promise<void> {
        for (let i = 0; i < this.wavesToShoot; i++) {
            this.launcher.fireProjectiles(this.playerNode.worldPosition, this.directions);

            await delay(this.wavesDelayMs);
        }
    }
}
