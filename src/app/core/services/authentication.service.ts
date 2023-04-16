import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FuseNavigation } from "@fuse/types";

import { User } from "../models/user";
import { Router } from "@angular/router";
import { LocationStrategy } from '@angular/common';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

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
    constructor(private router: Router, private http: HttpClient,
        public _httpClient:HttpClient,
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

    login(userName: string, password: string) {
        debugger;
        console.log(userName,password);
        return (
            this.http
                .post<any>(`login/token`, {
                    userName,
                    password,
                })
                .pipe(
                    map((user) => {
                        // login successful if there's a jwt token in the response
                        if (user && user.token) {
                            // store user details and jwt token in local storage to keep user logged in between page refreshes
                            localStorage.setItem(
                                "currentUser",
                                JSON.stringify(user)
                            );
                            this.currentUserSubject.next(user);
                        }

                        return user;
                    })
                )
        );
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


    getNavigationData(){
       if(this._fuseNavigationService.getNavigation("main1")){
           console.log("already exist")
           return;
       }
        return this.http
            // .post(`Generic/GetByProc?procName=SS_Rtrv_MenuInfo_Login_2`, {UserId:this.authService.currentUserValue.user.id})
            .post(`Generic/GetByProc?procName=SS_Rtrv_MenuInfo_Login_2`, {})
            .subscribe((data: any[]) => {

                var fn: FuseNavigation[] = [
                    {
                        id: "applications",
                        title: "",
                        translate: "",
                        type: "group",
                        icon: "apps",
                        children: [],
                    },
                ];

                //1 get first nav
                let nav = data.map((x) => x.menu_master_link_name);
                var uniqueNav = nav.filter((x, i, a) => a.indexOf(x) == i);//setup
                uniqueNav.map((firstNavName, index) => {
                    let firstNav: FuseNavigation = {
                        id: index.toString(),
                        title: firstNavName,//setup
                        type: "item",
                    };
                    //2 get all second nav
                    let firstNavs = data.filter((m) => m.menu_master_link_name === firstNavName); //===setup
                    var secondNavs = firstNavs.map((x) => x.menu_master_detail_link_name);//menu
                    var secondNavsUnique = secondNavs.filter((x, i, a) => a.indexOf(x) == i);

                    if (secondNavsUnique.length > 0) {
                        firstNav.type = "collapsable";
                        firstNav.icon = firstNavs[0].menu_master_icon;
                        firstNav.children = [];

                        secondNavsUnique.map((secondNavName, indexsub) => {
                            let secondNav: FuseNavigation = {
                                id: `${index}${indexsub}`,
                                type: "item",
                                title: secondNavName
                            };
                            //3 get all third nav
                            let linkSubSubManuObj = firstNavs.filter((x) => x.menu_master_detail_link_name === secondNavName);
                            let linkSubSubManu = linkSubSubManuObj
                                .map((x) => x.menu_master_detail_detail_link_name)
                                .filter((t) => t !== null);
                            var linkSubSubManuUnique = linkSubSubManu.filter((x, i, a) => a.indexOf(x) == i);

                            if (linkSubSubManuUnique.length > 0) {
                                secondNav.type = "collapsable";
                                secondNav.icon = linkSubSubManuObj[0].menu_master_icon;
                                secondNav.children = [];

                                linkSubSubManuUnique.map((xSubS, indexsubsub) => {
                                    let thirdNav: FuseNavigation = {
                                        id: `${index}${indexsub}${indexsubsub}`,
                                        title: xSubS,
                                        type: "item",
                                    };
                                    thirdNav.url = linkSubSubManuObj
                                        .find(x => x.menu_master_detail_detail_link_name === xSubS)
                                        .menu_master_detail_detail_action;
                                    secondNav.children.push(thirdNav);
                                });
                            }
                            else {
                                secondNav.url = linkSubSubManuObj
                                    .find(x => x.menu_master_detail_link_name === secondNav.title)
                                    .menu_master_detail_action;
                            }
                            firstNav.children.push(secondNav);
                        });
                    }
                    else {
                        firstNav.url = data
                            .find(x => x.menu_master_link_name === firstNav.title)
                            .menu_master_action;
                    }
                    fn[0].children.push(firstNav);
                });
                this.navigation = fn;
                try{
                    this._fuseNavigationService.unregister('main1');
                }catch{

                }
                console.log(this.navigation)
                // Register the navigation to the service
                
                this._fuseNavigationService.register("main1", this.navigation);

                // Set the main navigation as our current navigation
                this._fuseNavigationService.setCurrentNavigation("main1");
            });

    }
 
    

}
