import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
   
  {
      path: "sample-collection-list",
      loadChildren: () => import("./sample-collection/sample-collection.module").then((m) => m.SampleCollectionModule),
  },
   {
      path: "pathology-result-list",
      loadChildren: () => import("./result-entry/result-entry.module").then((m) => m.ResultEntryModule),
  },

  {
      path: "lab-request-list",
      loadChildren: () => import("./sample-request/sample-request.module").then((m) => m.SampleRequestModule),
  },


  
];

@NgModule({
  declarations: [
 ],
  imports: [
      RouterModule.forChild(appRoutes),
  ]
})
export class PathologyModule { }
