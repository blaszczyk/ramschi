import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {

  private visible = false;

  private spawnTimeout: any;
  
  spinners: Spinner[] = [];

  isVisible(): boolean {
    return this.visible;
  }

  show() {
    this.visible = true;
    this.spawnSpinner();
  }

  private spawnSpinner = () => {
    this.spinners.push(new Spinner());
    if (this.spinners.length <= MAX_SPINNERS) {
      this.spawnTimeout = setTimeout(this.spawnSpinner, SPINNER_GENERATION_TIME);
    }
  }

  hide() {
    this.visible = false;
    this.spinners.forEach(spinner => spinner.close());
    this.spinners = [];
    clearTimeout(this.spawnTimeout);
  }
}

export class Spinner {

  private get bounceRadius(): number {
    return Math.min(window.outerWidth, 400) / 2;
  }

  x = 0;
  y = FLOOR_DEPTH;
  
  private vx = 0;
  private vy = 0;

  private timeout: any;

  constructor() {
    this.applyPhysics();
  }

  private applyPhysics = () => {
    // newtons law
     this.vy += GRAVITY;
    // floor collision
    if (this.y >= FLOOR_DEPTH) {
      this.y = FLOOR_DEPTH;
      const angle =(4 + Math.random()) * Math.PI /3;
      this.vy = Math.sin(angle) * START_VELOCITY;
      this.vx = Math.cos(angle) * START_VELOCITY;
    }
    // wall collision
    else if (Math.abs(this.x) > this.bounceRadius) {
      this.x = Math.sign(this.x) * this.bounceRadius;
      this.vx = -this.vx;
    }
    // update position
    this.x += this.vx;
    this.y += this.vy;
    this.timeout = setTimeout(this.applyPhysics, TIME_STEP);
  }

  close() {
    clearTimeout(this.timeout);
  }
}

const FLOOR_DEPTH = 100;

const START_VELOCITY = 30;

const GRAVITY = 3;

const TIME_STEP = 30;

const SPINNER_GENERATION_TIME = 1000;

const MAX_SPINNERS = 7;
