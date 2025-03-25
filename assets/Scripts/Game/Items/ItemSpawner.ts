import { Component, Prefab, Vec3, _decorator } from "cc";
import { ObjectPool } from "../../Services/ObjectPool";
import { Item } from "./Item";

const { ccclass, property } = _decorator;

@ccclass("ItemSpawner")
export class ItemSpawner extends Component {
    // 物品预制件
    @property(Prefab) public itemPrefab: Prefab;

    // 物品对象池
    private itemPool: ObjectPool<Item>;

    // 初始化方法
    public init(): void {
        this.itemPool = new ObjectPool<Item>(this.itemPrefab, this.node, 5, "Item");
    }

    // 生成物品
    public spawn(position: Vec3): void {
        const item: Item = this.itemPool.borrow();
        item.setup(position);
        item.PickupEvent.on(this.return, this);
    }

    // 归还物品到对象池
    private return(item: Item): void {
        item.PickupEvent.off(this.return);
        this.itemPool.return(item);
    }
}
