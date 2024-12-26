import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { DosemasterService } from "./dosemaster.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewDoseMasterComponent } from "./new-dose-master/new-dose-master.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-dosemaster",
    templateUrl: "./dosemaster.component.html",
    styleUrls: ["./dosemaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DosemasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
        apiUrl: "DoseMaster/List",
        columnsList: [
            { heading: "Code", key: "doseId", sort: true, align: 'left', emptySign: 'NA', width:150 },
            { heading: "Dose Name", key: "doseName", sort: true, align: 'left', emptySign: 'NA', width:400 },
            { heading: "Dose Name English", key: "doseNameInEnglish", sort: true, align: 'left', emptySign: 'NA' , width:150},
            { heading: "Dose Name Marathi ", key: "doseNameInMarathi", sort: true, align: 'left', emptySign: 'NA', width:150 },
            { heading: "Qty/Day", key: "doseQtyPerDay", sort: true, align: 'left', emptySign: 'NA',width:100 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center",width:100 },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,width:100, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                           this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            debugger
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                debugger
                                if (result) {
                                    let that=this;
                                    this._DoseService.deactivateTheStatus(data.doseId).subscribe((data: any) => {
                                        this.toastr.success(data.message)
                                        that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "doseId",
        sortOrder: 0,
        filters: [
            { fieldName: "doseName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }

    constructor(public _DoseService: DosemasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {}
    onSearch() {}

    onSearchClear() {
        this._DoseService.myformSearch.reset({
            DoseNameSearch: "",
            IsDeletedSearch: "2",
        });
    }

    onClear() {
        this._DoseService.myForm.reset({ IsDeleted: "false" });
        this._DoseService.initializeFormGroup();
    }
   
    onEdit(row) {
        var m_data1 = {
            DoseId: row.DoseId,
            DoseName: row.DoseName.trim(),
            DoseNameInEnglish: row.DoseNameInEnglish.trim(),
            DoseQtyPerDay: row.DoseQtyPerDay,
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };

        // this._DoseService.populateForm(m_data1);
    }

    onSave(row: any=null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewDoseMasterComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
            });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                that.grid.bindGridData();
            }
        });
    }
}

export class DoseMaster {
    doseId: number;
    doseName: string;
    doseNameInEnglish: string;
    doseNameInMarathi:string;
    doseQtyPerDay: number;
    isActive: boolean;
    // AddedBy: number;
    // UpdatedBy: number;
    // AddedByName: string;

    /**
     * Constructor
     *
     * @param DoseMaster
     */
    constructor(DoseMaster) {
        {
            this.doseId = DoseMaster.doseId || "";
            this.doseName = DoseMaster.doseName || "";
            this.doseNameInEnglish = DoseMaster.doseNameInEnglish || "";
            this.doseNameInMarathi = DoseMaster.doseNameInMarathi || "";
            this.doseQtyPerDay = DoseMaster.doseQtyPerDay || "";

            this.isActive = DoseMaster.isActive || "false";
            // this.AddedBy = DoseMaster.AddedBy || "";
            // this.UpdatedBy = DoseMaster.UpdatedBy || "";
            // this.AddedByName = DoseMaster.AddedByName || "";
        }
    }
}
