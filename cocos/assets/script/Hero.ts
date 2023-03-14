import { _decorator, Component, Contact2DType, IPhysics2DContact, Input, EventKeyboard, input, EventTouch, Vec2, CCInteger, RigidBody2D, BoxCollider2D, Animation, Sprite, SpriteFrame, UITransform} from 'cc'
const { ccclass, property } = _decorator

@ccclass('Hero')
export class Hero extends Component {
    @property({type: Vec2})
    public jumpSpeed : Vec2 = new Vec2(0,300)

    @property({type: CCInteger})
    public maxJumpDistance: Number = 300

    @property({type: SpriteFrame})
    public jumpSprite: SpriteFrame|null = null;
    
    isJumping: boolean
    jumpKeyPressed: boolean
    touching: boolean
    startJumpY: any
    body: RigidBody2D
    jumpFinished: boolean
    animation: Animation
    sprite: Sprite
        
    start() {
        this.body = this.getComponent(RigidBody2D)
        this.isJumping = false
        this.jumpKeyPressed = false
        this.touching = false
        this.startJumpY = false

        let collider = this.node.getComponent(BoxCollider2D)

        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this)
        }

        input.on(Input.EventType.KEY_DOWN, this.keyDown, this)
        input.on(Input.EventType.KEY_UP, this.keyUp, this)
        this.node.parent.on(Input.EventType.TOUCH_START, this.touchStart, this)
        this.node.parent.on(Input.EventType.TOUCH_END, this.touchEnd, this)

        this.animation = this.node.getComponent(Animation)
        this.sprite = this.node.getComponent(Sprite)
    }

    onBeginContact (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
        this.touching = true
    }
    onEndContact (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
        this.touching = false
    }

    keyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case 32:
                this.jumpKeyPressed = true
                break
        }
    }

    keyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case 32:
                this.jumpKeyPressed = false
                this.isJumping = false
                break
        }
    }

    touchStart(event: EventTouch){
        this.jumpKeyPressed = true
    }

    touchEnd(event: EventTouch){
        this.jumpKeyPressed = false
        this.isJumping = false
    }

    animate(){
        if (this.touching){
            if (!this.animation.getState("running").isPlaying){
                this.animation.play("running")
            }
        } else {
            if (this.animation.getState("running").isPlaying){
                let jumpInitPoint = this.node.getPosition().y
                this.animation.stop()
                this.sprite.spriteFrame = this.jumpSprite
                console.log("init jump position",jumpInitPoint)
            }
        }
    }

    update(deltaTime: number) {
       if (this.jumpKeyPressed){
        this.jump()
       }
       this.animate()
    }

    jump(){
        if(this.touching){
            this.startJumpY = this.node.getPosition().y
            this.jumpFinished = false
            this.isJumping = true
            this.body.linearVelocity = this.jumpSpeed
        } else if (this.isJumping && !this.jumpFinished) {
            const jumpDistance = this.node.getPosition().y - this.startJumpY
            if (jumpDistance < this.maxJumpDistance){
                this.body.linearVelocity = this.jumpSpeed
            } else {
                this.jumpFinished = true
            }
        }
    }
}
