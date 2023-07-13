import { WELLY_ImageButton } from "../HUD/WELLY_ImageButton";
import { Label, PerspectiveCard } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

export class WELLY_Card extends PerspectiveCard
{
    private frontImageButton: WELLY_ImageButton = undefined;
    private id: number = -1;

    constructor(scene: Phaser.Scene, id: number, x: number, y: number, frontTexture: string, backTexture: string, cardSize: number)
    {
        const frontImageButton = new WELLY_ImageButton(scene, 0, 0, frontTexture);
        const frontCardButton = new Label(scene, { background: frontImageButton });
        const backCardButton = new Label(scene, { background: scene.add.image(0, 0, backTexture) });

        const config: PerspectiveCard.IConfig = {
            x: x,
            y: y,
            width: cardSize,
            height: cardSize,
            front: frontCardButton,
            back: backCardButton,
            orientation: "horizontal",
            flip : {
                frontToBack: "left-to-right",
                backToFront: "right-to-left",
                duration: 300,
                ease: 'Linear',
                delay: 0
            },
            draggable: false,
            sizerEvents: false
        };

        super(scene, config);

        this.id = id;
        this.frontImageButton = frontImageButton;

        this.frontImageButton.onClicked(() => {
            this.emit("clicked", this);
        }, this);

        this.layout();
        this.scene.add.existing(this);
    }

    public onClicked(fn: Function, context?: any) : this
    {
        this.on("clicked", (card: WELLY_Card) => { fn(card); }, context);
        return this;
    }

    public enable(): void
    {
        this.frontImageButton.setInteractive();
    }

    public disable(): void
    {
        this.frontImageButton.disableInteractive();
        this.disableInteractive();
    }

    public getId(): number
    {
        return this.id;
    }
}