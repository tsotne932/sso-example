import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  public redirectUrl: string = "";
  constructor(private _http: HttpClient, private _storage: StorageService) { }



  isLoggedIn() {
    ///api/v3/session/employee
    ///api/v3/session/public
    return this._http.get<{ result: { data: any } }>('/api/v3/session/employee').pipe(map(res => {
      if (res.result && res.result.data) {
        return true;
      } return false;
    }), catchError(() => of(false)));
  }
}
