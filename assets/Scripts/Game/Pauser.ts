export class Pauser {
    private isPaused = false; // 是否暂停

    // 获取是否暂停
    public get IsPaused(): boolean {
        return this.isPaused;
    }

    // 暂停
    public pause(): void {
        this.isPaused = true;
    }

    // 恢复
    public resume(): void {
        this.isPaused = false;
    }
}
