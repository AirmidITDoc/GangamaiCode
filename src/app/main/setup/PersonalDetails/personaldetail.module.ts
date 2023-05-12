import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    {
        path: "city-master",
        loadChildren: () =>
            import("./city-master/city-master.module").then(
                (m) => m.CityMasterModule
            ),
    },
    {
        path: "prefix-master",
        loadChildren: () =>
            import("./prefix-master/prefix-master.module").then(
                (m) => m.PrefixMasterModule
            ),
    },
    {
        path: "gender-master",
        loadChildren: () =>
            import("./gender-master/gender-master.module").then(
                (m) => m.GenderMasterModule
            ),
    },
    {
        path: "patient-type-master",
        loadChildren: () =>
            import("./patienttype-master/patienttype-master.module").then(
                (m) => m.PatienttypeMasterModule
            ),
    },
    {
        path: "relationship-master",
        loadChildren: () =>
            import("./relationship-master/relationship-master.module").then(
                (m) => m.RelationshipMasterModule
            ),
    },
    {
        path: "marital-master",
        loadChildren: () =>
            import("./maritalstatus-master/maritalstatus-master.module").then(
                (m) => m.MaritalstatusMasterModule
            ),
    },
    {
        path: "religion-master",
        loadChildren: () =>
            import("./religion-master/religion-master.module").then(
                (m) => m.ReligionMasterModule
            ),
    },

    {
        path: "country-master",
        loadChildren: () =>
            import("./country-master/country-master.module").then(
                (m) => m.CountryMasterModule
            ),
    },
    {
        path: "state-master",
        loadChildren: () =>
            import("./state-master/state-master.module").then(
                (m) => m.StateMasterModule
            ),
    },
    {
        path: "taluka-master",
        loadChildren: () =>
            import("./taluka-master/taluka-master.module").then(
                (m) => m.TalukaMasterModule
            ),
    },
    {
        path: "village-master",
        loadChildren: () =>
            import("./village-master/village-master.module").then(
                (m) => m.VillageMasterModule
            ),
    },
    {
        path: "area-master",
        loadChildren: () =>
            import("./area-master/area-master.module").then(
                (m) => m.AreaMasterModule
            ),
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(appRoutes)],
})
export class PersonaldetailModule {}
