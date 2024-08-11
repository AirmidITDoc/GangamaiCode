import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { RadiologyTestMasterService } from '../radiology-test-master.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

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
  TemplateList: any = [];
  msg: any;
  registerObj:any;
  ServiceId:any;
  CategoryId:any;
  vTemplateName:any;
  vCategoryId:any;
  filteredOptionsCategory: Observable<string[]>;
  optionscategory: any[] = [];
  iscategorySelected: boolean = false;

  filteredOptionsService: Observable<string[]>;
  optionsservice: any[] = [];
  isserviceSelected: boolean = false;

  
  isTemplateNameSelected: boolean = false;
  filteredOptionsisTemplate: Observable<string[]>;
  optionsTemplate: any[] = [];

  
  DSTestList = new MatTableDataSource<TestList>();
  dsTemparoryList = new MatTableDataSource<TestList>();
 
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
    if (this.data) {
      
      this.registerObj=this.data.Obj;
     // this.Remark = this.registerObj.Remarks;
     console.log(this.data)
    this.gettemplateMasterComboList(this.registerObj);   
      console.log(this.registerObj)    
    }

    this.getCategoryNameCombobox();
    this.getServiceNameCombobox();
    this.getTemplateNameCombobox();

    this.getserviceNameCombobox();
    this.getcategoryNameCombobox();
  }
 
 
  getTemplateNameCombobox() {

    this._radiologytestService.gettemplateMasterCombo().subscribe(data => {
        this.TemplateList = data;
        this.optionsTemplate = this.TemplateList.slice();
        this.filteredOptionsisTemplate = this._radiologytestService.AddParameterFrom.get('TemplateName').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filterTemplate(value) : this.TemplateList.slice()),
        );

    });
}

private _filterTemplate(value: any): string[] {
    if (value) {
        const filterValue = value && value.TemplateName ? value.TemplateName.toLowerCase() : value.toLowerCase();

        return this.optionsTemplate.filter(option => option.TemplateName.toLowerCase().includes(filterValue));
    }
}


getOptionTextTemplate(option) {

    return option && option.TemplateName ? option.TemplateName : '';
}

  getCategoryNameCombobox() {

    this._radiologytestService.getCategoryMasterCombo().subscribe((data) => {
        this.CategorycmbList = data;
        if (this.data) {
            const toSelectId = this.CategorycmbList.find(c => c.CategoryId == this.registerObj.CategoryId);
            this._radiologytestService.myform.get('CategoryId').setValue(toSelectId);

        }

    });
}

private _filtercategory(value: any): string[] {
    if (value) {
        const filterValue = value && value.CategoryName ? value.CategoryName.toLowerCase() : value.toLowerCase();
        return this.optionscategory.filter(option => option.CategoryName.toLowerCase().includes(filterValue));
    }

}

getOptionTextCategory(option) {
    return option && option.CategoryName ? option.CategoryName : " ";
}

getcategoryNameCombobox() {
    this._radiologytestService.getCategoryMasterCombo().subscribe(data => {
        this.CategorycmbList = data;
        this.optionscategory = this.CategorycmbList.slice();
        this.filteredOptionsCategory = this._radiologytestService.myform.get('CategoryId').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filtercategory(value) : this.CategorycmbList.slice()),
        );
    });
}

getServiceNameCombobox() {

    this._radiologytestService.getServiceMasterCombo().subscribe((data) => {
        this.ServicecmbList = data;
        if (this.data) {
            const toSelectId = this.ServicecmbList.find(c => c.ServiceId == this.registerObj.ServiceId);
            this._radiologytestService.myform.get('ServiceId').setValue(toSelectId);

        }

    });
}

private _filterservice(value: any): string[] {
    if (value) {
        const filterValue = value && value.ServiceName ? value.ServiceName.toLowerCase() : value.toLowerCase();
        return this.optionsservice.filter(option => option.ServiceName.toLowerCase().includes(filterValue));
    }

}
getOptionTextService(option) {
    return option && option.ServiceName ? option.ServiceName : " ";
}

getserviceNameCombobox() {
    this._radiologytestService.getServiceMasterCombo().subscribe(data => {
        this.ServicecmbList = data;
        this.optionsservice = this.ServicecmbList.slice();
        this.filteredOptionsService = this._radiologytestService.myform.get('ServiceId').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filterservice(value) : this.ServicecmbList.slice()),
        );
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
    this._radiologytestService.AddParameterFrom.get('TemplateName').reset();
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
         insertRadiologyTestMaster['testId'] = 0;
         insertRadiologyTestMaster['testName'] = this._radiologytestService.myform.get("TestName").value;
         insertRadiologyTestMaster['printTestName'] = this._radiologytestService.myform.get("PrintTestName").value;
         insertRadiologyTestMaster['categoryId'] = this._radiologytestService.myform.get("CategoryId").value.CategoryId;
         insertRadiologyTestMaster['addedBy'] = this.accountService.currentUserValue.user.id;
         insertRadiologyTestMaster['Isdeleted'] = 1;
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
        updateRadiologyTestMaster['Isdeleted'] = 1;
        updateRadiologyTestMaster['updatedBy'] = this.accountService.currentUserValue.user.id;
        updateRadiologyTestMaster['serviceId'] = this._radiologytestService.myform.get("ServiceId").value.ServiceId;
       
        let insertRadiologyTemplateTest = [];
        this.DSTestList.data.forEach((element) => {
          debugger
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
      this._radiologytestService.myform.reset();
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
