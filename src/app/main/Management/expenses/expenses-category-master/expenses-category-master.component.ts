import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { ExpensesService } from '../expenses.service';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryComponent } from './new-category/new-category.component';

@Component({
  selector: 'app-expenses-category-master',
  templateUrl: './expenses-category-master.component.html',
  styleUrls: ['./expenses-category-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ExpensesCategoryMasterComponent {
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  headName: any = "";

  allcolumns = [
    { heading: "Code", key: "expCatId", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Category Name", key: "categoryName", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "AdddeBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA' }, after update added by taking null
    { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, callback: (data: any) => {
            this.OnaddNew(data) // EDIT Records
          }
        }, {
          action: gridActions.delete, callback: (data: any) => {
            this._ExpensesService.deactivateCategoryTheStatus(data.expCatId).subscribe((response: any) => {
              this.grid.bindGridData;
            });
          }
        }]
    }
  ]

  allfilters = [
    { fieldName: "CategoryName", fieldValue: "", opType: OperatorComparer.StartsWith },
    { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    apiUrl: "ExpensesCategoryMaster/List",
    columnsList: this.allcolumns,
    sortField: "ExpCatId",
    sortOrder: 0,
    filters: this.allfilters
  }
  constructor(public _ExpensesService: ExpensesService, public _matDialog: MatDialog,
    public toastr: ToastrService,) { }

  ngOnInit(): void { }

  OnaddNew(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const dialogRef = this._matDialog.open(NewCategoryComponent,
      {
        maxWidth: "50vw",
        maxHeight: '50%',
        width: '70%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
        this.grid.bindGridData();
    });
  }

}
