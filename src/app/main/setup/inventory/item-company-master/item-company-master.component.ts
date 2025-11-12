import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { NewItemCompanyMasterComponent } from "./new-item-company-master/new-item-company-master.component";
import { ItemCompanyMasterService } from "./item-company-master.service";

@Component({
  selector: 'app-item-company-master',
  templateUrl: './item-company-master.component.html',
  styleUrls: ['./item-company-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ItemCompanyMasterComponent {
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  itemCompanyName: any = "";

  allcolumns = [
    { heading: "Item Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Item Company Short Name", key: "compshortName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, callback: (data: any) => {
            this.onSave(data);
          }
        }, {
          action: gridActions.delete, callback: (data: any) => {
            this._ItemCompanyMasterService.deactivateTheStatus(data.companyId).subscribe((response: any) => {
              this.grid.bindGridData();
            });
          }
        }]
    }
  ]

  allfilters = [
    { fieldName: "itemCompanyName", fieldValue: "", opType: OperatorComparer.StartsWith },
    { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
  ]
  gridConfig: gridModel = {
    apiUrl: "ItemCompany/List",
    columnsList: this.allcolumns,
    sortField: "companyId",
    sortOrder: 0,
    filters: this.allfilters
  }

  constructor(public _ItemCompanyMasterService: ItemCompanyMasterService, public _matDialog: MatDialog,
    public toastr: ToastrService,) { }

  ngOnInit(): void { }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    const dialogRef = this._matDialog.open(NewItemCompanyMasterComponent,
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
