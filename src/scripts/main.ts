import Phaser from 'phaser';
import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin.js';
import { ScenePreloadAssets } from "./Scenes/ScenePreloadAssets";
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { CST } from './CST';

document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.style.overflow = "hidden";

new Phaser.Game({
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.MAX_ZOOM,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    width: window.innerWidth,
    height: window.innerHeight,
    dom: { createContainer: true },
    scene: [ScenePreloadAssets],
    backgroundColor: CST.STYLE.COLOR.BLUE,
    render: { pixelArt: false, transparent: false },
    physics: { 
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    plugins: {
        global: [
            { key: 'rexOutlinePipeline', plugin: OutlinePipelinePlugin, start: true }
        ],
        scene: [{ key: 'rexUI', plugin: UIPlugin, mapping: 'rexUI', start: true }]
    }
});