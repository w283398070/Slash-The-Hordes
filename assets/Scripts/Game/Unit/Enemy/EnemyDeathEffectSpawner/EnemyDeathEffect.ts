import { _decorator, Component, Animation, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("EnemyDeathEffect")
export class EnemyDeathEffect extends Component {
    @property(Animation) private animation: Animation;

    // 设置效果位置并激活
    public setup(worldPosition: Vec3): void {
        this.node.setWorldPosition(worldPosition);
        this.node.active = true;

        // 播放死亡效果动画
        this.animation.play("DeathEffect");
    }
}
