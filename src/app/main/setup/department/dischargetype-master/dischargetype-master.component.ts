import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { DischargetypeMasterService } from "./dischargetype-master.service";
import { NewDischargetypeComponent } from "./new-dischargetype/new-dischargetype.component";

@Component({
    selector: "app-dischargetype-master",
    templateUrl: "./dischargetype-master.component.html",
    styleUrls: ["./dischargetype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DischargetypeMasterComponent implements OnInit {
         @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    dischargeTypeName: any = "";

        allcolumns =[
            { heading: "Code", key: "dischargeTypeId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DischargeTypeName", key: "dischargeTypeName", sort: true, align: 'left', emptySign: 'NA' },
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
                            this._dischargetypeService.deactivateTheStatus(data.dischargeTypeId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
        
        allfilters =  [
            { fieldName: "dischargeTypeName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    
 gridConfig: gridModel = {
        apiUrl: "DischargeType/List",
        columnsList: this.allcolumns,
        sortField: "dischargeTypeId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _dischargetypeService: DischargetypeMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
     //filters addedby avdhoot vedpathak date-27/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'DischargeTypeNameSearch')
            this._dischargetypeService.myformSearch.get('DischargeTypeNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.dischargeTypeName = this._dischargetypeService.myformSearch.get('DischargeTypeNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._dischargetypeService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "DischargeType/List",
            columnsList: this.allcolumns,
            sortField: "dischargeTypeId",
            sortOrder: 0,
            filters: [
                { fieldName: "dischargeTypeName", fieldValue: this.dischargeTypeName, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewDischargetypeComponent,
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