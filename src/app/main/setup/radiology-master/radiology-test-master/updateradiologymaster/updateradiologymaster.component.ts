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
        this.testForm.markAllAsTouched();
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

    OnAdd(event) {
        debugger
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
        debugger
        if (!this.testForm.invalid) {
            if(!this.testForm.get("testId").value){
                    let mRadiologyTemplateDetails = this.DSTestList.data.map((row: any) => ({
                        "ptemplateId": 0,
                        "testId": 0,
                        "templateId": row.templateId || 0
                    }));
    
                console.log("Insert data1:",mRadiologyTemplateDetails);
    
                var mdata={
                    "testId": 0,
                    "testName": this.testForm.get("testName").value,
                    "printTestName": this.testForm.get("printTestName").value,
                    "categoryId": this.testForm.get("categoryId").value || 0,
                    "serviceId": this.testForm.get("serviceId").value || 0,
                    "mRadiologyTemplateDetails": mRadiologyTemplateDetails
                }
    
                    console.log("json of Test:", mdata)
                    this._radiologytestService.testMasterSave(mdata).subscribe((response) => {
                    this.toastr.success(response.message);
                    this.onClear(true);
                }, (error) => {
                    this.toastr.error(error.message);
                });
            } 
        }else{
            let invalidFields = [];

            if (this.testForm.invalid) {
                for (const controlName in this.testForm.controls) {
                if (this.testForm.controls[controlName].invalid) {
                    invalidFields.push(`My Form: ${controlName}`);
                }
                }
            }

            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                  this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                  );
                });
              }
        }
    }

    getValidationMessages() {
        return {
            testName: [
                { name: "required", Message: "TestName is required" },
            ],
            categoryId:[
                { name: "required", Message: "Category is required" },
            ],
            printTestName:[
                { name: "required", Message: "PrintTestName is required" },
            ],
            serviceId:[
                { name: "required", Message: "Service is required" },
            ],
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
