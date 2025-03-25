import { Component, instantiate, Node, Prefab, _decorator } from "cc";
import { ModalWindow } from "./ModalWindow";
const { ccclass, property } = _decorator;

@ccclass("ModalWindowManager")
export class ModalWindowManager extends Component {
    @property(Prefab) private availableWindows: Prefab[] = []; // 可用窗口的预制件数组

    // 显示模态窗口
    public async showModal<TParams, TResult>(name: string, params: TParams): Promise<TResult> {
        const windowPrefab: Prefab = this.availableWindows.find((w) => w.name === name); // 查找窗口预制件
        const windowNode: Node = instantiate(windowPrefab); // 实例化窗口节点
        windowNode.setParent(this.node); // 将窗口节点设置为当前节点的子节点

        const modalWindow: ModalWindow<TParams, TResult> = <ModalWindow<TParams, TResult>>windowNode.getComponent(name); // 获取模态窗口组件
        const result: TResult = await modalWindow.runAsync(params); // 运行模态窗口
        windowNode.destroy(); // 销毁窗口节点

        return result; // 返回结果
    }
}
