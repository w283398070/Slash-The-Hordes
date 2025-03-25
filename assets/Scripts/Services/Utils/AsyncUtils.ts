/**
 * 延迟指定的毫秒数
 * @param ms 延迟的毫秒数
 * @returns 返回一个Promise，在指定时间后解析
 */
export async function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
