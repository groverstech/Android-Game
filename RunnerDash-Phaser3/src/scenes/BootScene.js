import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.createProceduralTextures();
  }

  create() {
    this.scene.start('Game');
    this.scene.launch('UI');
  }

  createProceduralTextures() {
    const g = this.add.graphics();

    // Player run frames (3 variations)
    const makeRunner = (frame) => {
      g.clear();
      g.fillStyle(0x42f5b3, 1);
      g.fillRoundedRect(0, 0, 48, 60, 8);
      g.fillStyle(0x0b1220, 1);
      g.fillRect(4, 8, 40, 6);

      g.fillStyle(0x1bd185, 1);
      if (frame === 0) { g.fillRect(6, 60, 10, 14); g.fillRect(30, 60, 10, 14); }
      if (frame === 1) { g.fillRect(0, 60, 10, 14); g.fillRect(36, 60, 10, 14); }
      if (frame === 2) { g.fillRect(10, 60, 10, 14); g.fillRect(26, 60, 10, 14); }

      g.generateTexture('player_run_' + frame, 48, 74);
    };
    for (let i = 0; i < 3; i++) makeRunner(i);

    // Jump
    g.clear();
    g.fillStyle(0x42f5b3, 1);
    g.fillRoundedRect(0, 0, 48, 60, 8);
    g.fillStyle(0x1bd185, 1);
    g.fillRect(6, 60, 34, 8);
    g.generateTexture('player_jump', 48, 68);

    // Ground tile
    g.clear();
    g.fillStyle(0x13233a, 1); g.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 8; i++) {
      g.fillStyle(0x18314f, 1); g.fillRect(i * 8, 48, 6, 10);
    }
    g.generateTexture('ground', 64, 64);

    // Sky background
    g.clear();
    g.fillStyle(0x0f1a2f, 1); g.fillRect(0, 0, 960, 540);
    g.fillStyle(0x273e68, 1);
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * 960, y = Math.random() * 540, r = Math.random() * 2 + 0.5;
      g.fillCircle(x, y, r);
    }
    g.generateTexture('sky', 960, 540);

    // Coin
    g.clear();
    g.fillStyle(0xffcc00, 1); g.fillCircle(16, 16, 16);
    g.fillStyle(0xfff1a1, 1); g.fillCircle(16, 10, 6);
    g.generateTexture('coin', 32, 32);

    // Spike
    g.clear();
    g.fillStyle(0x8ef, 1); g.fillRect(0, 22, 48, 10);
    g.fillStyle(0xeb445a, 1);
    for (let i = 0; i < 6; i++) {
      g.fillTriangle(i * 8, 22, (i * 8) + 8, 22, (i * 8) + 4, 0);
    }
    g.generateTexture('spike', 48, 32);

    // Shield
    g.clear();
    g.lineStyle(4, 0x7df9ff, 1); g.strokeCircle(20, 20, 18);
    g.fillStyle(0x7df9ff, 0.25); g.fillCircle(20, 20, 18);
    g.generateTexture('shield', 40, 40);

    // Magnet
    g.clear();
    g.fillStyle(0xff3366, 1); g.fillRoundedRect(0, 0, 32, 24, 6);
    g.fillStyle(0x0b1220, 1); g.fillRect(0, 0, 8, 10); g.fillRect(24, 0, 8, 10);
    g.generateTexture('magnet', 32, 24);

    // Speed arrow
    g.clear();
    g.fillStyle(0x77e66b, 1); g.fillTriangle(0, 24, 24, 12, 0, 0);
    g.generateTexture('speed', 24, 24);
  }
}
