export const CST = {
    SCENES: {
        PRELOAD_ASSETS: "PRELOAD_ASSETS",
        GAME: "GAME",
        UI: "UI",
    },
    GAME: {
        DEBUG: false,
        SCALE: 1,
        WIDTH: 100,
        HEIGHT: 100,
        LEVELS: [
            { COLUMNS: 3, ROWS: 2, DURATION_SHOW_CARDS: 1000, MESSAGE_END: "NOT BAD!" },
            { COLUMNS: 4, ROWS: 2, DURATION_SHOW_CARDS: 1000, MESSAGE_END: "DELICIOUS!" },
            { COLUMNS: 4, ROWS: 3, DURATION_SHOW_CARDS: 1200, MESSAGE_END: "WELLY NICE!" },
            { COLUMNS: 6, ROWS: 4, DURATION_SHOW_CARDS: 1800, MESSAGE_END: "" }
        ]
    },
    STYLE: {
        TEXT: {
            FONT_FAMILY: "Kickers-Regular"
        },
        COLOR: {
            ORANGE: "#f1966b",
            BLUE: "#2c4b7e",
            LIGHT_BLUE: "#6782e6",
            WHITE: "#f7e6e6"
        },
        OUTLINE: {
            COLOR: 0xFFFFFF,
            THICKNESS: 2
        },
        BUTTON: {
            TINT: {
                HOVERED: 0x999999,
                PRESSED: 0x444444 
            }
        },
        TOOLTIP: {
            DELAY_DISPLAY: 600,
            OFFSET_LEFT: 6,
            OFFSET_RIGHT: 30,
            OFFSET_BOTTOM: 30,
            OFFSET_TOP: 6,
        }
    },
    EVENTS: {
        UI: {
            TOOLTIP: {
                SHOW: "SHOW_TOOLTIP",
                HIDE: "HIDE_TOOLTIP"
            }
        }
    }
}