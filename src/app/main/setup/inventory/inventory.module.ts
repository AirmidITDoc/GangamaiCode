import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    {
        path: "currency-master",
        loadChildren: () =>
            import("./currency-master/currency-master.module").then(
                (m) => m.CurrencyMasterModule
            ),
    },
    {
        path: "item-type-master",
        loadChildren: () =>
            import("./item-type-master/item-type-master.module").then(
                (m) => m.ItemTypeMasterModule
            ),
    },
    {
        path: "item-category-master",
        loadChildren: () =>
            import("./item-category-master/item-category-master.module").then(
                (m) => m.ItemCategoryMasterModule
            ),
    },
    {
        path: "uom-master",
        loadChildren: () =>
            import("./uom-master/uom-master.module").then(
                (m) => m.UomMasterModule
            ),
    },
    {
        path: "item-generic-master",
        loadChildren: () =>
            import("./item-generic-master/item-generic-master.module").then(
                (m) => m.ItemGenericMasterModule
            ),
    },
    {
        path: "item-class-master",
        loadChildren: () =>
            import("./item-class-master/item-class-master.module").then(
                (m) => m.ItemClassMasterModule
            ),
    },
    {
        path: "manufacture-master",
        loadChildren: () =>
            import("./manufacture-master/manufacture-master.module").then(
                (m) => m.ManufactureMasterModule
            ),
    },
    {
        path: "store-master",
        loadChildren: () =>
            import("./store-master/store-master.module").then(
                (m) => m.StoreMasterModule
            ),
    },
    {
        path: "item-master",
        loadChildren: () =>
            import("./item-master/item-master.module").then(
                (m) => m.ItemMasterModule
            ),
    },
    {
        path: "supplier-master",
        loadChildren: () =>
            import("./supplier-master/supplier-master.module").then(
                (m) => m.SupplierMasterModule
            ),
    },
    {
        path: "tax-master",
        loadChildren: () =>
            import("./tax-master/tax-master.module").then(
                (m) => m.TaxMasterModule
            ),
    },
    {
        path: "mode-of-payment-master",
        loadChildren: () =>
            import(
                "./mode-of-payment-master/mode-of-payment-master.module"
            ).then((m) => m.ModeOfPaymentMasterModule),
    },
    {
        path: "terms-of-payment-master",
        loadChildren: () =>
            import(
                "./terms-of-payment-master/terms-of-payment-master.module"
            ).then((m) => m.TermsOfPaymentMasterModule),
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(appRoutes)],
})
export class InventoryModule {}
