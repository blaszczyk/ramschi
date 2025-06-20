import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private spawnMode = false;

  private offset = 0;

  spinners: Spinner[] = [];

  isVisible(): boolean {
    return this.spinners.length > 0;
  }

  show() {
    this.spawnMode = true;
    this.update();
  }

  hide() {
    this.spawnMode = false;
  }

  private update = () => {
    this.spinners.forEach((spinner) => {
      const state = spinner.applyPhysics();
      if (state === State.DIE || (state === State.BOUNCE && !this.spawnMode)) {
        this.spinners.splice(this.spinners.indexOf(spinner), 1);
      }
    });
    if (this.spawnMode && this.spinners.length < MAX_SPINNERS) {
      this.spawnSpinner();
    }
    if (this.spinners.length > 0) {
      setTimeout(this.update, TIME_STEP);
    }
  };

  private spawnSpinner = () => {
    const depth =
      this.spinners.length === 0
        ? 0
        : FLOOR_HEIGHT + Math.random() * (FLOOR_DEPTH - FLOOR_HEIGHT);
    this.spinners.push(new Spinner(depth, this.offset, this.offset % 4));
    this.offset++;
  };
}

export class Spinner {
  private x = 0;
  private y = 0;
  private z = 0;

  private vx = 0;
  private vy = 0;
  private vz = 0;

  constructor(
    private depth: number,
    public readonly id: number,
    public readonly offset: number,
  ) {
    this.x = (Math.random() - 0.5) * BOUNCE_RADIUS;
    this.y = depth;
    this.z = 0;
  }

  get cssPosition(): string {
    const scale = OBSERVER_DISTANCE / (OBSERVER_DISTANCE - this.z);
    return `translate(${this.x}px, ${this.y}px) scale(${scale})`;
  }

  get zIndex(): number {
    return 10000 + this.z;
  }

  applyPhysics(): State {
    // newtons law
    this.vy += GRAVITY;
    // move
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
    // floor collision
    if (this.y >= this.depth) {
      this.y = 2 * this.depth - this.y;
      const currentEnergy = this.vx ** 2 + this.vy ** 2 + this.vz ** 2;
      if (currentEnergy > KILL_ENERGY) {
        return State.DIE;
      }
      const newVelocity = Math.sqrt(currentEnergy + BOUNCE_ENERGY);
      const azimuth = 2 * Math.PI * Math.random();
      const polar = Math.acos(-1 + 0.5 * Math.random());
      this.vy = newVelocity * Math.cos(polar);
      this.vx = newVelocity * Math.sin(polar) * Math.cos(azimuth);
      this.vz = newVelocity * Math.sin(polar) * Math.sin(azimuth);
      return State.BOUNCE;
    }
    // wall collisions
    if (Math.abs(this.x) > BOUNCE_RADIUS) {
      this.x = 2 * Math.sign(this.x) * BOUNCE_RADIUS - this.x;
      this.vx = -this.vx;
    }
    if (Math.abs(this.z) > BOUNCE_RADIUS) {
      this.z = 2 * Math.sign(this.z) * BOUNCE_RADIUS - this.z;
      this.vz = -this.vz;
    }
    return State.SURVIVE;
  }
}

const BOUNCE_ENERGY = 200;

const KILL_ENERGY = 1600;

const GRAVITY = 3;

const TIME_STEP = 30;

const MAX_SPINNERS = 20;

const BOUNCE_RADIUS = Math.min(window.outerWidth, 400) / 2;

const OBSERVER_DISTANCE = 2 * BOUNCE_RADIUS;

const FLOOR_DEPTH = window.outerHeight / 2 - 100;

const FLOOR_HEIGHT = -window.outerHeight / 2 + KILL_ENERGY / (2 * GRAVITY);

enum State {
  SURVIVE,
  DIE,
  BOUNCE,
}
