import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { DosemasterService } from "./dosemaster.service";
import { NewDoseMasterComponent } from "./new-dose-master/new-dose-master.component";

@Component({
    selector: "app-dosemaster",
    templateUrl: "./dosemaster.component.html",
    styleUrls: ["./dosemaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DosemasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
 doseName: any = "";
   
        allcolumns = [
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
        ]
        
          allfilters = [
            { fieldName: "doseName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    
 gridConfig: gridModel = {
        apiUrl: "DoseMaster/List",
        columnsList: this.allcolumns,
        sortField: "doseId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(public _DoseService: DosemasterService, 
        public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }
    //filters addedby avdhoot vedpathak date-28/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'DoseNameSearch')
            this._DoseService.myformSearch.get('DoseNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.doseName = this._DoseService.myformSearch.get('DoseNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._DoseService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "DoseMaster/List",
            columnsList: this.allcolumns,
            sortField: "doseId",
            sortOrder: 0,
            filters: [
                { fieldName: "doseName", fieldValue: this.doseName, opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: isActive, opType: OperatorComparer.Equals }
            ]
        }
        // this.grid.gridConfig = this.gridConfig;
        // this.grid.bindGridData();
        console.log("GridConfig:", this.gridConfig);

    if (this.grid) {
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    } else {
        console.error("Grid is undefined!");
    }
    }
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
                maxWidth: "50vw",
                maxHeight: '50%',
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
