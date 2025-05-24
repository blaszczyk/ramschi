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

  update() {
    this.spinners.forEach(spinner => {
      const mustDie = spinner.applyPhysics();
      if (mustDie) {
        this.spinners.splice(this.spinners.indexOf(spinner), 1);
      }
    });
    if (this.spawnMode && this.spinners.length < MAX_SPINNERS) {
      this.spawnSpinner();
    }
    if (this.spawnMode || this.spinners.length > 0) {
      setTimeout(() => this.update(), TIME_STEP);
    }
  }

  private spawnSpinner = () => {
        const depth = this.spinners.length === 0 ? 0 : 
          (FLOOR_HEIGHT + Math.random() * (FLOOR_DEPTH - FLOOR_HEIGHT));
        const newSpinner = new Spinner(depth, this.offset % 4);
        this.offset++;
        this.spinners.push(newSpinner);
  }

  hide = () => {
    this.spawnMode = false;
    this.spinners.forEach(spinner => spinner.suicideRequested = true);
  }
}

export class Spinner {

  x = 0;
  y = 0;
  
  private vx = 0;
  private vy = 0;

  suicideRequested = false;

  constructor(
    private depth: number,
    public readonly offset: number,
  ) {
    this.x = (Math.random() - 0.5) * BOUNCE_RADIUS;
    this.y = depth;
    this.applyPhysics();
  }

  applyPhysics = () => {
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
        return true;
      }
      this.vy = Math.sin(angle) * newVelocity;
      this.vx = Math.cos(angle) * newVelocity;
      return this.suicideRequested;
    }
    // wall collision
    else if (Math.abs(this.x) > BOUNCE_RADIUS) {
      this.x = Math.sign(this.x) * BOUNCE_RADIUS;
      this.vx = -this.vx;
    }
    return false;
  }
}

const VELOCITY_STEP = 10;

const KILL_VELOCITY = 40;

const GRAVITY = 3;

const TIME_STEP = 30;

const MAX_SPINNERS = 20;

const BOUNCE_RADIUS = Math.min(window.outerWidth, 400) / 2;

const FLOOR_DEPTH = window.outerHeight / 2 - 100;

const FLOOR_HEIGHT = - window.outerHeight / 2 + KILL_VELOCITY ** 2 / (2 * GRAVITY);
