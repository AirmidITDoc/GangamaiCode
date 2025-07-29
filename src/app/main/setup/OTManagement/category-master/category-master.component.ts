import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { CategoryMasterService } from './category-master.service';
import { NewCategoryMasterComponent } from './new-category-master/new-category-master.component';

@Component({
  selector: 'app-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.scss'],
   encapsulation: ViewEncapsulation.None,
        animations: fuseAnimations,
})
export class CategoryMasterComponent implements OnInit {
msg: any;
 categoryName: any = "";


 @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
   
        allColumns =  [
            { heading: "Code", key: "surgeryCategoryId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "SystemName", key: "surgeryCategoryName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "AddedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA' },
            //{ heading: "UserName", key: "addedByName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._CategoryMasterService.deactivateTheStatus(data.surgeryCategoryId).subscribe((response: any) => {
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
       
        allFilters = [
            { fieldName: "categoryName", fieldValue: "", opType: OperatorComparer.StartsWith },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    
 gridConfig: gridModel = {
        apiUrl: "SurgeryCategoryMaster/List",
        columnsList: this.allColumns,
        sortField: "SurgeryCategoryId",
        sortOrder: 0,
        filters: this.allFilters
    }
    constructor(
        public _CategoryMasterService: CategoryMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewCategoryMasterComponent,
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
