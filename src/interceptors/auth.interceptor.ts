import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = localStorage.getItem("accessToken");
  const authReq = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 || 403) {
        const refreshToken = localStorage.getItem("refreshToken");
        return authService.refreshAccessToken(refreshToken).pipe(
          switchMap((newAccessToken) => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newAccessToken}` }
            });
            return next(retryReq);
          }),
          catchError(() => {
            authService.logout();
            return throwError(() => err);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
