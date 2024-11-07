import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { PhoneAppointListService } from './phone-appoint-list.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewPhoneAppointmentComponent } from './new-phone-appointment/new-phone-appointment.component';
import { GeturlService } from './geturl.service';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-phoneappointment',
  templateUrl: './phoneappointment.component.html',
  styleUrls: ['./phoneappointment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PhoneappointmentComponent implements OnInit {

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  

  gridConfig: gridModel = {
      apiUrl: "PathCategoryMaster/List",
      columnsList: [
          { heading: "Code", key: "categoryId", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "Category Name", key: "categoryName", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
          {
              heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
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
                                  this._PhoneAppointListService.deactivateTheStatus(data.groupId).subscribe((response: any) => {
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
      sortField: "categoryId",
      sortOrder: 0,
      filters: [
          { fieldName: "groupName", fieldValue: "", opType: OperatorComparer.Contains },
          { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
      ],
      row: 25
  }
  constructor(
      public _PhoneAppointListService: PhoneAppointListService,
      public _matDialog: MatDialog,
     //private accountService: AuthenticationService,
      private _fuseSidebarService: FuseSidebarService,
      public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
      
  }

onSave(row: any = null) {
      debugger
      let that = this;
      const dialogRef = this._matDialog.open(NewPhoneAppointmentComponent,
          {
              maxWidth: "75vw",
              height: '75%',
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