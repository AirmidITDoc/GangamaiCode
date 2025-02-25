import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { DosemasterService } from "./dosemaster.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
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
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
        apiUrl: "DoseMaster/List",
        columnsList: [
            { heading: "Code", key: "doseId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Dose Name", key: "doseName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Dose Name In English", key: "doseNameInEnglish", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DoseQtyPerDay", key: "doseQtyPerDay", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._DoseService.deactivateTheStatus(data.doseId).subscribe((data: any) => {
                                this.toastr.success(data.message)
                                this.grid.bindGridData();
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
        row: 25
    }

    constructor(public _DoseService: DosemasterService, 
        public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }
    onSearch() { }

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

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewDoseMasterComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
}

export class DoseMaster {
    doseId: number;
    doseName: string;
    doseNameInEnglish: string;
    doseNameInMarathi: string;
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
