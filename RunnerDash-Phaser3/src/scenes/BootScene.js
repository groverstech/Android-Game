import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor(){ super('Boot'); }

  preload(){
    // Generate textures procedurally for a zero-asset start
    this.createProceduralTextures();
  }

  create(){
    this.scene.start('Game');
    this.scene.launch('UI');
  }

  createProceduralTextures(){
    const g = this.add.graphics();

    // Player run frames (simple stylized rectangle guy)
    const makeRunner = (frame, offset) => {
      g.clear();
      g.fillStyle(0x42f5b3, 1);
      g.fillRoundedRect(0, 0, 48, 60, 8);
      // face stripe
      g.fillStyle(0x0b1220, 1);
      g.fillRect(4, 8, 40, 6);
      // legs animation
      g.fillStyle(0x1bd185, 1);
      if (frame === 0){ g.fillRect(6, 60, 10, 14); g.fillRect(30, 60, 10, 14); }
      if (frame === 1){ g.fillRect(0, 60, 10, 14); g.fillRect(36, 60, 10, 14); }
      if (frame === 2){ g.fillRect(10, 60, 10, 14); g.fillRect(26, 60, 10, 14); }
      this.textures.addSpriteSheet('player_run_'+frame, g.generateTexture('tmp'+offset+frame, 48, 74), {
        frameWidth: 48, frameHeight: 74, endFrame: 0
      });
    };
    for(let i=0;i<3;i++){ makeRunner(i, i*10); }

    // Jump texture
    g.clear(); g.fillStyle(0x42f5b3,1); g.fillRoundedRect(0,0,48,60,8); g.fillStyle(0x1bd185,1); g.fillRect(6,60,34,8);
    this.textures.addSpriteSheet('player_jump', g.generateTexture('player_jump_tmp', 48, 68), {frameWidth:48, frameHeight:68});

    // Ground tile
    g.clear();
    g.fillStyle(0x13233a, 1); g.fillRect(0,0,64,64);
    for(let i=0;i<8;i++){ g.fillStyle(0x18314f,1); g.fillRect(i*8, 48, 6, 10); }
    this.textures.addSpriteSheet('ground', g.generateTexture('ground_tmp', 64, 64), {frameWidth:64, frameHeight:64});

    // Sky stars parallax
    g.clear();
    g.fillStyle(0x0f1a2f, 1); g.fillRect(0,0,960,540);
    g.fillStyle(0x273e68, 1);
    for(let i=0;i<120;i++){ const x=Math.random()*960, y=Math.random()*540, r=Math.random()*2+0.5; g.fillCircle(x,y,r); }
    this.textures.addSpriteSheet('sky', g.generateTexture('sky_tmp', 960, 540), {frameWidth:960, frameHeight:540});

    // Coin
    g.clear();
    g.fillStyle(0xffcc00, 1); g.fillCircle(16,16,16);
    g.fillStyle(0xfff1a1,1); g.fillCircle(16,10,6);
    this.textures.addSpriteSheet('coin', g.generateTexture('coin_tmp',32,32), {frameWidth:32, frameHeight:32});

    // Spike obstacle
    g.clear();
    g.fillStyle(0x8ef,1); g.fillRect(0,22,48,10);
    g.fillStyle(0xeb445a,1);
    for(let i=0;i<6;i++){ g.fillTriangle(i*8,22,(i*8)+8,22,(i*8)+4,0); }
    this.textures.addSpriteSheet('spike', g.generateTexture('spike_tmp',48,32), {frameWidth:48, frameHeight:32});

    // Shield power-up
    g.clear();
    g.lineStyle(4, 0x7df9ff, 1); g.strokeCircle(20,20,18);
    g.fillStyle(0x7df9ff,0.25); g.fillCircle(20,20,18);
    this.textures.addSpriteSheet('shield', g.generateTexture('shield_tmp',40,40), {frameWidth:40, frameHeight:40});

    // Magnet power-up
    g.clear();
    g.fillStyle(0xff3366,1); g.fillRoundedRect(0,0,32,24,6);
    g.fillStyle(0x0b1220,1); g.fillRect(0,0,8,10); g.fillRect(24,0,8,10);
    this.textures.addSpriteSheet('magnet', g.generateTexture('magnet_tmp',32,24), {frameWidth:32, frameHeight:24});

    // Speed power-up
    g.clear();
    g.fillStyle(0x77e66b,1); g.fillTriangle(0,24,24,12,0,0);
    this.textures.addSpriteSheet('speed', g.generateTexture('speed_tmp',24,24), {frameWidth:24, frameHeight:24});
  }
}
