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

@Component({
    selector: "app-testmaster",
    templateUrl: "./testmaster.component.html",
    styleUrls: ["./testmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TestmasterComponent implements OnInit {
    isLoading = true;
    msg: any;
    step = 0;
    SearchName: string;

    setStep(index: number) {
        this.step = index;
    }

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    displayedColumns: string[] = [
        "TestId",
        "TestName",
        "PrintTestName",
        "CategoryName",
        "TechniqueName",
        "MachineName",
        "SuggestionNote",
        "FootNote",
        "ServiceName",
        "AddedByName",
        "IsTemplateTest",
        "IsCategoryPrint",
        "IsPrintTestName",
        "IsDeleted",
        "action",
    ];

    DSTestMasterList = new MatTableDataSource<TestMaster>();

    constructor(
        public _TestService: TestmasterService,

        public _matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getTestMasterList();
    }

    onSearchClear() {
        this._TestService.myformSearch.reset({
            TestNameSearch: "",
            IsDeletedSearch: "2",
        });
    }

    onClear() {
        this._TestService.myform.reset({ IsDeleted: "false" });
        this._TestService.initializeFormGroup();
    }

    onSearch() {
        this.getTestMasterList();
    }

    getTestMasterList() {
        var m_data = {
            TestName:
                this._TestService.myformSearch
                    .get("TestNameSearch")
                    .value.trim() + "%" || "%",
            p_IsDeleted:
                this._TestService.myformSearch.get("IsDeletedSearch").value,
        };
        this._TestService.getTestMasterList(m_data).subscribe((Menu) => {
            this.DSTestMasterList.data = Menu as TestMaster[];
            this.DSTestMasterList.sort = this.sort;
            this.DSTestMasterList.paginator = this.paginator;
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

    onSubmit() {
        if (this._TestService.myform.valid) {
            if (!this._TestService.myform.get("TestId").value) {
                var m_data = {
                    insertPathologyTestMaster: {
                        testName: this._TestService.myform
                            .get("TestName")
                            .value.trim(),
                        printTestName: this._TestService.myform
                            .get("PrintTestName")
                            .value.trim(),
                        categoryId:
                            this._TestService.myform.get("CategoryId").value,
                        isSubTest: Boolean(
                            JSON.parse(
                                this._TestService.myform.get("IsSubTest").value
                            )
                        ),
                        techniqueName: this._TestService.myform
                            .get("TechniqueName")
                            .value.trim(),
                        machineName: this._TestService.myform
                            .get("MachineName")
                            .value.trim(),
                        suggestionNote: this._TestService.myform
                            .get("SuggestionNote")
                            .value.trim(),
                        footNote: this._TestService.myform
                            .get("FootNote")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._TestService.myform.get("IsDeleted").value
                            )
                        ),
                        addedBy: this._TestService.myform.get("AddedBy").value,
                        serviceId:
                            this._TestService.myform.get("ServiceID").value,
                        isTemplateTest:
                            this._TestService.myform.get("IsTemplateTest")
                                .value,
                        isCategoryPrint: Boolean(
                            JSON.parse(
                                this._TestService.myform.get("IsCategoryPrint")
                                    .value
                            )
                        ),
                        isPrintTestName: Boolean(
                            JSON.parse(
                                this._TestService.myform.get("IsPrintTestName")
                                    .value
                            )
                        ),
                    },
                };

                this._TestService
                    .insertPathologyTestMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                    });
            } else {
                var m_dataUpdate = {
                    updatePathologyTestMaster: {
                        testId: this._TestService.myform.get("TestId").value,
                        testName: this._TestService.myform
                            .get("TestName")
                            .value.trim(),
                        printTestName: this._TestService.myform
                            .get("PrintTestName")
                            .value.trim(),
                        categoryId:
                            this._TestService.myform.get("CategoryId").value,
                        isSubTest: Boolean(
                            JSON.parse(
                                this._TestService.myform.get("IsSubTest").value
                            )
                        ),
                        techniqueName: this._TestService.myform
                            .get("TechniqueName")
                            .value.trim(),
                        machineName: this._TestService.myform
                            .get("MachineName")
                            .value.trim(),
                        suggestionNote: this._TestService.myform
                            .get("SuggestionNote")
                            .value.trim(),
                        footNote: this._TestService.myform
                            .get("FootNote")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._TestService.myform.get("IsDeleted").value
                            )
                        ),
                        updatedBy:
                            this._TestService.myform.get("UpdatedBy").value,
                        serviceId:
                            this._TestService.myform.get("ServiceID").value,
                        isTemplateTest:
                            this._TestService.myform.get("IsTemplateTest")
                                .value,
                        isCategoryPrint: Boolean(
                            JSON.parse(
                                this._TestService.myform.get("IsCategoryPrint")
                                    .value
                            )
                        ),
                        isPrintTestName: Boolean(
                            JSON.parse(
                                this._TestService.myform.get("IsPrintTestName")
                                    .value
                            )
                        ),
                    },
                };
                this._TestService
                    .updatePathologyTestMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            TestId: row.TestId,
            TestName: row.TestName.trim(),
            PrintTestName: row.PrintTestName.trim(),
            CategoryId: row.CategoryId,
            IsSubTest: JSON.stringify(row.IsSubTest),
            TechniqueName: row.TechniqueName.trim(),
            MachineName: row.MachineName.trim(),
            SuggestionNote: row.SuggestionNote.trim(),
            FootNote: row.FootNote.trim(),
            ServiceName: row.ServiceName.trim(),
            IsTemplateTest: row.IsTemplateTest,
            IsCategoryPrint: JSON.stringify(row.IsCategoryPrint),
            IsPrintTestName: JSON.stringify(row.IsPrintTestName),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };

        this._TestService.populateForm(m_data);

        const dialogRef = this._matDialog.open(TestFormMasterComponent, {
            maxWidth: "80vw",
            maxHeight: "95vh",
            width: "100%",
            height: "100%",
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getTestMasterList();
        });
    }

    onAdd() {
        const dialogRef = this._matDialog.open(TestFormMasterComponent, {
            maxWidth: "80vw",
            maxHeight: "95vh",
            width: "100%",
            height: "100%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getTestMasterList();
        });
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
    AddedByName: string;
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
            this.AddedByName = TestMaster.AddedByName || "";
            this.IsDeletedSearch = TestMaster.IsDeletedSearch || "";
        }
    }
}

//
export class TestDetailMaster {
    TestDetId: number;
    TestId: number;
    ParameterId: number;
    SubTestID: number;

    /**
     * Constructor
     *
     * @param TestDetailMaster
     */
    constructor(TestDetailMaster) {
        {
            this.TestDetId = TestDetailMaster.TestDetId || "";
            this.TestId = TestDetailMaster.TestId || "";
            this.ParameterId = TestDetailMaster.ParameterId || "";
            this.SubTestID = TestDetailMaster.SubTestID || "";
        }
    }
}
//
export class TemplateDetails {
    PTemplateId: number;
    TestId: number;
    TemplateId: number;
    /**
     * Constructor
     *
     * @param TemplateDetails
     */
    constructor(TemplateDetails) {
        {
            this.PTemplateId = TemplateDetails.PTemplateId || "";
            this.TestId = TemplateDetails.TestId || "";
            this.TemplateId = TemplateDetails.TemplateId || "";
        }
    }
}

export class parameterselect {
    ParameterId: number;
    ParameterName: String;

    /**
     * Constructor
     *
     * @param parameterselect
     */
    constructor(parameterselect) {
        {
            this.ParameterId = parameterselect.ParameterId || "1";
            this.ParameterName = parameterselect.ParameterName || "RR";
        }
    }
}
