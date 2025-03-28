import { Component, _decorator, CCString } from "cc";
import { Y8API } from "./Y8def";

const { ccclass, property } = _decorator;

@ccclass("Y8")
export class Y8 extends Component {
    @property(CCString) private appId = "ENTER APP ID"; // 应用ID

    // 初始化方法
    public init(): Promise<void> {
        return new Promise<void>((resolve) => {
            // Y8脚本加载后的回调
            window.idAsyncInit = (): void => {
                // 等待应用连接
                ID.Event.subscribe("id.init", resolve);
                ID.init({ appId: this.appId });
            };

            // 加载脚本
            (function (d, s, id): void {
                const fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                const js: HTMLScriptElement = <HTMLScriptElement>d.createElement(s);
                js.id = id;
                js.src = document.location.protocol == "https:" ? "https://cdn.y8.com/api/sdk.js" : "http://cdn.y8.com/api/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            })(document, "script", "id-jssdk");
        });
    }

    // 登录方法
    public login(): Promise<Y8API.Authorization> {
        console.log("Logging in");
        return new Promise<Y8API.Authorization>((resolve) => {
            ID.login((response: Y8API.Authorization) => {
                resolve(response);
            });
        });
    }

    // 尝试自动登录
    public async tryAutoLogin(): Promise<void> {
        const auth = await this.getLoginStatus();
        console.log(auth);
        if (auth?.status == "not_linked" || auth?.status == "uncomplete") {
            await this.login();
        }
    }

    // 检查是否已登录
    public async isLoggedIn(): Promise<boolean> {
        const auth = await this.getLoginStatus();
        return auth?.success == true;
    }

    // 发送自定义事件
    public sendCustomEvent(name: string, data?: string | number): void {
        ID.Analytics.custom_event(name, data);
    }

    // 获取登录状态
    private getLoginStatus(): Promise<Y8API.Authorization> {
        return new Promise((resolve) => {
            ID.getLoginStatus(resolve);
        });
    }
}
