import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { TestFormMasterComponent } from "./test-form-master/test-form-master.component";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { TestmasterService } from "./testmaster.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatAccordion } from "@angular/material/expansion";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { MatTabGroup } from "@angular/material/tabs";
import { AuthenticationService } from "app/core/services/authentication.service";
import Swal from "sweetalert2";

@Component({
    selector: "app-testmaster",
    templateUrl: "./testmaster.component.html",
    styleUrls: ["./testmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TestmasterComponent implements OnInit {
    displayedColumns: string[] = [
        "TestId",
        "TestName",
        "PrintTestName",
        "CategoryName",
        "TechniqueName",
        "MachineName",
        "SuggestionNote",
        "FootNote",
        "AddedBy",
        "IsTemplateTest",
        "Isdeleted",
        "action",
    ];
    displayedColumns1: string[] = [
        "ParameterName"
    ];
    isChecked: boolean = false;
    isCheckednew: boolean = false;
    Parametercmb: any = [];
    CategorycmbList: any = [];
    TemplatecmbList: any = [];
    ServicecmbList: any = [];
    ChargeList: any = [];
    Subtestcmb: any = [];
    DSTestList = new MatTableDataSource<TestList>();
    dsTemparoryList = new MatTableDataSource<TestList>();
    vCategoryId: any;
    msg: any;
    step = 0;
    SearchName: string;
    isLoading = true;
    sIsLoading: string = '';

    setStep(index: number) {
        this.step = index;
    }

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    //parametername filter
    public parameternameFilterCtrl: FormControl = new FormControl();
    public filteredParametername: ReplaySubject<any> = new ReplaySubject<any>(1);

    // category filter
    public categoryFilterCtrl: FormControl = new FormControl();
    public filteredCategory: ReplaySubject<any> = new ReplaySubject<any>(1);

    //service filter
    public serviceFilterCtrl: FormControl = new FormControl();
    public filteredService: ReplaySubject<any> = new ReplaySubject<any>(1);

    // Template filter
    public subtestFilterCtrl: FormControl = new FormControl();
    public filteredSubtest: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    DSTestMasterList = new MatTableDataSource<TestMaster>();

    constructor(
        public _TestService: TestmasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private accountService: AuthenticationService,
    ) { }

    ngOnInit(): void {
        this.parameternameFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterParametername();
            });


        this.subtestFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterSubtestname();
            });
        this.getCategoryNameCombobox();
        this.getServiceNameCombobox();
        this.getParameterNameCombobox();
        this.getTestMasterList();
        this.getNewSubTestList();
    }

    onSearchClear() {
        this._TestService.myformSearch.reset({
            TestNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getTestMasterList();
    }
    onSearch() {
        this.getTestMasterList();
        setTimeout(() => {
            this.onSearchClear();
        }, 5000);
    }

    getTestMasterList() {
        this.sIsLoading = 'loading-data';
        var m_data = {
            ServiceName: this._TestService.myformSearch.get('TestNameSearch').value + "%" || "%"
        };
        this._TestService.getTestMasterList(m_data).subscribe((Menu) => {
            this.DSTestMasterList.data = Menu as TestMaster[];
            console.log(this.DSTestMasterList.data)
            this.sIsLoading = '';
            this.DSTestMasterList.sort = this.sort;
            this.DSTestMasterList.paginator = this.paginator;
        },
            error => {
                this.sIsLoading = '';
            });
    }
    getSubTestMasterList() {
        debugger;
        this.sIsLoading = 'loading-data';
        var m_data = {
            ServiceName: this._TestService.myformSearch.get('TestNameSearch').value + "%" || "%"
        };
        this._TestService.getSubTestMasterList(m_data).subscribe((Menu) => {
            this.DSTestMasterList.data = Menu as TestMaster[];
            // console.log(this.DSTestMasterList)
            this.sIsLoading = '';
            this.DSTestMasterList.sort = this.sort;
            this.DSTestMasterList.paginator = this.paginator;
        },
            error => {
                this.sIsLoading = '';
            });
    }

    onDeactive(row, TestId) {

        Swal.fire({
            title: 'Do you want to Change Active Status Of  Test',
            showCancelButton: true,
            confirmButtonText: 'OK',

        }).then((flag) => {
            let Query
            if (flag.isConfirmed) {
                if (row.Isdeleted) {
                    Query =
                        "Update M_PathTestMaster set Isdeleted=0 where TestId=" + TestId;

                } else {
                    Query =
                        "Update M_PathTestMaster set Isdeleted=1 where TestId=" + TestId;

                }
                this._TestService
                    .deactivateTheStatus(Query)
                    .subscribe((data) => (this.msg = data));
                this.getTestMasterList();
            }
        });
    }

    //Tab-2

    getSubTestList(el) {
        var m_data = {
            TestId: el.TestId
        };

        this._TestService.getSubTestList(m_data).subscribe((Menu) => {
            this.DSTestList.data = Menu as TestList[];
            this.DSTestList.sort = this.sort;
            this.DSTestList.paginator = this.paginator;
        });
    }
    getParameterTestList(el) {
        var m_data = {
            TestId: el.TestId
        };

        this._TestService.getParameterTestList(m_data).subscribe((Menu) => {
            this.DSTestList.data = Menu as TestList[];

            this.DSTestList.sort = this.sort;
            this.DSTestList.paginator = this.paginator;
        });
    }

    showDropdown1: boolean = false; // Initially set to false
    onCheckboxChange(event: any) {
        this.showDropdown1 = event.checked;
    }

    OnAdd(event) {
        this.DSTestList.data = [];
        this.ChargeList = this.dsTemparoryList.data;
        this.ChargeList.push(
            {
                TestName: this._TestService.AddParameterFrom.get('ParameterName').value.TestName || "",
            });
        this.DSTestList.data = this.ChargeList

        this._TestService.AddParameterFrom.reset();
    }

    getCategoryNameCombobox() {

        this._TestService.getCategoryMasterCombo().subscribe(data => {
            this.CategorycmbList = data;
            console.log(this.CategorycmbList)
            this.filteredCategory.next(this.CategorycmbList.slice());
            this._TestService.myform.get('CategoryId').setValue(this.CategorycmbList[0]);

        });
    }


    // parameter filter
    private filterParametername() {
        if (!this.Parametercmb) {
            return;
        }
        // get the search keyword
        let search = this.parameternameFilterCtrl.value;
        if (!search) {
            this.filteredParametername.next(this.Parametercmb.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredParametername.next(
            this.Parametercmb.filter(
                (bank) => bank.TestName.toLowerCase().indexOf(search) > -1
            )
        );
    }
    getParameterNameCombobox() {
        this._TestService.getParameterMasterCombo().subscribe((data) => {
            this.Parametercmb = data;
            this.filteredParametername.next(this.Parametercmb.slice());
            //console.log(this.Parametercmb);
        });
    }
    // getParameterNameCombobox() {
    //     this._TestService.getParameterMasterCombo().subscribe((data) => {
    //     this.Parametercmb = data;
    //     this.filteredParametername.next(this.Parametercmb.slice());
    //     console.log(this.Parametercmb);
    //     });
    // }

    // subtest filter
    private filterSubtestname() {
        if (!this.Subtestcmb) {
            return;
        }
        // get the search keyword
        let search = this.subtestFilterCtrl.value;
        if (!search) {
            this.filteredSubtest.next(this.Subtestcmb.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredSubtest.next(
            this.Subtestcmb.filter(
                (bank) => bank.TestName.toLowerCase().indexOf(search) > -1
            )
        );
    }
    getNewSubTestList() {
        this._TestService.getNewSubTestList().subscribe((data) => {
            this.Subtestcmb = data;
            // console.log(this.Subtestcmb)
            this.filteredSubtest.next(this.Subtestcmb.slice());
        });
    }
    // Service name filter

    getServiceNameCombobox() {
        this._TestService.getServiceMasterCombo().subscribe((data) => {
            this.ServicecmbList = data;
            // console.log(this.ServicecmbList)
            this.filteredService.next(this.ServicecmbList.slice());
            this._TestService.myform.get("ServiceName").setValue(this.ServicecmbList[0]);
        });
    }
    // onSubmit() {

    //     debugger
    //     if (!this._TestService.myform.get("TestId").value) {

    //         let insertPathologyTestMaster = {};

    //         insertPathologyTestMaster['testName'] = this._TestService.myform.get('TestName').value || "";
    //         insertPathologyTestMaster['printTestName'] = this._TestService.myform.get('PrintTestName').value || "";
    //         insertPathologyTestMaster['categoryId'] = this._TestService.myform.get('CategoryId').value.CategoryId || 0;
    //         insertPathologyTestMaster['isSubTest'] = this._TestService.myform.get('IsSubTest').value || 1;
    //         insertPathologyTestMaster['techniqueName'] = this._TestService.myform.get('TechniqueName').value || "";
    //         insertPathologyTestMaster['machineName'] = this._TestService.myform.get('MachineName').value || "";
    //         insertPathologyTestMaster['suggestionNote'] = this._TestService.myform.get('SuggestionNote').value || "";
    //         insertPathologyTestMaster['footNote'] = this._TestService.myform.get('FootNote').value || "";
    //         insertPathologyTestMaster['isDeleted'] = this._TestService.myform.get('IsDeleted').value || "";
    //         insertPathologyTestMaster['addedBy'] =  this.accountService.currentUserValue.user.id,
    //         insertPathologyTestMaster['serviceId'] = this._TestService.myform.get('ServiceName').value.ServiceId || 0;
    //         insertPathologyTestMaster['isTemplateTest'] = true;
    //         insertPathologyTestMaster['testId'] = 0;

    //         let pathTestDetailMaster = []
    //         this.DSTestList.data.forEach((element) => {
    //             let PathDetailsObj = {};
    //             PathDetailsObj['testId'] = 0;
    //             PathDetailsObj['subTestID'] = 10;
    //             PathDetailsObj['parameterID'] = element.ParameterID || 0;

    //             pathTestDetailMaster.push(PathDetailsObj);
    //         }); 

    //       let  pathTemplateDetailMaster=[];
    //         this.DSTestList.data.forEach((element) => {
    //         let PathTemplateDetailsObj = {};
    //         PathTemplateDetailsObj['TestId'] = 0;
    //         PathTemplateDetailsObj['TemplateId'] = 10;
    //         pathTemplateDetailMaster.push(PathTemplateDetailsObj);
    //     }); 

    //         let pathTestDetDeletesObj = {};
    //         pathTestDetDeletesObj['testId'] = 0;

    //         let pathTemplateDetDeletesObj = {};
    //         pathTemplateDetDeletesObj['testId'] = 0;
    //         let submitData ;
    //     if(1){
    //          submitData = {
    //             "insertPathologyTestMaster": insertPathologyTestMaster,
    //             "pathTestDetailMaster": pathTestDetailMaster

    //         };
    //     }
    //     else if(2){
    //          submitData = {
    //             "insertPathologyTestMaster": insertPathologyTestMaster,
    //             "pathTestDetailMaster": pathTestDetailMaster

    //         };
    //     }
    //         console.log(submitData);

    //         this._TestService.insertPathologyTestMaster(submitData).subscribe(response => {
    //             if (response) {
    //                 this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                     toastClass: 'tostr-tost custom-toast-success',
    //                 });

    //                 this.onClear()

    //             } else {
    //                 this.toastr.error('New Test Master Data not saved !, Please check API error..', 'Error !', {
    //                     toastClass: 'tostr-tost custom-toast-error',
    //                 });
    //             }
    //         }, error => {
    //             this.toastr.error('New Test Master Data not saved !, Please check API error..', 'Error !', {
    //                 toastClass: 'tostr-tost custom-toast-error',
    //             });
    //         });
    //     }
    //     else {

    //         let updatePathologyTestMaster = {};

    //         updatePathologyTestMaster['testName'] = this._TestService.myform.get('TestName').value || "";
    //         updatePathologyTestMaster['printTestName'] = this._TestService.myform.get('PrintTestName').value || "";
    //         updatePathologyTestMaster['categoryId'] = this._TestService.myform.get('CategoryId').value.CategoryId || 0;
    //         updatePathologyTestMaster['isSubTest'] = this._TestService.myform.get('IsSubTest').value;
    //         updatePathologyTestMaster['techniqueName'] = this._TestService.myform.get('TechniqueName').value || "";
    //         updatePathologyTestMaster['machineName'] = this._TestService.myform.get('MachineName').value || "";
    //         updatePathologyTestMaster['suggestionNote'] = this._TestService.myform.get('SuggestionNote').value || "";
    //         updatePathologyTestMaster['footNote'] = this._TestService.myform.get('FootNote').value || "";
    //         updatePathologyTestMaster['isDeleted'] = this._TestService.myform.get('IsDeleted').value || "";
    //         updatePathologyTestMaster['updatedBy'] = this.accountService.currentUserValue.user.id;
    //         updatePathologyTestMaster['serviceId'] = this._TestService.myform.get('ServiceName').value.ServiceID || 0;
    //         updatePathologyTestMaster['isTemplateTest'] = false;
    //         updatePathologyTestMaster['testId'] = this._TestService.myform.get('TestId').value ||0

    //         let updatePathologyTemplateTest = []
    //         this.DSTestList.data.forEach((element) => {
    //             let UpdatePathDetailsObj = {};
    //             UpdatePathDetailsObj['testId'] = 0;
    //             UpdatePathDetailsObj['templateId'] = 0;
    //             updatePathologyTemplateTest.push(UpdatePathDetailsObj);
    //         });

    //         let submitData = {
    //             "updatePathologyTestMaster": updatePathologyTestMaster,
    //             "updatePathologyTemplateTest": updatePathologyTemplateTest
    //         };
    //         console.log(submitData);

    //         this._TestService.insertPathologyTestMaster(submitData).subscribe(response => {
    //             if (response) {
    //                 this.toastr.success('Record Updated Successfully.', 'Saved !', {
    //                     toastClass: 'tostr-tost custom-toast-success',
    //                 });

    //                 this.onClear()

    //             } else {
    //                 this.toastr.error('New Test Master Data not Updated !, Please check API error..', 'Error !', {
    //                     toastClass: 'tostr-tost custom-toast-error',
    //                 });
    //             }
    //         }, error => {
    //             this.toastr.error('New Test Master Data not Updated !, Please check API error..', 'Error !', {
    //                 toastClass: 'tostr-tost custom-toast-error',
    //             });
    //         });

    //     }

    // }
   
    selectedValue: string = '';
    @ViewChild('tabGroup') tabGroup: MatTabGroup;

    onEdit(row) {
        debugger
        if (row.IsNumericParameter == 1) {
            let SelectQuery = "select * from M_PathTestDetailMaster where TestId=" + row.TestId
            console.log(SelectQuery);
            this._TestService.getTestListfor(SelectQuery).subscribe(Visit => {
                row['TestList'] = Visit;
                console.log(Visit)
                
            });
        } else if (row.IsNumericParameter == 0) {
            let SelectQuery = "select * from M_PathTemplateDetails where TestId=" + row.TestId
            console.log(SelectQuery);
            this._TestService.getTemplateListfor(SelectQuery).subscribe(Visit => {
                row['descriptiveList'] = Visit;
                console.log(Visit)
            });
           
        }

        this._TestService.populateForm(row);
        const dialogRef = this._matDialog.open(TestFormMasterComponent, {
            maxWidth: "70vw",
            maxHeight: "90vh",
            width: "100%",
            height: "100%",
            data: {
                registerObj: row
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getTestMasterList();
        });
    }

    onAdd() {
        const dialogRef = this._matDialog.open(TestFormMasterComponent, {

            width: "80%",
            height: "90%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getTestMasterList();
        });
    }
    onClear() {
        this._TestService.myform.reset({ IsDeleted: "false" });
        this._TestService.initializeFormGroup();
        this.DSTestList.data = [];
    }
}

export class TestMaster {
    TestId: number;
    TestName: string;
    PrintTestName: String;
    CategoryId: number;
    IsSubTest: boolean;
    TechniqueName: string;
    MachineName: string;
    SuggestionNote: string;
    FootNote: string;
    ServiceID: number;
    IsTemplateTest: number;
    IsCategoryPrint: boolean;
    IsPrintTestName: boolean;
    Isdeleted: boolean;
    UpdatedBy: number;
    AddedBy: number;
    IsDeletedSearch: number;
    /**
     * Constructor
     *
     * @param TestMaster
     */
    constructor(TestMaster) {
        {
            this.TestId = TestMaster.TestId || "";
            this.TestName = TestMaster.TestName || "";
            this.PrintTestName = TestMaster.PrintTestName || "";
            this.CategoryId = TestMaster.CategoryId || "";
            this.IsSubTest = TestMaster.IsSubTest || "";
            this.TechniqueName = TestMaster.TechniqueName || "";
            this.MachineName = TestMaster.MachineName || "";
            this.SuggestionNote = TestMaster.SuggestionNote || "";
            this.FootNote = TestMaster.FootNote || "";
            this.Isdeleted = TestMaster.Isdeleted || "false";
            this.ServiceID = TestMaster.ServiceID || "";
            this.IsTemplateTest = TestMaster.IsTemplateTest || "";
            this.IsCategoryPrint = TestMaster.IsCategoryPrint || "false";
            this.IsPrintTestName = TestMaster.IsPrintTestName || "false";
            this.UpdatedBy = TestMaster.UpdatedBy || "";
            this.AddedBy = TestMaster.AddedBy || "";
            this.IsDeletedSearch = TestMaster.IsDeletedSearch || "";
        }
    }
}
export class TestList {
    TestId: number;
    TestName: any;
    ParameterName: any;
    ParameterID: number;
    Isdeleted: any;
    /**
     * Constructor
     *
     * @param TestList
     */
    constructor(TestList) {
        {
            this.ParameterName = TestList.ParameterName || "";
            this.TestId = TestList.TestId || "";
            this.TestName = TestList.TestName || "";
            this.Isdeleted = TestList.Isdeleted || "";
        }
    }
}


export class TemplatedetailList {
    TemplateId: number;
    TemplateName: any;
    constructor(TemplateList) {
        {
            this.TemplateId = TemplateList.TemplateId || "";
            this.TemplateName = TemplateList.TemplateName || "";

        }
    }
} 
