import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { LocationMasterService } from "./location-master.service";
import { NewLocationComponent } from "./new-location/new-location.component";

@Component({
    selector: "app-location-master",
    templateUrl: "./location-master.component.html",
    styleUrls: ["./location-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class LocationMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    locationName: any = "";
    
        allcolumns =[
            { heading: "Code", key: "locationId", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Location Name", key: "locationName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center"},
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._locationService.deactivateTheStatus(data.locationId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
       
        allfilters =[
            { fieldName: "locationName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    
gridConfig: gridModel = {
        apiUrl: "LocationMaster/List",
        columnsList: this.allcolumns,
        sortField: "locationId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(public _locationService: LocationMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }
        
    ngOnInit(): void { }
//filters addedby avdhoot vedpathak date-27/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'LocationNameSearch')
            this._locationService.myformSearch.get('LocationNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.locationName = this._locationService.myformSearch.get('LocationNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._locationService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "LocationMaster/List",
            columnsList: this.allcolumns,
            sortField: "locationId",
            sortOrder: 0,
            filters: [
                { fieldName: "locationName", fieldValue: this.locationName, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewLocationComponent,
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
