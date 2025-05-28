import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CategorymasterService } from "./categorymaster.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { NewCategoryComponent } from "./new-category/new-category.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-categorymaster",
    templateUrl: "./categorymaster.component.html",
    styleUrls: ["./categorymaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CategorymasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
 categoryName: any = "";
   
       allcolumns = [
            { heading: "Code", key: "categoryId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Category Name", key: "categoryName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Added By", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._categorymasterService.deactivateTheStatus(data.categoryId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
    
            allfilters =[
            { fieldName: "categoryName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
        apiUrl: "PathCategoryMaster/List",
        columnsList: this.allcolumns,
        sortField: "categoryId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _categorymasterService: CategorymasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {

    }
 //filters addedby avdhoot vedpathak date-28/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'CategoryNameSearch')
            this._categorymasterService.myformSearch.get('CategoryNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.categoryName = this._categorymasterService.myformSearch.get('CategoryNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._categorymasterService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "PathCategoryMaster/List",
            columnsList: this.allcolumns,
            sortField: "categoryId",
            sortOrder: 0,
            filters: [
                { fieldName: "categoryName", fieldValue: this.categoryName, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewCategoryComponent,
            {
                maxWidth: "45vw",
                maxHeight: '35%',
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