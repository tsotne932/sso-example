import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private _router: Router, private _service: AppService) {
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //ვინახავ სთორიჯში  ახალ ტოკენს, incase cross-storage-მა არ იმუშაოს მომავალში
    const privateToken = route.queryParamMap.get('token');
    if (privateToken) localStorage.setItem('private-token', privateToken);
    const url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }


  async checkLogin(url: string) {

    const logged = await this._service.isLoggedIn().toPromise();
    if (logged) return true;
    this._service.redirectUrl = url;
    ///public   `https://sso.municipal.gov.ge/public/auth/login?redirectUrl=${document.location.href}`;
    document.location.href = `https://sso.municipal.gov.ge/private/auth/login?redirectUrl=${document.location.href}`;
    return false;
  }

}
