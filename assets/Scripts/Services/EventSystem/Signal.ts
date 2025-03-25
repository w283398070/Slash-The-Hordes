// 需要捕获 *this*
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISignal } from "./ISignal";

export class Signal<T = void> implements ISignal<T> {
    private handlers: ((data: T) => void)[] = [];
    private thisArgs: any[] = [];

    // 添加事件处理程序
    public on(handler: (data: T) => void, thisArg: any): void {
        this.handlers.push(handler);
        this.thisArgs.push(thisArg);
    }

    // 移除事件处理程序
    public off(handler: (data: T) => void): void {
        const index: number = this.handlers.indexOf(handler);
        this.handlers.splice(index, 1);
        this.thisArgs.splice(index, 1);
    }

    // 触发事件
    public trigger(data: T): void {
        // 保护触发 >> 移除
        const handlers: ((data: T) => void)[] = [...this.handlers];
        const thisArgs: any[] = [...this.thisArgs];

        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(thisArgs[i], data);
        }
    }
}
