import { Component, instantiate, Node, Prefab } from "cc";

export class ObjectPool<T extends Component> {
    private prefab: Prefab; // 预制件
    private parent: Node; // 父节点
    private pooledObjects: PooledObject<T>[] = []; // 对象池数组
    private componentName: string; // 组件名称

    public constructor(prefab: Prefab, parent: Node, defaultPoolCount: number, componentName: string) {
        this.prefab = prefab;
        this.parent = parent;
        this.componentName = componentName;

        for (let i = 0; i < defaultPoolCount; i++) {
            this.createNew();
        }
    }

    // 借用对象
    public borrow(): T {
        const objectToBorrow: PooledObject<T> | null = this.pooledObjects.find((o) => !o.IsBorrowed);
        if (objectToBorrow != null) {
            return objectToBorrow.borrow();
        }

        return this.createNew().borrow();
    }

    // 归还对象
    public return(object: T): void {
        const objectToReturn: PooledObject<T> | null = this.pooledObjects.find((o) => o.Equals(object));
        if (objectToReturn == null) {
            throw new Error("Object " + this.prefab.name + " is not a member of the pool");
        }

        objectToReturn.return();
    }

    // 创建新对象
    private createNew(): PooledObject<T> {
        const newPooledObject: PooledObject<T> = new PooledObject(this.prefab, this.parent, this.componentName);
        this.pooledObjects.push(newPooledObject);

        return newPooledObject;
    }
}

class PooledObject<T extends Component> {
    private isBorrowed = false; // 是否被借用
    private defaultParent: Node; // 默认父节点
    private instancedNode: Node; // 实例化的节点
    private instancedComponent: T; // 实例化的组件

    public constructor(prefab: Prefab, defaultParent: Node, componentName: string) {
        this.defaultParent = defaultParent;

        this.instancedNode = instantiate(prefab);
        this.instancedComponent = <T>this.instancedNode.getComponent(componentName);
        if (this.instancedComponent == null) {
            console.error("Object " + prefab.name + " does not have component " + componentName);
        }

        this.clear();
    }

    // 获取是否被借用
    public get IsBorrowed(): boolean {
        return this.isBorrowed;
    }

    // 判断是否相等
    public Equals(component: T): boolean {
        return this.instancedComponent == component;
    }

    // 借用对象
    public borrow(): T {
        this.isBorrowed = true;
        return this.instancedComponent;
    }

    // 归还对象
    public return(): void {
        this.clear();
    }

    // 清理对象
    private clear(): void {
        this.instancedNode.active = false;
        this.instancedNode.parent = this.defaultParent;
        this.isBorrowed = false;
    }
}
