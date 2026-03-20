import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { InstructionmasterService } from "./instructionmaster.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewInstructionMasterComponent } from "./new-instruction-master/new-instruction-master.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";

@Component({
    selector: "app-instructionmaster",
    templateUrl: "./instructionmaster.component.html",
    styleUrls: ["./instructionmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class InstructionmasterComponent implements OnInit {

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.InstructionMaster, permissionType.Add);
    instructionDescription: any = "";

    allcolumns = [
        // { heading: "Code", key: "instructionId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Instruction Name", key: "instructionDescription", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.InstructionMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.InstructionMaster, permissionType.Delete), callback: (data: any) => {
                        this._InstructionService.deactivateTheStatus(data.instructionId).subscribe((data: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        }
    ]

    allfilters = [
        { fieldName: "instructionDescription", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.InstructionMaster,
        apiUrl: "InstructionMastere/List",
        columnsList: this.allcolumns,
        sortField: "instructionId",
        sortOrder: 0,
        filters: this.allfilters
    }

    openedFromOPD = false;
    constructor(public _InstructionService: InstructionmasterService, public _matDialog: MatDialog,
        public toastr: ToastrService, public permissionService: PagePermissionService) { }

    ngOnInit(): void {
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button


        const that = this;
        const dialogRef = this._matDialog.open(NewInstructionMasterComponent,
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



    onClear() {
        this._InstructionService.myForm.reset({ IsDeleted: "false" });
        this._InstructionService.initializeFormGroup();
    }

}