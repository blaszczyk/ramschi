import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {

  private visible = false;

  private timeout: any;
  
  spinners: Spinner[] = [];

  isVisible(): boolean {
    return this.visible;
  }

  show() {
    this.visible = true;
    this.spawnSpinner();
  }

  private spawnSpinner = () => {
    const depth = (3 * Math.random() - 1) * FLOOR_DEPTH;
    this.spinners.push(new Spinner(depth));
    if (this.spinners.length <= MAX_SPINNERS) {
      this.timeout = setTimeout(this.spawnSpinner, SPINNER_GENERATION_TIME);
    }
  }

  private killSpinner = () => {
    this.spinners.pop()?.close();
    if (this.spinners.length) {
      this.timeout = setTimeout(this.killSpinner, SPINNER_KILL_TIME);
    }
    else {
      this.visible = false;
    }
  }

  hide() {
    clearTimeout(this.timeout);
    this.killSpinner();
  }
}

export class Spinner {

  private get bounceRadius(): number {
    return Math.min(window.outerWidth, 400) / 2;
  }

  x = 0;
  y = 0;
  
  private vx = 0;
  private vy = 0;

  private timeout: any;

  constructor(private depth: number) {
    this.x = (2 * Math.random() - 1) * this.bounceRadius;
    this.y = depth;
    this.applyPhysics();
  }

  private applyPhysics = () => {
    // newtons law
     this.vy += GRAVITY;
    // floor collision
    if (this.y >= this.depth) {
      this.y = this.depth;
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

const SPINNER_GENERATION_TIME = 100;

const SPINNER_KILL_TIME = 25;

const MAX_SPINNERS = 20;
