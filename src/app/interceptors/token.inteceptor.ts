import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from '../service/storage.service';



@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  storage: StorageService;
  constructor(private injector: Injector) {
    this.storage = this.injector.get(StorageService)
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handle(request, next));
  }
  async handle(request: HttpRequest<any>, next: HttpHandler) {
    //private-token შიდა სისტემისთვის
    //public-token მოქალაქის მხარეს
    const token = await this.storage.get('private-token');
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(tap(evt => {
      if (evt instanceof HttpResponse) {
        const sessionToken = evt.headers.get('session-token');
        //private-token შიდა სისტემისთვის
        //public-token მოქალაქის მხარეს
        if (sessionToken)
          this.storage.set('private-token', sessionToken)
      }
    })).toPromise();
  }
}
