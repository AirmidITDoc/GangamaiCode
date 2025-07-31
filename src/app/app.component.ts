

import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, Subscription, fromEvent } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as navigationTurkish } from 'app/navigation/i18n/tr';
import { navigation } from 'app/navigation/navigation';
import { AuthenticationService } from './core/services/authentication.service';
import { ConfigService } from './core/services/config.service';
import { SpinnerService } from './core/services/spinner.service';
// import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Idle } from 'idlejs/dist';
import { ApiCaller } from './core/services/apiCaller';
import { BandwidthService } from './core/services/bandwidth.service';
import { SignalRService } from './core/services/signalr.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    // standalone:true,
    // imports: [FuseProgressBarModule,FuseThemeOptionsModule,FuseSidebarModule,LoaderModule],
})
export class AppComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;
    url: any;
    isOffLine: boolean;
    onlineEvent: Observable<Event>;
    offlineEvent: Observable<Event>;
    subscriptions: Subscription[] = [];
    isLoading: boolean = true;
    configSettingParam: any = [];
      configSettingParam1: any = [];
    newconfigSettingParam: any = [];
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */

    idle = new Idle().whenNotInteractive().within(10).do(() => {
        this.url = this.router.url;
        // console.log('this.url==', this.url);
        if (this.url !== '/auth/login') {
            alert('You are being timed out due to inactivity. Please Log-In again.');
            this.dialogRef ? this.dialogRef.closeAll() : '';
            this.router.navigate(['auth/login'], { replaceUrl: true });
            //   this.logoutService();
        }
    }).start();

    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
        private http: HttpClient,
        private _httpClient1: ApiCaller,

        private authService: AuthenticationService,
        private dialogRef: MatDialog,
        private configService: ConfigService,
        private globalEvent$: SpinnerService,
        private ngxSpinner$: SpinnerService,
        private _loading: SpinnerService,
        private router: Router,
        private bandwidthService: BandwidthService,
        private signalRService: SignalRService,
    ) {

        this.bandwidthService.monitorBandwidth();

        this.onlineEvent = fromEvent(window, 'online');
        this.offlineEvent = fromEvent(window, 'offline');

        // Prevent browser back button
        this.authService.preventBackButton();

        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        this._translateService.addLangs(['en', 'tr']);

        // Set the default language
        this._translateService.setDefaultLang('en');

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationTurkish);

        // Use a language
        this._translateService.use('en');

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();

    }
    loading: boolean = false;
    listenToLoading(): void {
        this._loading.loadingSub
            .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
            .subscribe((loading) => {
                this.loading = loading;
            });
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    send() {
        this.signalRService.sendMessage('AngularUser', 'Hello from Angular!');
    }

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        // debugger
        this.signalRService.startConnection();
        //this.signalRService.addReceiveMessageListener();

        //check connection
        this.subscriptions.push(this.onlineEvent.subscribe(e => {
            this.isOffLine = false;
        }));

        this.subscriptions.push(this.offlineEvent.subscribe(e => {
            this.isOffLine = true;
        }));

        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Boxed
                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                }
                else {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for (let i = 0; i < this.document.body.classList.length; i++) {
                    const className = this.document.body.classList[i];

                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });
        this.authService.currentUser.subscribe((d: any) => {
            if ((d?.userToken ?? "") != "") {
                // debugger
                this.authService.getNavigationData();
                this.ConfigSettingParam();
                this.ConfigSettingParamNew();
            }
        });
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

    ConfigSettingParam() {
        var Params =
        {
            "searchFields": [
                {
                    "fieldName": "ConfigId",
                    "fieldValue": "1",
                    "opType": "Equals"
                }
            ],
            "mode": "SysConfig"
        }
        this._httpClient1
            .PostData("Common", Params).subscribe(data => {
                this.configSettingParam = data;
                console.log(data);
                this.configService.setCongiParam(this.configSettingParam[0]);
                console.log(this.configSettingParam);
            });
    }

    configdata = []
    AddList: any = [];
    public dsconfigList = new MatTableDataSource<ConfigList>();
    ConfigSettingParamNew() {
        var Params =
        {
            "searchFields": [],
            "mode": "NewSysConfig"
        }
        this._httpClient1.PostData("Common", Params).subscribe(data => {
           this.configSettingParam1 = data;
                console.log(data);
                this.configService.setCongiParam(this.configSettingParam1[0]);
                console.log(this.configSettingParam);
        });
    }
}


export class ConfigList {
    SystemConfigId: Number;
    SystemCategoryId: number;
    SystemName: number;
    SystemInputValue: any;

    /**
     * Constructor
     *
     * @param ConfigList
     */
    constructor(ConfigList) {
        {
            this.SystemConfigId = ConfigList.SystemConfigId || 0;
            this.SystemCategoryId = ConfigList.SystemCategoryId || 0;
            this.SystemName = ConfigList.SystemName || '';
            this.SystemInputValue = ConfigList.SystemInputValue || "";

        }
    }

}
