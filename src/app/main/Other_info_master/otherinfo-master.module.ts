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
import { OtherinfoMasterService } from "./otherinfo-master.service";
import { DefectComponent } from './defect/defect.component';



const appRoutes: Routes = [

    {
        path: "Loom",
        loadChildren: () => import("./loom/loom-master.module").then((m) => m.LoomMasterModule),
        
    },
   
    {
        path: 'Transport',
        loadChildren: () =>  import('./transport/transport-master.module').then(m => m.TransportMasterModule)
        
    },
    {
        path: 'Addless',
        loadChildren: () =>  import('./other-addless/addless-master.module').then(m => m.AddlessMasterModule)
        
    },
  
    {
        path: "Defect",
        loadChildren: () =>  import("./defect/defect-master.module").then((m) => m.DefectMasterModule),
        
    },
   
    {
        path: 'Beam',
        loadChildren: () =>  import('./beam/beam-master.module').then(m => m.BeamMasterModule)
        
    },
    {
        path: 'RollType',
        loadChildren: () =>  import('./roll-type/rolltype-master.module').then(m => m.  RolltypeMasterModule)
        
    },

    {
        path: 'LoomType',
        loadChildren: () => import('./loomtype/loomtype-master.module').then(m => m.LoomtypeMasterModule)
        
    },
   
  
  ];
  @NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(appRoutes),
    ]
})
export class OtherinfoMasterModule { }
