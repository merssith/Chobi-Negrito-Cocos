import { _decorator, Component, Prefab, instantiate, UITransform, BoxCollider2D, director, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Platform')
export class Platform extends Component {

    @property({type: Prefab})
    public tile: Prefab|null = null;

    @property({type: Prefab})
    public ham: Prefab|null = null;

    @property({type: CCInteger})
    public coinsOffsetMin: number = 100

    @property({type: CCInteger})
    public coinsOffsetMax: number = 200

    tileSize:number = 64
    active: boolean;
    
    start() {
    }

    init(tilesCount, x, y) {
        this.active = true
        this.node.removeAllChildren()

        this.node.setPosition(x, y)
        for (let i=0; i< tilesCount; i++){
            const tile = instantiate(this.tile)
            this.node.addChild(tile)
            tile.setPosition(i * tile.getComponent(UITransform).width, 0)
        }

        this.node.getComponent(UITransform).width = this.tileSize * tilesCount
        this.node.getComponent(UITransform).height = this.tileSize

        let collider = this.node.getComponent(BoxCollider2D)
        collider.size.width = this.node.getComponent(UITransform).width
        collider.size.height = this.node.getComponent(UITransform).height
        collider.offset.x = this.node.getComponent(UITransform).width / 2 - this.tileSize / 2
        collider.apply()

        this.createHams()
    }

    createHams(){
        const y = this.coinsOffsetMin + Math.random() * (this.coinsOffsetMax - this.coinsOffsetMin)

        this.node.children.forEach(tile => {
            if (Math.random() <= 0.4){
                const ham = instantiate(this.ham)
                tile.addChild(ham)
                ham.setPosition(0, y)
            }
        })
    }

    update(deltaTime: number) {
        if (this.active) {
            this.node.setPosition(this.node.getPosition().x -= 150 * deltaTime, this.node.getPosition().y)

            const platformRight = this.node.getPosition().x + this.node.getComponent(UITransform).width

            if (platformRight < -(director.root.mainWindow.width / 2)){
                this.active = false
            }
        }
    }
}

