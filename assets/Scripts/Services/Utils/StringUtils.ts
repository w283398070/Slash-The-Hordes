/**
 * 格式化字符串
 * @param text 要格式化的字符串，包含占位符如 {0}, {1}, ...
 * @param params 替换占位符的参数数组
 * @returns 返回格式化后的字符串
 */
export function formatString(text: string, params: string[]): string {
    let textWithParams = text;
    for (let i = 0; i < params.length; i++) {
        textWithParams = textWithParams.replace(`{${i}}`, params[i]);
    }

    return textWithParams;
}
