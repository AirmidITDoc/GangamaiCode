import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { TaxMasterService } from "./tax-master.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { NewTaxComponent } from "./new-tax/new-tax.component";

@Component({
    selector: "app-tax-master",
    templateUrl: "./tax-master.component.html",
    styleUrls: ["./tax-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TaxMasterComponent implements OnInit {
    constructor(
        public _TaxMasterService: TaxMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog
    ) { }

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "TaxMaster/List",
        columnsList: [
            { heading: "TaxId", key: "id", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "TaxNatureName", key: "taxNature", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            { heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        debugger
                        this._TaxMasterService.deactivateTheStatus(data.id).subscribe((response: any) => {
                            this.toastr.success(response.message);
                            this.grid.bindGridData();
                        });
                    }
                }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "id",
        sortOrder: 0,
        filters: [
            { fieldName: "taxNature", fieldValue: "", opType: OperatorComparer.Equals },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals },
        ],
        row: 25
    }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewTaxComponent,
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

