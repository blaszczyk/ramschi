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
    this.offset = 0;
    this.update();
  }

  update = () => {
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
      setTimeout(this.update, TIME_STEP);
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

  private x = 0;
  private y = 0;
  private z = 0;
  
  private vx = 0;
  private vy = 0;
  private vz = 0;

  suicideRequested = false;

  constructor(
    private depth: number,
    public readonly offset: number,
  ) {
    this.x = (Math.random() - 0.5) * BOUNCE_RADIUS;
    this.y = depth;
    this.z = 0;
    this.applyPhysics();
  }

  get cssPosition(): string {
    const scale = OBSERVER_DISTANCE / (OBSERVER_DISTANCE - this.z);
    return `translate(${this.x}px, ${this.y}px) scale(${scale})`;
  }

  get zIndex(): number {
    return 10000 + this.z;
  }

  applyPhysics(): boolean {
    // newtons law
    this.vy += GRAVITY;
    // update position
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
    // floor collision
    if (this.y >= this.depth) {
      this.y = this.depth;
      const currentVelocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy + this.vz * this.vz);
      // die if too fast
      if (currentVelocity > KILL_VELOCITY) {
        return true;
      }
      // bounce in random direction
      const newVelocity = currentVelocity + VELOCITY_STEP;
      const azimuth = 2 * Math.PI * Math.random();
      const polar = Math.acos(-1 + 0.5 * Math.random());
      this.vy = newVelocity * Math.cos(polar);
      this.vx = newVelocity * Math.sin(polar) * Math.cos(azimuth);
      this.vz = newVelocity * Math.sin(polar) * Math.sin(azimuth);
      // die if requested
      return this.suicideRequested;
    }
    // wall collisions
    if (Math.abs(this.x) > BOUNCE_RADIUS) {
      this.x = Math.sign(this.x) * BOUNCE_RADIUS;
      this.vx = -this.vx;
    }
    if (Math.abs(this.z) > BOUNCE_RADIUS) {
      this.z = Math.sign(this.z) * BOUNCE_RADIUS;
      this.vz = -this.vz;
    }
    // survive
    return false;
  }
}

const VELOCITY_STEP = 9;

const KILL_VELOCITY = 40;

const GRAVITY = 3;

const TIME_STEP = 30;

const MAX_SPINNERS = 20;

const BOUNCE_RADIUS = Math.min(window.outerWidth, 400) / 2;

const OBSERVER_DISTANCE = 2 * BOUNCE_RADIUS;

const FLOOR_DEPTH = window.outerHeight / 2 - 100;

const FLOOR_HEIGHT = - window.outerHeight / 2 + KILL_VELOCITY ** 2 / (2 * GRAVITY);
