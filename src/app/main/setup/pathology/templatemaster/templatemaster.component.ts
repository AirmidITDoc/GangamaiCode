import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { TemplateReportComponent } from "./template-report/template-report.component";
import { PathologyTemplateFormComponent } from "./pathology-template-form/pathology-template-form.component";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { TemplatemasterService } from "./templatemaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatAccordion } from "@angular/material/expansion";
import { MatSort } from "@angular/material/sort";

@Component({
    selector: "app-templatemaster",
    templateUrl: "./templatemaster.component.html",
    styleUrls: ["./templatemaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TemplatemasterComponent implements OnInit {
    isLoadingResults = true;
    isLoading = true;
    isRateLimitReached = false;
    msg: any;
    step = 0;
    Testcmblist: any = [];

    setStep(index: number) {
        this.step = index;
    }

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    displayedColumns: string[] = [
        "PTemplateId",
        "TestName",
        "TemplateId",
        "action",
    ];

    DSTemplateMasterList = new MatTableDataSource<TemplateMaster>();

    constructor(
        public _templateService: TemplatemasterService,

        public _matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getTemplateMasterList();
        this.getTestNameCombobox();
    }
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    getTemplateMasterList() {
        this._templateService.getTemplateMasterList().subscribe(
            (Menu) => {
                this.DSTemplateMasterList.data = Menu as TemplateMaster[];
                this.isLoading = false;
                this.DSTemplateMasterList.sort = this.sort;
                this.DSTemplateMasterList.paginator = this.paginator;
            },
            (error) => (this.isLoading = false)
        );
    }

    getTestNameCombobox() {
        this._templateService
            .getTestMasterCombo()
            .subscribe((data) => (this.Testcmblist = data));
    }

    onClear() {
        this._templateService.myform.reset();
        this._templateService.initializeFormGroup();
    }

    onSearch() {
        this.getTemplateMasterList();
    }

    onDeactive(PTemplateId) {
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
                    "Update M_PathParameterMaster set IsDeleted=1 where PTemplateId=" +
                    PTemplateId;
                console.log(Query);
                this._templateService
                    .deactivateTheStatus(Query)
                    .subscribe((data) => (this.msg = data));
                this.getTemplateMasterList();
            }
            this.confirmDialogRef = null;
        });
    }
    onAdd() {
        this.onClear();
        const dialogRef = this._matDialog.open(PathologyTemplateFormComponent, {
            maxWidth: "80vw",
            maxHeight: "95vh",
            width: "100%",
            height: "100%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getTemplateMasterList();
        });
    }

    OnPrint(TemplateId) {
        var m_data = { TemplateId: TemplateId };
        // console.log(m_data);
        this._templateService.populatePrintForm(m_data);
        const dialogRef = this._matDialog.open(TemplateReportComponent, {
            maxWidth: "95vw",
            maxHeight: "95vh",
            width: "100%",
            height: "100%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getTemplateMasterList();
        });
    }

    onPrint(cmpName): void {
        let printContents, popupWin;
        printContents = document.getElementById(cmpName).innerHTML;
        popupWin = window.open(
            "",
            "_blank",
            "top=0,left=0,height=100%,width=auto"
        );
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="alert("ksjksdjskjksdjksjdkjds");window.print();">Hi</body>
      </html>`);
        popupWin.document.close();
    }
}

export class TemplateMaster {
    PTemplateId: number;
    TestId: number;
    TemplateId: number;

    /**
     * Constructor
     *
     * @param TemplateMaster
     */
    constructor(TemplateMaster) {
        {
            this.PTemplateId = TemplateMaster.PTemplateId || "";
            this.TestId = TemplateMaster.TestId || "";
            this.TemplateId = TemplateMaster.TemplateId || "";
        }
    }
}
