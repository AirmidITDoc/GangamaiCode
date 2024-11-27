import { Component, OnInit, ViewChild } from '@angular/core';
import { NewCreditReasonComponent } from './new-credit-reason/new-credit-reason.component';
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { CreditreasonService } from './creditreason.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-credit-reason-master',
  templateUrl: './credit-reason-master.component.html',
  styleUrls: ['./credit-reason-master.component.scss']
})
export class CreditReasonMasterComponent implements OnInit {

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
 
  constructor(public _CreditreasonService: CreditreasonService,public _matDialog: MatDialog,
      public toastr : ToastrService,) {}
      @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
      gridConfig: gridModel = {
          apiUrl: "CreditReasonMaster/List",
          columnsList: [
              { heading: "Code", key: "creditId", sort: true, align: 'left', emptySign: 'NA',width:200 },
              { heading: "credit Reason ", key: "creditReason", sort: true, align: 'left', emptySign: 'NA', width:600 },
              { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center",width:200 },
              {
                  heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,width:190, actions: [
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
                                      this._CreditreasonService.deactivateTheStatus(data.creditId).subscribe((response: any) => {
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
          sortField: "creditId",
          sortOrder: 0,
          filters: [
              { fieldName: "creditReason", fieldValue: "", opType: OperatorComparer.Contains },
              { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
          ],
          row: 25
      }
  
   
      ngOnInit(): void { }
      onSave(row: any = null) {
          let that = this;
          const dialogRef = this._matDialog.open(NewCreditReasonComponent,
              {
                  maxWidth: "45vw",
                  height: '35%',
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