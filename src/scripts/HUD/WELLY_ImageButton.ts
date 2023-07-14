import OutlinePipelinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline-plugin";
import { CST } from "../CST";

export declare type WELLY_ImageButtonStyle = {
    outlineThichkess?: number
    outlineColor?: number,
    texturePressed?: string;
    textureHovered?: string;
    tintPressed?: number;
    tintHovered?: number;
    pixelPerfect?: boolean;
}

export class WELLY_ImageButton extends Phaser.GameObjects.Image
{
    protected _isEnabled: boolean = true;

    /** Whether this button is currently pressed */
    protected isPressed = false;

    /** Whether this button is hoverred */
    protected isHovered = false;

    protected outlineThickness: number = CST.STYLE.OUTLINE.THICKNESS;
    protected outlineColor: number = CST.STYLE.OUTLINE.COLOR;

    protected tintPressed: number = CST.STYLE.BUTTON.TINT.PRESSED;
    protected tintHovered: number = CST.STYLE.BUTTON.TINT.HOVERED;

    protected textureNormal: string;
    protected texturePressed: string | undefined;
    protected textureHovered: string | undefined;

    protected toolTipText: string = "";

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number, style?: WELLY_ImageButtonStyle)
    {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        style = this.initStyle(style);

        this.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(0, 0, this.displayWidth, this.displayHeight),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            pixelPerfect: style.pixelPerfect,
            cursor: "url(assets/cursors/cursorWellyHovered.cur), pointer"
        });

        const outlinePlugin = scene.plugins.get('rexOutlinePipeline') as OutlinePipelinePlugin;

        // Behaviors
        this.on(Phaser.Input.Events.POINTER_OVER, () => {
            if (this._isEnabled)
            {
                this.setTint(this.tintHovered);

                if (this.textureHovered && (this.textureHovered != this.texture.key))
                {
                    this.setTexture(this.textureHovered);
                }

                if (this.outlineThickness)
                {
                    outlinePlugin.add(this, { thickness: CST.STYLE.OUTLINE.THICKNESS, outlineColor: CST.STYLE.OUTLINE.COLOR });
                }

                this.isHovered = true;
                this.isPressed = false;
            }

            this.scene.events.emit(CST.EVENTS.UI.TOOLTIP.HIDE);
        }, this);

        this.on(Phaser.Input.Events.POINTER_OUT, () => {
            if (this._isEnabled)
            {
                this.clearTint();

                if (this.textureNormal && (this.textureNormal != this.texture.key) && (this.textureNormal != "__DEFAULT")  && (this.textureNormal != "__MISSING"))
                {
                    this.setTexture(this.textureNormal);
                }
                outlinePlugin.remove(this);
            }

            this.isPressed = false;
            this.isHovered = false;

            this.scene.events.emit(CST.EVENTS.UI.TOOLTIP.HIDE);
        }, this);

        this.on(Phaser.Input.Events.POINTER_DOWN, () => {
            if (this._isEnabled)
            {
                if (this.texturePressed && (this.texturePressed != this.texture.key))
                {
                    this.setTexture(this.texturePressed);
                }

                this.setTint(this.tintPressed);

                outlinePlugin.remove(this);
                if (this.outlineThickness)
                {
                    outlinePlugin.add(this, { thickness: CST.STYLE.OUTLINE.THICKNESS, outlineColor: CST.STYLE.OUTLINE.COLOR });
                }

                this.isPressed = true;
                this.isHovered = false;
            }

            this.scene.events.emit(CST.EVENTS.UI.TOOLTIP.HIDE);
        }, this);

        this.on(Phaser.Input.Events.POINTER_UP, () => {
            if (this._isEnabled)
            {
                outlinePlugin.remove(this);
                if (this.outlineThickness)
                {
                    outlinePlugin.add(this, { thickness: CST.STYLE.OUTLINE.THICKNESS, outlineColor: CST.STYLE.OUTLINE.COLOR });
                }

                this.setTint(this.tintHovered);

                if (this.textureHovered && (this.textureHovered != this.texture.key))
                {
                    this.setTexture(this.textureHovered);
                }

                this.isPressed = false;
                this.isHovered = true;
            }

            this.scene.events.emit(CST.EVENTS.UI.TOOLTIP.HIDE);
        }, this);

        this.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
            if (this._isEnabled)
            {
                outlinePlugin.remove(this);
                if (this.outlineThickness)
                {
                    outlinePlugin.add(this, { thickness: CST.STYLE.OUTLINE.THICKNESS, outlineColor: CST.STYLE.OUTLINE.COLOR });
                }

                if (this.isPressed)
                {
                    this.setTint(this.tintPressed);

                    if (this.texturePressed && (this.texturePressed != this.texture.key))
                    {
                        this.setTexture(this.texturePressed);
                    }
                }
                else
                {
                    this.setTint(this.tintHovered);

                    if (this.textureHovered && (this.textureHovered != this.texture.key))
                    {
                        this.setTexture(this.textureHovered);
                    }
                }
            }

            this.scene.events.emit(CST.EVENTS.UI.TOOLTIP.SHOW, pointer.x, pointer.y, this.toolTipText);
        }, this);

        this.on(Phaser.Input.Events.POINTER_WHEEL, (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
            this.scene.events.emit(CST.EVENTS.UI.TOOLTIP.HIDE);
        }, this);
    }

    public disableInteractive(): this
    {
        const outlinePlugin = this.scene.plugins.get('rexOutlinePipeline') as OutlinePipelinePlugin;
        outlinePlugin.remove(this);
        this.clearTint();
        
        return super.disableInteractive();
    }

    private initStyle(style?: WELLY_ImageButtonStyle): WELLY_ImageButtonStyle
    {
        if (style == undefined)
        {
            style = {};
        }

        if (style.outlineThichkess != undefined)
        {
            this.outlineThickness = style.outlineThichkess; 
        }
        
        if (style.outlineColor != undefined)
        {
            this.outlineColor = style.outlineColor; 
        }

        if (style.tintHovered != undefined)
        {
            this.tintHovered = style.tintHovered; 
        }

        if (style.tintPressed != undefined)
        {
            this.tintPressed = style.tintPressed; 
        }

        if (style.pixelPerfect == undefined)
        {
            style.pixelPerfect = true; 
        }

        const textureString = (this.texture instanceof Phaser.Textures.Texture) ? this.texture.key : this.texture;
        this.setButtonImages(textureString, style.texturePressed, style.textureHovered);

        return style;
    }

    public onClicked(fn: Function, context?: any) : this
    {
        this.on(Phaser.Input.Events.POINTER_UP, () => { fn(); }, context);
        return this;
    }

    public onHovered(fn: Function, context?: any) : this
    {
        this.on(Phaser.Input.Events.POINTER_OVER, fn, context);
        return this;
    }

    public onPointerOut(fn: Function, context?: any) : this
    {
        this.on(Phaser.Input.Events.POINTER_OUT, fn, context);
        return this;
    }

    /** Set images for each states. This only work with simple textures. Don't use it if you have frames! */
    public setButtonImages(keyNormal: string, keyPressed?: string, keyHovered?: string): this
    {
        this.textureNormal = keyNormal;
        this.texturePressed = keyPressed;
        this.textureHovered = keyHovered;

        this.setTexture(this.textureNormal);

        return this;
    }

    public setToolTipText(text: string): void
    {
        this.toolTipText = text;
    }

    public setEnabled(value: boolean): void
    {
        this.isEnabled = value;
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