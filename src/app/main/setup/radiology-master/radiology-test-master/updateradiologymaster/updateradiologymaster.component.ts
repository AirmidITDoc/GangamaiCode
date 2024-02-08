import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { RadiologyTestMasterService } from '../radiology-test-master.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-updateradiologymaster',
  templateUrl: './updateradiologymaster.component.html',
  styleUrls: ['./updateradiologymaster.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UpdateradiologymasterComponent implements OnInit {
  displayedColumns1: string[] = [
    "ParameterName"
  ];
  ChargeList: any = [];
  RadiologytestMasterList: any;
  CategorycmbList: any = [];
  ServicecmbList: any = [];
  TemplatecmbList: any = [];
  msg: any;
  registerObj:any;

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
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<UpdateradiologymasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if (this.data.Obj) {
      
      this.registerObj=this.data.Obj;
     // this.Remark = this.registerObj.Remarks;
    this.gettemplateMasterComboList(this.registerObj.TestId);   
      console.log(this.registerObj)    
    }

    this.getCategoryNameCombobox();
    this.getServiceNameCombobox();
    this.getTemplateNameCombobox();

    this.categoryFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterCategoryname();
    });

  this.serviceFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterServicename();
    });
  this.serviceFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterTemplatename();
    });
  }
 // categoryname filter
  private filterCategoryname() {
    if (!this.CategorycmbList) {

      return;
    }
    // get the search keyword
    let search = this.categoryFilterCtrl.value;
    if (!search) {
      this.filteredCategory.next(this.CategorycmbList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCategory.next(
      this.CategorycmbList.filter(bank => bank.CategoryName.toLowerCase().indexOf(search) > -1)
    );
  }


  // Service name filter
  private filterServicename() {
    if (!this.ServicecmbList) {

      return;
    }
    // get the search keyword
    let search = this.serviceFilterCtrl.value;
    if (!search) {
      this.filteredService.next(this.ServicecmbList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredService.next(
      this.ServicecmbList.filter(bank => bank.ServiceName.toLowerCase().indexOf(search) > -1)
    );
  }
  // Template name filter
  private filterTemplatename() {
    if (!this.TemplatecmbList) {

      return;
    }
    // get the search keyword
    let search = this.templateFilterCtrl.value;
    if (!search) {
      this.filteredTemplate.next(this.TemplatecmbList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredTemplate.next(
      this.TemplatecmbList.filter(bank => bank.TemplateName.toLowerCase().indexOf(search) > -1)
    );
  }




  getServiceNameCombobox() {
    this._radiologytestService.getServiceMasterCombo().subscribe(data => {
      this.ServicecmbList = data;
      this.filteredService.next(this.ServicecmbList.slice());
      this._radiologytestService.myform.get('ServiceId').setValue(this.ServicecmbList[0]);
      if (this.data) {
        const toSelectServiceId= this.ServicecmbList.find(c => c.ServiceName == this.registerObj.ServiceName);
        this._radiologytestService.myform.get('ServiceId').setValue(toSelectServiceId);
        console.log(this.registerObj)
        console.log(toSelectServiceId)
       }
    });
  }
  getTemplateNameCombobox() {
  
    this._radiologytestService.gettemplateMasterCombo().subscribe(data => {
      this.TemplatecmbList = data;
      //console.log(this.TemplatecmbList);
      this.filteredTemplate.next(this.TemplatecmbList.slice());
    });
  }

  getCategoryNameCombobox() {

    this._radiologytestService.getCategoryMasterCombo().subscribe(data => {
      this.CategorycmbList = data;
      this.filteredCategory.next(this.CategorycmbList.slice());
      this._radiologytestService.myform.get('CategoryId').setValue(this.CategorycmbList[0]);
      if (this.data) {
        const toSelectCategoryId= this.CategorycmbList.find(c => c.CategoryName == this.registerObj.CategoryName);
        this._radiologytestService.myform.get('CategoryId').setValue(toSelectCategoryId);
        console.log(this.registerObj.CategoryIds)
        console.log(toSelectCategoryId)
       }
    });
  }
  OnAdd(event) {
    this.DSTestList.data = [];
    this.ChargeList = this.dsTemparoryList.data;
    this.ChargeList.push(
      {
        TemplateName: this._radiologytestService.AddParameterFrom.get('TemplateName').value.TemplateName || "",
        TemplateId:this._radiologytestService.AddParameterFrom.get('TemplateName').value.TemplateId || 0,
      });
    this.DSTestList.data = this.ChargeList
    // console.log(this.ChargeList);
    // this._TestService.AddParameterFrom.get('ParameterName').setValue("");
    this._radiologytestService.AddParameterFrom.reset();
  }
 
  gettemplateMasterComboList(el){
    var vdata={
      "TemplateId" : el.TestId
    }
    this._radiologytestService.gettemplateMasterComboList(vdata).subscribe(data =>{
      this.DSTestList.data = data as TestList[];
      this.ChargeList = data as TestList[];
    })
  }
  onClear() {
    this._radiologytestService.myform.reset({ IsDeleted: 'false' });
    this._radiologytestService.initializeFormGroup();
    this.DSTestList.data = [];
  }
  onClose(){
    this._matDialog.closeAll();
    this._radiologytestService.myform.reset();
  }
  onSubmit() {
    if (this._radiologytestService.myform.valid) {
      if (!this._radiologytestService.myform.get("TestId").value) {
         let insertRadiologyTestMaster= {};
         insertRadiologyTestMaster['testName'] = this._radiologytestService.myform.get("TestName").value;
         insertRadiologyTestMaster['printTestName'] = this._radiologytestService.myform.get("PrintTestName").value;
         insertRadiologyTestMaster['categoryId'] = this._radiologytestService.myform.get("CategoryId").value.CategoryId;
         insertRadiologyTestMaster['addedBy'] = this.accountService.currentUserValue.user.id;
         insertRadiologyTestMaster['serviceId'] = this._radiologytestService.myform.get("ServiceId").value.ServiceId;
        
         let insertRadiologyTemplateTest = [];
         this.DSTestList.data.forEach((element) => {
          let insertRtestObj={};
          insertRtestObj['testId'] = 0;
          insertRtestObj['templateId'] = element.TemplateId;
          insertRadiologyTemplateTest.push(insertRtestObj);

         });

         let submitData ={
          "insertRadiologyTestMaster": insertRadiologyTestMaster,
          "insertRadiologyTemplateTest":insertRadiologyTemplateTest
         }
        console.log(submitData);
        this._radiologytestService.insertRadiologyTestMaster(submitData).subscribe(data => {
          this.msg = data;
          if (data) {
            this.toastr.success('Record Saved Successfully.', 'Saved !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
            this.onClear();
            this._matDialog.closeAll();
          } else {
            this.toastr.error('Radiology Test Master Data not saved !, Please check API error..', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
          this._matDialog.closeAll();
        }, error => {
          this.toastr.error('Radiology  Test not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }); this._matDialog.closeAll();
      }  
      else{
        let updateRadiologyTestMaster= {};
        updateRadiologyTestMaster['testId'] = this._radiologytestService.myform.get('TestId').value;
        updateRadiologyTestMaster['testName'] = this._radiologytestService.myform.get("TestName").value;
        updateRadiologyTestMaster['printTestName'] = this._radiologytestService.myform.get("PrintTestName").value;
        updateRadiologyTestMaster['categoryId'] = this._radiologytestService.myform.get("CategoryId").value.CategoryId;
        updateRadiologyTestMaster['updatedBy'] = this.accountService.currentUserValue.user.id;
        updateRadiologyTestMaster['serviceId'] = this._radiologytestService.myform.get("ServiceId").value.ServiceId;
       
        let insertRadiologyTemplateTest = [];
        this.DSTestList.data.forEach((element) => {
         let insertRtestObj={};
         insertRtestObj['testId'] = element.TestId;
         insertRtestObj['templateId'] = element.TemplateId;
         insertRadiologyTemplateTest.push(insertRtestObj);

        });

        let radiologyTemplateDetDelete={};
        radiologyTemplateDetDelete["testId"] =this._radiologytestService.myform.get('TestId').value; 

        let submitData ={
         "updateRadiologyTestMaster": updateRadiologyTestMaster,
         "insertRadiologyTemplateTest":insertRadiologyTemplateTest,
         "radiologyTemplateDetDelete": radiologyTemplateDetDelete
        }
       console.log(submitData);
       this._radiologytestService.insertRadiologyTestMaster(submitData).subscribe(data => {
         this.msg = data;
         if (data) {
           this.toastr.success('Record Saved Successfully.', 'Saved !', {
             toastClass: 'tostr-tost custom-toast-success',
           }); this.onClear();
           this._matDialog.closeAll();
           
         } else {
           this.toastr.error('Radiology Test Master Data not saved !, Please check API error..', 'Error !', {
             toastClass: 'tostr-tost custom-toast-error',
           });
         }
         this._matDialog.closeAll();
       }, error => {
         this.toastr.error('Radiology  Test not saved !, Please check API error..', 'Error !', {
           toastClass: 'tostr-tost custom-toast-error',
         });
       });
       this._matDialog.closeAll();
      }
 
      }
     
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
