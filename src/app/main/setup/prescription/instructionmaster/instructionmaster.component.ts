import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { InstructionmasterService } from "./instructionmaster.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewInstructionMasterComponent } from "./new-instruction-master/new-instruction-master.component";

@Component({
    selector: "app-instructionmaster",
    templateUrl: "./instructionmaster.component.html",
    styleUrls: ["./instructionmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class InstructionmasterComponent implements OnInit {

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    constructor(public _InstructionService: InstructionmasterService, public _matDialog: MatDialog,
        public toastr: ToastrService) { }

    gridConfig: gridModel = {
        apiUrl: "InstructionMastere/List",
        columnsList: [
            { heading: "Code", key: "instructionId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Instruction Name", key: "instructionDescription", sort: true, align: 'left', emptySign: 'NA', width: 800 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, width: 100, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._InstructionService.deactivateTheStatus(data.instructionId).subscribe((data: any) => {
                                this.toastr.success(data.message)
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "instructionId",
        sortOrder: 0,
        filters: [
            { fieldName: "instructionDescription", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    onSave(row: any = null) {
        debugger
        let that = this;
        const dialogRef = this._matDialog.open(NewInstructionMasterComponent,
            {
                maxWidth: "45vw",
                height: '30%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }

        });
    }

    ngOnInit(): void {
    }

    onClear() {
        this._InstructionService.myForm.reset({ IsDeleted: "false" });
        this._InstructionService.initializeFormGroup();
    }

}