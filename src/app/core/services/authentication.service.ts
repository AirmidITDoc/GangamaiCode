// import { Injectable } from "@angular/core";
// import { BehaviorSubject, Observable } from "rxjs";
// import { map } from "rxjs/operators";

// import { LocationStrategy } from '@angular/common';
// import { Router } from "@angular/router";
// import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
// import { User } from "../models/user";
// import { ApiCaller } from "./apiCaller";

// @Injectable({ providedIn: "root" })
// export class AuthenticationService {
//     private currentUserSubject: BehaviorSubject<User>;
//     public currentUser: Observable<User>;
//     /**
//      * Constructor
//      *
//      * @param {DOCUMENT} document
//      * @param {FuseNavigationService} _fuseNavigationService
//      */
//     navigation: any;
//     constructor(private router: Router, private http: ApiCaller,
//         private _fuseNavigationService: FuseNavigationService,
//         private locationStrategy: LocationStrategy) {
//         this.currentUserSubject = new BehaviorSubject<User>(
//             JSON.parse(localStorage.getItem("currentUser"))
//         );
//         this.currentUser = this.currentUserSubject.asObservable();
//     }
//     public get currentUserValue(): User {
//         return this.currentUserSubject.value;
//     }
//     getCaptcha(): Observable<any> {
//         return this.http.GetData('Login/GetCaptcha');
//     }

//     getDBInfo(): Observable<any> {
//         return this.http.GetData('DbInfo/DBInformation');
//     }

//     login(data: any): Observable<any> {
//         return (this.http.PostData('Login/Authenticate', data).pipe(map((user) => {
//             if (user.status == "Ok") {
//                 localStorage.setItem("currentUser", JSON.stringify(user));
//                 this.currentUserSubject.next(user);
//             }
//             return user;
//         })));
//     }
//     confirmlogin(data: any): Observable<any> {
//         return (this.http.PostData('Login/ConfirmAuthenticate', data).pipe(map((user) => {
//             if (user.status == "Ok") {
//                 localStorage.setItem("currentUser", JSON.stringify(user));
//                 this.currentUserSubject.next(user);
//             }
//             return user;
//         })));
//     }

//     logout(): Observable<any> {
//         // remove user from local storage to log user out
//         return (this.http.PostData('Login/logout', null).pipe(map((user) => {
//             localStorage.removeItem("currentUser");
//             this.currentUserSubject.next(null);
//             this.router.navigate(["auth/login"]);
//             return user;
//         })));
//     }

//     preventBackButton() {
//         history.pushState(null, null, window.location.href);
//         this.locationStrategy.onPopState(() => {
//             history.pushState(null, null, window.location.href);
//         });
//     }


//     getNavigationData() {
//         // if (this._fuseNavigationService.getNavigation("main1")) {
//         //     return;
//         // }
//         return this.http.GetData('login/get-menus').subscribe((data: any[]) => {
//             // console.log(data)
//             this.navigation = data;
//             try {
//                 this._fuseNavigationService.unregister('main1');
//             } catch {

//             }
//             this._fuseNavigationService.register("main1", this.navigation);
//             this._fuseNavigationService.setCurrentNavigation("main1");
//         });

//     }
// }

import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, TimeoutError, from, of, throwError, timer } from "rxjs";
import { catchError, finalize, map, retry, shareReplay, switchMap, tap, timeout } from "rxjs/operators";

import { LocationStrategy } from '@angular/common';
import { Router } from "@angular/router";
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { User } from "../models/user";
import { ApiCaller } from "./apiCaller";
import { LoginChallenge, LoginEnvelope, LoginEnvelopeService } from "./login-envelope.service";

export interface MenuItem {
    url?: string;
    isView?: boolean;
    children?: MenuItem[];
}

@Injectable({ providedIn: "root" })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private menus: MenuItem[] | null = null;
    private menuRequest: Observable<MenuItem[]> | null = null;
    private menuGeneration = 0;
    private menuNavigationRegistered = false;
    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseNavigationService} _fuseNavigationService
     */
    navigation: any;
    constructor(private router: Router, private http: ApiCaller,
        private _fuseNavigationService: FuseNavigationService,
        private locationStrategy: LocationStrategy,
        private loginEnvelope: LoginEnvelopeService) {
        this.currentUserSubject = new BehaviorSubject<User>(
            JSON.parse(localStorage.getItem("currentUser"))
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    clearSession(): void {
        localStorage.removeItem("currentUser");
        this.clearNavigationData();
        this.currentUserSubject.next(null);
    }

    // check
    getChallenge(): Observable<LoginChallenge> {
        return this.http.GetData('Login/Challenge?loginType=Web').pipe(
            timeout({ first: 20000 }),
            retry({
                count: 1,
                delay: (error) => {
                    if (error instanceof TimeoutError || error.status === 0 || error.status >= 500) {
                        return timer(500);
                    }
                    return throwError(() => error);
                }
            })
        );
    }

    getDBInfo(): Observable<any> {
        return this.http.GetData('DbInfo/DBInformation');
    }

    login(credentials: { username: string; password: string; captchaCode: string },
        challenge: LoginChallenge): Observable<any> {
        return this.authenticateV2(credentials, challenge).pipe(map((user) => {
            if (user.status == "Ok") {
                this.clearNavigationData();
                localStorage.setItem("currentUser", JSON.stringify(user));
                this.currentUserSubject.next(user);
            }
            return user;
        }));
    }

    confirmlogin(data: any): Observable<any> {
        return (this.http.PostData('Login/ConfirmAuthenticateV2', {
            token: data.token,
            loginType: 'Web'
        }).pipe(map((user) => {
            if (user.status == "Ok") {
                this.clearNavigationData();
                localStorage.setItem("currentUser", JSON.stringify(user));
                this.currentUserSubject.next(user);
            }
            return user;
        })));
    }

    private authenticateV2(credentials: { username: string; password: string; captchaCode: string },
        challenge: LoginChallenge): Observable<any> {
        const post = (candidate: LoginChallenge) => from(
            this.loginEnvelope.encrypt(credentials, candidate)
        ).pipe(
            switchMap((envelope: LoginEnvelope) => this.http.PostData('Login/AuthenticateV2', envelope))
        );

        return post(challenge).pipe(
            catchError(error => {
                if (!this.isUnsupportedLoginKey(error)) {
                    return throwError(() => error);
                }
                return this.getChallenge().pipe(switchMap(refreshed => post(refreshed)));
            })
        );
    }

    private isUnsupportedLoginKey(error: any): boolean {
        const body = error?.error;
        const code = body?.code ?? body?.errorCode ?? body?.data?.code ?? body?.data?.errorCode;
        return code === 'LOGIN_KEY_UNSUPPORTED';
    }

    logout(): Observable<any> {
        // remove user from local storage to log user out
        return (this.http.PostData('Login/logout', null).pipe(map((user) => {
            this.clearSession();
            this.router.navigate(["auth/login"]);
            return user;
        })));
    }

    preventBackButton() {
        history.pushState(null, null, window.location.href);
        this.locationStrategy.onPopState(() => {
            history.pushState(null, null, window.location.href);
        });
    }


    getNavigationData(): Observable<MenuItem[]> {
        if (this.menus !== null) {
            return of(this.menus);
        }
        if (this.menuRequest) {
            return this.menuRequest;
        }

        const generation = this.menuGeneration;
        const request = this.http.GetData('login/get-menus').pipe(
            map((data: unknown) => {
                if (generation !== this.menuGeneration) {
                    throw new Error('Menu request belongs to an expired session.');
                }
                if (!Array.isArray(data)) {
                    throw new Error('The menu response is invalid.');
                }
                return data as MenuItem[];
            }),
            tap((data) => {
                const homeMenu = {
                    id: 'home',
                    title: 'Home',
                    type: 'item',
                    icon: 'home',
                    url: '/dashboard/home'
                };
                this.menus = data;
                this.navigation = [homeMenu, ...data];
                if (this.menuNavigationRegistered) {
                    this._fuseNavigationService.unregister("main1");
                }
                this._fuseNavigationService.register("main1", this.navigation);
                this.menuNavigationRegistered = true;
                this._fuseNavigationService.setCurrentNavigation("main1");
            }),
            finalize(() => {
                if (this.menuRequest === request) {
                    this.menuRequest = null;
                }
            }),
            shareReplay({ bufferSize: 1, refCount: false })
        );
        this.menuRequest = request;
        return request;
    }

    private clearNavigationData(): void {
        this.menuGeneration++;
        this.menus = null;
        this.menuRequest = null;
        this.navigation = null;
        if (this.menuNavigationRegistered) {
            this._fuseNavigationService.unregister("main1");
            this._fuseNavigationService.register("main1", []);
            this._fuseNavigationService.setCurrentNavigation("main1");
        }
    }
}
