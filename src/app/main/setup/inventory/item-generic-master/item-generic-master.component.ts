import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ItemGenericMasterService } from "./item-generic-master.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { NewGenericComponent } from "./new-generic/new-generic.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { FormGroup } from "@angular/forms";

@Component({
    selector: "app-item-generic-master",
    templateUrl: "./item-generic-master.component.html",
    styleUrls: ["./item-generic-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemGenericMasterComponent implements OnInit {
    genericForm: FormGroup;

    constructor(public _ItemGenericMasterService: ItemGenericMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ItemGenericMasterComponent>,) { }

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "GenericMaster/List",
        columnsList: [
            { heading: "Code", key: "genericId", sort: true, width: 150, align: 'left', emptySign: 'NA' },
            { heading: "Generic Name", key: "genericName", sort: true, width: 750, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, width: 150, align: "center" },
            {
                heading: "Action", key: "action", align: "right", width: 150, type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._ItemGenericMasterService.deactivateTheStatus(data.genericId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "genericId",
        sortOrder: 0,
        filters: [
            { fieldName: "GenericName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }


    ngOnInit(): void { }

    onClear(val: boolean) {
        this.genericForm.reset();
        this.dialogRef.close(val);
    }

    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewGenericComponent,
            {
                maxWidth: "35vw",
                height: '35%',
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