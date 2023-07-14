import { CST } from "../CST";
import { Label } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';
import { WELLY_Utils } from "../Utils/WELLY_Utils";

export class WELLY_ToolTip extends Label
{
    constructor(scene: Phaser.Scene, x: number, y: number, text: string)
    {
        const background = new RoundRectangle(scene, {
            x: 0,
            y: 0,
            radius: 4,
            color: WELLY_Utils.hexColorToNumber(CST.STYLE.COLOR.WHITE),
            alpha: 1,
            strokeColor: WELLY_Utils.hexColorToNumber(CST.STYLE.COLOR.LIGHT_BLUE),
            strokeWidth: 3
        });
        scene.add.existing(background)

        const textObject = scene.add.text(0, 0, text, { fontSize: "18px", fontFamily: CST.STYLE.TEXT.FONT_FAMILY, color: CST.STYLE.COLOR.BLUE });

        super(scene, {
            x: x,
            y: y,
            background: background,
            text: textObject,
            align: "center",
            space: {
                top: 4,
                bottom: 4,
                left: 6,
                right: 6
            }
        });
        scene.add.existing(this);
        this.setDepth(9999);
    }
}