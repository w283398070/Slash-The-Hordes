export class GameTimer {
    private targetDelay: number; // 目标延迟时间
    private currentDelay = 0; // 当前延迟时间

    public constructor(targetDelay: number) {
        this.targetDelay = targetDelay; // 设置目标延迟时间
    }

    // 游戏每帧调用的方法
    public gameTick(deltaTime: number): void {
        this.currentDelay += deltaTime; // 增加当前延迟时间
    }

    // 尝试完成一个周期
    public tryFinishPeriod(): boolean {
        if (this.targetDelay <= this.currentDelay) {
            this.currentDelay = 0; // 重置当前延迟时间
            return true; // 返回完成周期
        } else {
            return false; // 返回未完成周期
        }
    }
}
