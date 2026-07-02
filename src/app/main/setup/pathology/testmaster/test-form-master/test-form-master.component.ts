import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { TemplatedetailList, TestList } from "../testmaster.component";
import { TestmasterService } from "../testmaster.service";



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
    displayedColumns2: string[] = ['Reorder', 'SubtestName', 'ParameterName', 'PrintParameterName', 'MethodName', 'UnitName', 'ParaMultipleRange', 'Formula', 'IsNumeric', 'Action'];
    autocompleteModeCategoryId: string = "PathCategory";
    autocompleteModeServiceID: string = "PathologyService";
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
    showTemplateTable: boolean = false;
    displayedColumns5: string[] = ['TemplateName', 'Action'];
    vUnitId = this._loggedService.currentUserValue.user.unitId;
    vsuggestionNote: any
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
        // debugger
        this.testForm.get("Status").setValue(1)
        if (this.data) {
            this.registerObj = this.data;
            this.vTestId = this.registerObj.testId
            this.vTestName = this.registerObj.testName
            this.TemplateId = this.registerObj.TemplateId;
            this.isActive = this.registerObj.isActive;
            this.vsuggestionNote = this.registerObj?.suggestionNote || '';
            this.ServiceID = this.registerObj.serviceID;


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
        const m_data = {
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
        const now = new Date();
        return this._formBuilder.group({
            pathTest: this._formBuilder.group({
                testName: ["", [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                printTestName: ["", [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                categoryId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isSubTest: false,
                techniqueName: ["", [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                machineName: ["", [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                suggestionNote: ["", [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                footNote: ["", [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                isActive: Boolean(JSON.parse(this.testForm.get("isActive").value)), //true
                addedBy: [this._loggedService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
                updatedBy: [this._loggedService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
                serviceId: [0],
                isTemplateTest: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isCategoryPrint: false,
                isPrintTestName: false,
                testDate: [now.toISOString().split('T')[0]],
                testTime: [now.toTimeString().slice(0, 5)],
                createdBy: this._loggedService.currentUserValue.userId,
                modifiedBy: this._loggedService.currentUserValue.userId,
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
            SubTestId: [item.subTestID ?? item.testId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            ParameterId: [item.parameterID ?? item.parameterId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }

    get pathTemplateArray(): FormArray {
        return this.testFormInsert.get('pathTemplateDetail') as FormArray;
    }

    get pathTestArray(): FormArray {
        return this.testFormInsert.get('pathTestDetail') as FormArray;
    }

    previousStatus: number | null = null;
    toggle(val) {
        // this.resetAddData();
        if (this.previousStatus === 3 || val === 3) {
            this.resetAddData();
        }
        this.previousStatus = val;
        if (val == "1") {
            this._TestmasterService.is_Test = true;
            this.Subtest = false
            this.Statusflag = false;
            this.serviceflag = true;
            this._TestmasterService.is_templatetest = false;
            this.testForm.get('ServiceId')?.setValidators([Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()])
            this.testForm.get('ServiceId')?.updateValueAndValidity();
        } else if (val == "2") {
            this._TestmasterService.is_subtest = true;
            this._TestmasterService.is_Test = false;
            this.serviceflag = false;
            this.Subtest = true
            this._TestmasterService.is_templatetest = false;
            this.testForm.get('ServiceId')?.setValue(0)
            this.testForm.get('ServiceId')?.clearValidators();
            this.testForm.get('ServiceId')?.updateValueAndValidity();
            // get issubtest list
        } else if (val == "3") {
            this._TestmasterService.is_templatetest = true;
            this._TestmasterService.is_subtest = false;
            this._TestmasterService.is_Test = false;
            this.Statusflag = true;
            this.serviceflag = true;
            this.Subtest = false
            this.DSTestList.data = [];
            this.testForm.get('ServiceId')?.setValidators([Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()])
            this.testForm.get('ServiceId')?.updateValueAndValidity();
        }
    }

    resetAddData() {
        this.chargeslist = [];
        this.ChargeList = [];
        this.DSTestList.data = [];
        this.DSTestListtemp.data = [];
        this.dsTemparoryList.data = [];
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
        const m_data =
        {
            "first": 0,
            "rows": 9999,
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
            const newData = Visit.data as TestList[] || [];

            // Initialize lists if not defined
            if (!this.DSTestList.data) this.DSTestList.data = [];
            if (!this.dsTemparoryList.data) this.dsTemparoryList.data = [];

            // 🔹 Append new data instead of replacing
            this.DSTestList.data = [...this.DSTestList.data, ...newData];
            this.dsTemparoryList.data = [...this.dsTemparoryList.data, ...newData];

            console.log('Updated DSTestList:', this.DSTestList.data);

            this.chargeslist = (Visit.data || []).map(x => ({
                ...x,
                parameterId: x.parameterId ?? x.parameterID
            }));

            // 🔄 single source → all tables
            this.ChargeList = [...this.chargeslist];
            // this.DSTestList.data = Visit.data as TestList[];
            // this.dsTemparoryList.data = Visit as TestList[];
        });

    }

    // wroung api list used
    // fetchSubTestlist(obj) {
    //     var m_data =
    //     {
    //         "first": 0,
    //         "rows": 999,
    //         "sortField": "TestId",
    //         "sortOrder": 0,
    //         "filters": [
    //             {
    //                 "fieldName": "TestId",
    //                 "fieldValue": String(obj.testId),
    //                 "opType": "Equals"
    //             }
    //         ],
    //         "Columns": [],
    //         "exportType": "JSON"
    //     }

    //     this._TestmasterService.getSubTestList(m_data).subscribe(Visit => {
    //         // this.DSTestList.data = Visit.data as TestList[];
    //         // this.dsTemparoryList.data = Visit as TestList[];
    //         const data = Visit.data as TestList[] || [];

    //         // 🔥 VERY IMPORTANT
    //         this.chargeslist = [...data];
    //         this.ChargeList = [...data];

    //         this.DSTestList.data = [...data];
    //         this.dsTemparoryList.data = [...data];
    //         this.DSTestListtemp.data = [...data];
    //     });
    // }

    //  fetchSubTestlist(obj) {
    //     var m_data =
    //     {
    //         "first": 0,
    //         "rows": 10,
    //         "sortField": "TestId",
    //         "sortOrder": 0,
    //         "filters": [
    //             {
    //                 "fieldName": "TestId",
    //                 "fieldValue": String(obj.testId),
    //                 "opType": "Equals"
    //             }
    //         ],
    //         "Columns": [],
    //         "exportType": "JSON"
    //     }

    //     this._TestmasterService.getSubTestList(m_data).subscribe(Visit => {
    //         this.DSTestList.data = Visit.data as TestList[];
    //         this.dsTemparoryList.data = Visit as TestList[];
    //     });

    // }

    fetchSubTestlist(obj) {

        const m_data = {
            first: 0,
            rows: 999,
            sortField: 'TestId',
            sortOrder: 0,
            filters: [{
                fieldName: 'TestId',
                fieldValue: String(obj.testId),
                opType: 'Equals'
            }],
            Columns: [],
            exportType: 'JSON'
        };

        this._TestmasterService.getSubTestList(m_data).subscribe(res => {

            this.chargeslist = (res.data || []).map(x => ({
                ...x,
                parameterId: x.parameterId ?? x.parameterID
            }));

            // 🔄 single source → all tables
            this.ChargeList = [...this.chargeslist];
            this.DSTestList.data = [...this.chargeslist];
            this.dsTemparoryList.data = [...this.chargeslist];
            this.DSTestListtemp.data = [...this.chargeslist];
        });
    }


    drop(event: CdkDragDrop<string[]>) {
        this.DSTestList.data = [];
        this.ChargeList = this.dsTemparoryList.data;
        moveItemInArray(this.ChargeList, event.previousIndex, event.currentIndex);
        this.DSTestList.data = this.ChargeList;
    }

    fetchTemplate(obj) {
        const m_data = {
            "first": 0,
            "rows": 999,
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
        if (this.ServiceID == 0 && !this.Subtest) {
            this.testForm.get('ServiceId')?.setValidators([Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()])
            this.testForm.get('ServiceId')?.updateValueAndValidity();
            this.toastr.warning(`Select Service Name`, 'Warning',);
            return;
        }


        this.testForm.get("ServiceId").setValue(this.ServiceID)
        this.testFormInsert.get("pathTest.serviceId")?.setValue(Number(this.testForm.get("ServiceId").value) || 0)
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
                (this.testFormInsert.get('pathTest') as FormGroup).removeControl('createdBy');
            } else {
                this.testFormInsert.get("pathTest.addedBy")?.setValue(this._loggedService.currentUserValue.userId);
                (this.testFormInsert.get('pathTest') as FormGroup).removeControl('updatedBy');
                (this.testFormInsert.get('pathTest') as FormGroup).removeControl('modifiedBy');
            }

            this.testFormInsert.get("pathTest.TestId")?.setValue(this.vTestId || 0)
            this.testFormInsert.get("pathTest.testName")?.setValue(this.testForm.get("TestName").value)
            this.testFormInsert.get("pathTest.printTestName")?.setValue(this.testForm.get("PrintTestName").value)
            this.testFormInsert.get("pathTest.categoryId")?.setValue(Number(this.testForm.get("CategoryId").value))
            this.testFormInsert.get("pathTest.techniqueName")?.setValue(this.testForm.get("TechniqueName").value || '')
            this.testFormInsert.get("pathTest.machineName")?.setValue(this.testForm.get("MachineName").value || '')
            this.testFormInsert.get("pathTest.suggestionNote")?.setValue(this.testForm.get("SuggestionNote").value || '')
            this.testFormInsert.get("pathTest.footNote")?.setValue(this.testForm.get("FootNote").value || '')
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
        // debugger
        const parameter = this.testForm.get("ParameterNameSearch").value + "%" || '%';
        const param = {
            "first": 0,
            "rows": 999,
            "sortField": "ParameterId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "ParameterName",
                    "fieldValue": parameter,
                    "opType": "StartsWith"
                },
                {
                    "fieldName": "UnitId",
                    "fieldValue": String(0),//this.vUnitId),
                    "opType": "Equals"
                },
                {
                    "fieldName": "IsNumneric",
                    "fieldValue": "2",
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }
        this._TestmasterService.getParameterMasterList(param).subscribe(data => {

            this.paramterList.data = data.data as TestList[];
            this.paramterList.sort = this.sort;
            this.paramterList.paginator = this.paginator;
        });
    }

    // isSubtest checkbox list 
    getSubTestMasterList() {
        const parameter = this.testForm.get("ParameterNameSearch").value + "%" || '%';
        const param = {
            "first": 0,
            "rows": 999,
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

            this.paramterList.data = data.data as TestList[];
            this.paramterList.sort = this.sort;
            this.paramterList.paginator = this.paginator;
        });
    }

    chooseFirstOption(auto: MatAutocomplete): void {
        auto.options.first.select();
    }

    onAdd(event) {
        // debugger
        if (this.testForm.get("IsSubTest").value) {
            this.addSubTest(event);

        } else if (!this.testForm.get("IsSubTest").value) {
            this.addParameter(event);
        }

    }
    // onDeleteRow(event) {

    //     const paraid = event.parameterID ?? event.parameterId;
    //     if (!paraid) {
    //         console.warn('Cannot delete: parameterId missing', event);
    //         return;
    //     }

    //     // 🔥 MASTER DELETE (single source of truth)
    //     this.chargeslist = this.chargeslist.filter(
    //         item => (item.parameterID ?? item.parameterId) !== paraid
    //     );

    //     // 🔄 REFLECT IN UI
    //     this.DSTestList.data = [...this.chargeslist];
    //     this.dsTemparoryList.data = [...this.chargeslist];
    //     this.DSTestListtemp.data = [...this.chargeslist];
    // }

    onDeleteRow(event) {
        const paraid = event.parameterID ?? event.parameterId
        // PARAMETER delete
        if (paraid && !event.testId) {

            this.chargeslist = this.chargeslist.filter(
                item => item.parameterId !== paraid
            );

            this.ChargeList = this.ChargeList.filter(
                item => item.parameterId !== paraid
            );
        }

        // SUBTEST delete
        else if (event.testId) {

            this.chargeslist = this.chargeslist.filter(
                item => item.parameterId !== paraid
            );

            this.ChargeList = this.ChargeList.filter(
                item => item.parameterId !== paraid
            );
        }

        this.DSTestList.data = [...this.ChargeList];
        this.dsTemparoryList.data = [...this.ChargeList];
        this.DSTestListtemp.data = [...this.chargeslist];
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

        if (!row || !row.parameterId) {
            console.error("Invalid row data!");
            return;
        }

        if (!this.chargeslist)
            this.chargeslist = [];

        if (this.chargeslist.length > 0 && this.chargeslist.length != 1) {
            const isDuplicate = this.chargeslist.some(ele => ele.parameterId === row.parameterId);

            if (isDuplicate) {
                this.toastr.warning('Selected Parameter already added in the list', 'Warning!', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }

        this.chargeslist.push(row);

        this.addparameterdata(row);
        // debugger
        this.DSTestListtemp.data = [...this.chargeslist];
        this.DSTestListtemp.sort = this.sort;
        this.DSTestListtemp.paginator = this.paginator;
    }

    addparameterdata(row) {
        debugger
        this.ChargeList = this.DSTestList.data || [];

        const exists = this.ChargeList.some(item => item.ParameterID === row.parameterId);
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
            const isDuplicate = this.chargeslist.some(ele => ele.testId === row.testId);

            if (isDuplicate) {
                this.toastr.warning('Selected SubTest already added in the list', 'Warning!', {
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
        const param = {
            "first": 0,
            "rows": 999,
            "sortField": "TestId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "TestId",
                    "fieldValue": String(row.testId),
                    "opType": "Equals"
                }
            ],
            "exportType": "JSON",
            "columns": []
        };

        this._TestmasterService.getIsSubTestDetaileList(param).subscribe(data => {
            const apiData = data.data as TestList[] || [];
            console.log('API returned:', apiData);
            if (!this.ChargeList) this.ChargeList = [];

            const newItems = apiData.length > 0 ? apiData : [{
                parameterID: row.parameterId || 0,
                parameterName: row.parameterName,
                subTestID: row.subTestID || 0,
                testId: row.testId || 0
                // testName:row.testName
            }];
            this.ChargeList = [...this.ChargeList, ...newItems];

            this.DSTestList.data = [...this.ChargeList];
            this.dsTemparoryList.data = [...this.ChargeList];

            console.log('Merged final list:', this.ChargeList);
        });
    }

    CategoryId = 0;
    // ServiceID=0;

    selectChangeCategoryId(obj: any) {
        this.CategoryId = obj;
    }
    selectChangeServiceID(obj: any) {
        if (obj.status == 'Completed') {
            const name = obj.serviceName;
            Swal.fire({
                icon: 'warning',
                title: 'Test already completed',
                text: `This ${name} already has an Test.`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6'
            });
            this.testForm.get('ServiceId')?.setValue(0)
            return;
        }
        debugger
        this.ServiceID = obj.serviceId;
        if (this.ServiceID == 0) {
            this.testForm.get('ServiceId')?.setValidators([Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()])
            this.testForm.get('ServiceId')?.updateValueAndValidity();
        }
    }
    selectChangeTemplateName(obj: any) {
        this.TemplateId = obj;
    }

    onClose(val: boolean) {
        this._TestmasterService.is_Test = true;
        this._TestmasterService.is_subtest = false;
        this._TestmasterService.is_templatetest = false;

        this.testForm.reset({ Status: 1 });
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