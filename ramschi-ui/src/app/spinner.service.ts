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

  private spawnSpinner = () => {
    if (this.spawnMode && this.spinners.length < MAX_SPINNERS) {
      const depth = this.spinners.length === 0 ? 0 : (3 * Math.random() - 1) * FLOOR_DEPTH;
      this.spinners.push(new Spinner(depth));
      setTimeout(this.spawnSpinner, SPAWN_INTERVAL);
    }
  }

  hide = () => {
    this.spawnMode = false;
    this.spinners.forEach(spinner => 
      spinner.requestSuicide(() => {
        this.spinners.splice(this.spinners.indexOf(spinner), 1)
      }
  ));
  }
}

export class Spinner {

  x = 0;
  y = 0;
  
  private vx = 0;
  private vy = 0;

  private suicideCallback: (() => void) | undefined = undefined;

  constructor(private depth: number) {
    this.x = (Math.random() - 0.5) * BOUNCE_RADIUS;
    this.y = depth;
    this.applyPhysics();
  }

  private applyPhysics = () => {
    let canDie = false;
    // newtons law
     this.vy += GRAVITY;
    // floor collision
    if (this.y >= this.depth) {
      this.y = this.depth;
      const angle =(4 + Math.random()) * Math.PI /3;
      const currentVelocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      const newVelocity = Math.min(currentVelocity + START_VELOCITY, MAX_VELOCITY);
      this.vy = Math.sin(angle) * newVelocity;
      this.vx = Math.cos(angle) * newVelocity;
      canDie = true;
    }
    // wall collision
    else if (Math.abs(this.x) > BOUNCE_RADIUS) {
      this.x = Math.sign(this.x) * BOUNCE_RADIUS;
      this.vx = -this.vx;
    }
    // update position
    this.x += this.vx;
    this.y += this.vy;

    if (canDie && this.suicideCallback) {
      this.suicideCallback();
    }
    else {
      setTimeout(this.applyPhysics, TIME_STEP);
    }
  }

  requestSuicide(callback: () => void) {
    this.suicideCallback = callback;
  }
}

const FLOOR_DEPTH = 100;

const START_VELOCITY = 10;

const MAX_VELOCITY = 30;

const GRAVITY = 3;

const TIME_STEP = 30;

const SPAWN_INTERVAL = 100;

const MAX_SPINNERS = 20;

const BOUNCE_RADIUS = Math.min(window.outerWidth, 400) / 2;
