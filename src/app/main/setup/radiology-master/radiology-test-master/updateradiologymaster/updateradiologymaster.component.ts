import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { RadiologyTestMasterService } from '../radiology-test-master.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
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
    testForm:FormGroup;
    AddParameterFrom:FormGroup;
    
    isActive:boolean=true;

    autocompleteModeService:string="Service"; 
    
    autocompleteModeCategory:string="ItemCategory";

    vTestName: any;
    vPrintName: any;

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
        
        this.testForm=this._radiologytestService.createRadiologytestForm();
        this.AddParameterFrom = this._radiologytestService.createAddparaFrom();
        if((this.data?.testId??0) > 0) 
        {  
            // this.registerObj=this.data.Obj;
            this.isActive=this.data.isActive
            // this.Remark = this.registerObj.Remarks;
            
            this.testForm.patchValue(this.data);
            console.log(this.data)
            // this.gettemplateMasterServicewise(this.registerObj);   
            // console.log(this.registerObj)    
        }
    }
    
    itemId=0;
    selectChangeCategory(obj: any){
        console.log(obj);
        this.itemId=obj
    }
    
    service=0;
    selectChangeservice(obj: any){
        console.log(obj);
        this.service=obj
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


    private _filtercategory(value: any): string[] {
        if (value) {
            const filterValue = value && value.CategoryName ? value.CategoryName.toLowerCase() : value.toLowerCase();
            return this.optionscategory.filter(option => option.CategoryName.toLowerCase().includes(filterValue));
        }

    }

    getOptionTextCategory(option) {
        return option && option.CategoryName ? option.CategoryName : " ";
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




    OnAdd(event) {
        this.DSTestList.data = [];
        this.ChargeList = this.dsTemparoryList.data;
        
        this.ChargeList.push(
        {
            TemplateName: this.testForm.get('templateName').value,
            TemplateId:this.testForm.get('testId').value,
        });
        this.DSTestList.data = this.ChargeList
        this.testForm.get('templateName').reset();
    }
 
    gettemplateMasterServicewise(el){
        
        var vdata={
            "Id" : el.serviceId
        }

        // this._radiologytestService.gettemplateMasterComboList(vdata).subscribe(data =>{
        //   this.DSTestList.data = data as TestList[];
        //   this.ChargeList = data as TestList[];
        // })
    }

    onClear(val: boolean) {
        this.testForm.reset({ IsDeleted: 'false' });
        this._radiologytestService.initializeFormGroup();
        this.DSTestList.data = [];
        this.dialogRef.close(val)
    }

    onClose(){
        this._matDialog.closeAll();
        this._radiologytestService.myform.reset();
    }
    
    onSubmit() {
    
        if (this.testForm.invalid) {
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass:'tostr-tost custom-toast-warning',
        })
        return;
        }else{
        if(!this.testForm.get("testId").value){
            var data1=[];
                let mRadiologyTemplateDetails = {};
                mRadiologyTemplateDetails["ptemplateId"]=0,
                mRadiologyTemplateDetails['testId'] = 0, 
                mRadiologyTemplateDetails['templateId'] = 0
                data1.push(mRadiologyTemplateDetails);

            console.log("Insert data1:",data1);

            var mdata={
                "testId": 0,
                "testName": this.testForm.get("testName").value,
                "printTestName": this.testForm.get("printTestName").value,
                "categoryId": this.testForm.get("categoryId").value || 0,
                "serviceId": this.testForm.get("serviceId").value || 0,
                "mRadiologyTemplateDetails": data1
            }

                console.log("json of Test:", mdata)
                this._radiologytestService.testMasterSave(mdata).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        } else{
            
        }
        }
    }

    getValidationMessages() {
        return {
            testName: [],
            categoryId:[],
            printTestName:[],
            serviceId:[],
            templateName:[],
        };
    }
  
    @ViewChild('Tname') Tname: ElementRef;
    @ViewChild('printName') printName: ElementRef;

    public onEnterTname(event): void {
        if (event.which === 13) {
            this.printName.nativeElement.focus();
        }
    }
    public onEnterprintName(event): void {
        if (event.which === 13) {
            this.printName.nativeElement.focus();
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
