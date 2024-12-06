import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RadiologyTestMasterService } from './radiology-test-master.service';
import { ToastrService } from 'ngx-toastr';
import { MatTabGroup } from '@angular/material/tabs';
import { DatePipe } from '@angular/common';
import { UpdateradiologymasterComponent } from './updateradiologymaster/updateradiologymaster.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-radiology-test-master',
  templateUrl: './radiology-test-master.component.html',
  styleUrls: ['./radiology-test-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RadiologyTestMasterComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "RadiologyTest/List",
        columnsList: [
            { heading: "Code", key: "testId",width: 150, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "TestName", key: "testName",width: 200, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "printTest Name", key: "printTestName",width: 200, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CategoryName", key: "categoryId",width: 200, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ServiceName", key: "serviceId",width: 200, sort: true, align: 'left', emptySign: 'NA' },
            
            { heading: "IsDeleted", key: "isActive",width: 100, type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action",width: 100, align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data) // EDIT Records
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.onDeactive(data.testId); // DELETE Records
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "testId",
        sortOrder: 0,
        filters: [
            { fieldName: "TestName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }

  
  constructor(
    public _radiologytestService: RadiologyTestMasterService,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }

  ngOnInit(): void {
    
   
  }
  onSearch() {
    
  }
  onSave(row:any = null) {
    const dialogRef = this._matDialog.open(UpdateradiologymasterComponent,
    {
        maxWidth: "90vw",
        height: '90%',
        width: '70%',
        data: row
    });
    dialogRef.afterClosed().subscribe(result => {
        if(result){
            // this.getGenderMasterList();
            // How to refresh Grid.
        }
        console.log('The dialog was closed - Action', result);
    });
}

onDeactive(testId) {
    this.confirmDialogRef = this._matDialog.open(
        FuseConfirmDialogComponent,
        {
            disableClose: false,
        }
    );
    this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
    this.confirmDialogRef.afterClosed().subscribe((result) => {
        if (result) {
            this._radiologytestService.deactivateTheStatus(testId).subscribe((response: any) => {
                if (response.StatusCode == 200) {
                    this.toastr.success(response.Message);
                    // this.getGenderMasterList();
                    // How to refresh Grid.
                }
            });
        }
        this.confirmDialogRef = null;
    });
}
  onEdit(row) {
  
    row["IsDeleted"]= JSON.stringify(row.IsActive)
    console.log(row)
    this._radiologytestService.populateForm(row);
    const dialogRef = this._matDialog.open(UpdateradiologymasterComponent, {
      maxWidth: "80%", 
      width: "95%",
      height: "85%",
        data : {
            Obj : row,
          }
    });
    dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed - Insert Action", result);
        
    });
}
  


}


export class TestList {
  testId:any;
  testName: any;
  printTestName:any;
  categoryId: number;
  serviceId:any;
  isActive:any;
  mRadiologyTemplateDetails:any;
  /**
   * Constructor
   *
   * @param TestList
   */
  constructor(TestList) {
    {
      this.testId = TestList.testId || "";
      this.testName = TestList.testName || '';
      this.printTestName = TestList.printTestName || '';
      this.categoryId = TestList.categoryId || "";
      this.serviceId = TestList.serviceId || 0;
      this.isActive = TestList.isActive || 0;
      this.mRadiologyTemplateDetails = TestList.mRadiologyTemplateDetails || 0;
    }
  }
}
export class RadiologytestMaster {
  TestId: number;
  TestName: string;
  PrintTestName: string;
  CategoryId: number;
  IsDeleted: boolean;
  AddedBy: number;
  UpdatedBy: number;
  ServiceId: number;
  AddedByName: string;
  IsActive:any;
  /**
   * Constructor
   *
   * @param RadiologytestMaster
   */
  constructor(RadiologytestMaster) {
    {
      this.TestId = RadiologytestMaster.TestId || '';
      this.TestName = RadiologytestMaster.TestName || '';
      this.PrintTestName = RadiologytestMaster.PrintTestName || '';
      this.CategoryId = RadiologytestMaster.CategoryId || '';
      this.IsDeleted = RadiologytestMaster.IsDeleted || 'false';
      this.AddedBy = RadiologytestMaster.AddedBy || '';
      this.UpdatedBy = RadiologytestMaster.UpdatedBy || '';
      this.ServiceId = RadiologytestMaster.ServiceId || '';
      this.AddedByName = RadiologytestMaster.AddedByName || '';
      this.IsActive = RadiologytestMaster.IsActive || '';

    }
  }
}