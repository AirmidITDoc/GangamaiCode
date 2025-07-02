import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { RadiologyTestMasterService } from '../radiology-test-master.service';

@Component({
    selector: 'app-updateradiologymaster',
    templateUrl: './updateradiologymaster.component.html',
    styleUrls: ['./updateradiologymaster.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class UpdateradiologymasterComponent implements OnInit {
    testForm: FormGroup;
    AddParameterFrom: FormGroup;

    isActive: boolean = true;

    autocompleteModeService: string = "Service";

    autocompleteModeCategory: string = "ItemCategory";
    autocompleteModeRadioTemp: string = "RadioTemplate";

    vTestName: any;
    vPrintName: any;

    displayedColumns1: string[] = [
        "ParameterName",
        "Action"
    ];
    ChargeList: any = [];
    RadiologytestMasterList: any;
    CategorycmbList: any = [];
    ServicecmbList: any = [];
    TemplateList: any = [];
    msg: any;
    registerObj: any;
    ServiceId: any;
    CategoryId: any;
    vTemplateName: any;
    vCategoryId: any;
    filteredOptionsCategory: Observable<string[]>;
    optionscategory: any[] = [];
    iscategorySelected: boolean = false;
    testId: any;

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

        this.testForm = this._radiologytestService.createRadiologytestForm();
        this.testForm.markAllAsTouched();
        this.AddParameterFrom = this._radiologytestService.createAddparaFrom();
        if ((this.data?.testId ?? 0) > 0) {
            // this.registerObj=this.data.Obj;
            this.isActive = this.data.isActive
            this.testId = this.data.testId
            this.testForm.get("serviceId").setValue(this.data.serviceId)
            this.gettemplateMasterServicewise(this.data);
            this.testForm.patchValue(this.data);
            console.log(this.data)
        }
    }

    itemId = 0;
    selectChangeCategory(obj: any) {
        console.log(obj);
        this.itemId = obj
    }

    service = 0;
    selectChangeservice(obj: any) {
        console.log(obj);
        this.service = obj
    }

    templateId = 0
    templateName = ''
    selectChangetemplate(obj: any) {
        console.log(obj);
        this.templateId = obj.value
        this.templateName = obj.text
    }

    // OnAdd(event) {
    //     debugger

    //     //  if (this.DSTestList.data.length === 0) {
    //     //     this.toastr.warning('List cannot be empty.', 'Warning !', {
    //     //         toastClass: 'tostr-tost custom-toast-warning',
    //     //     });
    //     //     return;
    //     // }

    //     this.DSTestList.data = [];
    //     this.ChargeList = this.dsTemparoryList.data;

    //     this.ChargeList.push(
    //         {
    //             templateName: this.templateName,
    //             templateId: this.templateId,
    //         });
    //     this.DSTestList.data = this.ChargeList

    //     this.testForm.get('templateName').reset();
    // }

    //     OnAdd(event) {
    //     debugger;

    //     if (!this.templateName || !this.templateId) {
    //         this.toastr.warning('Select Template Name.', 'Warning!', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }

    //     this.ChargeList = [...this.dsTemparoryList.data];

    //     this.ChargeList.push({
    //         templateName: this.templateName,
    //         templateId: this.templateId,
    //     });

    //     this.DSTestList.data = this.ChargeList;

    //     this.testForm.get('templateName').reset();
    // }

    OnAdd(event) {
        debugger;

        if (!this.templateName || !this.templateId) {
            this.toastr.warning('Select Template Name.', 'Warning!', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        // Copy existing list from DSTestList (not dsTemparoryList)
        this.ChargeList = [...this.DSTestList.data];

        // Optionally prevent duplicates
        const exists = this.ChargeList.some(item => item.templateId === this.templateId);
        if (exists) {
            this.toastr.warning('Template already added.', 'Warning!');
            return;
        }

        // Add new item
        this.ChargeList.push({
            templateName: this.templateName,
            templateId: this.templateId,
        });

        // Update both lists
        this.DSTestList.data = this.ChargeList;
        this.dsTemparoryList.data = this.ChargeList;

        this.testForm.get('templateName').reset();
    }

    gettemplateMasterServicewise(row) {
        debugger
        var param = {
            "first": 0,
            "rows": 10,
            "sortField": "TemplateId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "Id",
                    "fieldValue": String(row.testId),
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }
        console.log(param)
        this._radiologytestService.gettemplateMasterComboList(param).subscribe(data => {
            this.DSTestList.data = data.data as TestList[];
            this.dsTemparoryList.data = data.data as TestList[];
            console.log(this.DSTestList.data)
            this.ChargeList = data as TestList[];
            console.log(this.ChargeList)

        })
    }

    onDeleteRow(element: any) {
        debugger;
        this.DSTestList.data = this.DSTestList.data.filter(item => item !== element);

        this.dsTemparoryList.data = this.dsTemparoryList.data.filter(item => item !== element);

        this.toastr.success('Item deleted successfully', 'Deleted');
    }


    onClear(val: boolean) {
        this.testForm.reset({ IsDeleted: 'false' });
        this._radiologytestService.initializeFormGroup();
        this.DSTestList.data = [];
        this.dialogRef.close(val)
    }

    onClose() {
        this._matDialog.closeAll();
        this._radiologytestService.myform.reset();
    }

    invalidFields1 = [];

   onSubmit() {
  debugger;


  if (this.testForm.invalid) {
    const invalidFields: string[] = [];

    Object.keys(this.testForm.controls).forEach(controlName => {
      const control = this.testForm.controls[controlName];
      if (control.invalid) {
        invalidFields.push(`My Form: ${controlName}`);
      }
    });

    if (invalidFields.length > 0) {
      invalidFields.forEach(field => {
        this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
      });
    }
    return;
  }

 
  this.invalidFields1 = [];

  if (this.DSTestList.data.length === 0) {
    this.invalidFields1.push('No data in the Template list!');
  }

  if (this.invalidFields1.length > 0) {
    this.invalidFields1.forEach(field => {
      this.toastr.warning(field, 'Warning!');
    });
    return;
  }

  
  const mRadiologyTemplateDetails = this.DSTestList.data.map((row: any) => ({
    ptemplateId: 0,
    testId: 0,
    templateId: row.templateId || 0
  }));

  console.log("Insert data1:", mRadiologyTemplateDetails);

 
  const testIdControl = this.testForm.controls['testId'];
  const templateDetailsControl = this.testForm.controls['mRadiologyTemplateDetails'];

  testIdControl.setValue(this.testId);
  templateDetailsControl.setValue(mRadiologyTemplateDetails);

  console.log(this.testForm.value);

 
  this._radiologytestService.testMasterSave(this.testForm.value).subscribe(response => {
    this.toastr.success(response.message);
    this.onClear(true);
  });
}


    getValidationMessages() {
        return {
            testName: [
                { name: "required", Message: "TestName is required" },
            ],
            categoryId: [
                { name: "required", Message: "Category is required" },
            ],
            printTestName: [
                { name: "required", Message: "PrintTestName is required" },
            ],
            serviceId: [
                { name: "required", Message: "Service is required" },
            ],
            templateName: [],
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
    templateName: any;
    TemplateId: any;
    templateId: any;
    TestId: number;
    /**
     * Constructor
     *
     * @param TestList
     */
    constructor(TestList) {
        {
            this.TemplateName = TestList.TemplateName || "";
            this.templateName = TestList.templateName || "";
            this.TemplateId = TestList.TemplateId || 0;
            this.templateId = TestList.templateId || 0;
            this.TestId = TestList.TestId || 0;
        }
    }
}
