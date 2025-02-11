import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { TestFormMasterComponent } from "./test-form-master/test-form-master.component";
import { TestmasterService } from "./testmaster.service";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ExcelDownloadService } from "app/main/shared/services/excel-download.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";

import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-testmaster",
    templateUrl: "./testmaster.component.html",
    styleUrls: ["./testmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TestmasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    parameter = this._TestService.myform.get("ParameterNameSearch").value + "%" || '%';
    gridConfig: gridModel = {
        apiUrl: "Pathology/PathologyTestList",
        columnsList: [
            { heading: "Code", key: "testId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Test Name", key: "testName", sort: true, align: 'left', emptySign: 'NA', width: 200 },            
            { heading: "Print Test Name", key: "PrintTestName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Category Name", key: "CategoryId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Billing Service Name", key: "ServiceId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Technique Name", key: "TechniqueName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Machine Name", key: "MachineName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IsSub Test", key: "IsSubTest", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Added By", key: "username", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
            {
                heading: "Action", key: "action", align: "right", width: 100, type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._TestService.deactivateTheStatus(data.testId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],

        
        sortField: "TestId",
        sortOrder: 0,
        filters: [
            { fieldName: "ServiceName", fieldValue: this.parameter, opType: OperatorComparer.StartsWith },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "0", opType: OperatorComparer.Equals }
        ],
        row: 25
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


    onSave(row: any = null) {
        
        let that = this;
        const dialogRef = this._matDialog.open(TestFormMasterComponent,
            {
                maxWidth: "100vw",
                height: '100%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
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
    ServiceName: any;
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
            this.ServiceName = TestMaster.ServiceName || "";
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
    ParameterId: any;
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
