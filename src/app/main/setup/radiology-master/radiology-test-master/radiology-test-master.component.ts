import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { RadiologyTestMasterService } from "./radiology-test-master.service";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-radiology-test-master",
    templateUrl: "./radiology-test-master.component.html",
    styleUrls: ["./radiology-test-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class RadiologyTestMasterComponent implements OnInit {
    // RadiologytestMasterList: any;
    // CategorycmbList: any = [];
    // ServicecmbList: any = [];
    // msg: any;

    // @ViewChild(MatSort) sort: MatSort;
    // @ViewChild(MatPaginator) paginator: MatPaginator;

    // displayedColumns: string[] = [
    //     "TestId",
    //     "TestName",
    //     "PrintTestName",
    //     "CategoryName",
    //     "ServiceId",
    //     "AddedByName",
    //     "IsDeleted",
    //     "action",
    // ];

    // DSRadiologyTestMasterList = new MatTableDataSource<RadiologytestMaster>();

    // // category filter
    // public categoryFilterCtrl: FormControl = new FormControl();
    // public filteredCategory: ReplaySubject<any> = new ReplaySubject<any>(1);

    // //service filter
    // public serviceFilterCtrl: FormControl = new FormControl();
    // public filteredService: ReplaySubject<any> = new ReplaySubject<any>(1);

    // private _onDestroy = new Subject<void>();

    // constructor(public _radiologytestService: RadiologyTestMasterService) {}

    ngOnInit(): void {
    //     this.getRadiologytestMasterList();
    //     this.getCategoryNameCombobox();
    //     this.getServiceNameCombobox();

    //     this.categoryFilterCtrl.valueChanges
    //         .pipe(takeUntil(this._onDestroy))
    //         .subscribe(() => {
    //             this.filterCategoryname();
    //         });

    //     this.serviceFilterCtrl.valueChanges
    //         .pipe(takeUntil(this._onDestroy))
    //         .subscribe(() => {
    //             this.filterServicename();
    //         });
     }
    // onSearch() {
    //     this.getRadiologytestMasterList();
    // }

    // onSearchClear() {
    //     this._radiologytestService.myformSearch.reset({
    //         TestNameSearch: "",
    //         IsDeletedSearch: "2",
    //     });
    // }
    // // categoryname filter
    // private filterCategoryname() {
    //     if (!this.CategorycmbList) {
    //         return;
    //     }
    //     // get the search keyword
    //     let search = this.categoryFilterCtrl.value;
    //     if (!search) {
    //         this.filteredCategory.next(this.CategorycmbList.slice());
    //         return;
    //     } else {
    //         search = search.toLowerCase();
    //     }
    //     // filter the banks
    //     this.filteredCategory.next(
    //         this.CategorycmbList.filter(
    //             (bank) => bank.CategoryName.toLowerCase().indexOf(search) > -1
    //         )
    //     );
    // }

    // // Service name filter
    // private filterServicename() {
    //     if (!this.ServicecmbList) {
    //         return;
    //     }
    //     // get the search keyword
    //     let search = this.serviceFilterCtrl.value;
    //     if (!search) {
    //         this.filteredService.next(this.ServicecmbList.slice());
    //         return;
    //     } else {
    //         search = search.toLowerCase();
    //     }
    //     // filter the banks
    //     this.filteredService.next(
    //         this.ServicecmbList.filter(
    //             (bank) => bank.ServiceName.toLowerCase().indexOf(search) > -1
    //         )
    //     );
    // }

    // getRadiologytestMasterList() {
    //     this._radiologytestService
    //         .getRadiologytestMasterList()
    //         .subscribe((Menu) => {
    //             this.DSRadiologyTestMasterList.data =
    //                 Menu as RadiologytestMaster[];
    //             this.DSRadiologyTestMasterList.sort = this.sort;
    //             this.DSRadiologyTestMasterList.paginator = this.paginator;
    //         });
    // }

    // getServiceNameCombobox() {
       

    //     this._radiologytestService.getServiceMasterCombo().subscribe((data) => {
    //         this.ServicecmbList = data;
    //         this._radiologytestService.myform
    //             .get("ServiceId")
    //             .setValue(this.ServicecmbList[0]);
    //     });
    // }

    // getCategoryNameCombobox() {
        
    //     this._radiologytestService
    //         .getCategoryMasterCombo()
    //         .subscribe((data) => {
    //             this.CategorycmbList = data;
    //             this._radiologytestService.myform
    //                 .get("CategoryId")
    //                 .setValue(this.CategorycmbList[0]);
    //         });
    // }
    // onClear() {
    //     this._radiologytestService.myform.reset({ IsDeleted: "false" });
    //     this._radiologytestService.initializeFormGroup();
    // }

    // onSubmit() {
    //     if (this._radiologytestService.myform.valid) {
    //         if (!this._radiologytestService.myform.get("TestId").value) {
    //             var m_data = {
    //                 insertRadiologyTestMaster: {
    //                     TestName: this._radiologytestService.myform
    //                         .get("TestName")
    //                         .value.trim(),
    //                     PrintTestName: this._radiologytestService.myform
    //                         .get("PrintTestName")
    //                         .value.trim(),
    //                     CategoryId:
    //                         this._radiologytestService.myform.get("CategoryId")
    //                             .value,
    //                     IsDeleted: Boolean(
    //                         JSON.parse(
    //                             this._radiologytestService.myform.get(
    //                                 "IsDeleted"
    //                             ).value
    //                         )
    //                     ),

    //                     ServiceId:
    //                         this._radiologytestService.myform.get("ServiceId")
    //                             .value,
    //                 },
    //             };
    //             // console.log(m_data);
    //             this._radiologytestService
    //                 .insertRadiologyTestMaster(m_data)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     this.getRadiologytestMasterList();
    //                 });
    //         } else {
    //             var m_dataUpdate = {
    //                 updateRadiologyTestMaster: {
    //                     TestId: this._radiologytestService.myform.get("TestId")
    //                         .value,
    //                     TestName:
    //                         this._radiologytestService.myform.get("TestName")
    //                             .value,
    //                     PrintTestName: this._radiologytestService.myform
    //                         .get("PrintTestName")
    //                         .value.trim(),
    //                     CategoryId:
    //                         this._radiologytestService.myform.get("CategoryId")
    //                             .value,
    //                     IsDeleted: Boolean(
    //                         JSON.parse(
    //                             this._radiologytestService.myform.get(
    //                                 "IsDeleted"
    //                             ).value
    //                         )
    //                     ),

    //                     ServiceId:
    //                         this._radiologytestService.myform.get("ServiceId")
    //                             .value,
    //                 },
    //             };
    //             this._radiologytestService
    //                 .updateRadiologyTestMaster(m_dataUpdate)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     this.getRadiologytestMasterList();
    //                 });
    //         }
    //         this.onClear();
    //     }
    // }
    // onEdit(row) {
    //     var m_data = {
    //         TestId: row.TestId,
    //         TestName: row.TestName.trim(),
    //         PrintTestName: row.PrintTestName.trim(),
    //         CategoryId: row.CategoryId,
    //         ServiceId: row.ServiceId,
    //         IsDeleted: JSON.stringify(row.IsDeleted),
    //         UpdatedBy: row.UpdatedBy,
    //     };
    //     this._radiologytestService.populateForm(m_data);
    // }
}
export class RadiologytestMaster {
    TestId: number;
    TestName: string;
    PrintTestName: string;
    CategoryId: number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    ServiceId: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param RadiologytestMaster
     */
    constructor(RadiologytestMaster) {
        {
            this.TestId = RadiologytestMaster.TestId || "";
            this.TestName = RadiologytestMaster.TestName || "";
            this.PrintTestName = RadiologytestMaster.PrintTestName || "";
            this.CategoryId = RadiologytestMaster.CategoryId || "";
            this.IsDeleted = RadiologytestMaster.IsDeleted || "false";
            this.AddedBy = RadiologytestMaster.AddedBy || "";
            this.UpdatedBy = RadiologytestMaster.UpdatedBy || "";
            this.ServiceId = RadiologytestMaster.ServiceId || "";
            this.AddedByName = RadiologytestMaster.AddedByName || "";
        }
    }
}
