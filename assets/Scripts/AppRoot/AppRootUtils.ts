
import { delay } from "../Services/Utils/AsyncUtils";
import { AppRoot } from "./AppRoot";

/**
 * 异步等待AppRoot实例初始化完成
 * 该函数会持续检查AppRoot实例是否存在，直到实例化完成
 * 同时会调整AppRoot节点的渲染顺序，确保其在最上层显示
 */
export async function requireAppRootAsync(): Promise<void> {
    console.log("Waiting for app root"); // 日志：等待AppRoot初始化
    // 持续检查AppRoot实例是否存在
    while (AppRoot.Instance == null) await delay(10);

    // 调整AppRoot节点的渲染顺序
    AppRoot.Instance.node.setSiblingIndex(1000); // 设置为最高渲染层级
    AppRoot.Instance.node.active = false; // 强制引擎重新排序
    AppRoot.Instance.node.active = true; // 重新激活节点

    console.log("App root ready"); // 日志：AppRoot准备就绪
}
