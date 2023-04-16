import { Component, OnDestroy, OnInit,ViewChild, ViewEncapsulation } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";
import { FuseConfigService } from "@fuse/services/config.service";
import { navigation } from "app/navigation/navigation";
import { AuthenticationService } from "app/core/services/authentication.service";
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { NotificationServiceService } from 'app/core/notification-service.service';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { ProfieComponent } from '../../../main/administration/profie/profie.component';
// import { ChangePasswordComponent } from '../../../main/administration/change-password/change-password.component';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
// import { CreateUserComponent } from "app/main/administration/create-user/create-user.component";
// import { UserDetailsComponent } from "app/main/administration/user-details/user-details.component";
// import { MyprofileComponent } from "app/main/administration/myprofile/myprofile.component";


@Component({
    selector: "toolbar",
    templateUrl: "./toolbar.component.html",
    styleUrls: ["./toolbar.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    user: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private accountService: AuthenticationService,
        private router: Router,
        public _matDialog: MatDialog,
    ) {
        // Set the defaults
        this.userStatusOptions = [
            {
                title: "Online",
                icon: "icon-checkbox-marked-circle",
                color: "#4CAF50",
            },
            {
                title: "Away",
                icon: "icon-clock",
                color: "#FFC107",
            },
            {
                title: "Do not Disturb",
                icon: "icon-minus-circle",
                color: "#F44336",
            },
            {
                title: "Invisible",
                icon: "icon-checkbox-blank-circle-outline",
                color: "#BDBDBD",
            },
            {
                title: "Offline",
                icon: "icon-checkbox-blank-circle-outline",
                color: "#616161",
            },
        ];

        this.languages = [
            {
                id: "en",
                title: "English",
                flag: "us",
            },
            {
                id: "tr",
                title: "Turkish",
                flag: "tr",
            },
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar =
                    settings.layout.navbar.position === "top";
                this.rightNavbar = settings.layout.navbar.position === "right";
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {
            id: this._translateService.currentLang,
        });

        this.user = this.accountService.currentUserValue;
        this.accountService.currentUser.subscribe((x) => (this.user = x));
    }

    logout() {
        this.accountService.logout();
    }
    navigateToDash() {
        this.router.navigate(['/dashboard']);
    }

    navigateToDialyDash() {
        this.router.navigate(['/dashboard/daily-dashboard']);
    }

    navigateToFinancDash() {
        // this.accountService.logout();
        this.router.navigate(['/dashboard/Inventory-dashboard']);
    }

    navigateToPathDash() {
        // this.accountService.logout();
        this.router.navigate(['/dashboard/Pathology-dashboard']);
    }

    navigateToCashlessDashboard() {
        // this.accountService.logout();
        this.router.navigate(['/dashboard/Cashless-dashboard']);
    }
    
    
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    // addNewProfile() {
    //     const dialogRef = this._matDialog.open(MyprofileComponent,
    //       {
    //         maxWidth: "52vw",
    //           maxHeight: "93vh", width: '100%',
    //       });
    //     dialogRef.afterClosed().subscribe(result => {
          
    //     });
    //   }

    //   addchangePassword() {
    //     const dialogRef = this._matDialog.open(ChangePasswordComponent,
    //       {
    //         maxWidth: "50vw",
    //         maxHeight: "60vh", 
    //       });
    //     dialogRef.afterClosed().subscribe(result => {
          
    //     });
    //   }
    


}
