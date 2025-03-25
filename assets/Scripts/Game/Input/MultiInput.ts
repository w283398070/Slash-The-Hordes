import { Vec2 } from "cc";
import { IInput } from "./IInput";

// MultiInput 类实现了 IInput 接口
export class MultiInput implements IInput {
    // inputs 是一个 IInput 接口数组
    private inputs: IInput[];

    // 构造函数，接受一个 IInput 数组作为参数
    public constructor(inputs: IInput[]) {
        this.inputs = inputs;
    }

    // getAxis 方法返回一个 Vec2 对象
    public getAxis(): Vec2 {
        // 遍历 inputs 数组
        for (let i = 0; i < this.inputs.length; i++) {
            // 如果当前输入的轴不为零，则返回该轴
            if (!this.inputs[i].getAxis().equals(Vec2.ZERO)) {
                return this.inputs[i].getAxis();
            }
        }

        // 如果所有输入的轴都为零，则返回一个新的 Vec2 对象
        return new Vec2();
    }
}
