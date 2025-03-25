import { Animation, Node, BoxCollider2D, Collider2D, Component, Vec2, Vec3, _decorator, Details, Sprite, Color } from "cc";
import { delay } from "../../../Services/Utils/AsyncUtils";
import { IInput } from "../../Input/IInput";
import { UnitHealth } from "../UnitHealth";
import { UnitLevel } from "../UnitLevel";
import { Magnet } from "./Magnet";
import { PlayerRegeneration } from "./PlayerRegeneration";
import { PlayerUI } from "./PlayerUI/PlayerUI";
import { Weapon } from "./Weapon/Weapon";

const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
    @property(BoxCollider2D) private collider: BoxCollider2D; // 玩家碰撞器
    @property(PlayerUI) private playerUI: PlayerUI; // 玩家UI
    @property(Weapon) private weapon: Weapon; // 玩家武器
    @property(Magnet) private magnet: Magnet; // 磁铁
    @property(Node) private playerGraphics: Node; // 玩家图形节点
    @property(Animation) private animation: Animation; // 动画组件
    @property(Sprite) private sprite: Sprite; // 精灵组件

    private input: IInput; // 输入接口
    private health: UnitHealth; // 生命值
    private level: UnitLevel; // 等级
    private regeneration: PlayerRegeneration; // 生命值恢复
    private speed: number; // 移动速度

    private isMoveAnimationPlaying = false; // 是否正在播放移动动画

    // 初始化方法
    public init(input: IInput, data: PlayerData): void {
        this.input = input;
        this.health = new UnitHealth(data.maxHp);
        this.level = new UnitLevel(data.requiredXP, data.xpMultiplier);
        this.regeneration = new PlayerRegeneration(this.health, data.regenerationDelay);
        this.speed = data.speed;

        this.weapon.init(data.strikeDelay, data.damage);
        this.magnet.init(data.magnetDuration);
        this.health.HealthPointsChangeEvent.on(this.animateHpChange, this);
        this.playerUI.init(this.health);
    }

    public get Health(): UnitHealth {
        return this.health;
    }

    public get Level(): UnitLevel {
        return this.level;
    }

    public get Weapon(): Weapon {
        return this.weapon;
    }

    public get Magnet(): Magnet {
        return this.magnet;
    }

    public get Regeneration(): PlayerRegeneration {
        return this.regeneration;
    }

    public get Collider(): Collider2D {
        return this.collider;
    }

    // 游戏每帧调用的方法
    public gameTick(deltaTime: number): void {
        this.move(deltaTime);
        this.weapon.gameTick(deltaTime);
        this.magnet.gameTick(deltaTime);
        this.regeneration.gameTick(deltaTime);
    }

    // 移动方法
    private move(deltaTime: number): void {
        if (!this.health.IsAlive) return;

        const movement: Vec2 = this.input.getAxis();
        if (!movement.equals(Vec2.ZERO)) {
            movement.x *= deltaTime * this.speed;
            movement.y *= deltaTime * this.speed;

            const newPosition: Vec3 = this.node.worldPosition;
            newPosition.x += movement.x;
            newPosition.y += movement.y;

            this.node.setWorldPosition(newPosition);

            if (!this.isMoveAnimationPlaying) {
                this.isMoveAnimationPlaying = true;
                this.animation.play("Move");
            }

            if (movement.x < 0) {
                this.playerGraphics.setScale(new Vec3(1, 1, 1));
            } else if (0 < movement.x) {
                this.playerGraphics.setScale(new Vec3(-1, 1, 1));
            }
        } else {
            if (this.isMoveAnimationPlaying) {
                this.isMoveAnimationPlaying = false;
                this.animation.play("Idle");
            }
        }
    }

    // 动画：生命值变化
    private async animateHpChange(hpChange: number): Promise<void> {
        if (hpChange < 0) {
            this.sprite.color = Color.RED;
        } else {
            this.sprite.color = Color.GREEN;
        }

        await delay(100);
        this.sprite.color = Color.WHITE;

        if (!this.health.IsAlive) {
            this.animation.play("Die");
        }
    }
}

// 玩家数据类
export class PlayerData {
    public requiredXP: number[] = [];
    public speed = 0;
    public maxHp = 0;
    public regenerationDelay = 0;
    public xpMultiplier = 0;
    public goldMultiplier = 0;

    // 武器
    public strikeDelay = 0;
    public damage = 0;

    // 磁铁
    public magnetDuration = 0;
}
