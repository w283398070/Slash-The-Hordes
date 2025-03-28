import { Animation, Vec3, _decorator } from "cc";
import { Enemy } from "./Enemy";
const { ccclass, property } = _decorator;

@ccclass("AnimatedEnemy")
export class AnimatedEnemy extends Enemy {
    @property(Animation) private animation: Animation;

    private isAnimatingIdle = false;

    // 每帧调用的方法
    public gameTick(move: Vec3, deltaTime: number): void {
        super.gameTick(move, deltaTime);

        console.log("Move x:  " + move.x + " Move y:  " + move.y);

        if (move.x === 0 && move.y === 0) {
            this.animateIdle();
        } else {
            this.animateRun();
        }
    }

    // 播放待机动画
    private animateIdle(): void {
        if (this.isAnimatingIdle) return;
        this.isAnimatingIdle = true;

        this.animation.play("Idle");
    }

    // 播放跑步动画
    private animateRun(): void {
        if (!this.isAnimatingIdle) return;
        this.isAnimatingIdle = false;

        this.animation.play("Run");
    }
}
