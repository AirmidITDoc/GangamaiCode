import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { ManufactureMasterService } from "./manufacture-master.service";
import { NewManufactureComponent } from "./new-manufacture/new-manufacture.component";

@Component({
    selector: "app-manufacture-master",
    templateUrl: "./manufacture-master.component.html",
    styleUrls: ["./manufacture-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ManufactureMasterComponent implements OnInit {

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    manufName: any = "";
        allcolumns = [
            { heading: "Code", key: "manufId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ManuFatcureName", key: "manufName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ManufactureShortName", key: "manufShortName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UserName", key: "AddedBy", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._ManufactureMasterService.deactivateTheStatus(data.manufId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
       
      allfilters = [
            { fieldName: "manufName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
        apiUrl: "ManufactureMaster/List",
        columnsList: this.allcolumns,
        sortField: "ManufName",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(public _ManufactureMasterService: ManufactureMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }
        
    ngOnInit(): void { }
 //filters addedby avdhoot vedpathak date-28/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'ManufNameSearch')
            this._ManufactureMasterService.myformSearch.get('ManufNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.manufName = this._ManufactureMasterService.myformSearch.get('ManufNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._ManufactureMasterService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "ManufactureMaster/List",
            columnsList: this.allcolumns,
            sortField: "ManufName",
            sortOrder: 0,
            filters: [
                { fieldName: "manufName", fieldValue: this.manufName, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewManufactureComponent,
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