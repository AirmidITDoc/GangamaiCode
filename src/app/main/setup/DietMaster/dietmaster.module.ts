import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: "dietcategoryMaster",
    loadChildren: () =>
      import("./dietcategory-master/dietcategory-master.module").then((m) => m.DietcategoryMasterModule
      ),
  },
  // {
  //   path: "diettypeMaster",
  //   loadChildren: () =>
  //     import("./diettype-master/diettype-master.module").then((m) => m.DiettypeMasterModule
  //     ),
  // },
  {
    path: "fooditemMaster",
    loadChildren: () =>
      import("./food-itemmaster/food-itemmaster.module").then((m) => m.FoodItemmasterModule
      ),
  },
  // {
  //   path: "menuMaster",
  //   loadChildren: () =>
  //     import("./menu-master/menu-master.module").then((m) => m.MenuMasterModule
  //     ),
  // },
  // {
  //   path: "dietrestrictionMaster",
  //   loadChildren: () =>
  //     import("./dietrestriction-master/dietrestriction-master.module").then((m) => m.DietrestrictionMasterModule
  //     ),
  // },
  {
    path: "feedingrouteMaster",
    loadChildren: () =>
      import("./feedingroute-master/feedingroute-master.module").then((m) => m.FeedingrouteMasterModule
      ),
  },
  {
    path: "foodpreferenceMaster",
    loadChildren: () =>
      import("./foodpreference-master/foodpreference-master.module").then((m) => m.FoodpreferenceMasterModule
      ),
  },
  // {
  //   path: "allergyMaster",
  //   loadChildren: () =>
  //     import("./allergy-master/allergy-master.module").then((m) => m.AllergyMasterModule
  //     ),
  // },
  {
    path: "foodcategoryMaster",
    loadChildren: () =>
      import("./foodcategory-master/foodcategory-master.module").then((m) => m.FoodcategoryMasterModule
      ),
  },
  // {
  //   path: "mealtypeMaster",
  //   loadChildren: () =>
  //     import("./mealtype-master/mealtype-master.module").then((m) => m.MealtypeMasterModule
  //     ),
  // },
];

@NgModule({
  declarations: [
  ],
  imports: [RouterModule.forChild(appRoutes)]
})
export class DietmasterModule { }
