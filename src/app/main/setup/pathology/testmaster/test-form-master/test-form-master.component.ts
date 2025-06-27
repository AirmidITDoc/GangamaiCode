import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { AuthenticationService } from "app/core/services/authentication.service";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { TemplatedetailList, TestList, TestMaster } from "../testmaster.component";
import { TestmasterService } from "../testmaster.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
import { element } from "protractor";



@Component({
    selector: "app-test-form-master",
    templateUrl: "./test-form-master.component.html",
    styleUrls: ["./test-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TestFormMasterComponent implements OnInit {
    testForm: FormGroup;
    templatedetailsForm: FormGroup;
    testdetailsForm: FormGroup;
    testFormInsert: FormGroup;
    dsTemparoryList = new MatTableDataSource<TestList>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = ['parameterName'];
    displayedColumns2: string[] = ['Reorder', 'ParameterName', 'PrintParameterName', 'MethodName', 'UnitName', 'ParaMultipleRange', 'Formula', 'IsNumeric', 'Action'];
    autocompleteModeCategoryId: string = "ItemCategory";
    autocompleteModeServiceID: string = "Service";
    autocompleteModeTemplate: string = "Template";
    registerObj: any;
    vTestId: any;
    TemplateId: any = 0;
    ParameterName: any = '';
    TemplateList: any = [];
    ChargeList: any = [];
    DSTestList = new MatTableDataSource<TestList>();
    DSTestListtemp = new MatTableDataSource<TestList>();
    Templatetdatasource = new MatTableDataSource<TemplatedetailList>();
    paramterList: any = new MatTableDataSource<TestList>();
    ServiceID: any = 0;
    serviceflag: boolean = true;
    Subtest: any;
    chargeslist: any = [];
    Statusflag: any = false;
    isActive: boolean = true;
    vTestName: any;
    showTemplateTable: boolean=false;
   displayedColumns5: string[] = ['TemplateName', 'Action'];

    // ///////////////////////

    constructor(
        public _TestmasterService: TestmasterService,
        public dialogRef: MatDialogRef<TestFormMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        private _formBuilder: UntypedFormBuilder,
        private _loggedService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {

        this.testForm = this._TestmasterService.createPathtestForm();
        this.testForm.markAllAsTouched();

        this.testFormInsert = this.createPathtestInsertForm();
        this.testFormInsert.markAllAsTouched();

        this.templatedetailsForm = this._TestmasterService.templatedetailsForm();
        this.testdetailsForm = this._TestmasterService.testdetailsForm();
        this.testForm.get("Status").setValue(1)
        if (this.data) {
            this.registerObj = this.data;
            this.vTestId = this.registerObj.testId
            this.vTestName = this.registerObj.testName
            this.TemplateId = this.registerObj.TemplateId;
            this.isActive = this.registerObj.isActive;

            if (this.registerObj.isTemplateTest === "0" && !this.registerObj.isSubTest) {
                this._TestmasterService.is_subtest = false;
                this.Statusflag = false;
                this._TestmasterService.is_templatetest = false;
                this.testForm.get("Status").setValue(1);
                this._TestmasterService.is_Test = true
                this.fetchTestlist(this.registerObj);

            } else if (this.registerObj.isTemplateTest === "1") {
                this._TestmasterService.is_templatetest = true;
                this._TestmasterService.is_subtest = false;
                this._TestmasterService.is_Test = false;
                this.Statusflag = true;
                this.testForm.get("Status").setValue(3);
                this.fetchTemplate(this.registerObj);
            } else if (this.registerObj.isTemplateTest === "0" && this.registerObj.isSubTest) {
                this.Subtest = this.registerObj.isSubTest; // Fix possible typo (IsSubTest → isSubTest)
                this.Statusflag = false;
                this._TestmasterService.is_templatetest = false;
                this._TestmasterService.is_subtest = true;
                this._TestmasterService.is_Test = false;
                this.serviceflag = false;
                this.testForm.get("Status").setValue(2);
                this.fetchSubTestlist(this.registerObj);
            }
        }

        this.getParameterList();
        var m_data = {
            TestId: this.data?.testId,
            TestName: this.data?.testName,
            PrintTestName: this.data?.printTestName,
            CategoryId: this.data?.categoryId,
            ServiceId: this.data?.serviceID,
            TechniqueName: this.data?.techniqueName,
            MachineName: this.data?.machineName,
            FootNote: this.data?.footNote,
            SuggestionNote: this.data?.suggestionNote
        };
        this.testForm.patchValue(m_data);
    }

    createPathtestInsertForm(): FormGroup {
        return this._formBuilder.group({
            pathTest: this._formBuilder.group({
                testName: ["",[this._FormvalidationserviceService.allowEmptyStringValidator()]],
                printTestName: ["",[this._FormvalidationserviceService.allowEmptyStringValidator()]],
                categoryId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isSubTest: false,
                techniqueName: ["",[this._FormvalidationserviceService.allowEmptyStringValidator()]],
                machineName: ["",[this._FormvalidationserviceService.allowEmptyStringValidator()]],
                suggestionNote: ["",[this._FormvalidationserviceService.allowEmptyStringValidator()]],
                footNote: ["",[this._FormvalidationserviceService.allowEmptyStringValidator()]],
                isActive: Boolean(JSON.parse(this.testForm.get("isActive").value)), //true
                addedBy: [this._loggedService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
                updatedBy: [this._loggedService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
                serviceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isTemplateTest: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
                TestId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]]
            }),
            pathTemplateDetail: this._formBuilder.array([]),
            pathTestDetail: this._formBuilder.array([]),
        });
    }

    createpathTemplateDetail(item: any = {}): FormGroup {
        return this._formBuilder.group({
            TestId: [this.vTestId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            TemplateId: [item.templateId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]]
        });
    }

    createpathTestDetail(item: any = {}): FormGroup {
        return this._formBuilder.group({
            TestId: [this.vTestId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            SubTestId: [item.subTestID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            ParameterId: [item.parameterID ?? item.parameterId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }

    get pathTemplateArray(): FormArray {
        return this.testFormInsert.get('pathTemplateDetail') as FormArray;
    }

    get pathTestArray(): FormArray {
        return this.testFormInsert.get('pathTestDetail') as FormArray;
    }

    toggle(val) {

        if (val == "1") {
            this._TestmasterService.is_Test = true;
            this.Subtest = false
            this.Statusflag = false;
            this.serviceflag = true;
            this._TestmasterService.is_templatetest = false;
        } else if (val == "2") {
            this._TestmasterService.is_subtest = true;
            this._TestmasterService.is_Test = false;
            this.serviceflag = false;
            this.Subtest = true
            this._TestmasterService.is_templatetest = false;
            // get issubtest list
        } else if (val == "3") {
            this._TestmasterService.is_templatetest = true;
            this._TestmasterService.is_subtest = false;
            this._TestmasterService.is_Test = false;
            this.Statusflag = true;
            this.serviceflag = true;
            this.Subtest = false
        }
    }

    onSearchClear() {
        this.testForm.get("ParameterNameSearch").setValue("");
        this.ParameterName = ""
        this.getParameterList();
        // this.getParameterNameCombobox();
    }
    onSearch() {

        if (this.testForm.get("IsSubTest").value != true)
            // this.getParameterNameCombobox();
            this.getParameterList();
        else
            this.getSubTestMasterList();
    }

    fetchTestlist(obj) {
        var m_data =
        {
            "first": 0,
            "rows": 10,
            "sortField": "TestId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "TestId",
                    "fieldValue": String(obj.testId),
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }

        this._TestmasterService.getTestListfor(m_data).subscribe(Visit => {
            this.DSTestList.data = Visit.data as TestList[];
            this.dsTemparoryList.data = Visit as TestList[];
        });

    }

    // wroung api list used
    fetchSubTestlist(obj) {
        var m_data =
        {
            "first": 0,
            "rows": 10,
            "sortField": "TestId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "TestId",
                    "fieldValue": String(obj.testId),
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }

        this._TestmasterService.getSubTestList(m_data).subscribe(Visit => {
            this.DSTestList.data = Visit.data as TestList[];
            this.dsTemparoryList.data = Visit as TestList[];
        });

    }

    drop(event: CdkDragDrop<string[]>) {

        this.DSTestList.data = [];
        this.ChargeList = this.dsTemparoryList.data;
        moveItemInArray(this.ChargeList, event.previousIndex, event.currentIndex);
        this.DSTestList.data = this.ChargeList;
    }

    fetchTemplate(obj) {
        var m_data = {
            "first": 0,
            "rows": 10,
            "sortField": "TemplateId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "TestId",
                    "fieldValue": String(obj.testId),
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }
        this._TestmasterService.getTemplateListfor(m_data).subscribe(Visit => {
            this.Templatetdatasource.data = Visit.data as TemplatedetailList[];
            // this.dsTemparoryList.data = Visit as TestList[];
        });

    }

    invalidFields1 = [];

    onSubmit() {
        debugger

        if (!this.testForm.invalid && !this.testFormInsert.invalid) {
            this.invalidFields1 = [];

            if (!this._TestmasterService.is_templatetest && this.DSTestList.data.length === 0) {
                this.invalidFields1.push('No data in the table list!');
            }
            if (this._TestmasterService.is_templatetest && this.Templatetdatasource.data.length === 0) {
                this.invalidFields1.push('No data in the template list!');
            }
            if (this.invalidFields1.length > 0) {
                this.invalidFields1.forEach(field => {
                    this.toastr.warning(field, 'Warning!');
                });
                return;
            }

            this.pathTemplateArray.clear();
            this.Templatetdatasource.data.forEach(item => {
                this.pathTemplateArray.push(this.createpathTemplateDetail(item));
            });

            this.pathTestArray.clear();
            this.DSTestList.data.forEach(item => {
                this.pathTestArray.push(this.createpathTestDetail(item));
            });
            const isUpdate = this.vTestId;

            if (isUpdate) {
            this.testFormInsert.get("pathTest.updatedBy")?.setValue(this._loggedService.currentUserValue.userId);
             (this.testFormInsert.get('pathTest') as FormGroup).removeControl('addedBy');
            } else {
            this.testFormInsert.get("pathTest.addedBy")?.setValue(this._loggedService.currentUserValue.userId);
             (this.testFormInsert.get('pathTest') as FormGroup).removeControl('updatedBy');
            }
         
            this.testFormInsert.get("pathTest.TestId")?.setValue(this.vTestId ?? 0)
            this.testFormInsert.get("pathTest.testName")?.setValue(this.testForm.get("TestName").value)
            this.testFormInsert.get("pathTest.printTestName")?.setValue(this.testForm.get("PrintTestName").value)
            this.testFormInsert.get("pathTest.categoryId")?.setValue(Number(this.testForm.get("CategoryId").value))
            this.testFormInsert.get("pathTest.techniqueName")?.setValue(this.testForm.get("TechniqueName").value ?? '')
            this.testFormInsert.get("pathTest.machineName")?.setValue(this.testForm.get("MachineName").value ?? '')
            this.testFormInsert.get("pathTest.suggestionNote")?.setValue(this.testForm.get("SuggestionNote").value ?? '')
            this.testFormInsert.get("pathTest.footNote")?.setValue(this.testForm.get("FootNote").value ?? '')
            this.testFormInsert.get("pathTest.serviceId")?.setValue(Number(this.testForm.get("ServiceId").value) ?? 0)
            this.testFormInsert.get("pathTest.isSubTest")?.setValue(this.Subtest !== undefined ? this.Subtest : false)
            this.testFormInsert.get("pathTest.isTemplateTest")?.setValue(this._TestmasterService.is_templatetest ? 1 : 0)
            console.log("json of Test:", this.testFormInsert.value)
            this._TestmasterService.TestMasterSave(this.testFormInsert.value).subscribe((response) => {
                this.onClose(true);
            });

        } else {
            this.invalidFields1 = [];

            if (this.testForm.invalid) {
                for (const controlName in this.testForm.controls) {
                    if (this.testForm.controls[controlName].invalid) {
                        this.invalidFields1.push(`My Form: ${controlName}`);
                    }
                }
            }
            
            // checks nested error 
            if (this.testFormInsert.invalid) {
                for (const controlName in this.testFormInsert.controls) {
                    const control = this.testFormInsert.get(controlName);

                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                this.invalidFields1.push(`Table Data : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        this.invalidFields1.push(`Insert Form: ${controlName}`);
                    }
                }
            }

            if (this.invalidFields1.length > 0) {
                this.invalidFields1.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                    );
                });
            }
        }

    }

    getParameterList() {
        let parameter = this.testForm.get("ParameterNameSearch").value + "%" || '%';
        var param = {
            "first": 0,
            "rows": 10,
            "sortField": "ParameterId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "ParameterName",
                    "fieldValue": parameter,
                    "opType": "StartsWith"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }
        this._TestmasterService.getParameterMasterList(param).subscribe(data => {

            this.paramterList.data = data.data as TestList[];;
            this.paramterList.sort = this.sort;
            this.paramterList.paginator = this.paginator;
        });
    }

    // isSubtest checkbox list 
    getSubTestMasterList() {
        let parameter = this.testForm.get("ParameterNameSearch").value + "%" || '%';
        var param = {
            "first": 0,
            "rows": 10,
            "sortField": "TestId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "TestName",
                    "fieldValue": parameter,
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }
        this._TestmasterService.getIsSubTestList(param).subscribe(data => {

            this.paramterList.data = data.data as TestList[];;
            this.paramterList.sort = this.sort;
            this.paramterList.paginator = this.paginator;
        });
    }

    chooseFirstOption(auto: MatAutocomplete): void {
        auto.options.first.select();
    }

    onAdd(event) {
        if (this.testForm.get("IsSubTest").value) {
            this.addSubTest(event);

        } else if (!this.testForm.get("IsSubTest").value) {
            this.addParameter(event);
        }

    }

    onDeleteRow(event) {
        let temp = [...this.paramterList.data];
        temp.push({
            parameterName: event.parameterName || "",
        });
        this.paramterList.data = temp;

        temp = [...this.DSTestList.data];
        let index = temp.findIndex(item => item.parameterName === event.parameterName);
        if (index !== -1) {
            temp.splice(index, 1);
        }
        this.DSTestList.data = temp;

        let chargesIndex = this.chargeslist.findIndex(item => item.parameterName === event.parameterName);
        if (chargesIndex !== -1) {
            this.chargeslist.splice(chargesIndex, 1);
        }
    }

    onDeleteTemplateRow(event) {
        if (!this.Templatetdatasource) {
            this.Templatetdatasource = new MatTableDataSource<TemplatedetailList>([]);
        }

        this.Templatetdatasource.data = this.Templatetdatasource.data.filter(item => item.templateName !== event.templateName);

        this.toastr.success('Record Deleted Successfully.', 'Deleted!', {
            toastClass: 'tostr-tost custom-toast-success',
        });
    }

    DDtemplateId = 0
    DDtemplateName = ""
    selectChangeTemplate(data) {
        this.DDtemplateId = data.value
        this.DDtemplateName = data.text
    }
    list = [];

    onAddTemplate() {
        if (!this.list) {
    this.list = [];
  }

  const newItem = {
    templateId: this.DDtemplateId,
    templateName: this.DDtemplateName
  };

  this.list.push(newItem);
  this.Templatetdatasource.data = [...this.Templatetdatasource.data, newItem];

  this.templatedetailsForm.get("TemplateId").reset();
  this.templatedetailsForm.get("TemplateName").reset();

  this.showTemplateTable = true;
}

    addParameter(row) {
        // ;

        if (!row || !row.parameterId) {
            console.error("Invalid row data!");
            return;
        }

        if (!this.chargeslist) {
            this.chargeslist = [];
        }

        if (this.chargeslist.length > 0) {
            let isDuplicate = this.chargeslist.some(ele => ele.parameterId === row.parameterId);

            if (isDuplicate) {
                this.toastr.warning('Selected Parameter already added in the list', 'Warning!', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }

        this.chargeslist.push(row);

        this.addparameterdata(row);

        this.DSTestListtemp.data = [...this.chargeslist];
        this.DSTestListtemp.sort = this.sort;
        this.DSTestListtemp.paginator = this.paginator;
    }

    addparameterdata(row) {
        this.ChargeList = this.DSTestList.data || [];

        let exists = this.ChargeList.some(item => item.ParameterID === row.parameterId);
        if (!exists) {
            this.ChargeList.push({
                parameterId: row.parameterId,
                parameterName: row.parameterName,
                printParameterName: row.printParameterName,
                methodName: row.methodName,
                unitName: row.unitName
            });

            this.DSTestList.data = [...this.ChargeList];
            this.dsTemparoryList.data = [...this.ChargeList];
        }
    }

    addSubTest(row) {
        if (!row || !row.testId) {
            console.error("Invalid row data!");
            return;
        }
        if (!this.chargeslist) {
            this.chargeslist = [];
        }
        if (this.chargeslist.length > 0) {
            let isDuplicate = this.chargeslist.some(ele => ele.testId === row.testId);

            if (isDuplicate) {
                this.toastr.warning('Selected Parameter already added in the list', 'Warning!', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }

        this.chargeslist.push(row);

        this.addsubtestdata(row);

        this.DSTestListtemp.data = [...this.chargeslist];
        this.DSTestListtemp.sort = this.sort;
        this.DSTestListtemp.paginator = this.paginator;
    }

    addsubtestdata(row) {
        this.ChargeList = this.DSTestList.data || [];

        let exists = this.ChargeList.some(item => item.testId === row.testId);
        if (!exists) {
            this.ChargeList.push({
                parameterID: row.parameterId || 0,
                parameterName: row.parameterName,
                subTestID: row.subTestID || 0,
                testId: row.testId
            });

            this.DSTestList.data = [...this.ChargeList];
            this.dsTemparoryList.data = [...this.ChargeList];
        }
    }

    CategoryId = 0;
    // ServiceID=0;

    selectChangeCategoryId(obj: any) {
        this.CategoryId = obj;
    }
    selectChangeServiceID(obj: any) {
        this.ServiceID = obj;
    }
    selectChangeTemplateName(obj: any) {
        this.TemplateId = obj;
    }

    onClose(val: boolean) {
        this.testForm.reset({ Status: [1] });
        this.dialogRef.close(val);
    }
}


// {
//     "pathTest": {
//       "testName": "string",
//       "printTestName": "string",
//       "categoryId": 0,
//       "isSubTest": true,
//       "techniqueName": "string",
//       "machineName": "string",
//       "suggestionNote": "string",
//       "footNote": "string",
//       "isActive": true,
//       "addedBy": 0,
//       "serviceId": 0,
//       "isTemplateTest": 0,
//       "testId": 0
//     },
//     "pathTemplateDetail": [
//       {
//         "testId": 0,
//         "templateId": 0
//       }
//     ],
//     "pathTestDetail": [
//       {
//         "testId": 0,
//         "subTestId": 0,
//         "parameterId": 0
//       }
//     ]
//   }