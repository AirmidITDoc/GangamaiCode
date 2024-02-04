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
import { MatTabGroup } from "@angular/material/tabs";

@Component({
    selector: "app-templatemaster",
    templateUrl: "./templatemaster.component.html",
    styleUrls: ["./templatemaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TemplatemasterComponent implements OnInit {
    displayedColumns: string[] = [
        "TemplateId",
        "TemplateName",
        "TemplateDesc",
        "IsDeleted",
        "AddedBy",
        "UpdatedBy",
        "action"
    ];

    isLoadingResults = true;
    isLoading = true;
    isRateLimitReached = false;
    msg: any;
    Testcmblist: any = [];
    vTemplateName:any;
    vTemplateDesc:any;

   

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    DSTemplateMasterList = new MatTableDataSource<TemplateMaster>();
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    constructor(
        public _templateService: TemplatemasterService,

        public _matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getTemplateMasterList();
        // this.getTestNameCombobox();
    }
 

    onSearch() {
        this.getTemplateMasterList();
    }
    onSearchClear(){
        this._templateService.myformSearch.reset({
            TemplateNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getTemplateMasterList();  
    }
    getTemplateMasterList() {
       var  vdata={
            'TemplateName':this._templateService.myformSearch.get('TemplateNameSearch').value + "%" || "%",
        }
        this._templateService.getTemplateMasterList(vdata).subscribe(
            (data) => {
                this.DSTemplateMasterList.data = data as TemplateMaster[];
                this.isLoading = false;
                //console.log(this.DSTemplateMasterList)
                this.DSTemplateMasterList.sort = this.sort;
                this.DSTemplateMasterList.paginator = this.paginator;
            },
            (error) => (this.isLoading = false)
        );
    }
 
    onClear() {
        this._templateService.myform.reset();
        this._templateService.initializeFormGroup();
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
                    "Update M_PathParameterMaster set IsDeleted=0 where TemplateId=" +
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

    UpdatedBy:any;
    IsDeleted:any;
    @ViewChild('tabGroup') tabGroup: MatTabGroup;
    openTab(row, tabGroup: MatTabGroup): void {
      this.vTemplateName = row.TemplateName;
      this.vTemplateDesc = row.TemplateDesc;
      this.IsDeleted = JSON.stringify(row.IsDeleted),
      this.UpdatedBy + row.UpdatedBy;
      const tabIndex = row === 'tab1' ? 0 : 1;  
      tabGroup.selectedIndex = tabIndex;
     // console.log(row)
      this.getTemplateMasterList();
    }

    // onEdit(row) {
    //     console.log(row);
    //     var m_data = {
    //         TemplateId: row.TemplateId,
    //         TemplateName: row.TemplateName.trim(),
    //         TemplateDesc:row.TemplateDesc.trim(),
    //         IsDeleted: JSON.stringify(row.IsDeleted),
    //         UpdatedBy: row.UpdatedBy,
    //     };
    //     console.log(m_data);
    //     this._templateService.populateForm(m_data);
    //     const dialogRef = this._matDialog.open(PathologyTemplateFormComponent, {
    //         maxWidth: "80%", 
    //         width: "80%",
    //         height: "85%",
    //         data : {
    //             registerObj : m_data,
    //           }
    //     });
    //     dialogRef.afterClosed().subscribe((result) => {
    //         console.log("The dialog was closed - Insert Action", result);
    //         this.getTemplateMasterList();
    //     });
    // }
    onAdd(tabName: string, tabGroup: MatTabGroup) {
        const tabIndex = tabName === 'tab1' ? 0 : 1;  
        tabGroup.selectedIndex = tabIndex;
       // console.log(row)
        this.getTemplateMasterList();
        this.onClear();
        // const dialogRef = this._matDialog.open(PathologyTemplateFormComponent, {
        //     maxWidth: "80%", 
        //     width: "80%",
        //     height: "85%",
        // });
        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log("The dialog was closed - Insert Action", result);
        //     this.getTemplateMasterList();
        // });
    }
    onSubmit() {
        if (this._templateService.myform.valid) {
            if (!this._templateService.myform.get("TemplateId").value) {
                var m_data = {
                    insertPathologyTemplateMaster: {
                        testId: 0,
                        templateId:this._templateService.myform.get("TemplateId").value,
                    },
                };
                console.log(m_data)

                this._templateService.insertTemplateMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                    });
            } else {
                var m_dataUpdate = {
                    updatePathologyTemplateMaster: {
                        PTemplateId:
                            this._templateService.myform.get("PTemplateId")
                                .value,
                        testId: this._templateService.myform.get("TestId")
                            .value,
                        templateId:
                            this._templateService.myform.get("TemplateId")
                                .value,
                    },
                };

                this._templateService
                    .updateTemplateMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                    });
            }
           
        }
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
    TemplateId: number;
    TemplateName: any;
    TemplateDesc: any;
    IsDeleted:any;
    AddedBy:any;
    UpdatedBy:any;

    /**
     * Constructor
     *
     * @param TemplateMaster
     */
    constructor(TemplateMaster) {
        {
            this.AddedBy = TemplateMaster.AddedBy || 0;
            this.TemplateName = TemplateMaster.TemplateName || "";
            this.TemplateDesc = TemplateMaster.TemplateDesc || "";
            this.IsDeleted = TemplateMaster.IsDeleted || 0;
            this.AddedBy = TemplateMaster.AddedBy || 0;
            this.UpdatedBy = TemplateMaster.UpdatedBy || 0;
            
        }
    }
}
