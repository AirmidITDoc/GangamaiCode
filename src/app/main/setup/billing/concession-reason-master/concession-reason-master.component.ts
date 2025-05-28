import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { ConcessionReasonMasterService } from "./concession-reason-master.service";
import { NewConcessionreasonComponent } from "./new-concessionreason/new-concessionreason.component";

@Component({
    selector: "app-concession-reason-master",
    templateUrl: "./concession-reason-master.component.html",
    styleUrls: ["./concession-reason-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class ConcessionReasonMasterComponent implements OnInit {

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

     concessionReason: any = "";
        allcolumns = [
            { heading: "Code", key: "concessionId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Concession Reason ", key: "concessionReason", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._ConcessionReasonMasterService.deactivateTheStatus(data.concessionId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
        
        allfilters = [
            { fieldName: "concessionReason", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
        apiUrl: "ConcessionReasonMaster/List",
        columnsList: this.allcolumns,
        sortField: "concessionId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(
        public _ConcessionReasonMasterService: ConcessionReasonMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }
     //filters addedby avdhoot vedpathak date-28/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'ConcessionReasonNameSearch')
            this._ConcessionReasonMasterService.myformSearch.get('ConcessionReasonNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.concessionReason = this._ConcessionReasonMasterService.myformSearch.get('ConcessionReasonNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._ConcessionReasonMasterService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "ConcessionReasonMaster/List",
            columnsList: this.allcolumns,
            sortField: "concessionId",
            sortOrder: 0,
            filters: [
                { fieldName: "concessionReason", fieldValue: this.concessionReason, opType: OperatorComparer.Contains },
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

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewConcessionreasonComponent,
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