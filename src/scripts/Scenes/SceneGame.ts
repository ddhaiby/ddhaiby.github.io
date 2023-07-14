import { CST } from "../CST";
import { WELLY_Scene, SceneData } from "./WELLY_Scene";
import { SceneUI } from "./SceneUI";
import { WELLY_Card } from "../HUD/WELLY_Card";

export class SceneGame extends WELLY_Scene
{
    private sceneUI: SceneUI;

    // Audio
    private audioWorldMap: Phaser.Sound.BaseSound;

    private cards: WELLY_Card[] = [];

    private firstCard: WELLY_Card | undefined;
    private secondCard: WELLY_Card | undefined;

    private remainCardCount: number = 0;

    private elapsedTime: number = 0;
    private isGameInProgress: boolean = false;

    private currentLevel: number = 0;

    constructor()
    {
        super({key: CST.SCENES.GAME});
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

        // this.audioWorldMap = this.sound.add("GUINEA PIGS CITY", { volume: 0.05, loop: true });
        // this.audioWorldMap.play();

        this.initUI();

        this.startLevel(0);
    }

    protected startLevel(level: number): void
    {
        this.currentLevel = level;
        this.createBoard();
        this.startCountdown();

        if (level == 0)
        {
            this.sceneUI.updateChrono(0);
        }
    }

    protected startNextLevel(): void
    {
        if (this.currentLevel < CST.GAME.LEVELS.length - 1)
        {
            this.startLevel(this.currentLevel + 1);
        }
    }

    private createBoard(): void
    {
        let availableCards = [] as { index: number; count: number; }[];

        const columns = CST.GAME.LEVELS[this.currentLevel].COLUMNS;
        const rows = CST.GAME.LEVELS[this.currentLevel].ROWS;
        
        this.remainCardCount = columns * rows;

        // Each card will be spawned exactly twice in the board
        for (let i = 1; i <= this.remainCardCount * 0.5; ++i)
        {
            availableCards.push({index: i, count: 2});
        }

        const spacing = 16;
        const cardSize = 120;

        const childrenRectWidth = columns * cardSize + (columns - 1) * spacing;
        const childrenRectHeight = rows * cardSize + (rows - 1) * spacing;

        const startX = (this.scale.displaySize.width - childrenRectWidth) * 0.5 + cardSize * 0.5;
        const startY = (this.scale.displaySize.height - childrenRectHeight) * 0.5 + cardSize;

        for (const card of this.cards)
        {
            card.destroy();
        }

        this.cards = [];

        for (let j = 0; j < rows; ++j)
        {
            for (let i = 0; i < columns; ++i)
            {
                const availableCardIndex = Phaser.Math.Between(0, availableCards.length - 1);
                const wellyIdx = availableCards[availableCardIndex].index;

                const cardX = startX + i * cardSize + (i - 1) * spacing;
                const cardY = startY + j * cardSize + (j - 1) * spacing;

                const card = new WELLY_Card(this, wellyIdx, cardX, cardY, "Welly_Hidden", `Welly_${wellyIdx}`, cardSize);
                this.cards.push(card);

                card.onClicked((card: WELLY_Card) => { this.onCardClicked(card); }, this);

                availableCards[availableCardIndex].count = availableCards[availableCardIndex].count - 1;
                if (availableCards[availableCardIndex].count <= 0)
                {
                    availableCards.splice(availableCardIndex, 1);
                }
            }
        }
    }

    private initUI(): void
    {
        this.sceneUI = this.scene.get(CST.SCENES.UI) as SceneUI;
        this.sceneUI.events.on("readyToStartGame", () => { this.startGame(); }, this);
        this.sceneUI.events.on("readyToStartNextLevel", () => { this.startNextLevel(); }, this);
    }

    private startCountdown(): void
    {
        this.isGameInProgress = false;
        this.sceneUI.startCountdown();
    }

    private startGame(): void
    {
        this.turnBackAllCards();

        this.cards[0].flip?.once("complete", () =>
        {
            this.time.delayedCall(CST.GAME.LEVELS[this.currentLevel].DURATION_SHOW_CARDS, () =>
            {
                this.turnFrontAllCards();

                this.cards[0].flip?.once("complete", () => {
                    this.isGameInProgress = true;
                }, this);
            } , undefined, this);
        }, this);
    }

    private completeLevel(): void
    {
        this.isGameInProgress = false;

        if (this.currentLevel < CST.GAME.LEVELS.length - 1)
        {
            this.time.delayedCall(800, () => { this.sceneUI.onLeveCompleted(this.currentLevel); }, undefined, this);
        }
        else
        {
            this.time.delayedCall(1300, () => { this.sceneUI.onAllLevelCompleted(); }, undefined, this);
        }
    }

    private turnBackAllCards(): void
    {
        const cardFaceFront = 0;
        this.turnAllCards(cardFaceFront);
    }

    private turnFrontAllCards(): void
    {
        const cardFaceBack = 1;
        this.turnAllCards(cardFaceBack);
    }

    private turnAllCards(faceToTurn: number): void
    {
        for (const card of this.cards)
        {
            if (card.face == faceToTurn)
            {
                card.flip?.flip();
            }
        }
    }

    private onCardClicked(card: WELLY_Card): void
    {
        const canFlipCard = (this.firstCard == undefined) || (this.secondCard == undefined);

        if (canFlipCard && card)
        {
            card.disable();
            card.flip?.flip();

            if (this.firstCard == undefined)
            {
                this.firstCard = card;
            }
            else
            {
                this.secondCard = card;
                this.secondCard.flip?.once("complete", () => { this.checkFlippedCards(this.firstCard as WELLY_Card, this.secondCard as WELLY_Card); }, this);
            }
        }
    }

    private checkFlippedCards(card1: WELLY_Card, card2: WELLY_Card): void
    {
        if (this.isMatching(card1, this.secondCard as WELLY_Card))
        {
            this.hideCard(card1);
            this.hideCard(card2);

            this.firstCard = undefined;
            this.secondCard = undefined;

            this.remainCardCount -= 2;

            this.checkGameState();
        }
        else
        {
            this.firstCard = undefined;
            this.secondCard = undefined;

            card1.flip?.flip(250);
            card2.flip?.flip(250);

            card2.flip?.once("complete", () => {
                card1.enable();
                card2.enable();
            }, this);
        }
    }

    private checkGameState(): void
    {
        if (this.remainCardCount <= 0)
        {
            this.completeLevel();
        }
    }

    private hideCard(card: WELLY_Card): void
    {
        this.tweens.add({
            targets: card,
            y: card.y - 8,
            duration: 100,
            onComplete: () => {
                this.tweens.add({
                    targets: card,
                    y: card.y + 60,
                    duration: 800,
                    alpha: 0,
                    onComplete: () => { card.setVisible(false); },
                    onCompleteScope: this
                });
            },
            onCompleteScope: this
        });
    }

    private isMatching(card1: WELLY_Card, card2: WELLY_Card): boolean
    {
        return card1.getId() == card2.getId();
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    public update(time: number, delta: number): void
    {
        super.update(time, delta);

        if (this.isGameInProgress)
        {
            this.elapsedTime += delta;
            this.sceneUI.updateChrono(this.elapsedTime);
        }
    }
}