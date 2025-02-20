import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RadiologyTestMasterService } from './radiology-test-master.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateradiologymasterComponent } from './updateradiologymaster/updateradiologymaster.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { values } from 'lodash';


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
        apiUrl: "RadiologyTest/RadiologyTestList",
        columnsList: [
            { heading: "Code", key: "testId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "TestName", key: "testName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PrintTestName", key: "printTestName",width: 200, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CategoryName", key: "categoryId",width: 150, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ServiceName", key: "serviceId",width: 150, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "AddedBy", key: "username", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IsActive", key: "isActive",width: 100, type: gridColumnTypes.status, align: "center" },
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
        sortField: "TestId",
        sortOrder: 0,
        filters: [
            { fieldName: "ServiceName", fieldValue: "djfh", opType: OperatorComparer.Contains },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals },
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

    ngOnInit(): void {}
    onSearch() {}
    onSave(row:any = null) {
        const dialogRef = this._matDialog.open(UpdateradiologymasterComponent,
        {
            maxWidth: "70vw",
            height: '95%',
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