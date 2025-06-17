import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { BedMasterService } from "./bed-master.service";
import { NewBedComponent } from "./new-bed/new-bed.component";


@Component({
    selector: "app-bed-master",
    templateUrl: "./bed-master.component.html",
    styleUrls: ["./bed-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BedMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    bedName: any = "";

        allcolumns = [
            { heading: "Code", key: "bedId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BedName", key: "bedName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "RoomId", key: "roomId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsAvailible", key: "isAvailible", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._BedMasterService.deactivateTheStatus(data.bedId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
        
        allfilters = [
            { fieldName: "bedName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    gridConfig: gridModel = {
        apiUrl: "BedMaster/List",
        columnsList: this.allcolumns,
        sortField: "bedId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(
        public _BedMasterService: BedMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
    //filters addedby avdhoot vedpathak date-27/05/2025
    // Clearfilter(event) {
    //     console.log(event)
    //     if (event == 'BedNameSearch')
    //         this._BedMasterService.myformSearch.get('BedNameSearch').setValue("")

    //     this.onChangeFirst();
    // }

    // onChangeFirst() {
    //     this.bedName = this._BedMasterService.myformSearch.get('BedNameSearch').value
    //     this.getfilterdata();
    // }

    // getfilterdata() {
    //     debugger
    //     let isActive = this._BedMasterService.myformSearch.get("IsDeletedSearch").value || "";
    //     this.gridConfig = {
    //         apiUrl: "BedMaster/List",
    //         columnsList: this.allcolumns,
    //         sortField: "bedId",
    //         sortOrder: 0,
    //         filters: [
    //             { fieldName: "bedName", fieldValue: this.bedName, opType: OperatorComparer.Contains },
    //             { fieldName: "isActive", fieldValue: isActive, opType: OperatorComparer.Equals }
    //         ]
    //     }
    //     // this.grid.gridConfig = this.gridConfig;
    //     // this.grid.bindGridData();
    //     console.log("GridConfig:", this.gridConfig);

    // if (this.grid) {
    //     this.grid.gridConfig = this.gridConfig;
    //     this.grid.bindGridData();
    // } else {
    //     console.error("Grid is undefined!");
    // }
    // }
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewBedComponent,
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