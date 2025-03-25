/* eslint-disable @typescript-eslint/no-explicit-any */

// 信号接口
export interface ISignal<T = void> {
    // 添加事件处理程序
    on(handler: (data?: T) => void, thisArg: any): void;
    
    // 移除事件处理程序
    off(handler: (data?: T) => void): void;
}
