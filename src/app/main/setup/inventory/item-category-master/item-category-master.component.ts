import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { ItemCategoryMasterService } from "./item-category-master.service";
import { NewItemcategoryComponent } from "./new-itemcategory/new-itemcategory.component";

@Component({
    selector: "app-item-category-master",
    templateUrl: "./item-category-master.component.html",
    styleUrls: ["./item-category-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemCategoryMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
 itemCategoryName: any = "";


   
        allcolumns =  [
            { heading: "Code", key: "itemCategoryId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ItemCategoryName", key: "itemCategoryName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ItemTypeName", key: "itemTypeId", sort: true, align: 'left', emptySign: 'NA' },
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
                            this._categorymasterService.deactivateTheStatus(data.itemCategoryId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
      
        allfilters =  [
            { fieldName: "itemCategoryName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
        apiUrl: "ItemCategoryMaster/List",
        columnsList: this.allcolumns,
        sortField: "itemCategoryId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _categorymasterService: ItemCategoryMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void { }
//filters addedby avdhoot vedpathak date-28/05/2025
    // Clearfilter(event) {
    //     console.log(event)
    //     if (event == 'ItemCategoryNameSearch')
    //         this._categorymasterService.myformSearch.get('ItemCategoryNameSearch').setValue("")

    //     this.onChangeFirst();
    // }

    // onChangeFirst() {
    //     this.itemCategoryName = this._categorymasterService.myformSearch.get('ItemCategoryNameSearch').value
    //     this.getfilterdata();
    // }

    // getfilterdata() {
    //     debugger
    //     let isActive = this._categorymasterService.myformSearch.get("IsDeletedSearch").value || "";
    //     this.gridConfig = {
    //         apiUrl: "ItemCategoryMaster/List",
    //         columnsList: this.allcolumns,
    //         sortField: "itemCategoryId",
    //         sortOrder: 0,
    //         filters: [
    //             { fieldName: "itemCategoryName", fieldValue: this.itemCategoryName, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewItemcategoryComponent,
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