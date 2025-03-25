import { Animation, Vec3, _decorator } from "cc";
import { Item } from "./Item";

const { ccclass, property } = _decorator;

@ccclass("XP")
export class XP extends Item {
    @property(Animation) private animation: Animation;

    // 设置物品位置并激活
    public setup(position: Vec3): void {
        super.setup(position);
        // 播放掉落动画
        this.animation.play("DropStart");
    }
}
