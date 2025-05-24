import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { AreaMasterService } from "./area-master.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { MatDialog } from "@angular/material/dialog";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewAreaComponent } from "./new-area/new-area.component";

@Component({
    selector: "app-state-master",
    templateUrl: "./area-master.component.html",
    styleUrls: ["./area-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AreaMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    areaName: any = "";

    allcolumns = [
        { heading: "Code", key: "areaId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Area Name", key: "areaName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "City Name", key: "cityId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA' },
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
                        this._AreaMasterService.deactivateTheStatus(data.areaId).subscribe((response: any) => {
                            this.toastr.success(response.message);
                            this.grid.bindGridData();
                        });
                    }
                }]
        }
    ]
    allfilters = [
        { fieldName: "areaName", fieldValue: this.areaName, opType: OperatorComparer.Contains },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        apiUrl: "AreaMaster/List",
        columnsList: this.allcolumns,
        sortField: "areaId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(
        public _AreaMasterService: AreaMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
    
    Clearfilter(event) {
        console.log(event)
        if (event == 'AreaNameSearch')
            this._AreaMasterService.myformSearch.get('AreaNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.areaName = this._AreaMasterService.myformSearch.get('AreaNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._AreaMasterService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "AreaMaster/List",
            columnsList: this.allcolumns,
            sortField: "areaId",
            sortOrder: 0,
            filters: [
                { fieldName: "areaName", fieldValue: this.areaName, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewAreaComponent,
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