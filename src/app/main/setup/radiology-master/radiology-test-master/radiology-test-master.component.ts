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
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
  selector: 'app-radiology-test-master',
  templateUrl: './radiology-test-master.component.html',
  styleUrls: ['./radiology-test-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RadiologyTestMasterComponent implements OnInit {
  ChargeList: any = [];
  RadiologytestMasterList: any;
  CategorycmbList: any = [];
  ServicecmbList: any = [];
  TemplatecmbList: any = [];
  msg: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'TestId',
    'TestName',
    'PrintTestName',
    'CategoryName',
    'ServiceId',
    'AddedByName',
    'IsActive',
    'action'
  ];
  displayedColumns1: string[] = [
    "ParameterName"
  ];

  dataSource = new MatTableDataSource<RadiologytestMaster>();
  dataSource1 = new MatTableDataSource<RadiologytestMaster>();
  tempList = new MatTableDataSource<RadiologytestMaster>();
  DSTestList = new MatTableDataSource<TestList>();
  dsTemparoryList = new MatTableDataSource<TestList>();
  currentStatus=0;

  
  constructor(
    public _radiologytestService: RadiologyTestMasterService,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }

  ngOnInit(): void {
    this.getRadiologyTestList();
   
  }
  onSearch() {
    this.getRadiologyTestList();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  onSearchClear() {
    this._radiologytestService.myformSearch.reset({
      TestNameSearch: "",
      IsDeletedSearch: "2",
    }); this.getRadiologyTestList();
  }
  sIsLoading: string = '';
  resultsLength = 0;
  getRadiologyTestList() {
    var vdata = {
      "ServiceName": this._radiologytestService.myformSearch.get("TestNameSearch").value + '%' || '%',
      "Start":(this.paginator?.pageIndex??0),
      "Length":(this.paginator?.pageSize??35)
    }
    console.log(vdata);
    this._radiologytestService.getRadiologyList(vdata).subscribe(data => {
      this.dataSource.data = data as RadiologytestMaster[];
      this.dataSource1.data = data as RadiologytestMaster[];
      this.dataSource.data = data["Table1"] ?? [] as RadiologytestMaster[];
      console.log(this.dataSource.data)
      this.resultsLength = data["Table"][0]["total_row"];
      this.sIsLoading = this.dataSource.data.length == 0 ? 'no-data' : '';
    });
  }

  
  onClear() {
    this._radiologytestService.myform.reset({ IsDeleted: 'false' });
    this._radiologytestService.initializeFormGroup();
    this.DSTestList.data = [];
  }
   
  toggle(val: any) {
    if (val == "2") {
        this.currentStatus = 2;
    } else if (val == "1") {
        this.currentStatus = 1;
    }
    else {
        this.currentStatus = 0;

    }
}
onFilterChange() {
       
  if (this.currentStatus == 1) {
      this.tempList.data = []
      this.dataSource1.data= this.dataSource.data
      for (let item of this.dataSource1.data) {
          if (item.IsActive) this.tempList.data.push(item)

      }
debugger
      this.dataSource.data = [];
      this.dataSource.data = this.tempList.data;
  }
  else if (this.currentStatus == 0) {
      this.dataSource1.data= this.dataSource.data
      this.tempList.data = []

      for (let item of this.dataSource1.data) {
          if (!item.IsActive) this.tempList.data.push(item)

      }
      this.dataSource.data = [];
      this.dataSource.data = this.tempList.data;
  }
  else {
      this.dataSource.data= this.dataSource1.data
      this.tempList.data = this.dataSource.data;
  }


}
  
  onAdd() {
    const dialogRef = this._matDialog.open(UpdateradiologymasterComponent,
      {
           maxWidth: "80%", 
            width: "95%",
            height: "85%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
       this.getRadiologyTestList();
    });
  }
  onEdit(row) {
    // var m_data = {
    //   "TestId": row.TestId, 
    //   "TestName": row.TestName.trim(),
    //   "PrintTestName":row.PrintTestName,
    //   "CategoryId": row.CategoryName,
    //   "ServiceId": row.ServiceName,
    //   "IsDeleted": JSON.stringify(row.Isdeleted),
    //   "UpdatedBy": row.UpdatedBy,
    // };

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
        this.getRadiologyTestList();
    });
}
  
onDeactive(row) {
  Swal.fire({
    title: 'Confirm Status',
    text: 'Are you sure you want to Change Status?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes,Change Status!'
  }).then((result) => {
      let Query;
      if (result.isConfirmed) {
          if(row.IsActive){
           Query =
          "Update M_RadiologyTestMaster set IsActive=0 where TestId=" +row.TestId;
          console.log(Query);
          }else{
               Query =
              "Update M_RadiologyTestMaster set IsActive=1 where TestId=" +row.TestId;
          }

          this._radiologytestService.deactivateTheStatus(Query)
          .subscribe((data) => {
            Swal.fire('Changed!', 'Test Status has been Changed.', 'success');
             this.getRadiologyTestList();
           }, (error) => {
             Swal.fire('Error!', 'Failed to deactivate category.', 'error');
           });
      }
    });

  this.getRadiologyTestList();
}

}


export class TestList {
  TemplateName: any;
  TemplateId:any;
  TestId: number;
  /**
   * Constructor
   *
   * @param TestList
   */
  constructor(TestList) {
    {
      this.TemplateName = TestList.TemplateName || "";
      this.TemplateId = TestList.TemplateId || 0;
      this.TestId = TestList.TestId || 0;
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