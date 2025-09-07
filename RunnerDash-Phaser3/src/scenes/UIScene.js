import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor(){ super('UI'); }

  create(){
    const { width } = this.scale;
    this.hud = this.add.text(20, 16, '', { fontFamily: 'monospace', fontSize: '18px', color: '#cfe7ff' }).setDepth(10);
    this.banner = this.add.text(width/2, 60, 'RUNNER DASH', { fontFamily: 'monospace', fontSize: '28px', color: '#9cc2ff' }).setOrigin(0.5).setDepth(10);

    this.input.keyboard.on('keydown-SPACE', ()=> this.scene.get('Game').jump());
    this.input.keyboard.on('keydown-UP', ()=> this.scene.get('Game').jump());

    this.addHelp();

    const game = this.scene.get('Game');
    game.events.on('hud:update', (state)=> this.updateHUD(state));
    game.events.on('hud:pause', (isPaused)=> this.banner.setText(isPaused ? 'PAUSED (P to resume)' : 'RUNNER DASH'));
    this.events.on('hud:flash', ({text})=> {
      this.banner.setText(text);
      this.time.delayedCall(1200, ()=> this.banner.setText('RUNNER DASH'));
    });
  }

  addHelp(){
    const { width, height } = this.scale;
    const help = [
      'Tap/Click or SPACE/UP to Jump (double jump allowed)',
      'P = Pause/Resume',
      'Coin x5 pts · Shield/Magnet/Speed power-ups',
      'Goal: Run far, collect coins, avoid spikes',
      'Brand: Market Surge · Grovers Technologies'
    ];
    this.add.text(width-24, height-24, help.join('\n'), { fontFamily: 'monospace', fontSize:'14px', color:'#86b7ff', align:'right' }).setOrigin(1).setAlpha(0.85);
  }

  updateHUD(state){
    const s = `Score ${Math.floor(state.score)}   Coins ${state.coins}   Best ${state.best}   Dist ${Math.floor(state.distance)}m`;
    this.hud.setText(s);
  }
}
