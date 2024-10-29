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
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";

import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";

@Component({
    selector: "app-testmaster",
    templateUrl: "./testmaster.component.html",
    styleUrls: ["./testmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TestmasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "Gender/List",
        columnsList: [
            { heading: "Code", key: "testId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Test Name", key: "testName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data) // EDIT Records
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.onDeactive(data.genderId); // DELETE Records
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "genderId",
        sortOrder: 0,
        filters: [
            { fieldName: "genderName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }

    constructor(
        public _TestService: TestmasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private reportDownloadService: ExcelDownloadService,
        private _fuseSidebarService: FuseSidebarService,
        private accountService: AuthenticationService,
    ) { }

    ngOnInit(): void {
        
    }
  
    onSearchClear() {
        this._TestService.myformSearch.reset({
            TestNameSearch: "",
            IsDeletedSearch: "2",
        });
       
    }
    onSearch() {
       
        setTimeout(() => {
            this.onSearchClear();
        }, 5000);
    }

  


    onEdit(row) {

        row.IsDeleted=JSON.stringify(row.Isdeleted)
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
           
        });
    }
    onSave(row:any = null) {
        const dialogRef = this._matDialog.open(TestFormMasterComponent,
        {
            maxWidth: "45vw",
            height: '35%',
            width: '70%',
            data: row
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                // this.getGenderMasterList();
                // How to refresh Grid.
            }
            console.log('The dialog was closed - Action', result);
        });
    }

    onDeactive(genderId) {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this._TestService.deactivateTheStatus(genderId).subscribe((response: any) => {
                    if (response.StatusCode == 200) {
                        this.toastr.success(response.Message);
                        // this.getGenderMasterList();
                        // How to refresh Grid.
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }

    onClear() {
        this._TestService.myform.reset({ IsDeleted: "false" });
        this._TestService.initializeFormGroup();
       
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
    ServiceName:any;
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
            this.TestId = TestMaster.TestId || 0;
            this.TestName = TestMaster.TestName || "";
            this.PrintTestName = TestMaster.PrintTestName || "";
            this.CategoryId = TestMaster.CategoryId || 0;
            this.IsSubTest = TestMaster.IsSubTest || "";
            this.TechniqueName = TestMaster.TechniqueName || "";
            this.MachineName = TestMaster.MachineName || "";
            this.SuggestionNote = TestMaster.SuggestionNote || "";
            this.FootNote = TestMaster.FootNote || "";
            this.Isdeleted = TestMaster.Isdeleted || "false";
            this.ServiceID = TestMaster.ServiceID || 0;
            this.ServiceName= TestMaster.ServiceName || "";
            this.IsTemplateTest = TestMaster.IsTemplateTest || "";
            this.IsCategoryPrint = TestMaster.IsCategoryPrint || "false";
            this.IsPrintTestName = TestMaster.IsPrintTestName || "false";
            this.UpdatedBy = TestMaster.UpdatedBy || 0;
            this.AddedBy = TestMaster.AddedBy || 0;
            this.IsDeletedSearch = TestMaster.IsDeletedSearch || "true";
        }
    }
}
export class TestList {
    TestId: number;
    TestName: any;
    ParameterName: any;
    ParameterID: number;
    Isdeleted: any;
    IsDeleted: any;
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
            this.IsDeleted = TestList.IsDeleted || "true";
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
