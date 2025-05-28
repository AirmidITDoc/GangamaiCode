import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { NewUMOComponent } from "./new-umo/new-umo.component";
import { UomMasterService } from "./uom-master.service";

@Component({
    selector: "app-uom-master",
    templateUrl: "./uom-master.component.html",
    styleUrls: ["./uom-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class UomMasterComponent implements OnInit {
    
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    unitofMeasurementName: any = "";
        allcolumns = [
            { heading: "Code", key: "unitofMeasurementId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UnitOfMeasurementName", key: "unitofMeasurementName", sort: true, align: 'left', emptySign: 'NA' },
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
                            this._UomMasterService.deactivateTheStatus(data.unitofMeasurementId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
        
         allfilters =[
            { fieldName: "unitofMeasurementName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    
gridConfig: gridModel = {
        apiUrl: "UnitOfMeasurement/List",
        columnsList: this.allcolumns,
        sortField: "unitofMeasurementId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(public _UomMasterService: UomMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }
    //filters addedby avdhoot vedpathak date-28/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'UnitofMeasurementSearch')
            this._UomMasterService.myformSearch.get('UnitofMeasurementSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.unitofMeasurementName = this._UomMasterService.myformSearch.get('UnitofMeasurementSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._UomMasterService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "UnitOfMeasurement/List",
            columnsList: this.allcolumns,
            sortField: "unitofMeasurementId",
            sortOrder: 0,
            filters: [
                { fieldName: "unitofMeasurementName", fieldValue: this.unitofMeasurementName, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewUMOComponent,
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