import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MillMasterComponent } from './mill-master/mill-master.component';
import { NewMillMasterComponent } from './mill-master/new-mill-master/new-mill-master.component';
import { EditMillmasterComponent } from './mill-master/edit-millmaster/edit-millmaster.component';
import { ShadeMasterComponent } from './shade-master/shade-master.component';
import { NewShademasterComponent } from './shade-master/new-shademaster/new-shademaster.component';
import { EditShademasterComponent } from './shade-master/edit-shademaster/edit-shademaster.component';


const appRoutes: Routes = [
    
    {
        path: "Yarn",
        loadChildren: () => import("./yarn-master/yarn-master.module").then((m) => m.YarnMasterModule),
    },
    {
        path: "Item",
       loadChildren: () => import("./item-master/item-master.module").then((m) => m.ItemMasterModule),
       
        // loadChildren: () => import("./phone-appointment/phone-appointment.module").then((m) => m.phoneappointment),
    },
    {
        path: "Mill",
        loadChildren: () => import("./mill-master/mill-master.module").then((m) => m.MillMasterModule),
    },
    {
        path: "Location",
        loadChildren: () => import("./location-master/location-master.module").then((m) => m.LocationMasterModule),
    },
    {
        path: "Quality",
        loadChildren: () => import("./inv-quality/quality-master.module").then((m) => m.QualityMasterModule),
    },
    {
        path: "Shade",
        loadChildren: () => import("./shade-master/shade-master.module").then((m) => m.ShadeMasterModule),
    },
    {
        path: "Design",
        loadChildren: () => import("./design-master/design-master.module").then((m) => m.DesignMasterModule),
    },
   

];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(appRoutes),
    ]
})
export class InventoryMasterModule { }
