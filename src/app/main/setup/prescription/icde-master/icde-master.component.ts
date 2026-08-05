
import { Component, OnInit, Optional, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { ToastrService } from "ngx-toastr";
import { ICDEMasterService } from "./icde-master.service";
import { NewICDEMasterComponent } from "./new-icde-master/new-icde-master.component";


@Component({
    selector: 'app-icde-master',
    templateUrl: './icde-master.component.html',
    styleUrls: ['./icde-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ICDEMasterComponent {

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    doseName: any = "";
    // IsAdd: boolean = this.permissionService.getPermission(permissionCodes.DoseMaster, permissionType.Add);

    allcolumns = [
        { heading: "ICD Diagnosis Name", key: "diagnosisName", sort: true, align: 'left', emptySign: 'NA', width: 600 },
        { heading: "ICD version", key: "icdversion", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "ICD Code", key: "icdcode", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Short Name", key: "shortName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
         { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
      
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.MICDE_Master, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.MICDE_Master, permissionType.Delete), callback: (data: any) => {
                        this._ICDEMasterService.deactivateTheStatus(data.icdid).subscribe((data: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        }
    ]

    allfilters = [
        { fieldName: "DiagnosisName", fieldValue: "", opType: OperatorComparer.StartsWith },
        // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        // permissionCode: permissionCodes.DoseMaster,
        apiUrl: "MIcdDiagnosisMaster/List",
        columnsList: this.allcolumns,
        sortField: "Icdid",
        sortOrder: 0,
        filters: this.allfilters
    }
    openedFromOPD = false;
    constructor(public _ICDEMasterService: ICDEMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        public permissionService: PagePermissionService,
        @Optional() private dialogRef: MatDialogRef<ICDEMasterComponent>
    ) { }

    ngOnInit(): void { }

    closeDialog() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }
    onSearch() { }

    onSearchClear() {
        this._ICDEMasterService.myformSearch.reset({
            DoseNameSearch: ""
        });
    }

    onClear() {
        this._ICDEMasterService.myForm.reset({ IsDeleted: "false" });
        this._ICDEMasterService.initializeFormGroup();
    }

    onEdit(row) {
        const m_data1 = {
            DoseId: row.DoseId,
            DoseName: row.DoseName.trim(),
            DoseNameInEnglish: row.DoseNameInEnglish.trim(),
            DoseQtyPerDay: row.DoseQtyPerDay,
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };

        // this._ICDEMasterService.populateForm(m_data1);
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewICDEMasterComponent,
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
