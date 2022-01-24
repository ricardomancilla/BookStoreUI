import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpEventType } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';

import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError(err => {
                    switch (err.status) {
                        case 401:
                            this.router.navigateByUrl(`/`);
                            return of();
                        case 0:
                            return throwError(() => new Error('There was an unknown error, please contact Evelin.'));
                        default:
                            return throwError(() => new Error(err));
                    }
                }));
    }
}