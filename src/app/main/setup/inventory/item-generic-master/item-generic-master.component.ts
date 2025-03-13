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
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
        apiUrl: "GenericMaster/List",
        columnsList: [
            { heading: "Code", key: "genericId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "GenericName", key: "genericName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
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
        ]
    }

    constructor(public _ItemGenericMasterService: ItemGenericMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ItemGenericMasterComponent>,) { }

    ngOnInit(): void { }

    onClear(val: boolean) {
        this.genericForm.reset();
        this.dialogRef.close(val);
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewGenericComponent,
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