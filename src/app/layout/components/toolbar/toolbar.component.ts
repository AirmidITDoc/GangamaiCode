import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
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
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { ProfieComponent } from '../../../main/administration/profie/profie.component';
// import { ChangePasswordComponent } from '../../../main/administration/change-password/change-password.component';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ChangePasswordComponent } from "app/main/administration/create-user/change-password/change-password.component";
import { NotificationService } from "app/core/notification.service";
import { SignalRService } from "app/core/services/signalr.service";
import { ConfigService } from "app/core/services/config.service";
import { ApiCaller } from "app/core/services/apiCaller";
import { LabAppointmentService } from "app/main/Lab Management/lab-appointment/lab-appointment.service";
import { DashboardserviceService } from "app/core/services/dashboardservice.service";
import { ConsentMasterModule } from "app/main/setup/OTManagement/consent-master/consent-master.module";
import { RoleTemplateService } from "app/main/administration/role-template-master/role-template.service";
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
    currentDate: Date = new Date();


    dailydashflag: boolean = false
    Investigationdashflag: boolean = false
    Financedashflag: boolean = false
    Cashlessdashflag: boolean = false
    beddashflag: boolean = false
    Labfinancedashflag: boolean = false
    Pharmacydashflag: boolean = false

    // Demo notification array
    notifications = [];
    unreadCount = 0;

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
        private _fuseSidebarService: FuseSidebarService, private _httpClient1: ApiCaller,
        private _service: LabAppointmentService,
        private _translateService: TranslateService,
        private _authService: RoleTemplateService,

        private _DashboardserviceService: DashboardserviceService,
        private accountService: AuthenticationService, public _configue: ConfigService,
        private router: Router, private signalRService: SignalRService,
        public _matDialog: MatDialog, public _notificationService: NotificationService
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
        setInterval(() => {
            this.currentDate = new Date();
        }, 1);


    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    DashboardconfigParams: any
    DashAcessConfigSetting: any = [];
    async ngOnInit() {


        this.signalRService.addReceiveMessageListener((data, user) => {
            if (JSON.parse(localStorage.getItem("currentUser")).userId == user) {
                this.notifications.unshift({ notiTitle: data.NotiTitle, notiBody: data.NotiBody, id: data.Id, createdDate: data.CreatedDate, redirectUrl: data.RedirectUrl });
                this.unreadCount++;
            }
        });
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
        if (JSON.parse(localStorage.getItem("currentUser"))?.userId > 0) {
            this._notificationService.getNotifications().subscribe((data) => {
                this.notifications = data.list;
                this.unreadCount = data.count;
            });
        }


        // Comment this if no work?
        const result = await this._DashboardserviceService.UserAccConfigSettingParam1();
        this.DashboardconfigParams = result;
        console.log(this.DashboardconfigParams);

        // this.loadData()

        if (this.DashboardconfigParams)
            this.setDashboard()
        // upt0

        // search menu
        this._authService.getFavMenus().subscribe((Menu) => {

            this.allMenus = this.flattenMenus(Menu);

            this.filteredMenus = [];  // 👈 EMPTY initially
        });
    }

    selectedIndex: number = -1;

    handleKeyDown(event: KeyboardEvent) {
        if (!this.filteredMenus || this.filteredMenus.length === 0) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.selectedIndex =
                (this.selectedIndex + 1) % this.filteredMenus.length;
        }

        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.selectedIndex =
                (this.selectedIndex - 1 + this.filteredMenus.length) % this.filteredMenus.length;
        }

        else if (event.key === 'Enter') {
            if (this.selectedIndex >= 0) {
                this.goToMenu(this.filteredMenus[this.selectedIndex]);
            }
        }
    }

    searchmenu(value: string): void {
         this.selectedIndex = -1;
        if (!value || value.trim() === '') {
            this.filteredMenus = [];
            return;
        }

        const lowerValue = value.toLowerCase();

        this.filteredMenus = this.allMenus.filter(menu =>
            menu.fullName.toLowerCase().includes(lowerValue)
        );
    }

    clearSearch(input: HTMLInputElement): void {
        input.value = '';        // clear input
        this.filteredMenus = []; // hide dropdown
    }

    // clearSearch(): void {
    //     this.filteredMenus = [];

    //     // clear input manually
    //     const input = document.querySelector('.menu-search-input') as HTMLInputElement;
    //     if (input) {
    //         input.value = '';
    //     }
    // }

    allMenus: any[] = [];
    filteredMenus: any[] = [];

    flattenMenus(menus: any[], parentName: string = ''): any[] {
        let result = [];

        menus.forEach(menu => {

            const fullName = parentName
                ? parentName + ' > ' + menu.linkName
                : menu.linkName;

            if (menu.linkAction && menu.linkAction !== '#') {
                result.push({
                    ...menu,
                    fullName: fullName   // 👈 useful for UI
                });
            }

            if (menu.children && menu.children.length > 0) {
                result = result.concat(this.flattenMenus(menu.children, fullName));
            }
        });

        return result;
    }

    goToMenu(menu: any) {
        this.filteredMenus = []; // 👈 hide dropdown after click
        this.router.navigate([menu.linkAction]);
    }

    async loadData() {
        const data = await this._DashboardserviceService.UserAccConfigSettingParam1();

        this.DashboardconfigParams = data;
        console.log(this.DashboardconfigParams)
    }


    readNotification(id) {
        this._notificationService.readNotifications(id).subscribe((data) => {
            this.unreadCount--;
        });
    }
    navigateToDailyDashboard() {
        this.router.navigate(['/dashboard']);
    }

    navigateToDailyDashboard1() {
        this.router.navigate(['/dashboard/old-dashboard']);
    }

    navigateToBedOccupancyDashboard() {

        this.router.navigate(['/dashboard/bed-occupancy']);
    }

    navigateToRadiologyDashboard() {

        this.router.navigate(['/dashboard/Radiology-dashboard']);
    }

    navigateToCashlessDashboard() {

        this.router.navigate(['/dashboard/Cashless-dashboard']);
    }

    navigateToPharmacyDashboard() {

        this.router.navigate(['/dashboard/Pharmacy-dashboard']);
    }

    navigateToFinancialDashboard() {

        this.router.navigate(['/dashboard/Financial-dashboard']);
    }
    navigateToLabFinancialDashboard() {

        this.router.navigate(['/dashboard/Lab-Financial-dashboard']);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(true);
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

    addchangePassword() {
        const dialogRef = this._matDialog.open(ChangePasswordComponent,
            {
                maxWidth: "50vw",
                maxHeight: "60vh",
            });
        dialogRef.afterClosed().subscribe(result => {

        });
    }


    setDashboard() {
        console.log(this.DashboardconfigParams)

        const access = this.DashboardconfigParams
            ?.find(x => x.AccessValueName === 'IsDailyDashboard');

        const dailydashData = Number(access?.AccessValue ?? 0);
        if (dailydashData)
            this.dailydashflag = true;

        const access1 = this.DashboardconfigParams
            ?.find(x => x.AccessValueName === 'IsBedAccupancyDashboard');

        const beddashData = Number(access1?.AccessValue ?? 0);

        if (beddashData)
            this.beddashflag = true;


        const access3 = this.DashboardconfigParams
            ?.find(x => x.AccessValueName === 'IsInvestigation');

        const invdashData = Number(access3?.AccessValue ?? 0);
        if (invdashData)
            this.Investigationdashflag = true;


        const access4 = this.DashboardconfigParams
            ?.find(x => x.AccessValueName === 'IsCashlessDashboard');

        const cashlessdashData = Number(access4?.AccessValue ?? 0);
        if (cashlessdashData)
            this.Cashlessdashflag = true;

        const access5 = this.DashboardconfigParams
            ?.find(x => x.AccessValueName === 'IsPharmacy');

        const phardashData = Number(access5?.AccessValue ?? 0);
        if (phardashData)
            this.Pharmacydashflag = true;

        const access6 = this.DashboardconfigParams
            ?.find(x => x.AccessValueName === 'IsFinancialDashboard');

        const finacedashData = Number(access6?.AccessValue ?? 0);
        if (finacedashData)
            this.Financedashflag = true;

        const access7 = this.DashboardconfigParams
            ?.find(x => x.AccessValueName === 'IsLabFinancialDashboard');

        const labdashData = Number(access7?.AccessValue ?? 0);

        if (labdashData)
            this.Labfinancedashflag = true;




        // else {
        //     this.Financedashflag = false
        //     this.router.navigate(['/dashboard']);
        // }



    }

    // navigateToImportExcel() {
    //     this.router.navigate(['/import-excel']);
    // }
}
