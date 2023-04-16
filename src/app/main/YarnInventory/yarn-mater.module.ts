import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { DatePipe } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatStepperModule } from "@angular/material/stepper";
import { ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatBadgeModule } from "@angular/material/badge";
import { MatFormFieldModule } from "@angular/material/form-field";

import { YarninwardService } from "./yarninward.service";
import { YarnIssueComponent } from './yarn-issue/yarn-issue.component';
import { YarnOutwardComponent } from './yarn-outward/yarn-outward.component';
// import { EditYarnInwardComponent } from './edit-yarn-inward/edit-yarn-inward.component';
// import { NewYarnInwardyComponent } from './new-yarn-inwardy/new-yarn-inwardy.component';




const appRoutes: Routes = [

 
    {
        path: "YarnInward",
        loadChildren: () => import("./yarn-inward/yarn-inward.module").then((m) => m.YarnInwardModule),
            
    },
   
    {
        path: 'YarnIssue',
        loadChildren: () =>  import('./yarn-issue/yarn-issue.module').then(m => m.YarnIssueModule)
        
    },
    {
      path: 'YarnOutward',
      loadChildren: () =>  import('./yarn-outward/yarn-outward.module').then(m => m.YarnOutwardModule)
      
  },
     
  
  ];
  @NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(appRoutes),
    ]
})
export class YarnMaterModule { }
