import { formatDate } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
//import 'hammerjs';

import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';

import { JwtInterceptor } from "./core/jwt.interceptor";
// import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ToastrModule } from 'ngx-toastr';
import { AppConfigModule } from './app-config.module';
import { LoaderModule } from "./core/components/loader/loader.module";
import { AppConfigService } from './core/services/api-config.service';
import { BandwidthService } from './core/services/bandwidth.service';
import { LayoutModule } from './layout/layout.module';
import { PdfviewerComponent } from './main/pdfviewer/pdfviewer.component';
import { Error401Component } from './main/shared/APIerrorpages/error-401/error-401.component';
import { Error403Component } from './main/shared/APIerrorpages/error-403/error-403.component';
import { Error404Component } from './main/shared/APIerrorpages/error-404/error-404.component';
import { InternetConnectionComponent } from './main/shared/componets/internet-connection/internet-connection.component';
import { SharedModule } from './main/shared/shared.module';
const appRoutes: Routes = [
    {
        path: "auth",
        loadChildren: () =>
            import("./main/auth/auth.module").then((m) => m.AuthModule),
    },
    {
        path: "dashboard",
        loadChildren: () =>
            import("./main/dashboard/dashboard.module").then((m) => m.DashboardModule),
    },
    // {
    //     path: 'dashboards/analytics',
    //     loadChildren: () => import('./main/dashboards/analytics/analytics.module').then(m => m.AnalyticsDashboardModule)
    // },
    // {
    //     path: 'dashboards/project',
    //     loadChildren: () => import('./main/dashboards/project/project.module').then(m => m.ProjectDashboardModule)
    // },
    {
        path: "setup",
        loadChildren: () =>
            import("./main/setup/setup.module").then((m) => m.SetupModule),
    },
    {
        path: "ipd",
        loadChildren: () =>
            import("./main/ipd/ip-routing.module").then((m) => m.IPRoutingModule),
    },
    {
        path: "opd",
        loadChildren: () =>
            import("./main/opd/opd.module").then((m) => m.OPDModule),
    },
    {
        path: "mrd",
        loadChildren: () =>
            import("./main/Mrd/mrd.module").then((m) => m.MrdModule),
    },
    {
        path: "nursingstation",
        loadChildren: () =>
            import("./main/nursingstation/nursingstation.module").then((m) => m.NursingstationModule),
    },
    {
        path: "pathology",
        loadChildren: () =>
            import("./main/pathology/pathology.module").then((m) => m.PathologyModule),
    },
    {
        path: "radiology",
        loadChildren: () =>
            import("./main/radiology/radiology-order-list/radioloy-orderlist.module").then((m) => m.RadioloyOrderlistModule),
    },
    {
        path: "administration",
        loadChildren: () =>
            import("./main/administration/administration.module").then((m) => m.AdministrationModule),
    },
    {
        path: "CanteenManagement",
        loadChildren: () =>
            import("./main/canteenmanagement/canteenmanagement.module").then((m) => m.CanteenmanagementModule),
    },
    {
        path: "otmanagement",
        loadChildren: () =>
            import("./main/otmanagement/ot-management.module").then((m) => m.OTManagementModule),
    },
    {
        path: "inventory",
        loadChildren: () =>
            import("./main/inventory/inventory.module").then((m) => m.InventoryModule),
    },
    {
        path: "purchase",
        loadChildren: () =>
            import("./main/purchase/purchase.module").then((m) => m.PurchaseModule),
    },
    {
        path: "pharmacy",
        loadChildren: () =>
            import("./main/pharmacy/pharmacy.module").then((m) => m.PharmacyModule),
    },
    {
        path: "nursingstation",
        loadChildren: () =>
            import("./main/nursingstation/nursingstation.module").then((m) => m.NursingstationModule),
    },
    {
        path: "reports",
        loadChildren: () =>
            import("./main/reports/reports.module").then((m) => m.ReportsModule),
    },
    {
        path: "emergencymanagement",
        loadChildren: () =>
            import("./main/emergencymanagement/emergencymanagement.module").then((m) => m.EmergencymanagementModule),
    },
    {
        path: "ambulancemanagement",
        loadChildren: () =>
            import("./main/ambulancemanagement/ambulancemanagement.module").then((m) => m.AmbulancemanagementModule),
    },
    // {
    //     path: "import-excel",
    //     loadChildren: () => import("./main/import-excel/import-excel.module").then(m => m.ImportExcelModule)
    // },
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: 'unauthorize',
        component: Error401Component
    },
    {
        path: 'forbidden',
        component: Error403Component
    },
    {
        path: '**',
        component: Error404Component
    },

];



export const PICK_FORMATS = {
    parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
    display: {
        dateInput: 'input',
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' }
    }
};
export function initializeApp(appConfig: AppConfigService) {
    return () => appConfig.loadConfig();
}


class PickDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            return formatDate(date, 'dd-MMM-yyyy', this.locale);;
        } else {
            return date.toDateString();
        }
    }
}

@NgModule({
    declarations: [
        AppComponent,
        PdfviewerComponent,
        InternetConnectionComponent,

    ],
    imports: [
        SharedModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        BrowserModule,
        AppConfigModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),
        MatMomentDateModule,
        MatDatepickerModule,
        MatNativeDateModule,
        // Material
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        // App modules
        LayoutModule,
        NgxExtendedPdfViewerModule,
        MatProgressSpinnerModule,
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            progressBar: true,
            progressAnimation: 'increasing',
        }),
        LoaderModule
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [AppConfigService],
            multi: true
        },
        BandwidthService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        // { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
        { provide: DateAdapter, useClass: PickDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
        //APIServices,
        //ServerData
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
