import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {

  private spawnMode = false;
  
  spinners: Spinner[] = [];

  isVisible(): boolean {
    return this.spinners.length > 0;
  }

  show() {
    this.spawnMode = true;
    this.spawnSpinner();
  }

  private spawnSpinner = (offset = 0) => {
    if (this.spawnMode) {
      if (this.spinners.length < MAX_SPINNERS) {
        const depth = this.spinners.length === 0 ? 0 : 
          (FLOOR_HEIGHT + Math.random() * (FLOOR_DEPTH - FLOOR_HEIGHT));
        const newSpinner = new Spinner(depth, offset);
        newSpinner.die = () => this.spinners.splice(this.spinners.indexOf(newSpinner), 1);
        this.spinners.push(newSpinner);
      }
      setTimeout(() => this.spawnSpinner((offset + 1) % 4), SPAWN_INTERVAL);
    }
  }

  hide = () => {
    this.spawnMode = false;
    this.spinners.forEach(spinner => spinner.requestSuicide = true);
  }
}

export class Spinner {

  x = 0;
  y = 0;
  
  private vx = 0;
  private vy = 0;

  requestSuicide = false;
  die: () => void = () => undefined;

  constructor(
    private depth: number,
    public readonly offset: number,
  ) {
    this.x = (Math.random() - 0.5) * BOUNCE_RADIUS;
    this.y = depth;
    this.applyPhysics();
  }

  private applyPhysics = () => {
    let canDie = false;
    // newtons law
    this.vy += GRAVITY;
    // update position
    this.x += this.vx;
    this.y += this.vy;
    // floor collision
    if (this.y >= this.depth) {
      this.y = this.depth;
      const angle =(4 + Math.random()) * Math.PI /3;
      const currentVelocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      const newVelocity = currentVelocity + VELOCITY_STEP;
      if (newVelocity > KILL_VELOCITY) {
        this.die();
        return;
      }
      this.vy = Math.sin(angle) * newVelocity;
      this.vx = Math.cos(angle) * newVelocity;
      canDie = true;
    }
    // wall collision
    else if (Math.abs(this.x) > BOUNCE_RADIUS) {
      this.x = Math.sign(this.x) * BOUNCE_RADIUS;
      this.vx = -this.vx;
    }

    if (canDie && this.requestSuicide) {
      this.die();
    }
    else {
      setTimeout(this.applyPhysics, TIME_STEP);
    }
  }
}

const VELOCITY_STEP = 10;

const KILL_VELOCITY = 40;

const GRAVITY = 3;

const TIME_STEP = 30;

const SPAWN_INTERVAL = 20;

const MAX_SPINNERS = 20;

const BOUNCE_RADIUS = Math.min(window.outerWidth, 400) / 2;

const FLOOR_DEPTH = window.outerHeight / 2 - 70;

const FLOOR_HEIGHT = - window.outerHeight / 2 + KILL_VELOCITY ** 2 / (2 * GRAVITY);
