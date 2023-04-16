import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { TranslateModule } from '@ngx-translate/core';
//import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { FakeDbService } from "app/fake-db/fake-db.service";
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';

import { JwtInterceptor } from "./core/jwt.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { SpinnerInterceptor } from "./core/spinner.interceptor";
import { BeamInwardComponent } from './main/Beam_Inventory/beam-inward/beam-inward.component';



const appRoutes: Routes = [
    {
        path: "auth",
        loadChildren: () =>
            import("./main/auth/auth.module").then((m) => m.AuthModule),
    },
   
    {
        path: 'dashboards/analytics',
        loadChildren: () => import('./main/dashboards/analytics/analytics.module').then(m => m.AnalyticsDashboardModule)
    },
    {
        path: 'dashboards/project',
        loadChildren: () => import('./main/dashboards/project/project.module').then(m => m.ProjectDashboardModule)
    },
    {
        path: "setup",
        loadChildren: () =>
            import("./main/setup/setup.module").then((m) => m.SetupModule),
    },

    {
        path: "Account Master",
        loadChildren: () =>
            import("./main/Master/master.module").then((m) => m.MasterModule),
    },
    {
        path: "Invoice",
        loadChildren: () =>
            // import("./main/Invoice/invoice.module").then((m) => m.InvoiceModule),

            import("./main/dashboards/analytics/analytics.module").then((m) => m.AnalyticsDashboardModule),
    },
    

    {
        path: "InventoryMaster",
        loadChildren: () =>
            //  import("./main/Invoice/invoice-list/invoice-list.module").then((m) => m.InvoiceListModule),
             import("./main/Inventory_Master/inventory-master.module").then((m) => m.InventoryMasterModule),
    },
    {
        path:"Beam Inventory",
        loadChildren: () =>
        import("./main/Beam_Inventory/beam-invemtoryall.module").then((m) => m.BeamInvemtoryallModule),
    },
    {
        path:"Contract Booking",
        loadChildren: () =>
        import("./main/ContractBooking/contractbooking.module").then((m) => m.ContractbookingModule),

    },

    {
        path:"Daily Production",
        loadChildren: () =>
        import("./main/DailyProduction/dailyproduction.module").then((m) => m.DailyproductionModule),
    },

    {
        path:"Other Info Master",
        loadChildren: () =>
        import("./main/Other_info_master/otherinfo-master.module").then((m) => m.OtherinfoMasterModule),

    },
    {
        path:"Yarn Inventory",
        loadChildren: () =>
        import("./main/YarnInventory/yarn-mater.module").then((m) => m.YarnMaterModule),

    },

   
    {
        path: '**',
        redirectTo: 'auth/login'
    }
];



export const PICK_FORMATS = {
    parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
    display: {
        dateInput: 'input',
        monthYearLabel: {year: 'numeric', month: 'short'},
        dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
        monthYearA11yLabel: {year: 'numeric', month: 'long'}
    }
  };
  
  class PickDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            return formatDate(date,'dd-MMM-yyyy',this.locale);;
        } else {
            return date.toDateString();
        }
    }
  }

@NgModule({
    declarations: [
        AppComponent,
               
        
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // InMemoryWebApiModule.forRoot(FakeDbService, {
        //     delay: 0,
        //     passThruUnknownUrl: true,    
        // }),

        // Material moment date module
        MatMomentDateModule,
        MatDatepickerModule,
        MatNativeDateModule,
        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
       
        // App modules
        LayoutModule


    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
        {provide: DateAdapter, useClass: PickDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS}
        //APIServices,
        //ServerData
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
