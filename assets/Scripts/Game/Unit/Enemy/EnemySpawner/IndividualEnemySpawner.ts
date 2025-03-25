import { randomRange } from "cc";
import { GameTimer } from "../../../../Services/GameTimer";
import { randomPositiveOrNegative } from "../../../../Services/Utils/MathUtils";
import { IndividualEnemySpawnerSettings } from "../../../Data/GameSettings";
import { DelayedEnemySpawner } from "./DelayedEnemySpawner";
import { EnemySpawner } from "./EnemySpawner";

export class IndividualEnemySpawner extends DelayedEnemySpawner {
    // 生成计时器
    private spawnTimer: GameTimer;
    // 敌人ID
    private enemyId: string;

    public constructor(private enemySpawner: EnemySpawner, settings: IndividualEnemySpawnerSettings) {
        super(settings.common.startDelay, settings.common.stopDelay);

        this.spawnTimer = new GameTimer(settings.common.cooldown);
        this.enemyId = settings.common.enemyId;
    }

    // 延迟生成敌人
    public delayedGameTick(deltaTime: number): void {
        this.spawnTimer.gameTick(deltaTime);
        if (this.spawnTimer.tryFinishPeriod()) {
            const posX: number = randomRange(300, 600) * randomPositiveOrNegative();
            const posY: number = randomRange(300, 600) * randomPositiveOrNegative();
            this.enemySpawner.spawnNewEnemy(posX, posY, this.enemyId);
        }
    }
}
