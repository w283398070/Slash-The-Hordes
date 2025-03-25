
import { _decorator, Component, Node, Prefab, instantiate, randomRangeInt, Vec3 } from "cc";
import { SCREEN_HALF_HEIGHT, SCREEN_HALF_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH } from "../Data/GameConstants";
const { ccclass, property } = _decorator;

/**
 * 背景管理类
 * 负责管理游戏背景的生成和动态更新
 * 使用分块加载和动态拼接技术实现无限滚动背景
 */
@ccclass("Background")
export class Background extends Component {
    // 背景预制体数组，包含不同风格的背景块
    @property(Prefab) private backgroundPrefabs: Prefab[] = [];

    private targetNode: Node; // 跟踪的目标节点（通常是玩家）
    private instancedBackgrounds: Node[][] = []; // 已实例化的背景块二维数组

    private rows = 3; // 背景块行数
    private columns = 3; // 背景块列数
    private nodeSize = 512; // 每个背景块的大小

    private playerGridPosX = 0; // 玩家在背景网格中的X坐标
    private playerGridPosY = 0; // 玩家在背景网格中的Y坐标

    /**
     * 初始化背景
     * @param targetNode 需要跟踪的目标节点（通常是玩家）
     */
    public init(targetNode: Node): void {
        this.targetNode = targetNode;

        // 初始化背景块网格
        for (let i = 0; i < this.rows; i++) {
            const rowNodes: Node[] = [];
            for (let u = 0; u < this.columns; u++) {
                // 随机选择一个背景预制体
                const randomIndex = randomRangeInt(0, this.backgroundPrefabs.length);
                const backgroundNode = instantiate(this.backgroundPrefabs[randomIndex]);
                backgroundNode.setParent(this.node);

                // 计算并设置背景块位置
                const x = u * this.nodeSize - this.nodeSize + SCREEN_HALF_WIDTH;
                const y = i * this.nodeSize - this.nodeSize + SCREEN_HALF_HEIGHT;
                backgroundNode.setWorldPosition(new Vec3(x, y, 0));

                rowNodes.push(backgroundNode);
            }

            this.instancedBackgrounds.push(rowNodes);
        }
    }

    /**
     * 游戏每帧更新时调用
     * 检查并更新背景块位置
     */
    public gameTick(): void {
        this.tryTileX();
        this.tryTileY();
    }

    /**
     * 检查并更新X轴方向的背景块
     */
    private tryTileX(): void {
        // 计算玩家当前所在的网格X坐标
        const playerGridPosX = Math.round((this.targetNode.worldPosition.x - SCREEN_HALF_WIDTH) / this.nodeSize);

        if (playerGridPosX < this.playerGridPosX) {
            // 玩家向左移动，将最后一列移动到最左侧
            const columnIndex = this.columns - 1;
            for (let i = 0; i < this.rows; i++) {
                const instancedNode = this.instancedBackgrounds[i][columnIndex];
                const newPosition: Vec3 = instancedNode.worldPosition;
                newPosition.x -= this.columns * this.nodeSize;

                instancedNode.setWorldPosition(newPosition);

                // 更新背景块数组
                this.instancedBackgrounds[i].splice(columnIndex, 1);
                this.instancedBackgrounds[i].unshift(instancedNode);
            }
        } else if (this.playerGridPosX < playerGridPosX) {
            // 玩家向右移动，将第一列移动到最右侧
            const columnIndex = 0;
            for (let i = 0; i < this.rows; i++) {
                const instancedNode = this.instancedBackgrounds[i][columnIndex];
                const newPosition: Vec3 = instancedNode.worldPosition;
                newPosition.x += this.columns * this.nodeSize;

                instancedNode.setWorldPosition(newPosition);

                // 更新背景块数组
                this.instancedBackgrounds[i].splice(columnIndex, 1);
                this.instancedBackgrounds[i].push(instancedNode);
            }
        }

        // 更新玩家网格位置
        this.playerGridPosX = playerGridPosX;
    }

    /**
     * 检查并更新Y轴方向的背景块
     */
    private tryTileY(): void {
        // 计算玩家当前所在的网格Y坐标
        const playerGridPosY = Math.round((this.targetNode.worldPosition.y - SCREEN_HALF_HEIGHT) / this.nodeSize);

        if (playerGridPosY < this.playerGridPosY) {
            // 玩家向下移动，将最后一行移动到最下方
            const rowIndex = this.rows - 1;
            const nodesInRow: Node[] = [];
            for (let i = 0; i < this.columns; i++) {
                const instancedNode = this.instancedBackgrounds[rowIndex][i];
                const newPosition: Vec3 = instancedNode.worldPosition;
                newPosition.y -= this.rows * this.nodeSize;

                instancedNode.setWorldPosition(newPosition);
                nodesInRow.push(instancedNode);
            }

            // 更新背景块数组
            this.instancedBackgrounds.splice(rowIndex, 1);
            this.instancedBackgrounds.unshift(nodesInRow);
        } else if (this.playerGridPosY < playerGridPosY) {
            // 玩家向上移动，将第一行移动到最上方
            const rowIndex = 0;
            const nodesInRow: Node[] = [];
            for (let i = 0; i < this.columns; i++) {
                const instancedNode = this.instancedBackgrounds[rowIndex][i];
                const newPosition: Vec3 = instancedNode.worldPosition;
                newPosition.y += this.rows * this.nodeSize;

                instancedNode.setWorldPosition(newPosition);
                nodesInRow.push(instancedNode);
            }

            // 更新背景块数组
            this.instancedBackgrounds.splice(rowIndex, 1);
            this.instancedBackgrounds.push(nodesInRow);
        }

        // 更新玩家网格位置
        this.playerGridPosY = playerGridPosY;
    }
}
