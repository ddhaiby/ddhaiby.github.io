import { CST } from "../CST";
import { SceneUI } from "./SceneUI";
import { SceneGame } from "./SceneGame";

export class ScenePreloadAssets extends Phaser.Scene
{
    constructor()
    {
        super({key: CST.SCENES.PRELOAD_ASSETS});
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    public init() : void
    {
    }

    // Preload
    ////////////////////////////////////////////////////////////////////////

    public preload() : void
    {
        this.preloadAudio();
        this.preloadBackground();
        this.preloadCard();
    }

    private preloadAudio(): void
    {
        this.load.setPath("./assets/audio/");
        // this.load.audio("GUINEA PIGS CITY", "GUINEA PIGS CITY.mp3");
    }

    private preloadBackground(): void
    {
        this.load.setPath("./assets/");
        this.load.image("background", "background.png");
        this.load.image("backgroundVictory", "backgroundVictory.png");
    }

    private preloadCard(): void
    {
        this.load.setPath("assets/cards/");
        this.load.image("Welly_1", "Welly_127.png");
        this.load.image("Welly_2", "Welly_2379.png");
        this.load.image("Welly_3", "Welly_2925.png");
        this.load.image("Welly_4", "Welly_2926.png");
        this.load.image("Welly_5", "Welly_2927.png");
        this.load.image("Welly_6", "Welly_2928.png");
        this.load.image("Welly_7", "Welly_3267.png");
        this.load.image("Welly_8", "Welly_3855.png");
        this.load.image("Welly_9", "Welly_3856.png");
        this.load.image("Welly_10", "Welly_3928.png");
        this.load.image("Welly_11", "Welly_3953.png");
        this.load.image("Welly_12", "Welly_4003.png");
        this.load.image("Welly_Hidden", "Welly_Hidden.png");
    }

    // Create
    ////////////////////////////////////////////////////////////////////////
  
    public create() : void
    {
        this.input.setDefaultCursor("url(assets/cursors/cursorWellyNormal.cur), pointer");

        this.initDimensions();

        this.scene.add(CST.SCENES.UI, SceneUI, true, undefined);
        this.scene.add(CST.SCENES.GAME, SceneGame, true, undefined);

        this.scene.bringToTop(CST.SCENES.UI);
        this.scene.remove(CST.SCENES.PRELOAD_ASSETS);
    }

    private initDimensions(): void
    {
        // Base the scaling on the background and the screen size size all assets are size matching
        // const widthScale = this.scale.displaySize.width / this.textures.get("background").getSourceImage().width;
        // const heightScale = this.scale.displaySize.height / this.textures.get("background").getSourceImage().height;
        // // CST.GAME.SCALE = Math.min(widthScale, heightScale);
        // CST.GAME.WIDTH = this.textures.get("background").getSourceImage().width * CST.GAME.SCALE;
        // CST.GAME.HEIGHT = this.textures.get("background").getSourceImage().height * CST.GAME.SCALE;
    }
}