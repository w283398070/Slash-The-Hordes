declare global {
    const ID: Y8API.ID;
    interface Window {
        idAsyncInit: () => void;
    }
}

export namespace Y8API {
    // Y8 API 接口
    export interface ID {
        init: (appInfo: { appId: string }) => void; // 初始化方法
        getLoginStatus: (callback: (response?: Authorization) => void, skipCache?: boolean) => void; // 获取登录状态
        login: (callback: (response?: Authorization) => void) => void; // 登录方法
        register: (callback: (response?: Authorization) => void) => void; // 注册方法
        Event: Event; // 事件接口
        Analytics: Analytics; // 分析接口
    }

    // 事件接口
    export interface Event {
        subscribe: (eventName: string, callback: (response?: any) => void) => void; // 订阅事件
    }

    // 分析接口
    export interface Analytics {
        custom_event: (name: string, data?: string | number) => void; // 发送自定义事件
    }

    // 授权接口
    export interface Authorization {
        status: string; // 状态
        success?: boolean; // 是否成功
        authResponse: {
            state: string; // 状态
            access_token: string; // 访问令牌
            token_type: string; // 令牌类型
            expires_in: number; // 过期时间
            scope: string; // 范围
            redirect_uri: string; // 重定向 URI
            details: any; // 详细信息
        };
    }
}
