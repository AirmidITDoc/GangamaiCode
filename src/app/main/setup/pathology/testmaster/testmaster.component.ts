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
        "IsDeleted",
        "action",
    ];
    displayedColumns1: string[] = [
        "ParameterName"
    ];
    isChecked:boolean=false;
    isCheckednew:boolean=false;
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
        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.parameternameFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterParametername();
            });

            this.categoryFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filterCategoryname();
            });

        this.serviceFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterServicename();
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
    }

    getTestMasterList() {
        this.sIsLoading = 'loading-data';
        var m_data = {
            ServiceName: this._TestService.myformSearch.get('TestNameSearch').value + "%" || "%"
        };
        this._TestService.getTestMasterList(m_data).subscribe((Menu) => {
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
    getSubTestMasterList() {
        this.sIsLoading = 'loading-data';
        var m_data = {
            ServiceName: this._TestService.myformSearch.get('TestNameSearch').value + "%" || "%"
        };
        this._TestService.getSubTestMasterList(m_data).subscribe((Menu) => {
            this.DSTestMasterList.data = Menu as TestMaster[];
            console.log(this.DSTestMasterList)
            this.sIsLoading = '';
            this.DSTestMasterList.sort = this.sort;
            this.DSTestMasterList.paginator = this.paginator;
        },
            error => {
                this.sIsLoading = '';
            });
    }

    onDeactive(TestId) {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                let Query =
                    "Update M_PathTestMaster set IsDeleted=1 where TestId=" +
                    TestId;
                console.log(Query);
                this._TestService
                    .deactivateTheStatus(Query)
                    .subscribe((data) => (this.msg = data));
                this.getTestMasterList();
            }
            this.confirmDialogRef = null;
        });
    }

    //Tab-2
 
    getSubTestList(el) {
        var m_data = {
            TestId:el.TestId
        };
        console.log(m_data)
        this._TestService.getSubTestList(m_data).subscribe((Menu) => {
            this.DSTestList.data = Menu as TestList[];
            console.log(this.DSTestList)
            this.DSTestList.sort = this.sort;
            this.DSTestList.paginator = this.paginator;
        });
    }
    getParameterTestList(el) {
        var m_data = {
            TestId:el.TestId
        };
        console.log(m_data)
        this._TestService.getParameterTestList(m_data).subscribe((Menu) => {
            this.DSTestList.data = Menu as TestList[];
            console.log(this.DSTestList)
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
        // console.log(this.ChargeList);
        // this._TestService.AddParameterFrom.get('ParameterName').setValue("");
        this._TestService.AddParameterFrom.reset();
    }
    // categoryname filter
    private filterCategoryname() {
        if (!this.CategorycmbList) {
    
          return;
        }
        // get the search keyword
        let search = this.categoryFilterCtrl.value;
        if (!search) {
          this.filteredCategory.next(this.CategorycmbList.slice());
          return;
        } else {
          search = search.toLowerCase();
        }
        // filter the banks
        this.filteredCategory.next(
          this.CategorycmbList.filter(bank => bank.CategoryName.toLowerCase().indexOf(search) > -1)
        );
      }
      getCategoryNameCombobox(){
    
        this._TestService.getCategoryMasterCombo().subscribe(data => {
          this.CategorycmbList = data;
          console.log(this.CategorycmbList[0])
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
        this._TestService.getParameterMasterCombo()
            .subscribe((data) => (this.Parametercmb = data));
            this.filteredParametername.next(this.Parametercmb.slice());
        // console.log(this.Parametercmb);
    }

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
            this.Subtestcmb = data ;
           // console.log(this.Subtestcmb)
            this.filteredSubtest.next(this.Subtestcmb.slice());
        });
    }
    // Service name filter
    private filterServicename() {
        if (!this.ServicecmbList) {
            return;
        }
        // get the search keyword
        let search = this.serviceFilterCtrl.value;
        if (!search) {
            this.filteredService.next(this.ServicecmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredService.next(
            this.ServicecmbList.filter(
                (bank) => bank.ServiceName.toLowerCase().indexOf(search) > -1
            )
        );
    }
    getServiceNameCombobox() {
        this._TestService.getServiceMasterCombo().subscribe((data) => {
            this.ServicecmbList = data;
            console.log(this.ServicecmbList)
            this.filteredService.next(this.ServicecmbList.slice());
            this._TestService.myform.get("ServiceName").setValue(this.ServicecmbList[0]);
        });
    }
    onSubmit() {

        debugger
        if (!this._TestService.myform.get("TestId").value) {

            let insertPathologyTestMaster = {};

            insertPathologyTestMaster['testName'] = this._TestService.myform.get('TestName').value || "";
            insertPathologyTestMaster['printTestName'] = this._TestService.myform.get('PrintTestName').value || "";
            insertPathologyTestMaster['categoryId'] = this._TestService.myform.get('CategoryId').value.CategoryId || 0;
            insertPathologyTestMaster['isSubTest'] = this._TestService.myform.get('IsSubTest').value ||1;
            insertPathologyTestMaster['techniqueName'] = this._TestService.myform.get('TechniqueName').value || "";
            insertPathologyTestMaster['machineName'] = this._TestService.myform.get('MachineName').value || "";
            insertPathologyTestMaster['suggestionNote'] = this._TestService.myform.get('SuggestionNote').value || "";
            insertPathologyTestMaster['footNote'] = this._TestService.myform.get('FootNote').value || "";
            insertPathologyTestMaster['isDeleted'] = this._TestService.myform.get('IsDeleted').value || "";
            insertPathologyTestMaster['addedBy'] = 1;
            insertPathologyTestMaster['serviceId'] = this._TestService.myform.get('ServiceName').value.ServiceID || 0;
            insertPathologyTestMaster['isTemplateTest'] = true;
            insertPathologyTestMaster['testId'] = 0;

            let pathTestDetailMaster = []
            this.DSTestList.data.forEach((element) => {
                let PathDetailsObj = {};
                PathDetailsObj['testId'] = 0;
                PathDetailsObj['subTestID'] = 10;
                PathDetailsObj['parameterID'] = element.ParameterID || 0;
                pathTestDetailMaster.push(PathDetailsObj);
            });
            let pathTestDetDelete = {};
            pathTestDetDelete['testId'] = 0;

            let submitData = {
                "insertPathologyTestMaster": insertPathologyTestMaster,
                "pathTestDetailMaster": pathTestDetailMaster
               // "pathTestDetDelete": pathTestDetDelete
            };

            console.log(submitData);

            this._TestService.insertPathologyTestMaster(submitData).subscribe(response => {
                if (response) {
                    this.toastr.success('Record Saved Successfully.', 'Saved !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });

                    this.onClear()

                } else {
                    this.toastr.error('New Test Master Data not saved !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            }, error => {
                this.toastr.error('New Test Master Data not saved !, Please check API error..', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            });
        }
        else {

            let updatePathologyTestMaster = {};

            updatePathologyTestMaster['testName'] = this._TestService.myform.get('TestName').value || "";
            updatePathologyTestMaster['printTestName'] = this._TestService.myform.get('PrintTestName').value || "";
            updatePathologyTestMaster['categoryId'] = this._TestService.myform.get('CategoryId').value.CategoryId || 0;
            updatePathologyTestMaster['isSubTest'] = this._TestService.myform.get('IsSubTest').value;
            updatePathologyTestMaster['techniqueName'] = this._TestService.myform.get('TechniqueName').value || "";
            updatePathologyTestMaster['machineName'] = this._TestService.myform.get('MachineName').value || "";
            updatePathologyTestMaster['suggestionNote'] = this._TestService.myform.get('SuggestionNote').value || "";
            updatePathologyTestMaster['footNote'] = this._TestService.myform.get('FootNote').value || "";
            updatePathologyTestMaster['isDeleted'] = this._TestService.myform.get('IsDeleted').value || "";
            updatePathologyTestMaster['updatedBy'] = 0;
            updatePathologyTestMaster['serviceId'] = this._TestService.myform.get('ServiceName').value.ServiceID || 0;
            updatePathologyTestMaster['isTemplateTest'] = true;
            updatePathologyTestMaster['testId'] = 0;

            let updatePathologyTemplateTest = []
            this.DSTestList.data.forEach((element) => {
                let UpdatePathDetailsObj = {};
                UpdatePathDetailsObj['testId'] = 0;
                UpdatePathDetailsObj['templateId'] = 0;
                updatePathologyTemplateTest.push(UpdatePathDetailsObj);
            });
            let pathTestDetDelete = {};
            pathTestDetDelete['testId'] = 0;

            let submitData = {
                "updatePathologyTestMaster": updatePathologyTestMaster,
                "updatePathologyTemplateTest": updatePathologyTemplateTest,
                "pathTestDetDelete": pathTestDetDelete
            };
            console.log(submitData);

            this._TestService.insertPathologyTestMaster(submitData).subscribe(response => {
                if (response) {
                    this.toastr.success('Record Updated Successfully.', 'Saved !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });

                    this.onClear()

                } else {
                    this.toastr.error('New Test Master Data not Updated !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            }, error => {
                this.toastr.error('New Test Master Data not Updated !, Please check API error..', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            });

        }

    }
    setDropdown(){
        // const selectedService = this.ServicecmbList.filter(c => c.ServiceName == row.ServiceName);
        // this._TestService.myform.get('ServiceName').setValue(selectedService);
    }
    selectedValue: string = '';
    @ViewChild('tabGroup') tabGroup: MatTabGroup;
    openTab(row, tabGroup: MatTabGroup): void {
        debugger
        var m_data = {
            TestId: row.TestId,
            TestName: row.TestName.trim(),
            PrintTestName: row.PrintTestName.trim(),
            CategoryId: row.CategoryId,
            CategoryName: row.CategoryName,
            IsSubTest: JSON.stringify(row.IsSubTest),
            TechniqueName: row.TechniqueName.trim(),
            MachineName: row.MachineName.trim(),
            SuggestionNote: row.SuggestionNote.trim(),
            FootNote: row.FootNote.trim(),
            ServiceName: row.ServiceID,
            IsTemplateTest: row.IsTemplateTest,
            IsCategoryPrint: JSON.stringify(row.IsCategoryPrint),
            IsPrintTestName: JSON.stringify(row.IsPrintTestName),
            IsDeleted: JSON.stringify(row.Isdeleted),
            UpdatedBy: row.UpdatedBy,
        };
        const selectedService = this.ServicecmbList.filter(c => c.ServiceName == row.TestName);
        this._TestService.myform.get('ServiceName').setValue(this.selectedValue);
        this.selectedValue = row.CategoryName;
        console.log(this.selectedValue);
        console.log(row.ServiceID)
        console.log(row.CategoryName)
        this._TestService.populateForm(m_data);
        const tabIndex = row === 'tab1' ? 0 : 1;
        tabGroup.selectedIndex = tabIndex;
         console.log(row)
         this.getSubTestList(row) ;
         this.getParameterTestList(row);
        this.getTestMasterList();
    }
    // onEdit(row) {
    //     var m_data = {
    //         TestId: row.TestId,
    //         TestName: row.TestName.trim(),
    //         PrintTestName: row.PrintTestName.trim(),
    //         CategoryId: row.CategoryId,
    //         CategoryName:row.CategoryName,
    //         IsSubTest: JSON.stringify(row.IsSubTest),
    //         TechniqueName: row.TechniqueName.trim(),
    //         MachineName: row.MachineName.trim(),
    //         SuggestionNote: row.SuggestionNote.trim(),
    //         FootNote: row.FootNote.trim(),
    //         ServiceName: row.ServiceName,
    //         IsTemplateTest: row.IsTemplateTest,
    //         IsCategoryPrint: JSON.stringify(row.IsCategoryPrint),
    //         IsPrintTestName: JSON.stringify(row.IsPrintTestName),
    //         IsDeleted: JSON.stringify(row.Isdeleted),
    //         UpdatedBy: row.UpdatedBy,
    //     };
    //     console.log(row)
    //     this._TestService.populateForm(m_data);

    //     const dialogRef = this._matDialog.open(TestFormMasterComponent, {
    //         maxWidth: "100%",
    //         height: '90%',
    //         width: '90%',
    //         data : {
    //             registerObj : row,
    //           }
    //     });

    //     dialogRef.afterClosed().subscribe((result) => {
    //         console.log("The dialog was closed - Insert Action", result);
    //         this.getTestMasterList();
    //     });
    // }

    onAdd(tabName: string, tabGroup: MatTabGroup) {
        const tabIndex = tabName === 'tab1' ? 0 : 1;
        tabGroup.selectedIndex = tabIndex;
        // console.log(row)
        this.getTestMasterList();
        this.onClear();
        // const dialogRef = this._matDialog.open(TestFormMasterComponent, {

        //     maxWidth: "100%",
        //     height: '90%',
        //     width: '90%',
        // });
        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log("The dialog was closed - Insert Action", result);
        //     this.getTestMasterList();
        // });
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
    IsDeleted: boolean;
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
            this.IsDeleted = TestMaster.IsDeleted || "false";
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
        }
    }
}
