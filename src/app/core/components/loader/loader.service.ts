import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoaderService {

  private _loaderSubject = new Subject<boolean>();
  public loaderState = this._loaderSubject.asObservable();

  constructor(private _router: Router) {
    this.routeNavigationStart();
  }

  show() {
    debugger
    this._loaderSubject.next(true);
  }

  hide() {
    this._loaderSubject.next(false);
  }

  routeNavigationStart() {
    this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.hide();
      }
    });
  }
}
