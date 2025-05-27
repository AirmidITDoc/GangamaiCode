import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { VillageMasterService } from "./village-master.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { NewVillageComponent } from "./new-village/new-village.component";
import { MatDialog } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-village-master",
    templateUrl: "./village-master.component.html",
    styleUrls: ["./village-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class VillageMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
     msg: any;
     villageName: any = "";

        allcolumns = [
            { heading: "Code", key: "villageId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "VillageName", key: "villageName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "TalukaName", key: "talukaName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UserName", key: "addedByName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._VillageMasterService.deactivateTheStatus(data.villageId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
        
         allfilters = [
            { fieldName: "villageName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]

     gridConfig: gridModel = {
        apiUrl: "VillageMaster/List",
        columnsList: this.allcolumns,
        sortField: "VillageName",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(
        public _VillageMasterService: VillageMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
//filters addedby avdhoot vedpathak date-27/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'VillageNameSearch')
            this._VillageMasterService.myformSearch.get('VillageNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.villageName = this._VillageMasterService.myformSearch.get('VillageNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._VillageMasterService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "VillageMaster/List",
            columnsList: this.allcolumns,
            sortField: "VillageName",
            sortOrder: 0,
            filters: [
                { fieldName: "villageName", fieldValue: this.villageName, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewVillageComponent,
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
