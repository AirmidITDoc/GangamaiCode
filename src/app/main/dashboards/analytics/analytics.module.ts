import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartsModule } from 'ng2-charts';

import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { AnalyticsDashboardComponent } from 'app/main/dashboards/analytics/analytics.component';
import { AnalyticsDashboardService } from 'app/main/dashboards/analytics/analytics.service';

const routes: Routes = [
    {
        path: '**',
        component: AnalyticsDashboardComponent,
        resolve: {
            data: AnalyticsDashboardService
        }
    }
];

@NgModule({
    declarations: [
        AnalyticsDashboardComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,

        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),
        ChartsModule,
        NgxChartsModule,

        FuseSharedModule,
        FuseWidgetModule
    ],
    providers: [
        AnalyticsDashboardService
    ]
})
export class AnalyticsDashboardModule {
}

