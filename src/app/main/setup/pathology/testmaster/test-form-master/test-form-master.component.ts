import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { TemplatedetailList, TestList, TestMaster } from "../testmaster.component";
import { TestmasterService } from "../testmaster.service";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { DatePipe } from "@angular/common";

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

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    subTestList = new MatTableDataSource<TestList>();
    DSsubTestListtemp = new MatTableDataSource<TestList>();
    dsTemparoryList = new MatTableDataSource<TestList>();
    DSTestMasterList = new MatTableDataSource<TestMaster>();


    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = ['parameterName'];
    displayedColumns2: string[] = ['Reorder', 'ParameterName', 'PrintParameterName', 'MethodName', 'UnitName', 'ParaMultipleRange', 'Formula', 'IsNumeric', 'Action'];
    displayedColumns3: string[] = ['Template Name', 'Add'];
    displayedColumns4: string[] = ['ParameterName'];
    displayedColumns5: string[] = ['TemplateName', 'Action'];

    autocompleteModeCategoryId: string = "ItemCategory";
    autocompleteModeServiceID: string = "Service";
    autocompleteModeTemplate: string = "Template";

    selectedItems: any;
    registerObj: any;
    vTestId: any;
    TemplateId: any = 0;
    // /////////////////////////////////

    ParameterName: any = '';
    Parametercmb: any = [];
    paraselect: any = ["new"];
    CategorycmbList: any = [];
    TemplateList: any = [];
    ServicecmbList: any = [];
    msg: any;
    ChargeList: any = [];
    DSTestList = new MatTableDataSource<TestList>();
    DSTestListtemp = new MatTableDataSource<TestList>();


    Templatetdatasource = new MatTableDataSource<TemplatedetailList>();
    paramterList: any = new MatTableDataSource<TestList>();

    vCategoryId: any;
    ServiceID: any = 0;

    filteredOptionsCategory: Observable<string[]>;
    optionscategory: any[] = [];
    iscategorySelected: boolean = false;

    filteredOptionsService: Observable<string[]>;
    optionsservice: any[] = [];
    isserviceSelected: boolean = false;
    serviceflag: boolean = true;

    optionsTemplate: any[] = [];
    isTemplate: any;
    Subtest: any;
    vTemplateName: any;
    chargeslist: any = [];

    public parameternameFilterCtrl: FormControl = new FormControl();
    public filteredParametername: ReplaySubject<any> = new ReplaySubject<any>(1);

    isTemplateNameSelected: boolean = false;
    filteredOptionsisTemplate: Observable<string[]>;

    private _onDestroy = new Subject<void>();
    sIsLoading: string;
    isChecked = false;
    @ViewChild('auto1') auto1: MatAutocomplete;
    @ViewChild('auto2') auto2: MatAutocomplete;
    Statusflag: any = false;
    isActive: boolean = true;
    vFootNote:any;
    vSuggestionNote:any;
    vTestName:any;
    // ///////////////////////

    constructor(
        public _TestmasterService: TestmasterService,
        public dialogRef: MatDialogRef<TestFormMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        
        this.testForm = this._TestmasterService.createPathtestForm();
        this.testForm.markAllAsTouched();

        this.templatedetailsForm = this._TestmasterService.templatedetailsForm();
        this.testdetailsForm = this._TestmasterService.testdetailsForm();
        this.testForm.get("Status").setValue(1)
        // this.testForm.reset({Status:[1]});
        debugger
        if (this.data) {
            this.registerObj = this.data;
            console.log(this.registerObj);
            this.vTestId = this.registerObj.testId
            this.vTestName=this.registerObj.testName
            this.TemplateId = this.registerObj.TemplateId;
            this.isActive=this.registerObj.isdeleted;

            if (this.registerObj.isTemplateTest === "0" && !this.registerObj.isSubTest) {
                this._TestmasterService.is_subtest = false;
                this.Statusflag = false;
                this._TestmasterService.is_templatetest = false;
                this.testForm.get("Status").setValue(1);
                this._TestmasterService.is_Test=true
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

    getOptionTextTemplate(option) {

        return option && option.TemplateName ? option.TemplateName : '';
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
        debugger
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
            "exportType": "JSON"
        }

        this._TestmasterService.getTestListfor(m_data).subscribe(Visit => {
            console.log("VisittestList:",Visit.data)
            this.DSTestList.data = Visit.data as TestList[];
            console.log(this.DSTestList.data)
            this.dsTemparoryList.data = Visit as TestList[];
        });

    }

    // wroung api list used
    fetchSubTestlist(obj) {
        debugger
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
            "exportType": "JSON"
        }

        this._TestmasterService.getSubTestList(m_data).subscribe(Visit => {
            console.log("VisitSubtestList:",Visit.data)
            this.DSTestList.data = Visit.data as TestList[];
            console.log(this.DSTestList.data)
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
        debugger
        var m_data =  {
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
            "exportType": "JSON"
        }
        this._TestmasterService.getTemplateListfor(m_data).subscribe(Visit => {
            console.log("VisitTemplateList:",Visit.data)
            this.Templatetdatasource.data = Visit.data as TemplatedetailList[];
            console.log(this.Templatetdatasource.data)
            // this.dsTemparoryList.data = Visit as TestList[];
        });

    }

    invalidFields1 = [];

    onSubmit() {
        debugger
        // const currentDate = new Date();
        // const datePipe = new DatePipe('en-US');
        // const formattedTime = datePipe.transform(currentDate, 'shortTime');
        // const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

        if (!this.testForm.invalid) {

            this.invalidFields1 = [];

            // Check table data validation
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
                return; // Stop further processing if there are errors
            }

            if(!this.vTestId){
            let mPathTemplateDetails = this.Templatetdatasource.data.map((row: any) => ({
                "PtemplateId": 0,
                "TestId": 0,
                "TemplateId": row.templateId,
            }));
            let mPathTestDetailMasters = this.DSTestList.data.map((row: any) => ({
                "TestDetId": 0,
                "TestId": row.testId || 0,
                "SubTestId": row.subTestID || 0,
                "ParameterId": row.parameterID || row.parameterId
            }));


            

            var mdata = {
                "TestId": 0,
                "TestName": this.testForm.get("TestName").value || "",
                "PrintTestName": this.testForm.get("PrintTestName").value || "",
                "CategoryId": this.testForm.get("CategoryId").value || 12,
                "IsSubTest": this.Subtest !== undefined ? this.Subtest : false,//this.testForm.get('IsSubTest').value,
                "TechniqueName": this.testForm.get("TechniqueName").value || "",
                "MachineName": this.testForm.get("MachineName").value || "",
                "SuggestionNote": this.testForm.get("SuggestionNote").value || "",
                "FootNote": this.testForm.get("FootNote").value || "",
                "IsDeleted": Boolean(JSON.parse(this.testForm.get("isActive").value)), //true
                "ServiceId": this.testForm.get("ServiceId").value || 0,
                "IsTemplateTest": this._TestmasterService.is_templatetest ? 1 : 0,//this.testForm.get('IsTemplateTest').value,
                // "TestTime": formattedTime,
                // "TestDate": formattedDate,//"2022-07-11",
                "MPathTemplateDetails": mPathTemplateDetails,
                "MPathTestDetailMasters": mPathTestDetailMasters
            }

            console.log("json of Test:", mdata)
            this._TestmasterService.TestMasterSave(mdata).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClose(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        } else {
            let mPathTemplateDetails = this.Templatetdatasource.data.map((row: any) => ({
                "PtemplateId": 0,
                "TestId": 0,
                "TemplateId": row.templateId, //teplate id is not comming becasue we not using dropdown so
            }));
            let mPathTestDetailMasters = this.DSTestList.data.map((row: any) => ({
                "TestDetId": 0,
                "TestId": row.testId || 0,
                "SubTestId": row.subTestID || 0,
                "ParameterId": row.parameterID || row.parameterId
            }));
            var mdata1 = {
                "TestId": this.vTestId,
                "TestName": this.testForm.get("TestName").value,
                "PrintTestName": this.testForm.get("PrintTestName").value,
                "CategoryId": this.testForm.get("CategoryId").value || 12,
                "IsSubTest": this.Subtest !== undefined ? this.Subtest : false, //this.Subtest, //this.testForm.get('IsSubTest').value,
                "TechniqueName": this.testForm.get("TechniqueName").value,
                "MachineName": this.testForm.get("MachineName").value,
                "SuggestionNote": this.testForm.get("SuggestionNote").value,
                "FootNote": this.testForm.get("FootNote").value,
                "IsDeleted": Boolean(JSON.parse(this.testForm.get("isActive").value)),
                "ServiceId": this.testForm.get("ServiceId").value || 0,
                "IsTemplateTest": this._TestmasterService.is_templatetest ? 1 : 0, //this.testForm.get('IsTemplateTest').value,
                // "TestTime": formattedTime,
                // "TestDate": formattedDate,//"2022-07-11",
                "MPathTemplateDetails": mPathTemplateDetails,
                "MPathTestDetailMasters": mPathTestDetailMasters
            }

            console.log("json of Test:", mdata1)
            this._TestmasterService.TestMasterUpdate(mdata1).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClose(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
          } else {
            this.invalidFields1 = [];
            
            if (this.testForm.invalid) {
              for (const controlName in this.testForm.controls) {
                if (this.testForm.controls[controlName].invalid) {
                  this.invalidFields1.push(`My Form: ${controlName}`);
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
        var param={
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
            "exportType": "JSON"          
          }

        console.log(param);
        this._TestmasterService.getParameterMasterList(param).subscribe(data => {

            this.paramterList.data = data.data as TestList[];;
            this.paramterList.sort = this.sort;
            this.paramterList.paginator = this.paginator;
            console.log("Test List :", this.paramterList.data)
        });
    }

    // isSubtest checkbox list 
    getSubTestMasterList() {
        let parameter = this.testForm.get("ParameterNameSearch").value + "%" || '%';
        var param={
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
            "exportType": "JSON"
          }

        console.log(param);
        this._TestmasterService.getIsSubTestList(param).subscribe(data => {

            this.paramterList.data = data.data as TestList[];;
            this.paramterList.sort = this.sort;
            this.paramterList.paginator = this.paginator;
            console.log("ISSubTest List :", this.paramterList.data)
        });
    }

    chooseFirstOption(auto: MatAutocomplete): void {
        auto.options.first.select();
    }

    onAdd(event) {
        // 
        console.log(event)

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

    DDtemplateId=0
    DDtemplateName=""
    selectChangeTemplate(data){
        console.log(data)
        this.DDtemplateId=data.value
        this.DDtemplateName=data.text
    }
    list = [];

    onAddTemplate() {
        console.log("event is :", event);
        if (!this.list) {
            this.list = [];
        }    
        const newItem = {
            templateId: this.DDtemplateId, //this.templatedetailsForm.get("TemplateId").value, // Ensure correct property name
            templateName: this.DDtemplateName //this.templatedetailsForm.get("TemplateName").value, // Ensure correct property name
        };
    
        this.list.push(newItem);
    
        this.Templatetdatasource.data = [...this.Templatetdatasource.data, newItem];
    
        console.log("Updated list:", this.list);
        console.log("Updated Templatetdatasource:", this.Templatetdatasource.data);
    
        // Reset form fields
        this.templatedetailsForm.get("TemplateId").reset();
        this.templatedetailsForm.get("TemplateName").reset();
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
        // 
        console.log("Adding Parameter:", row);

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

            console.log("Updated DSTestList:", this.DSTestList.data);
        }
    }

    addSubTest(row) {
        

        if (!row || !row.parameterID) {
            console.error("Invalid row data!");
            return;
        }
        if (!this.chargeslist) {
            this.chargeslist = [];
        }
        if (this.chargeslist.length > 0) {
            let isDuplicate = this.chargeslist.some(ele => ele.parameterID === row.parameterID);

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
        
        console.log("Adding Parameter:", row);

        this.ChargeList = this.DSTestList.data || [];

        let exists = this.ChargeList.some(item => item.parameterID === row.parameterID);
        // let exists = this.ChargeList.some(item => item.subTestID === row.subTestID);
        if (!exists) {
            this.ChargeList.push({
                parameterID: row.parameterID,
                parameterName: row.parameterName,
                subTestID: row.subTestID,
                testId: row.testId
            });

            this.DSTestList.data = [...this.ChargeList];
            this.dsTemparoryList.data = [...this.ChargeList];

            console.log("Updated DSTestList:", this.DSTestList.data);
        }
    }

    CategoryId = 0;
    // ServiceID=0;

    selectChangeCategoryId(obj: any) {
        console.log(obj);
        this.CategoryId = obj;
        console.log(this.CategoryId)
    }
    selectChangeServiceID(obj: any) {
        console.log(obj);
        this.ServiceID = obj;
    }
    selectChangeTemplateName(obj: any) {
        console.log(obj);
        this.TemplateId = obj;
    }

    onClose(val: boolean) {
        this.testForm.reset({Status:[1]});
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