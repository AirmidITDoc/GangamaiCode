import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { NewSubgroupComponent } from "./new-subgroup/new-subgroup.component";
import { SubGroupMasterService } from "./sub-group-master.service";

@Component({
    selector: "app-sub-group-master",
    templateUrl: "./sub-group-master.component.html",
    styleUrls: ["./sub-group-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SubGroupMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  subGroupName: any = "";
    
        allcolumns =  [
            { heading: "Code", key: "subGroupId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Sub Group Name", key: "subGroupName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Group Name", key: "groupId", sort: true, align: 'left', emptySign: 'NA' },
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
                            this._subgroupService.deactivateTheStatus(data.subGroupId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
       
        allfilters = [
            { fieldName: "subGroupName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
        apiUrl: "SubGroupMaster/List",
        columnsList: this.allcolumns,
        sortField: "subGroupId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(public _subgroupService: SubGroupMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void {

    }
    //filters addedby avdhoot vedpathak date-27/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'SubGroupNameSearch')
            this._subgroupService.myformSearch.get('SubGroupNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.subGroupName = this._subgroupService.myformSearch.get('SubGroupNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._subgroupService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "SubGroupMaster/List",
            columnsList: this.allcolumns,
            sortField: "subGroupId",
            sortOrder: 0,
            filters: [
                { fieldName: "subGroupName", fieldValue: this.subGroupName, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewSubgroupComponent,
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