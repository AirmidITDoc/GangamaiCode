import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import {  TemplatedetailList, TestList, TestMaster } from "../testmaster.component";
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


    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator) paginator:MatPaginator;

    displayedColumns: string[] = ['parameterName'];
    displayedColumns2: string[] = ['Reorder', 'ParameterName', 'PrintParameterName', 'MethodName', 'UnitName', 'ParaMultipleRange', 'Formula', 'IsNumeric', 'Action'];
    displayedColumns3: string[] = ['Template Name', 'Add'];
    displayedColumns4: string[] = ['ParameterName'];
    displayedColumns5: string[] = ['TemplateName', 'Action'];

    autocompleteModeCategoryId:string="CategoryName";
    autocompleteModeServiceID:string="ServiceName";    
    autocompleteModeTemplate:string="TemplateName";

    selectedItems: any;
    registerObj: any;
    TestId: any;
    TemplateId: any=0;
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
    vTemplateName:any;

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
isActive: any;
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
        this.templatedetailsForm = this._TestmasterService.templatedetailsForm();
        this.testdetailsForm = this._TestmasterService.testdetailsForm();

        if (this.data) {
            this.registerObj = this.data.registerObj;
            console.log(this.registerObj);
            this.TestId = this.registerObj.TestId
            this.TemplateId = this.registerObj.TemplateId;
            
            if (!this.registerObj.IsTemplateTest && !this.registerObj.IsSubTest) {
                this._TestmasterService.is_subtest = false;
                this.Statusflag = false;
                this._TestmasterService.is_templatetest = false;
                 this.testForm.get("Status").setValue(1);
                this.fetchTestlist();

            } else if (this.registerObj.IsTemplateTest) {
                this._TestmasterService.is_templatetest = true;
                this._TestmasterService.is_subtest = false;
                this._TestmasterService.is_Test = false;
                this.Statusflag = true;
                this.testForm.get("Status").setValue(3);
                this.fetchTemplate()

            } else if (!this.registerObj.IsTemplateTest && this.registerObj.IsSubTest) {
                this.Subtest = this.registerObj.IsSubTest
                this.Statusflag = false;
                this._TestmasterService.is_templatetest = false;
                this._TestmasterService.is_subtest = true;
                this._TestmasterService.is_Test = false;
                this.serviceflag = false;
                this.testForm.get("Status").setValue(2);
                this.fetchTestlist();
            }

            // this._TestmasterService.populateForm(this.registerObj);
            // this.getcategoryNameCombobox();
            // this.getServiceNameCombobox();

        }

        this.getParameterList();
        var m_data = {
          testId: this.data?.testId,
          unitName: this.data?.unitName.trim(),
        //   printSeqNo: this.data?.printSeqNo,
        //   isconsolidated: JSON.stringify(this.data?.isconsolidated),
        //   isConsolidatedDR: JSON.stringify(this.data?.isConsolidatedDR),
        // isDeleted: JSON.stringify(this.data?.isActive),
        };
        this.testForm.patchValue(m_data);
    }

    getOptionTextTemplate(option) {

        return option && option.TemplateName ? option.TemplateName : '';
    }

    toggle(val) {

        if (val == "1") {
            this._TestmasterService.is_Test = true;
            this.Subtest = 0
            this.Statusflag = false;
            this.serviceflag = true;
            this._TestmasterService.is_templatetest = false;
        } else if (val == "2") {
            this._TestmasterService.is_subtest = true;
            this._TestmasterService.is_Test = false;
            this.serviceflag = false;
            this.Subtest = 1
            this._TestmasterService.is_templatetest = false;
        } else if (val == "3") {
            this._TestmasterService.is_templatetest = true;
            this._TestmasterService.is_subtest = false;
            this._TestmasterService.is_Test = false;
            this.Statusflag = true;
            this.serviceflag = true;
        }


    }
    onSearchClear() {

        this.ParameterName = ""
        this.getParameterNameCombobox();
    }
    onSearch() {
        
        if (this.testForm.get("IsSubTest").value != true)
            this.getParameterNameCombobox();
        else
            this.getSubTestMasterList();
    }

    fetchTestlist() {

        var m_data = {
            "TestId": this.TestId
        }
        this._TestmasterService.getTestListfor(m_data).subscribe(Visit => {
          this.DSTestList.data = Visit as TestList[];
          this.dsTemparoryList.data = Visit as TestList[];
        });
       
    }

    fetchTemplate() {
        
        var m_data = {
            "TestId": this.TestId
        }
        this._TestmasterService.getTemplateListfor(m_data).subscribe(Visit => {
            this.Templatetdatasource.data = Visit as TemplatedetailList[];
        });
      
    }

    onSubmit() {
        if (this.testForm.invalid) {
            this.toastr.warning('please check from is invalid', 'Warning !', {
              toastClass:'tostr-tost custom-toast-warning',
          })
          return;
          }else{
            if(!this.testForm.get("TestId").value){
                var data1=[];
                // this.selectedItems.forEach((element) => {
                    let MPathTemplateDetailsObj = {};
                    MPathTemplateDetailsObj["PtemplateId"]=0,
                    MPathTemplateDetailsObj['TestId'] = 11, //this.departmentId;
                    MPathTemplateDetailsObj['TemplateId'] = 12 //this.myForm.get("DoctorId").value ? "0" : this.myForm.get("DoctorId").value || "0";
                    data1.push(MPathTemplateDetailsObj);
                // });
    
                console.log("Insert data1:",data1);
    
                var data2=[];
                // this.selectedItems.forEach((element) => {
                    let MPathTestDetailMastersObj = {};
                    MPathTestDetailMastersObj["TestDetId"]=0,
                    MPathTestDetailMastersObj['TestId'] = 16, //this.departmentId;
                    MPathTestDetailMastersObj['SubTestId'] = 17,
                    MPathTestDetailMastersObj['ParameterId']=19 //this.myForm.get("DoctorId").value ? "0" : this.myForm.get("DoctorId").value || "0";
                    data2.push(MPathTestDetailMastersObj);
                // });
                console.log("Insert data2:",data2);
    
                var mdata={
                    "TestId": 0,
                    "TestName": this.testForm.get("TestName").value,
                    "PrintTestName": this.testForm.get("PrintTestName").value,
                    "CategoryId": 12,
                    "IsSubTest": true,
                    "TechniqueName": this.testForm.get("TechniqueName").value,
                    "MachineName": this.testForm.get("MachineName").value,
                    "SuggestionNote": this.testForm.get("SuggestionNote").value,
                    "FootNote": this.testForm.get("FootNote").value,
                    "IsDeleted": true,
                    "ServiceId": 15,
                    "IsTemplateTest": true,
                    "TestTime": "2022-09-10",
                    "TestDate": "2022-07-11",
                    "MPathTemplateDetails": data1,
                    "MPathTestDetailMasters": data2
                  }
    
                  console.log("json of Test:", mdata)
                    this._TestmasterService.unitMasterSave(mdata).subscribe((response) => {
                    this.toastr.success(response.message);
                    this.onClose(true);
                }, (error) => {
                    this.toastr.error(error.message);
                });
            } else{
                
            }
          }
        
    }

    getParameterList() {
        var param={
          "first": 0,
          "rows": 25,
          sortField: "UnitId",
          sortOrder: 0,
          filters: [
              { fieldName: "parameterName", fieldValue: "", opType: OperatorComparer.Contains },
              { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
              { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
          
          ],
          "exportType": "JSON"
        }
        this._TestmasterService.getParameterMasterList(param).subscribe(data => {
        
          this.DSTestList.data = data.data as TestList[];;
          this.DSTestList.sort = this.sort;
          this.DSTestList.paginator = this.paginator;      
          console.log("Test List :",this.DSTestList.data)
        });
      }

        getOptionTextCategory(option) {
            return option && option.CategoryName ? option.CategoryName : " ";
        }


    getSubTestMasterList() {

        var m_dat = {
            TestName: this.testForm.get('ParameterNameSearch').value + "%" || '%'
        }
        this._TestmasterService.getNewSubTestList(m_dat).subscribe((Menu) => {
            this.subTestList.data = Menu as TestList[];
            this.paramterList.data = Menu;
        });
        console.log(this.subTestList.data)

    }

    getParameterNameCombobox() {
        
        var m_dat = {
            ParameterName: this.testForm.get('ParameterNameSearch').value + "%" || '%'
        }
        this._TestmasterService.getParameterMasterCombo(m_dat).subscribe((data) => {
            this.paramterList.data = data;
            this.Parametercmb = data;
        });
        console.log(this.Parametercmb);
    }

    // getServiceNameCombobox() {

        // this._TestmasterService.getServiceMasterCombo().subscribe((data) => {
        //     this.ServicecmbList = data;
        //     if (this.data) {
        //         const toSelectId = this.ServicecmbList.find(c => c.ServiceId == this.registerObj.ServiceID);
        //         this.testForm.get('ServiceID').setValue(toSelectId);

        //     }

        // });
    // }

    chooseFirstOption(auto: MatAutocomplete): void {
        auto.options.first.select();
    }

      onAdd(event) {
        console.log(event)
        
        if (this.testForm.get("IsSubTest").value) {
            this.addSubTest(event.TestId);

        } else if (!this.testForm.get("IsSubTest").value) {
            this.addParameter(event.ParameterID);
        }

    }

    onDeleteRow(event) {
        let temp = this.paramterList.data;
        temp.push({
            ParameterName: event.ParameterName || "",
        })
        this.paramterList.data = temp;
        temp = this.DSTestList.data;
        this.DSTestList.data = []
        temp.splice(temp.findIndex(item => item.ParameterName === event.ParameterName), 1);
        this.DSTestList.data = temp;


    }

    onDeleteTemplateRow(event) {
        let temp = this.TemplateList.data;
        temp.push({
            TemplateId: event.TemplateId || "",
        })
        this.paramterList.data = temp;
        temp = this.Templatetdatasource.data;
        this.Templatetdatasource.data = []
        temp.splice(temp.findIndex(item => item.TemplateId === event.TemplateId), 1);
        this.Templatetdatasource.data = temp;
        this.toastr.success('Record Deleted Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
    }

    list = [];
    onAddTemplate() {
        this.list.push(
            {
                TemplateId: this.templatedetailsForm.get("TemplateId").value.TemplateId,
                TemplateName: this.templatedetailsForm.get("TemplateName").value.TemplateName,
            });
        this.Templatetdatasource.data = this.list
        this.templatedetailsForm.get('TemplateName').reset();
    }

    addParameter(Id) {
        
        this.DSTestListtemp.data = [];
        let SelectQuery = "select * from lvwPathParaFill where ParameterID = " + Id
        console.log(SelectQuery)
        this._TestmasterService.getquerydata(SelectQuery).subscribe(Visit => {
            this.DSTestListtemp.data = Visit as TestList[];
            this.dsTemparoryList.data = Visit as TestList[];
            console.log(this.DSTestListtemp.data)
            if (this.DSTestListtemp.data.length > 0) {
                
                this.addparameterdata();
            }
        });

        let temp = this.paramterList.data;
        this.paramterList.data = []
        temp.splice(temp.findIndex(item => item.ParameterName === this.DSTestList.data["ParameterName"]), 1);
        this.paramterList.data = temp;
    }

    addparameterdata() {

        this.ChargeList = this.DSTestList.data;
        this.ChargeList.push(
            {
                ParameterID: this.DSTestListtemp.data[0]["ParameterID"],
                ParameterName: this.DSTestListtemp.data[0]["ParameterName"],
            });
        this.DSTestList.data = this.ChargeList;
        this.dsTemparoryList.data = this.ChargeList;
        console.log(this.DSTestList.data)

    }
    addSubTest(Id) {
        
        let SelectQuery = "select * from lvwPathSubTestFill where TestId = " + Id
        console.log(SelectQuery)
        this._TestmasterService.getquerydata(SelectQuery).subscribe(Visit => {
            this.DSsubTestListtemp.data = Visit as TestList[];
            console.log(this.DSsubTestListtemp.data)
            if (this.DSsubTestListtemp.data.length > 0) {
                
                this.addsubtestdata();
            }
        });


        let temp = this.paramterList.data;
        this.paramterList.data = []
        temp.splice(temp.findIndex(item => item.ParameterName === this.DSTestList.data["ParameterName"]), 1);
        this.paramterList.data = temp;

        console.log(this.DSTestList.data)
    }
    
    addsubtestdata() {

        this.ChargeList = this.DSTestList.data;
        this.DSsubTestListtemp.data.forEach((element) => {

            
            this.ChargeList.push(
                {
                    ParameterID: element.ParameterID,
                    ParameterName: element.ParameterName,
                    SubTestID: element.TestId
                });
            this.DSTestList.data = this.ChargeList;
            console.log(this.DSTestList.data)
        });
    }

    CategoryId=0;
    // ServiceID=0;

    selectChangeCategoryId(obj:any){
        console.log(obj);
        this.CategoryId=obj;
    }
    selectChangeServiceID(obj:any){
        console.log(obj);
        this.ServiceID=obj;
    }
    selectChangeTemplateName(obj:any){
        console.log(obj);
        this.TemplateId=obj;
    }

    getValidationCategoryMessages(){
        return {
            CategoryId: [
                { name: "required", Message: "Category is required" }
            ]
        };
    }
    getValidationServiceMessages(){
        return {
            ServiceID: [
                { name: "required", Message: "Service is required" }
            ]
        };
    }
  
    onClose(val: boolean) {
        this.testForm.reset();
        this.dialogRef.close(val);
    }
  }
