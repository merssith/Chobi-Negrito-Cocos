import { _decorator, Component, Node, CCInteger, UITransform, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Background')
export class Background extends Component {

    @property({type: CCInteger})
    public speed: number = 50

    start() {

    }

    move(node, offSet) {
        const spritRightX = node.getPosition().x + node.getComponent(UITransform).width / 2
        const screenLeftX = -(director.root.mainWindow.width / 2)
        if (spritRightX <= screenLeftX){
            node.setPosition(node.getPosition().x + node.getComponent(UITransform).width * 2 - offSet, node.getPosition().y)        
        } else {
            node.setPosition(node.getPosition().x - offSet, node.getPosition().y)        
        }
    }

    update(deltaTime: number) {
        this.node.children.forEach(node => {
            this.move(node, deltaTime * this.speed)
        })
    }
}

