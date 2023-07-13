import { CST } from "../CST";
import { WELLY_Scene, SceneData } from "./WELLY_Scene";
import { WELLY_ToolTip } from "../HUD/WELLY_ToolTip";
import { WELLY_ImageButton } from "../HUD/WELLY_ImageButton";
import { WELLY_Utils } from "../Utils/WELLY_Utils";

export class SceneUI extends WELLY_Scene
{
    private toolTip: WELLY_ToolTip;
    private tooltTipTimerEvent: Phaser.Time.TimerEvent;

    private chronoText: Phaser.GameObjects.Text;
    private countdownStartGameText: Phaser.GameObjects.Text;
    private congratulationText: Phaser.GameObjects.Text;
    private victoryText: Phaser.GameObjects.Text;
    private victoryImage: Phaser.GameObjects.Image;
    
    private preventClickBackground: Phaser.GameObjects.Graphics;

    private chronoTextY: number;

    constructor()
    {
        super({key: CST.SCENES.UI});
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    public init(data?: SceneData): void
    {
    }

    // Preload
    ////////////////////////////////////////////////////////////////////////

    public preload(): void
    {
    }

    // Create
    ////////////////////////////////////////////////////////////////////////

    public create(): void
    {
        super.create();

        this.input.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[]) => {
            this.events.emit("gameObjectHovered");
        }, this);

        this.createToolTip();

        this.events.on(CST.EVENTS.UI.TOOLTIP.SHOW, this.requestShowToolTip, this);
        this.events.on(CST.EVENTS.UI.TOOLTIP.HIDE, this.requestHideToolTip, this);

        this.preventClickBackground = this.add.graphics();
        this.preventClickBackground.fillStyle(WELLY_Utils.hexColorToNumber(CST.STYLE.COLOR.BLUE), 0.7);
        this.preventClickBackground.fillRect(0, 0, this.scale.displaySize.width, this.scale.displaySize.height);
        this.preventClickBackground.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.scale.displaySize.width, this.scale.displaySize.height), Phaser.Geom.Rectangle.Contains);

        this.chronoText = this.add.text(this.scale.displaySize.width * 0.5, 48, WELLY_Scene.formatTime(0), { fontFamily: CST.STYLE.TEXT.FONT_FAMILY, fontSize: "60px", color: CST.STYLE.COLOR.LIGHT_BLUE, align: "center" }).setOrigin(0.5, 0);
        this.chronoTextY = this.chronoText.y;

        this.countdownStartGameText = this.add.text(this.scale.displaySize.width * 0.5, this.scale.displaySize.height * 0.5, "", { fontFamily: CST.STYLE.TEXT.FONT_FAMILY, fontSize: "130px", color: CST.STYLE.COLOR.LIGHT_BLUE, align: "center" }).setOrigin(0.5);
        
        this.congratulationText = this.add.text(0, 0, "CONGRATULATIONS!", { fontFamily: CST.STYLE.TEXT.FONT_FAMILY, fontSize: "110px", color: CST.STYLE.COLOR.ORANGE, align: "center" }).setOrigin(0.5);
        this.congratulationText.setVisible(false);

        this.victoryImage = this.add.image(this.scale.displaySize.width * 0.5, this.scale.displaySize.height * 0.5, "backgroundVictory");
        this.victoryImage.setScale(0.2);
        this.victoryImage.setVisible(false);

        this.victoryText = this.add.text(this.victoryImage.x, this.victoryImage.y + this.victoryImage.displayHeight * 0.5 + 20, "WELLY VICTORY", { fontFamily: CST.STYLE.TEXT.FONT_FAMILY, fontSize: "110px", color: CST.STYLE.COLOR.ORANGE, align: "center" }).setOrigin(0.5, 0);
        this.victoryText.setVisible(false);
    }

    private createToolTip(): void
    {
        this.tooltTipTimerEvent = this.time.addEvent({});
        this.toolTip = new WELLY_ToolTip(this, 0, 0, "");
        this.toolTip.setOrigin(0, 0);
        this.toolTip.setVisible(false);
    }

    public requestShowToolTip(x: number, y: number, text: string, zoom: number = 1.0): void
    {
        if (!this.toolTip.visible && text && text.length > 0)
        {
            this.tooltTipTimerEvent.remove();
            this.tooltTipTimerEvent = this.time.delayedCall(CST.STYLE.TOOLTIP.DELAY_DISPLAY, () => {
                this.toolTip.setText(text);
                this.toolTip.layout(); // Layout to get the new size based on the new text
                
                const cameraWorldView = this.cameras.main.worldView;

                const isXPosOk = cameraWorldView.contains(x + this.toolTip.displayWidth + CST.STYLE.TOOLTIP.OFFSET_RIGHT, y);
                this.toolTip.setX(isXPosOk ? x + CST.STYLE.TOOLTIP.OFFSET_RIGHT : x - CST.STYLE.TOOLTIP.OFFSET_LEFT); 

                const isYPosOk = cameraWorldView.contains(x, y + this.toolTip.displayHeight + CST.STYLE.TOOLTIP.OFFSET_BOTTOM);
                this.toolTip.setY(isYPosOk ? y + CST.STYLE.TOOLTIP.OFFSET_BOTTOM : y - CST.STYLE.TOOLTIP.OFFSET_TOP); 

                this.toolTip.setOrigin(isXPosOk ? 0 : 1, isYPosOk ? 0 : 1);    
                this.toolTip.layout(); // Layout again to correctly set the position with the new origin

                this.toolTip.setVisible(true);
            }, undefined, this);
        }
    }

    public requestHideToolTip(): void
    {
        this.tooltTipTimerEvent.remove();
        this.toolTip.setVisible(false);
    }

    public startCountdown(): void
    {
        this.preventClickBackground.setVisible(true);
        this.countdownStartGameText.setVisible(true);
        this.doCountdown(3);
    }

    public doCountdown(remainTime: number): void
    {
        this.countdownStartGameText.setScale(1);
        this.countdownStartGameText.setText(remainTime.toString());
        this.countdownStartGameText.setColor((remainTime == 1) ? CST.STYLE.COLOR.ORANGE : CST.STYLE.COLOR.LIGHT_BLUE);

        --remainTime;
        if (remainTime >= 0)
        {
            this.tweens.add({
                targets: this.countdownStartGameText,
                scale: (remainTime == 0) ? 2.1 : 1.9,
                duration: 400,
                onComplete: () => {
                    this.tweens.add({
                        targets: this.countdownStartGameText,
                        scale: 1.2,
                        duration: 550,
                        onComplete: () => { this.doCountdown(remainTime); },
                        onCompleteScope: this
                    });
                },
                onCompleteScope: this
            });
        }
        else
        {
            this.onReadyToStartGame();
        }
    }
    protected onReadyToStartGame(): void
    {
        this.countdownStartGameText.setVisible(false);
        this.preventClickBackground.setVisible(false);
        this.events.emit("readyToStartGame");
    }

    public onLeveCompleted(level: number): void
    {
        this.tweens.add({
            targets: this.chronoText,
            y: this.scale.displaySize.height * 0.5,
            scale: 1.5,
            duration: 300,
            onComplete: () => {
                this.congratulationText.setPosition(this.chronoText.x, this.chronoText.y - 80);
                this.congratulationText.setText(CST.GAME.LEVELS[level].MESSAGE_END);
                this.congratulationText.setScale(0);
                this.congratulationText.setVisible(true);

                this.tweens.add({
                    targets: this.congratulationText,
                    scale: 1,
                    duration: 300,
                    onComplete: () => { },
                    onCompleteScope: this
                });

                this.time.delayedCall(3000, () => {
                    this.tweens.add({
                        targets: this.congratulationText,
                        scale: 0,
                        duration: 200,
                        onComplete: () => {
                            this.congratulationText.setVisible(false);
                        
                            this.tweens.add({
                                targets: this.chronoText,
                                y: this.chronoTextY,
                                scale: 1,
                                duration: 500,
                                onComplete: () => { this.events.emit("readyToStartNextLevel"); },
                                onCompleteScope: this
                            });
                        },
                        onCompleteScope: this
                    });
                }, undefined, this);
            },
            onCompleteScope: this
        });
    }

    public onAllLevelCompleted(): void
    {
        const scaleText = this.victoryText.scale;
        const scaleImage = this.victoryImage.scale;

        this.victoryText.setVisible(true);
        this.victoryImage.setVisible(true);

        this.victoryText.setScale(0);
        this.victoryImage.setScale(0);

        this.tweens.add({
            targets: this.victoryText,
            scale: scaleText,
            duration: 300
        });

        this.tweens.add({
            targets: this.victoryImage,
            scale: scaleImage,
            duration: 300
        });
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    public update(time: number, delta: number): void
    {
        super.update(time, delta);
    }

    public updateChrono(elapsedTime: number): void
    {
        this.chronoText.setText(WELLY_Scene.formatTime(elapsedTime));
    }
}