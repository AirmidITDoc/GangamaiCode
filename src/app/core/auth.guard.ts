// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

// import { AuthenticationService } from "./services/authentication.service";

// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {
//     constructor(
//         private router: Router,
//         private authenticationService: AuthenticationService
//     ) { }

//     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//         const currentUser = this.authenticationService.currentUserValue;
//         if (currentUser) {
//             // authorised so return true
//             return true;
//         }

//         // not logged in so redirect to login page with the return url
//         this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
//         return false;
//     }
// }

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService, MenuItem } from "./services/authentication.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private toastr: ToastrService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> {
        if (!this.authenticationService.currentUserValue) {
            return this.loginRedirect(state.url);
        }

        const path = this.pathOnly(state.url);
        if (path === '/dashboard/home') {
            return true;
        }

        return this.authenticationService.getNavigationData().pipe(
            map(menus => this.hasAccess(menus, path) || this.router.parseUrl('/forbidden')),
            catchError(error => {
                if (!this.authenticationService.currentUserValue) {
                    return of(this.loginRedirect(state.url));
                }
                console.error('Unable to verify page access.', error);
                this.toastr.error('Unable to load page permissions. Please try again.', 'Access error');
                return of(this.router.parseUrl('/forbidden'));
            })
        );
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> {
        return this.canActivate(route, state);
    }

    private loginRedirect(url: string): UrlTree {
        return this.router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: url } });
    }

    private pathOnly(url: string): string {
        const tree = this.router.parseUrl(url);
        tree.queryParams = {};
        tree.fragment = null;
        return this.router.serializeUrl(tree).replace(/\/+$/, '') || '/';
    }

    // private hasAccess(menus: MenuItem[], path: string): boolean {
    //     return menus.some(menu => {
    //         if (!menu || typeof menu !== 'object') {
    //             return false;
    //         }
    //         return (menu.isView !== false && typeof menu.url === 'string'
    //             && this.pathOnly('/' + menu.url.replace(/^\/+/, '')) === path)
    //             || (Array.isArray(menu.children) && this.hasAccess(menu.children, path));
    //     });
    // }

    private hasAccess(menus: MenuItem[], path: string): boolean {
        return menus.some(menu => {
            if (!menu || typeof menu !== 'object') {
                return false;
            }

            const menuPath = typeof menu.url === 'string'
                ? this.pathOnly('/' + menu.url.replace(/^\/+/, ''))
                : '';

            return (
                (menu.isView !== false &&
                    (menuPath === path ||
                        (menuPath !== '' && path.startsWith(menuPath + '/')))
                ) ||
                (Array.isArray(menu.children) &&
                    this.hasAccess(menu.children, path))
            );
        });
    }
}