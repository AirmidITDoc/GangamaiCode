import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IndentService } from './indent.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { MatTabGroup } from '@angular/material/tabs';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { NewIndentComponent } from './new-indent/new-indent.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';

@Component({
  selector: 'app-indent',
  templateUrl: './indent.component.html',
  styleUrls: ['./indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IndentComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  hasSelectedContacts: boolean;
 
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  gridConfig: gridModel = {
      apiUrl: "Indent/IndentList",
  columnsList: [
      { heading: "Code", key: "indentNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
      { heading: "From StoreId", key: "fromStoreId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
      { heading: "To StoreId", key: "toStoreId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
      { heading: "FromStoreName", key: "fromStoreName", sort: true, align: 'left', emptySign: 'NA', width: 700 },
        //  { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
          {
              heading: "Action", key: "action", width: 50, align: "right", type: gridColumnTypes.action, actions: [
                  {
                      action: gridActions.edit, callback: (data: any) => {
                          this.onSave(data);
                      }
                  }, {
                      action: gridActions.delete, callback: (data: any) => {
                          this.confirmDialogRef = this._matDialog.open(
                              FuseConfirmDialogComponent,
                              {
                                  disableClose: false,
                              }
                          );
                          this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                          this.confirmDialogRef.afterClosed().subscribe((result) => {
                              if (result) {
                                  let that = this;
                                  this._IndentService.deactivateTheStatus(data.IndentId).subscribe((response: any) => {
                                      this.toastr.success(response.message);
                                      that.grid.bindGridData();
                                  });
                              }
                              this.confirmDialogRef = null;
                          });
                      }
                  }]
          } //Action 1-view, 2-Edit,3-delete
      ],
      sortField: "IndentId",
      sortOrder: 0,
      filters: [
          { fieldName: "FromStoreId", fieldValue: "10009", opType: OperatorComparer.Equals },
          { fieldName: "ToStoreId", fieldValue: "10003", opType: OperatorComparer.Equals },
         { fieldName: "From_Dt", fieldValue: "01/01/2018", opType: OperatorComparer.Equals },
          { fieldName: "To_Dt", fieldValue: "11/11/2024", opType: OperatorComparer.Equals },
          { fieldName: "Status", fieldValue: "1", opType: OperatorComparer.Equals }
          // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
      ],
      row: 25
  }



 
  constructor(
      public _IndentService: IndentService,
      public toastr: ToastrService, public _matDialog: MatDialog
  ) { }

  ngOnInit(): void { }
  onSave(row: any = null) {
      let that = this;
      const dialogRef = this._matDialog.open(NewIndentComponent,
          {
              maxWidth: "95vw",
              height: '95%',
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