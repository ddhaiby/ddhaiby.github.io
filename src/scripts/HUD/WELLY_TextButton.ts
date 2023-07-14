import { CST } from "../CST";

export class WELLY_TextButton extends Phaser.GameObjects.Container
{
    protected _isEnabled: boolean = true;

    /** Whether this button is currently pressed */
    protected isPressed = false;

    /** Whether this button is hoverred */
    protected isHovered = false;

    protected toolTipText: string = "";

    protected textOffsetNormalY: number = -12;
    protected textOffsetHoveredY: number = -10;
    protected textOffsetPressedY: number = -1;

    protected buttonText: Phaser.GameObjects.Text;
    protected buttonImage: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string)
    {
        super(scene, x, y);
        scene.add.existing(this);

        this.buttonImage = this.scene.add.image(0, 0, "buttonNormal");
        this.buttonImage.setOrigin(0.5);
        this.width = this.buttonImage.displayWidth;
        this.height = this.buttonImage.displayHeight;
        this.add(this.buttonImage);

        this.buttonText = this.scene.add.text(0, 0, text, { fontFamily: CST.STYLE.TEXT.FONT_FAMILY, fontSize: "20px", color: "black", stroke: "black", strokeThickness: 1, align: "center" });
        this.buttonText.setOrigin(0.5);
        this.add(this.buttonText);
        this.updateTextPosition();

        this.buttonImage.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(0, 0, this.displayWidth, this.displayHeight),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            pixelPerfect: true,
            cursor: "url(assets/cursors/cursorWellyHovered.cur), pointer"
        });

        // Behaviors
        this.buttonImage.on(Phaser.Input.Events.POINTER_OVER, () => {
            if (this._isEnabled)
            {
                this.isHovered = true;
                this.isPressed = false;

                this.buttonImage.setTexture("buttonHovered");
                this.updateTextPosition();
            }

            this.scene.events.emit(CST.EVENTS.UI.TOOLTIP.HIDE);
        }, this);

        this.buttonImage.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.isPressed = false;
            this.isHovered = false;

            if (this._isEnabled)
            {
                this.buttonImage.setTexture("buttonNormal");
                this.updateTextPosition();
            }

            this.scene.events.emit(CST.EVENTS.UI.TOOLTIP.HIDE);
        }, this);

        this.buttonImage.on(Phaser.Input.Events.POINTER_DOWN, () => {
            if (this._isEnabled)
            {
                this.isPressed = true;
                this.isHovered = false;
                
                this.buttonImage.setTexture("buttonPressed");
                this.updateTextPosition();
            }

            this.scene.events.emit(CST.EVENTS.UI.TOOLTIP.HIDE);
        }, this);

        this.buttonImage.on(Phaser.Input.Events.POINTER_UP, () => {
            if (this._isEnabled)
            {
                this.isPressed = false;
                this.isHovered = true;

                this.buttonImage.setTexture("buttonHovered");
                this.updateTextPosition();
            }

            this.scene.events.emit(CST.EVENTS.UI.TOOLTIP.HIDE);
        }, this);

        this.buttonImage.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
            this.scene.events.emit(CST.EVENTS.UI.TOOLTIP.SHOW, pointer.x, pointer.y, this.toolTipText);
        }, this);

        this.buttonImage.on(Phaser.Input.Events.POINTER_WHEEL, (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
            this.scene.events.emit(CST.EVENTS.UI.TOOLTIP.HIDE);
        }, this);
    }

    private updateTextPosition(): void
    {
        const offsetY = this._isEnabled ? (this.isPressed ? this.textOffsetPressedY : (this.isHovered ? this.textOffsetHoveredY : this.textOffsetNormalY)) : this.textOffsetNormalY;
        this.buttonText.setY(offsetY);
    }

    public onClicked(fn: Function, context?: any) : this
    {
        this.buttonImage.on(Phaser.Input.Events.POINTER_UP, () => { fn(); }, context);
        return this;
    }

    public onHovered(fn: Function, context?: any) : this
    {
        this.buttonImage.on(Phaser.Input.Events.POINTER_OVER, fn, context);
        return this;
    }

    public onPointerOut(fn: Function, context?: any) : this
    {
        this.buttonImage.on(Phaser.Input.Events.POINTER_OUT, fn, context);
        return this;
    }

    public setToolTipText(text: string): void
    {
        this.toolTipText = text;
    }

    public setEnabled(value: boolean): void
    {
        this.isEnabled = value;

        if (this.isEnabled)
        {
            this.buttonImage.setInteractive();
            this.buttonImage.setTexture("buttonNormal");
        }
        else
        {
            this.buttonImage.disableInteractive();
            this.buttonImage.setTexture("buttonDisabled");
        }
    }

    public set isEnabled(value: boolean)
    {
        this._isEnabled = value;
    }

    public get isEnabled() : boolean
    {
        return this._isEnabled;
    }
}