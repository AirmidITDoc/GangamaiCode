import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FuseNavigation } from "@fuse/types";

import { User } from "../models/user";
import { Router } from "@angular/router";
import { LocationStrategy } from '@angular/common';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { ApiCaller } from "./apiCaller";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseNavigationService} _fuseNavigationService
     */
    navigation: any;
    constructor(private router: Router, private http: ApiCaller,
        private _fuseNavigationService: FuseNavigationService,
        private locationStrategy: LocationStrategy) {
        this.currentUserSubject = new BehaviorSubject<User>(
            JSON.parse(localStorage.getItem("currentUser"))
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    getCaptcha(): Observable<any> {
        return this.http.GetData('Login/GetCaptcha',false);
    }
    
    login(data: any): Observable<any> {
        return (this.http.PostData('Login/Authenticate', data,false).pipe(map((user) => {
            if (user) {
                localStorage.setItem("currentUser", JSON.stringify(user));
                this.currentUserSubject.next(user);
            }
            return user;
        })));
    }
    
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem("currentUser");
        this.currentUserSubject.next(null);
        this.router.navigate(["main/auth/login"]);
    }
    
    preventBackButton() {
        history.pushState(null, null, window.location.href);
        this.locationStrategy.onPopState(() => {
            history.pushState(null, null, window.location.href);
        });
    }
    
    
    getNavigationData() {
        // if (this._fuseNavigationService.getNavigation("main1")) {
        //     return;
        // }
        return this.http.GetData('login/get-menus').subscribe((data: any[]) => {
            this.navigation = data;
            try {
                this._fuseNavigationService.unregister('main1');
            } catch {
    
            }
            this._fuseNavigationService.register("main1", this.navigation);
            this._fuseNavigationService.setCurrentNavigation("main1");
        });
    
    }
}
