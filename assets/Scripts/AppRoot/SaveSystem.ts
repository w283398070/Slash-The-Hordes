
import { sys } from "cc";
import { UserData } from "../Game/Data/UserData";

/**
 * 存档系统
 * 负责用户数据的保存和加载
 * 使用localStorage进行本地数据持久化
 */
export class SaveSystem {
    // 用户数据在localStorage中的标识符
    private userDataIdentifier = "user-dse";

    /**
     * 保存用户数据
     * 将用户数据对象转换为JSON字符串并存储到localStorage
     * @param userData 需要保存的用户数据对象
     */
    public save(userData: UserData): void {
        sys.localStorage.setItem(this.userDataIdentifier, JSON.stringify(userData));
    }

    /**
     * 加载用户数据
     * 从localStorage读取并解析用户数据
     * @returns 返回解析后的用户数据对象，如果数据不存在或解析失败则返回新的用户数据对象
     */
    public load(): UserData {
        // 从localStorage获取数据
        const data: string = sys.localStorage.getItem(this.userDataIdentifier);

        // 如果数据不存在，返回新的用户数据对象
        if (!data) return new UserData();

        try {
            // 尝试解析数据
            // TODO: 如果UserData类新增字段，可能会导致已保存的数据结构不匹配
            return <UserData>JSON.parse(data);
        } catch (error) {
            // 解析失败时返回新的用户数据对象
            return new UserData();
        }
    }
}
