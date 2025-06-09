import {
  animate,
  query,
  sequence,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const DropDownAnimation = trigger('openClose', [
  state(
    'open',
    style({
      visibility: 'visible',
      height: '*',
      overflow: 'hidden',
    }),
  ),

  state(
    'closed',
    style({
      visibility: 'hidden',
      height: 0,
      overflow: 'hidden',
    }),
  ),

  transition('closed => open', [
    style({ visibility: 'visible', height: 0, overflow: 'hidden' }),
    sequence([
      animate('200ms', style({ height: '*' })),
      query('.menu-button', [
        stagger(20, [
          animate('400ms ease', style({ opacity: 1, transform: 'none' })),
        ]),
      ]),
    ]),
  ]),

  transition('open => closed', [
    style({ height: '*', overflow: 'hidden' }),
    sequence([
      query('.menu-button', [
        stagger(20, [
          animate(
            '100ms ease',
            style({ opacity: 0, transform: 'translateY(-50px)' }),
          ),
        ]),
      ]),
      animate('200ms', style({ height: 0 })),
    ]),
  ]),
]);
