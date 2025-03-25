import { _decorator, Component, Node, Vec3, ccenum, Enum } from "cc";
import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";
import { ItemType } from "./ItemType";
const { ccclass, property } = _decorator;

@ccclass("Item")
export class Item extends Component {
    // 物品类型
    @property({ type: Enum(ItemType) }) private itemType: ItemType;

    // 拾取事件信号
    private pickUpEvent = new Signal<Item>();

    // 获取物品类型
    public get ItemType(): ItemType {
        return <ItemType>this.itemType;
    }

    // 设置物品位置并激活
    public setup(position: Vec3): void {
        this.node.setWorldPosition(position);
        this.node.active = true;
    }

    // 获取拾取事件信号
    public get PickupEvent(): ISignal<Item> {
        return this.pickUpEvent;
    }

    // 拾取物品
    public pickup(): void {
        // 触发拾取事件
        this.pickUpEvent.trigger(this);
        // 禁用物品节点
        this.node.active = false;
    }
}
