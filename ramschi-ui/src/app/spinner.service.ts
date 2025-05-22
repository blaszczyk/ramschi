import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {

  private visible = false;

  x = 0;
  y = 0;

  private vx = 0;
  private vy = 0;

  private get bounceRadius(): number {
    return Math.min(window.outerWidth, 400) / 2;
  }

  isVisible(): boolean {
    return this.visible;
  }

  show() {
    this.visible = true;
    this.x = 0;
    this.y = FLOOR_DEPTH;
    this.applyPhysics();
  }

  hide() {
    this.visible = false;
  }

  private applyPhysics = () => {
    if( !this.visible ) {
      return;
    }
    // wall collision
    if (Math.abs(this.x) > this.bounceRadius) {
      this.vx = -this.vx;
    }
    // floor collision
    if (this.y >= FLOOR_DEPTH) {
      this.y = FLOOR_DEPTH;
      const angle =(4 + Math.random()) * Math.PI /3;
      this.vy = Math.sin(angle) * START_VELOCITY;
      this.vx = Math.cos(angle) * START_VELOCITY;
    }
    // newtons law
    else {
     this.vy += GRAVITY;
    }
    // update position
    this.x += this.vx;
    this.y += this.vy;
    setTimeout(this.applyPhysics, TIME_STEP);
  }
}

const FLOOR_DEPTH = 100;

const START_VELOCITY = 30;

const GRAVITY = 3;

const TIME_STEP = 30;
