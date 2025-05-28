import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { ItemTypeMasterService } from "./item-type-master.service";
import { NewItemtypeComponent } from "./new-itemtype/new-itemtype.component";

@Component({
    selector: "app-item-type-master",
    templateUrl: "./item-type-master.component.html",
    styleUrls: ["./item-type-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemTypeMasterComponent implements OnInit {
    
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    itemTypeName: any = "";

         allcolumns = [
            { heading: "Code", key: "itemTypeId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ItemTypeName", key: "itemTypeName", sort: true, align: 'left', emptySign: 'NA' },            
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
                            this._ItemTypeMasterService.deactivateTheStatus(data.itemTypeId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
        
        allfilters= [
            { fieldName: "itemTypeName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
        apiUrl: "ItemType/List",
        columnsList: this.allcolumns,
        sortField: "itemTypeId",
        sortOrder: 0,
        filters: this.allfilters
    }
    
    constructor(public _ItemTypeMasterService: ItemTypeMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }
 //filters addedby avdhoot vedpathak date-28/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'ItemTypeNameSearch')
            this._ItemTypeMasterService.myformSearch.get('ItemTypeNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.itemTypeName = this._ItemTypeMasterService.myformSearch.get('ItemTypeNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._ItemTypeMasterService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "ItemType/List",
            columnsList: this.allcolumns,
            sortField: "itemTypeId",
            sortOrder: 0,
            filters: [
                { fieldName: "itemTypeName", fieldValue: this.itemTypeName, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewItemtypeComponent,
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