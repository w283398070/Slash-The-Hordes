/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, writeFileSync } from "fs";
import { merge, unset } from "lodash";
import { GameSettings } from "../assets/Scripts/Game/Data/GameSettings";

// 重新生成游戏设置
regenerateGameSettings();
function regenerateGameSettings(): void {
    const settingsPath: string = process.argv[2];

    // 创建模板设置
    const templateSettings: GameSettings = new GameSettings();
    // 读取保存的设置
    const savedSettingsJson: string = readFileSync(settingsPath, "utf8");
    const savedSettings: GameSettings = <GameSettings>JSON.parse(savedSettingsJson);
    // 删除未使用的属性
    deleteUnusedProperties(templateSettings, savedSettings);
    // 合并模板设置和保存的设置
    const result: GameSettings = merge(templateSettings, savedSettings);

    // 写入结果到文件
    writeFileSync(settingsPath, JSON.stringify(result));
}

// 删除未使用的属性
function deleteUnusedProperties(templateSettings: GameSettings, savedSettings: GameSettings): void {
    const templateKeys: string[] = getAllKeys(templateSettings);
    const usedSettings: string[] = getAllKeys(savedSettings);

    usedSettings.forEach((key) => {
        if (key.match(/.\d+/)) return; // 忽略数组

        if (!templateKeys.includes(key)) {
            console.log("Removing unused property " + key);
            unset(savedSettings, key);
        }
    });
}

// 获取所有键
function getAllKeys(objectWithKeys: any, prefix = ""): string[] {
    if (typeof objectWithKeys === "string") return [];

    const keys: string[] = [];
    const objectKeys: string[] = Object.keys(objectWithKeys);

    for (let i = 0; i < objectKeys.length; i++) {
        keys.push(...getAllKeys(objectWithKeys[objectKeys[i]], `${prefix}${objectKeys[i]}.`));
        keys.push(`${prefix}${objectKeys[i]}`);
    }

    return keys;
}
