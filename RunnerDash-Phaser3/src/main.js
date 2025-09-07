import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';

const WIDTH = 960;
const HEIGHT = 540;

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#0b1220',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: WIDTH,
    height: HEIGHT
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 1800 }, debug: false }
  },
  scene: [BootScene, GameScene, UIScene]
};

new Phaser.Game(config);
