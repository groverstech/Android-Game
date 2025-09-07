import Phaser from 'phaser';

function playBeep(scene, freq = 880, dur = 0.08, type = 'square', volume = 0.1) {
  try {
    const ac = scene.sound.context;
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    // Start volume
    gain.gain.setValueAtTime(volume, ac.currentTime);
    // Smooth fade out to 0
    gain.gain.linearRampToValueAtTime(0, ac.currentTime + dur);

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + dur);

    // Clean up nodes when finished
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  } catch (e) {
    console.warn('playBeep error', e);
  }
}

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    this.state = {
      score: 0,
      distance: 0,
      coins: 0,
      best: Number(localStorage.getItem('rdash_best') || 0),
      shield: 0,
      magnet: 0,
      speedBoost: 0,
      paused: false,
      gameOver: false,
    };
  }

  create() {
    const { width, height } = this.scale;

    // Background
    this.sky = this.add.tileSprite(0, 0, width, height, 'sky').setOrigin(0).setScrollFactor(0);

    // Ground
    this.ground = this.physics.add.staticGroup();
    const tiles = Math.ceil(width / 64) + 2;
    for (let i = 0; i < tiles; i++) {
      const tile = this.ground.create(i * 64, height - 32, 'ground').setOrigin(0, 0.5);
      tile.refreshBody();
    }

    // Player
    this.player = this.physics.add.sprite(160, height - 140, 'player_run_0').setDepth(2);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(40, 60).setOffset(4, 8);

    // Groups
    this.obstacles = this.physics.add.group();
    this.coins = this.physics.add.group();
    this.powerups = this.physics.add.group();

    // Collisions
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.powerups, this.takePower, null, this);
    this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-P', () => this.togglePause());
    this.input.on('pointerdown', () => this.jump());

    // Spawners
    this.time.addEvent({ delay: 900, loop: true, callback: () => this.spawnObstacle() });
    this.time.addEvent({ delay: 400, loop: true, callback: () => this.maybeSpawnCoin() });
    this.time.addEvent({ delay: 4500, loop: true, callback: () => this.maybeSpawnPower() });

    this.baseSpeed = 340;
    this.speed = this.baseSpeed;
  }

  update(time, delta) {
    if (this.state.paused || this.state.gameOver) return;

    const dt = delta / 1000;

    // Background parallax
    this.sky.tilePositionX += (this.speed / 8) * dt;

    // Fake run animation
    if (this.player.body.onFloor()) {
      const frame = Math.floor(time / 120) % 3;
      this.player.setTexture('player_run_' + frame);
    }

    // Increase difficulty with distance
    this.speed = this.baseSpeed + Math.min(520, this.state.distance / 12);

    if (this.state.speedBoost > 0) {
      this.state.speedBoost -= dt;
      this.speed *= 1.35;
    }

    // Move objects
    [...this.obstacles.getChildren(), ...this.coins.getChildren(), ...this.powerups.getChildren()].forEach((obj) => {
      obj.x -= this.speed * dt;
      if (obj.x < -100) obj.destroy();
    });

    // Distance & score
    this.state.distance += (this.speed * dt) / 16;
    this.state.score += dt * 10 + (this.state.magnet > 0 ? 2 * dt : 0);

    // Magnet effect
    if (this.state.magnet > 0) {
      this.state.magnet -= dt;
      this.coins.getChildren().forEach((c) => {
        const dx = this.player.x - c.x,
          dy = this.player.y - c.y;
        const d = Math.hypot(dx, dy);
        if (d < 240) {
          c.body.velocity.x = (dx / d) * 600;
          c.body.velocity.y = (dy / d) * 600;
        }
      });
    }

    // Shield effect
    if (this.state.shield > 0) {
      this.state.shield -= dt;
      if (!this.shieldFX) {
        this.shieldFX = this.add.image(this.player.x, this.player.y, 'shield').setDepth(1.5);
      }
      this.shieldFX.setPosition(this.player.x, this.player.y);
      this.shieldFX.setScale(1 + 0.05 * Math.sin(time / 120));
      this.shieldFX.setAlpha(0.6);
      if (this.state.shield <= 0) {
        this.shieldFX.destroy();
        this.shieldFX = null;
      }
    }

    // Update HUD
    this.events.emit('hud:update', { ...this.state });
  }

  jump() {
    if (this.state.paused || this.state.gameOver) return;
    if (this.player.body.onFloor()) {
      this.player.setVelocityY(-760);
      this.player.setTexture('player_jump');
      playBeep(this, 660, 0.05, 'triangle', 0.15);
      this.player.doubleJump = true;
    } else if (this.player.doubleJump) {
      this.player.setVelocityY(-680);
      this.player.doubleJump = false;
      playBeep(this, 520, 0.05, 'sawtooth', 0.15);
    }
  }

  spawnObstacle() {
    if (this.state.paused || this.state.gameOver) return;
    const { width, height } = this.scale;

    // Variation in spike distance
    const gap = Phaser.Math.Between(0, 1) ? 0 : Phaser.Math.Between(64, 160);

    const o = this.obstacles.create(width + 48 + gap, height - 96, 'spike');
    o.setImmovable(true);
    o.body.setAllowGravity(false);
    o.body.setSize(44, 28).setOffset(2, 4);
  }

  maybeSpawnCoin() {
    if (this.state.paused || this.state.gameOver) return;
    const { width, height } = this.scale;
    if (Math.random() < 0.8) {
      const coins = Phaser.Math.Between(3, 6);
      const startY = height - Phaser.Math.Between(180, 280);
      for (let i = 0; i < coins; i++) {
        const c = this.coins.create(width + i * 36, startY + Phaser.Math.Between(-20, 20), 'coin');
        c.body.setAllowGravity(false);
        c.body.setCircle(14, 2, 2);
      }
    }
  }

  maybeSpawnPower() {
    if (this.state.paused || this.state.gameOver) return;
    const r = Math.random();
    const { width, height } = this.scale;
    let key = r < 0.34 ? 'shield' : r < 0.67 ? 'magnet' : 'speed';
    const p = this.powerups.create(width + 50, height - Phaser.Math.Between(180, 300), key);
    p.body.setAllowGravity(false);
    p.setData('kind', key);
  }

  collectCoin(player, coin) {
    coin.destroy();
    this.state.coins += 1;
    this.state.score += 5;
    playBeep(this, 1200, 0.03, 'square', 0.12);
  }

  takePower(player, p) {
    const kind = p.getData('kind');
    p.destroy();
    if (kind === 'shield') this.state.shield = 6;
    if (kind === 'magnet') this.state.magnet = 8;
    if (kind === 'speed') this.state.speedBoost = 4;
    playBeep(this, 300, 0.08, 'sine', 0.18);
  }

  hitObstacle(player, obstacle) {
    if (this.state.shield > 0) {
      obstacle.destroy();
      playBeep(this, 200, 0.06, 'triangle', 0.18);
      return;
    }
    this.gameOver();
  }

  gameOver() {
    // 2-second sawtooth buzz with fade-out
    playBeep(this, 80, 0.5, 'sine', 0.25);

    this.state.paused = true;
    this.state.gameOver = true;

    this.player.setTint(0xff6b6b);
    this.player.setVelocity(0, 0);

    this.state.best = Math.max(this.state.best, Math.floor(this.state.score));
    localStorage.setItem('rdash_best', String(this.state.best));

    this.scene.get('UI').events.emit('hud:flash', {
      text: 'GAME OVER - Tap/Space to Restart!',
    });

    // Restart on input
    this.input.once('pointerdown', () => this.scene.restart());
    this.input.keyboard.once('keydown-SPACE', () => this.scene.restart());
    this.input.keyboard.once('keydown-UP', () => this.scene.restart());
  }

  togglePause() {
    if (this.state.gameOver) return;
    this.state.paused = !this.state.paused;
    this.events.emit('hud:pause', this.state.paused);
  }
}
