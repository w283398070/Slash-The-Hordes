import { Node, Vec3 } from "cc";
import { getDirection } from "../../Services/Utils/VecUtils";
import { Item } from "./Item";

export class ItemAttractor {
    // 被吸引的物品数组
    private items: Item[] = [];
    // 物品的速度值数组
    private speedValues: number[] = [];

    // 构造函数，接受玩家节点和每秒速度增加值作为参数
    public constructor(private playerNode: Node, private speedIncreasePerSecond: number) {}

    // 游戏每帧调用的方法
    public gameTick(deltaTime: number): void {
        for (let i = 0; i < this.items.length; i++) {
            // 获取物品到玩家的方向
            const direction: Vec3 = getDirection(this.playerNode.worldPosition, this.items[i].node.worldPosition);
            const position = this.items[i].node.worldPosition.clone();
            // 更新物品位置
            position.x += direction.x * this.speedValues[i] * deltaTime;
            position.y += direction.y * this.speedValues[i] * deltaTime;

            this.items[i].node.setWorldPosition(position);
            // 增加物品速度
            this.speedValues[i] += this.speedIncreasePerSecond * deltaTime;
        }
    }

    // 添加物品到吸引列表
    public addItem(item: Item): void {
        if (this.items.includes(item)) return;

        // 监听物品的拾取事件
        item.PickupEvent.on(this.removeItem, this);

        this.items.push(item);
        this.speedValues.push(0);
    }

    // 从吸引列表中移除物品
    private removeItem(item: Item): void {
        item.PickupEvent.off(this.removeItem);

        const index = this.items.indexOf(item);

        this.items.splice(index, 1);
        this.speedValues.splice(index, 1);
    }
}
