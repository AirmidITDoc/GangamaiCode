import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { NotificationServiceService } from 'app/core/notification-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { PatientwiseMaterialConsumptionService } from '../patientwise-material-consumption.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { NewPatientwiseMaterialconsumptionComponent } from '../new-patientwise-materialconsumption/new-patientwise-materialconsumption.component';
import { fuseAnimations } from '@fuse/animations';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-material-consumption-patientwise',
  templateUrl: './material-consumption-patientwise.component.html',
  styleUrls: ['./material-consumption-patientwise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MaterialConsumptionPatientwiseComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  hasSelectedContacts: boolean;
  autocompleteModestore: string = "Store";

  
  gridConfig: gridModel = {
      apiUrl: "Nursing/PrescriptionWardList",
      columnsList: [
          { heading: "Code", key: "MaterialConsumptionId", sort: true, align: 'left', emptySign: 'NA' ,width:50},
          { heading: "ConsumptionNo", key: "consumptionNo", sort: true, align: 'left', emptySign: 'NA' ,width:50},
          { heading: "ConsumptionDate", key: "consumptionTime", sort: true, align: 'left', emptySign: 'NA' ,width:150},
          { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA' ,width:250},
          { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' ,width:50},
          
         { heading: "FromStoreId", key: "fromStoreId", sort: true, align: 'left', emptySign: 'NA',width:150 },
          { heading: "StoreName", key: "storeName", sort: true, align: 'left', emptySign: 'NA' ,width:150},
          { heading: "AdmissionDate", key: "admissionDate", sort: true, align: 'left', emptySign: 'NA' ,width:150},
          { heading: "StoreName", key: "storeName", sort: true, align: 'left', emptySign: 'NA' ,width:150},
          { heading: "oP_IP_Type", key: "oP_IP_Type", sort: true, align: 'left', emptySign: 'NA',width:50 },
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
                                  this._PatientwiseMaterialConsumptionService.deactivateTheStatus(data.MaterialConsumptionId).subscribe((response: any) => {
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
      sortField: "MaterialConsumptionId",
      sortOrder: 0,
      filters: [
          { fieldName: "FromDate", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
          { fieldName: "ToDate", fieldValue: "01/01/2025", opType: OperatorComparer.Equals },
          { fieldName: "ToStoreId", fieldValue: "13936", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
         // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
      ],
      row: 25
  }

  gridConfig1: gridModel = {
    apiUrl: "Nursing/PrescriptionDetailList",
    columnsList: [
        { heading: "Code", key: "ipMedID", sort: true, align: 'left', emptySign: 'NA' ,width:150},
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA' ,width:450},
        { heading: "ToStoreId", key: "v", sort: true, align: 'left', emptySign: 'NA' ,width:150},
        { heading: "OP_IP_ID", key: "oP_IP_ID", sort: true, align: 'left', emptySign: 'NA',width:150 },
       
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
                                this._PatientwiseMaterialConsumptionService.deactivateTheStatus(data.ipMedID).subscribe((response: any) => {
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
    sortField: "ToStoreId",
    sortOrder: 0,
    filters: [
      
        { fieldName: "ToStoreId", fieldValue: "113582", opType: OperatorComparer.Equals },
        { fieldName: "FromDate", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: "01/01/2025", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
       // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ],
    row: 25
}
  constructor(public _PatientwiseMaterialConsumptionService: PatientwiseMaterialConsumptionService, public _matDialog: MatDialog,
      public toastr : ToastrService,) {}
  ngOnInit(): void {
  }

  onSave(row: any = null) {
    let that = this;
    const dialogRef = this._matDialog.open(NewPatientwiseMaterialconsumptionComponent,
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

  StoreId=0
  selectChangestore(obj: any){
    console.log(obj);
    this.StoreId=obj.value
  }
  
  EditConsumption(){}
}
