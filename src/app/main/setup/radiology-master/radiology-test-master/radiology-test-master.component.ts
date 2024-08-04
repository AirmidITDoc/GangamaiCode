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
  DSTestList = new MatTableDataSource<TestList>();
  dsTemparoryList = new MatTableDataSource<TestList>();
  // category filter
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredCategory: ReplaySubject<any> = new ReplaySubject<any>(1);

  //service filter
  public serviceFilterCtrl: FormControl = new FormControl();
  public filteredService: ReplaySubject<any> = new ReplaySubject<any>(1);

  //Template filter
  public templateFilterCtrl: FormControl = new FormControl();
  public filteredTemplate: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  constructor(
    public _radiologytestService: RadiologyTestMasterService,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    private accountService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getRadiologyTestList();
   
  }
  onSearch() {
    this.getRadiologyTestList();
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
   
  // onSubmit() {
  //   if (this._radiologytestService.myform.valid) {
  //     if (!this._radiologytestService.myform.get("TestId").value) {
  //        let insertRadiologyTestMaster= {};
  //        insertRadiologyTestMaster['testName'] = this._radiologytestService.myform.get("TestName").value;
  //        insertRadiologyTestMaster['printTestName'] = this._radiologytestService.myform.get("PrintTestName").value;
  //        insertRadiologyTestMaster['categoryId'] = this._radiologytestService.myform.get("CategoryId").value.CategoryId;
  //        insertRadiologyTestMaster['addedBy'] = this.accountService.currentUserValue.user.id;
  //        insertRadiologyTestMaster['serviceId'] = this._radiologytestService.myform.get("ServiceId").value.ServiceId;
        
  //        let insertRadiologyTemplateTest = [];
  //        this.DSTestList.data.forEach((element) => {
  //         let insertRtestObj={};
  //         insertRtestObj['testId'] = 0;
  //         insertRtestObj['templateId'] = element.TemplateId;
  //         insertRadiologyTemplateTest.push(insertRtestObj);

  //        });

  //        let submitData ={
  //         "insertRadiologyTestMaster": insertRadiologyTestMaster,
  //         "insertRadiologyTemplateTest":insertRadiologyTemplateTest
  //        }
  //       console.log(submitData);
  //       this._radiologytestService.insertRadiologyTestMaster(submitData).subscribe(data => {
  //         this.msg = data;
  //         if (data) {
  //           this.toastr.success('Record Saved Successfully.', 'Saved !', {
  //             toastClass: 'tostr-tost custom-toast-success',
  //           });
  //           this.onClear();
  //           this.getRadiologyTestList();
  //         } else {
  //           this.toastr.error('Radiology Test Master Data not saved !, Please check API error..', 'Error !', {
  //             toastClass: 'tostr-tost custom-toast-error',
  //           });
  //         }
  //         this.getRadiologyTestList();
  //       }, error => {
  //         this.toastr.error('Radiology  Test not saved !, Please check API error..', 'Error !', {
  //           toastClass: 'tostr-tost custom-toast-error',
  //         });
  //       });
  //     }  
  //     else{
  //       let updateRadiologyTestMaster= {};
  //       updateRadiologyTestMaster['testId'] = this._radiologytestService.myform.get('TestId').value;
  //       updateRadiologyTestMaster['testName'] = this._radiologytestService.myform.get("TestName").value;
  //       updateRadiologyTestMaster['printTestName'] = this._radiologytestService.myform.get("PrintTestName").value;
  //       updateRadiologyTestMaster['categoryId'] = this._radiologytestService.myform.get("CategoryId").value.CategoryId;
  //       updateRadiologyTestMaster['updatedBy'] = this.accountService.currentUserValue.user.id;
  //       updateRadiologyTestMaster['serviceId'] = this._radiologytestService.myform.get("ServiceId").value.ServiceId;
       
  //       let insertRadiologyTemplateTest = [];
  //       this.DSTestList.data.forEach((element) => {
  //        let insertRtestObj={};
  //        insertRtestObj['testId'] = element.TestId;
  //        insertRtestObj['templateId'] = element.TemplateId;
  //        insertRadiologyTemplateTest.push(insertRtestObj);

  //       });

  //       let radiologyTemplateDetDelete={};
  //       radiologyTemplateDetDelete["testId"] =this._radiologytestService.myform.get('TestId').value; 

  //       let submitData ={
  //        "updateRadiologyTestMaster": updateRadiologyTestMaster,
  //        "insertRadiologyTemplateTest":insertRadiologyTemplateTest,
  //        "radiologyTemplateDetDelete": radiologyTemplateDetDelete
  //       }
  //      console.log(submitData);
  //      this._radiologytestService.insertRadiologyTestMaster(submitData).subscribe(data => {
  //        this.msg = data;
  //        if (data) {
  //          this.toastr.success('Record Saved Successfully.', 'Saved !', {
  //            toastClass: 'tostr-tost custom-toast-success',
  //          }); this.onClear();
  //          this.getRadiologyTestList();
  //        } else {
  //          this.toastr.error('Radiology Test Master Data not saved !, Please check API error..', 'Error !', {
  //            toastClass: 'tostr-tost custom-toast-error',
  //          });
  //        }
  //        this.getRadiologyTestList();
  //      }, error => {
  //        this.toastr.error('Radiology  Test not saved !, Please check API error..', 'Error !', {
  //          toastClass: 'tostr-tost custom-toast-error',
  //        });
  //      });
  //     }
 
  //     }
     
  // }

  
  onAdd() {
    const dialogRef = this._matDialog.open(UpdateradiologymasterComponent,
      {
           maxWidth: "80%", 
            width: "80%",
            height: "85%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
       this.getRadiologyTestList();
    });
  }
  onEdit(row) {
    var m_data = {
      "TestId": row.TestId, 
      "TestName": row.TestName.trim(),
      "PrintTestName":row.PrintTestName,
      "CategoryId": row.CategoryName,
      "ServiceId": row.ServiceName,
      "IsDeleted": JSON.stringify(row.Isdeleted),
      "UpdatedBy": row.UpdatedBy,
    };
    console.log(row)
    console.log(m_data)
    this._radiologytestService.populateForm(m_data);
    const dialogRef = this._matDialog.open(UpdateradiologymasterComponent, {
      maxWidth: "80%", 
      width: "80%",
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
      title: 'Do you want to Change Active Status Of Radiology Test',
       showCancelButton: true,
      confirmButtonText: 'OK',

    }).then((flag) => {
      let Query;
      if (flag.isConfirmed) {
          if(row.IsActive){
           Query =
          "Update M_RadiologyTestMaster set IsActive=0 where ParameterID=" +row.est;
          console.log(Query);
          }else{
               Query =
              "Update M_RadiologyTestMaster set IsActive=1 where ParameterID=" +row.Test;
          }

          this._radiologytestService.deactivateTheStatus(Query)
              .subscribe((data) => (this.msg = data));
          this.getRadiologyTestList();
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

    }
  }
}