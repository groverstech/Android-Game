import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  create() {
    const { width, height } = this.scale;

    // HUD (score etc.)
    this.hud = this.add
      .text(20, 16, '', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#cfe7ff',
      })
      .setDepth(10);

    // Banner for status messages (pause / game over)
    this.banner = this.add
      .text(width / 2, 60, '', {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#9cc2ff',
      })
      .setOrigin(0.5)
      .setDepth(10);

    // Start instructions
    this.startText = this.add
      .text(width / 2, height / 2, 'Tap / Click / SPACE to Start', {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#86b7ff',
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.addHelp();

    // Hook input for start
    this.started = false;
    this.input.once('pointerdown', () => this.startGame());
    this.input.keyboard.once('keydown-SPACE', () => this.startGame());
    this.input.keyboard.once('keydown-UP', () => this.startGame());
  }

  startGame() {
    this.started = true;
    this.startText.setVisible(false);

    // Allow jumping controls after start
    this.input.keyboard.on('keydown-SPACE', () => this.scene.get('Game').jump());
    this.input.keyboard.on('keydown-UP', () => this.scene.get('Game').jump());
    this.input.on('pointerdown', () => this.scene.get('Game').jump());

    // Link HUD to Game events
    const game = this.scene.get('Game');
    game.events.on('hud:update', (state) => this.updateHUD(state));
    game.events.on('hud:pause', (isPaused) => {
      this.banner.setText(isPaused ? 'PAUSED (P to resume)' : '');
    });
    this.events.on('hud:flash', ({ text }) => {
      this.banner.setText(text);
      this.time.delayedCall(2000, () => this.banner.setText(''));
    });
  }

  addHelp() {
    const { width, height } = this.scale;
    const help = [
      'Controls:',
      ' - Tap/Click or SPACE/UP to Jump (double jump allowed)',
      ' - P = Pause/Resume',
      'Collect coins & power-ups, avoid spikes!',
      'Brand: Market Surge · Grovers Technologies',
    ];
    this.add
      .text(width - 24, height - 24, help.join('\n'), {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#86b7ff',
        align: 'right',
      })
      .setOrigin(1)
      .setAlpha(0.85);
  }

  updateHUD(state) {
    if (!this.started) return;
    const s = `Score ${Math.floor(state.score)}   Coins ${state.coins}   Best ${state.best}   Dist ${Math.floor(
      state.distance
    )}m`;
    this.hud.setText(s);
  }
}
