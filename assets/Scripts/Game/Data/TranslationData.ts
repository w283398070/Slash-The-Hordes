

/**
 * 翻译数据类
 * 用于存储游戏中的多语言翻译键值对
 * 
 * 该类通过字符串索引的方式存储和访问翻译文本，键为翻译键名，值为对应语言的翻译文本
 * 适用于实现游戏的多语言支持功能
 */
export class TranslationData {
    /**
     * 翻译键值对映射
     * 使用字符串作为键来访问对应的翻译文本
     * 
     * @param key - 翻译键名，通常是唯一的标识符
     * @returns 返回对应语言的翻译文本字符串
     * 
     * @example
     * const translations = new TranslationData();
     * translations['welcome'] = "欢迎";
     * console.log(translations['welcome']); // 输出："欢迎"
     */
    [key: string]: string;
}
