import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { NewStateMasterComponent } from "./new-state-master/new-state-master.component";
import { StateMasterService } from "./state-master.service";

@Component({
    selector: "app-state-master",
    templateUrl: "./state-master.component.html",
    styleUrls: ["./state-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StateMasterComponent implements OnInit {
 @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    msg: any;
   stateName: any = "";
   
        allcolumns =  [
            { heading: "Code", key: "stateId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "State Name", key: "stateName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Country Name", key: "countryId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._StateMasterService.deactivateTheStatus(data.stateId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
        
        allfilters = [
            { fieldName: "stateName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    
 gridConfig: gridModel = {
        apiUrl: "StateMaster/List",
        columnsList: this.allcolumns,
        sortField: "stateId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _StateMasterService: StateMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
    //filters addedby avdhoot vedpathak date-27/05/2025
// Clearfilter(event) {
//         console.log(event)
//         if (event == 'StateNameSearch')
//             this._StateMasterService.myformSearch.get('StateNameSearch').setValue("")

//         //this.onChangeFirst();
//     }

    // onChangeFirst() {
    //     this.stateName = this._StateMasterService.myformSearch.get('StateNameSearch').value
    //     this.getfilterdata();
    // }

    getfilterdata() {
        debugger
        let isActive = this._StateMasterService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "StateMaster/List",
            columnsList: this.allcolumns,
            sortField: "stateId",
            sortOrder: 0,
            filters: [
                { fieldName: "stateName", fieldValue: this.stateName, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewStateMasterComponent,
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