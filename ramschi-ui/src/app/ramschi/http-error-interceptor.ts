import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { SpinnerService } from '../spinner.service';
import { inject } from '@angular/core';

export const handleHttpError =
  () =>
  (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
  ): Observable<HttpEvent<unknown>> => {
    const spinner: SpinnerService = inject(SpinnerService);
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        alert(
          `Ein Fehler ist aufgetreten!\n😮${error.status} ${error.statusText}😮\nBitte kontaktiere den Administrator.`,
        );
        spinner.hide();
        return throwError(() => error);
      }),
    );
  };
