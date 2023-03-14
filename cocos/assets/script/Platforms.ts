import { _decorator, Component, Node, Prefab, instantiate, CCInteger, director, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Platforms')
export class Platforms extends Component {

    @property({type: Prefab})
    public platform: Prefab|null = null;

    @property({type: CCInteger})
    public xOffsetMin: number = 60

    @property({type: CCInteger})
    public xOffsetMax: number = 200

    @property({type: CCInteger})
    public yOffsetMin: number = -120
    
    @property({type: CCInteger})
    public yOffsetMax: number = 120

    @property({type: CCInteger})
    public tilesCountMin: number = 2

    @property({type: CCInteger})
    public tilesCountMax: number = 6

    current: Component;
    platforms: any[];

     generateRandomData(){
        let data = {
            tilesCount: 0, 
            x: 0, 
            y: 0
        }
        const xOffset = this.xOffsetMin + Math.random() * (this.xOffsetMax - this.xOffsetMin)
        const yOffset = this.yOffsetMin + Math.random() * (this.yOffsetMax - this.yOffsetMin)

        data.x = this.current.node.getPosition().x + this.current.node.getComponent(UITransform).width + xOffset
        let y = this.current.node.getPosition().y + yOffset
        const screenTop = director.root.mainWindow.height / 2
        const screenBottom = -(director.root.mainWindow.height) / 2
        y = Math.min(y, screenTop - this.current.node.getComponent(UITransform).height * 2)
        y = Math.max(y, screenBottom + this.current.node.getComponent(UITransform).height)
        data.y = y

        data.tilesCount = this.tilesCountMin + Math.floor(Math.random() * (this.tilesCountMax - this.tilesCountMin))

        return data
    }

    start() {
        this.platforms = []
        this.createPlatform({
            tilesCount: 6, 
            x: -200, 
            y: -200
        })
    }

    createPlatform(data?){
        if(!data){
            data = this.generateRandomData()
        }

        const platform = this.platforms.find(platform => !platform.active)
        
        if (platform) {
            this.current = platform
        } else {
            const node = instantiate(this.platform)
            this.node.addChild(node)
            this.current = node.getComponent("Platform")
            this.platforms.push(this.current)
        }

        this.current.init(data.tilesCount, data.x, data.y)
    }

    update(deltaTime: number) {
        const screenRight = director.root.mainWindow.width / 2
        const currentPlatformRight = this.current.node.getPosition().x + this.current.node.getComponent(UITransform).width 

        if(currentPlatformRight < screenRight){
            this.createPlatform()
        }
    }
}

