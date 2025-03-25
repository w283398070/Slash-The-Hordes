export abstract class DelayedEnemySpawner {
    // 当前时间
    private currentTime = 0;

    public constructor(private startDelay: number, private stopDelay: number) {
        // 如果停止延迟为 -1，则设置为最大安全整数
        if (stopDelay === -1) {
            this.stopDelay = Number.MAX_SAFE_INTEGER;
        }
    }

    // 游戏每帧调用的方法
    public gameTick(deltaTime: number): void {
        this.currentTime += deltaTime;
        // 如果当前时间在开始延迟和停止延迟之间，则调用延迟生成方法
        if (this.startDelay <= this.currentTime && this.currentTime <= this.stopDelay) {
            this.delayedGameTick(deltaTime);
        }
    }

    // 抽象方法，延迟生成敌人
    public abstract delayedGameTick(deltaTime: number): void;
}
