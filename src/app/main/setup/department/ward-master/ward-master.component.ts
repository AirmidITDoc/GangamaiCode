import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { WardMasterService } from "./ward-master.service";
import { ToastrService } from "ngx-toastr";
import { NewWardComponent } from "./new-ward/new-ward.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { MatDialog } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-ward-master",
    templateUrl: "./ward-master.component.html",
    styleUrls: ["./ward-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class WardMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    roomName: any = "";

        allcolumns =  [
            { heading: "Code", key: "roomId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "RoomName", key: "roomName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Location", key: "locationId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Class", key: "classId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsAvailable", key: "isAvailible", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, 
                    {
                        action: gridActions.delete, callback: (data: any) => {
                            this._wardService.deactivateTheStatus(data.roomId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
       
        allfilters = [
            { fieldName: "roomName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
        apiUrl: "WardMaster/List",
        columnsList: this.allcolumns,
        sortField: "roomId",
        sortOrder: 0,
        filters: this.allfilters
    }


    constructor(public _wardService: WardMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }
//filters addedby avdhoot vedpathak date-27/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'RoomNameSearch')
            this._wardService.myformSearch.get('RoomNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.roomName = this._wardService.myformSearch.get('RoomNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._wardService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "WardMaster/List",
            columnsList: this.allcolumns,
            sortField: "roomId",
            sortOrder: 0,
            filters: [
                { fieldName: "roomName", fieldValue: this.roomName, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewWardComponent,
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