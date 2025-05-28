import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { ItemClassMasterService } from "./item-class-master.service";
import { NewItemClassComponent } from "./new-item-class/new-item-class.component";

@Component({
    selector: "app-item-class-master",
    templateUrl: "./item-class-master.component.html",
    styleUrls: ["./item-class-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemClassMasterComponent implements OnInit {
    
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    itemClassName: any = "";
   
         allcolumns = [
            { heading: "Code", key: "itemClassId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ItemClassName", key: "itemClassName", sort: true, align: 'left', emptySign: 'NA' },
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
                            this._ItemClassMasterService.deactivateTheStatus(data.itemClassId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
        
        allfilters = [
            { fieldName: "itemClassName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
        apiUrl: "ItemClassMaster/List",
        columnsList: this.allcolumns,
        sortField: "itemClassId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(public _ItemClassMasterService: ItemClassMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }
        
    ngOnInit(): void { }
     //filters addedby avdhoot vedpathak date-28/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'ItemClassNameSearch')
            this._ItemClassMasterService.myformSearch.get('ItemClassNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.itemClassName = this._ItemClassMasterService.myformSearch.get('ItemClassNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._ItemClassMasterService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "ItemClassMaster/List",
            columnsList: this.allcolumns,
            sortField: "itemClassId",
            sortOrder: 0,
            filters: [
                { fieldName: "itemClassName", fieldValue: this.itemClassName, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewItemClassComponent,
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