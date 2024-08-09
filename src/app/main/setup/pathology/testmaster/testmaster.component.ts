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
import { ExcelDownloadService } from "app/main/shared/services/excel-download.service";

@Component({
    selector: "app-testmaster",
    templateUrl: "./testmaster.component.html",
    styleUrls: ["./testmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TestmasterComponent implements OnInit {
    displayedColumns: string[] = [
        "IsTemplateTest",
        "TestId",
        "TestName",
        "PrintTestName",
        "CategoryName",
        "ServiceName",
        "TechniqueName",
        "MachineName",
        "AddedBy",
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
    currentStatus=0;
    setStep(index: number) {
        this.step = index;
    }

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    //parametername filter
    public parameternameFilterCtrl: FormControl = new FormControl();
    public filteredParametername: ReplaySubject<any> = new ReplaySubject<any>(1);

   

    private _onDestroy = new Subject<void>();

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    DSTestMasterList = new MatTableDataSource<TestMaster>();
    DSTestMasterList1 = new MatTableDataSource<TestMaster>();
    tempList = new MatTableDataSource<TestMaster>();

    constructor(
        public _TestService: TestmasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private reportDownloadService: ExcelDownloadService,
        private accountService: AuthenticationService,
    ) { }

    ngOnInit(): void {
        this.parameternameFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterParametername();
            });

        this.getParameterNameCombobox();
        this.getTestMasterList();
        // this.getNewSubTestList();
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

    toggle(val: any) {
        if (val == "2") {
            this.currentStatus = 2;
        } else if (val == "1") {
            this.currentStatus = 1;
        }
        else {
            this.currentStatus = 0;

        }
    }

    getTestMasterList() {
        this.sIsLoading = 'loading-data';
        var m_data = {
            ServiceName: this._TestService.myformSearch.get('TestNameSearch').value + "%" || "%"
        };
        this._TestService.getTestMasterList(m_data).subscribe((Menu) => {
            this.DSTestMasterList.data = Menu as TestMaster[];
            this.DSTestMasterList1.data = Menu as TestMaster[];
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
        ;
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
            title: 'Confirm Status',
            text: 'Are you sure you want to Change Active Status?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes,Change Status!'
          }).then((result) => {
            let Query
            if (result.isConfirmed) {
                if (row.Isdeleted) {
                    Query =
                        "Update M_PathTestMaster set Isdeleted=0 where TestId=" + TestId;

                } else {
                    Query =
                        "Update M_PathTestMaster set Isdeleted=1 where TestId=" + TestId;

                }
                this._TestService.deactivateTheStatus(Query)
                .subscribe((data) => {
                    Swal.fire('Changed!', 'Test Status has been Changed.', 'success');
                    this.getTestMasterList();
                  }, (error) => {
                   Swal.fire('Error!', 'Failed to deactivate Test.', 'error');
                  });
            }
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

    onFilterChange() {
       
        if (this.currentStatus == 1) {
            this.tempList.data = []
            this.DSTestMasterList.data= this.DSTestMasterList1.data
            for (let item of this.DSTestMasterList.data) {
                if (item.Isdeleted) this.tempList.data.push(item)

            }

            this.DSTestMasterList.data = [];
            this.DSTestMasterList.data = this.tempList.data;
        }
        else if (this.currentStatus == 0) {
            this.DSTestMasterList.data= this.DSTestMasterList1.data
            this.tempList.data = []

            for (let item of this.DSTestMasterList1.data) {
                if (!item.Isdeleted) this.tempList.data.push(item)

            }
            this.DSTestMasterList.data = [];
            this.DSTestMasterList.data = this.tempList.data;
        }
        else {
            this.DSTestMasterList.data= this.DSTestMasterList1.data
            this.tempList.data = this.DSTestMasterList.data;
        }


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
   

    selectedValue: string = '';
    @ViewChild('tabGroup') tabGroup: MatTabGroup;

    onEdit(row) {

        if (row.IsNumericParameter == 1) {
            this._TestService.getTestListfor(row.TestId).subscribe(Visit => {
                row['TestList'] = Visit;
                console.log(Visit)

            });
        } else if (row.IsNumericParameter == 0) {

            this._TestService.getTemplateListfor(row.TestId).subscribe(Visit => {
                row['descriptiveList'] = Visit;
                console.log(Visit)
            });

        }

        this._TestService.populateForm(row);
        const dialogRef = this._matDialog.open(TestFormMasterComponent, {
            maxWidth: "90vw",
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

            width: "90%",
            height: "95%",
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
    exportTestExcel(){
        this.sIsLoading == 'loading-data'
        let exportHeaders = ['TestId', 'TestName','PrintTestName','CategoryId', 'IsSubTest','TechniqueName','ServiceID','Isdeleted', 'AddedBy', 'UpdatedBy'];
        this.reportDownloadService.getExportJsonData(this.DSTestMasterList.data, exportHeaders, 'Pathology Test');
        this.DSTestMasterList.data = [];
        this.sIsLoading = '';
      }
    
      exportReportPdf() {
        let actualData = [];
        this.DSTestMasterList.data.forEach(e => {
          var tempObj = [];
          tempObj.push(e.TestId);
          tempObj.push(e.TestName);
          tempObj.push(e.PrintTestName);
          tempObj.push(e.CategoryId);
          tempObj.push(e.IsSubTest);
          tempObj.push(e.TechniqueName);
          tempObj.push(e.ServiceID);
          tempObj.push(e.Isdeleted);
          tempObj.push(e.AddedBy);
          
          actualData.push(tempObj);
        });
        let headers = [['TestId', 'TestName','PrintTestName','CategoryId','IsSubTest','TechniqueName','ServiceID', 'Isdeleted', 'AddedBy', 'UpdatedBy']];
        this.reportDownloadService.exportPdfDownload(headers, actualData, 'Pathology Test');
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
            this.TemplateId = TemplateList.TemplateId || 0;
            this.TemplateName = TemplateList.TemplateName || "";

        }
    }
} 
