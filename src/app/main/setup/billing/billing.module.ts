import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";
import { CreditReasonMasterComponent } from './credit-reason-master/credit-reason-master.component';

const appRoutes: Routes = [
    {
        path: "cash-counter-master",
        loadChildren: () =>
            import("./cash-counter-master/cash-counter-master.module").then(
                (m) => m.CashCounterMasterModule
            ),
    },
    {
        path: "billing-class-master",
        loadChildren: () =>
            import("./billing-class-master/billing-class-master.module").then(
                (m) => m.BillingClassMasterModule
            ),
    },
    {
        path: "tariff-master",
        loadChildren: () =>
            import("./tariff-master/tariff-master.module").then(
                (m) => m.TariffMasterModule
            ),
    },
    {
        path: "group-master",
        loadChildren: () =>
            import("./group-master/group-master.module").then(
                (m) => m.GroupMasterModule
            ),
    },
    {
        path: "sub-group-master",
        loadChildren: () =>
            import("./sub-group-master/sub-group-master.module").then(
                (m) => m.SubGroupMasterModule
            ),
    },
    {
        path: "service-master",
        loadChildren: () =>
            import("./service-master/service-master.module").then(
                (m) => m.ServiceMasterModule
            ),
    },
    {
        path: "company-type-master",
        loadChildren: () =>
            import("./company-type-master/company-type-master.module").then(
                (m) => m.CompanyTypeMasterModule
            ),
    },
    {
        path: "company-master",
        loadChildren: () =>
            import("./company-master/company-master.module").then(
                (m) => m.CompanyMasterModule
            ),
    },
    {
        path: "subtpa-company-master",
        loadChildren: () =>
            import("./subtpa-company-master/subtpa-company-master.module").then(
                (m) => m.SubtpaCompanyMasterModule
            ),
    },
    {
        path: "concession-reason-master",
        loadChildren: () =>
            import(
                "./concession-reason-master/concession-reason-master.module"
            ).then((m) => m.ConcessionReasonMasterModule),
    },
    {
        path: "bank-master",
        loadChildren: () =>
            import("./bank-master/bank-master.module").then(
                (m) => m.BankMasterModule
            ),
    },
    {
        path: "credit-reason-master",
        loadChildren: () =>
            import("./credit-reason-master/credit-reason-master.module").then(
                (m) => m.CreditReasonMasterModule
            ),
    },
];

@NgModule({
    declarations: [CreditReasonMasterComponent],
    imports: [RouterModule.forChild(appRoutes)],
})
export class BillingModule {}
