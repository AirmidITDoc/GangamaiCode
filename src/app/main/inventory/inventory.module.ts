import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
      path: "patientmaterialconsumption",
      loadChildren: () => import("./patient-material-consumption/patient-material-consumption.module").then((m) => m.PatientMaterialConsumptionModule),
  },
 
   {
       path: "indent",
      loadChildren: () => import("./indent/indent.module").then((m) => m.IndentModule),
  },

  {
      path: "issuetodepartment",
      loadChildren: () => import("./issue-to-department/issue-to-department.module").then((m) => m.IssueToDepartmentModule),
  },
  
  {
      path: "batchandexpdateadjustment",
      loadChildren: () =>
          import("./batch-and-exp-date-adjustment/batch-and-exp-date-adjustment.module").then((m) => m.BatchAndExpDateAdjustmentModule),
  },
  {
      path: "currentstock",
      loadChildren: () =>
          import("./current-stock/current-stock.module").then((m) => m.CurrentStockModule),
  },
  {
      path: "stockadjustment",
      loadChildren: () =>
          import("./stock-adjustment/stock-adjustment.module").then((m) => m.StockAdjustmentModule),
  },
  {
      path: "returnfromdepartment",
      loadChildren: () =>
      import("./return-from-department/return-from-department.module").then((m) => m.ReturnFromDepartmentModule),
  },
  {
      path: "patientmaterialconsumptionreturn",
      loadChildren: () =>
          import("./patient-material-consumption-return/patient-material-consumption-return.module").then((m) => m.PatientMaterialConsumptionReturnModule),
  },

  {
      path: "mrpadjustment",
      loadChildren: () =>
          import("./mrp-adjustment/mrp-adjustment.module").then((m) => m.MRPAdjustmentModule),
  },
  {
      path: "materialconsumption",
      loadChildren: () =>
          import("./material-consumption/material-consumption.module").then((m) => m.MaterialConsumptionModule),
  },
     
  {
      path: "itemmovement",
      loadChildren: () =>
          import("./item-movemnent/item-movemnent.module").then((m) => m.ItemMovemnentModule),
  },
  // {
  //     path: "issuefromdepartment",
  //     loadChildren: () =>
  //         import("./issueto-department/issueto-department.module").then((m) => m.IssuetoDepartmentModule),
  // },
  {
      path: "gstadjustment",
      loadChildren: () =>
          import("./gst-adjustment/gst-adjustment.module").then((m) => m.GSTAdjustmentModule),
  },
];

@NgModule({
  declarations: [ ],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})
export class InventoryModule { }


