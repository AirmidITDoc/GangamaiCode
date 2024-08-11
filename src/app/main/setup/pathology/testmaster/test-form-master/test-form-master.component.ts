import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { map, startWith, takeUntil } from "rxjs/operators";
import { TemplatedetailList, TestMaster, TestmasterComponent } from "../testmaster.component";
import { TestmasterService } from "../testmaster.service";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table";
import { element } from "protractor";
import { ToastrService } from "ngx-toastr";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PainAssesList } from "app/main/nursingstation/clinical-care-chart/clinical-care-chart.component";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { AuthenticationService } from "app/core/services/authentication.service";


@Component({
    selector: "app-test-form-master",
    templateUrl: "./test-form-master.component.html",
    styleUrls: ["./test-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TestFormMasterComponent implements OnInit {
    displayedColumns: string[] = ['ParameterName', 'Add'];
    displayedColumns2: string[] = ['Reorder', 'ParameterName','PrintParameterName', 'MethodName','UnitName', 'ParaMultipleRange','Formula','IsNumeric', 'Action'];
    displayedColumns3: string[] = ['Template Name', 'Add'];
    displayedColumns4: string[] = ['ParameterName'];
    displayedColumns5: string[] = ['TemplateName', 'Action'];

    Parametercmb: any = [];
    paraselect: any = ["new"];
    CategorycmbList: any = [];
    TemplateList: any = [];
    ServicecmbList: any = [];
    msg: any;
    ChargeList: any = [];
    registerObj: any;
    DSTestList = new MatTableDataSource<TestList>();
    subTestList = new MatTableDataSource<TestList>();
    dsTemparoryList = new MatTableDataSource<TestList>();
    DSTestMasterList = new MatTableDataSource<TestMaster>();

    Templatetdatasource = new MatTableDataSource<TemplatedetailList>();
    paramterList: any = new MatTableDataSource<TestList>();

    vCategoryId: any;
    ServiceID: any;

    filteredOptionsCategory: Observable<string[]>;
    optionscategory: any[] = [];
    iscategorySelected: boolean = false;

    filteredOptionsService: Observable<string[]>;
    optionsservice: any[] = [];
    isserviceSelected: boolean = false;
    TestId: any;
    TemplateId: any;
    optionsTemplate: any[] = [];
    isTemplate: any;
    Subtest: any;
    //parametername filter
    public parameternameFilterCtrl: FormControl = new FormControl();
    public filteredParametername: ReplaySubject<any> = new ReplaySubject<any>(1);

    isTemplateNameSelected: boolean = false;
    filteredOptionsisTemplate: Observable<string[]>;

    private _onDestroy = new Subject<void>();
    sIsLoading: string;
    isChecked = false;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('auto1') auto1: MatAutocomplete;
    @ViewChild('auto2') auto2: MatAutocomplete;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    constructor(
        public _TestService: TestmasterService,
        public toastr: ToastrService,
        private accountService: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<TestmasterComponent>
    ) { }

    ngOnInit(): void {
        if (this.data) {
            this.registerObj = this.data.registerObj;
            console.log(this.registerObj);
            this.TestId = this.registerObj.TestId
            this.TemplateId = this.registerObj.TemplateId;

            if (!this.registerObj.IsTemplateTest && !this.registerObj.IsSubTest) {
                this._TestService.is_subtest = false;
                this.Statusflag = false;
                this._TestService.is_templatetest = false;
                this.fetchTestlist();

            } else if (this.registerObj.IsTemplateTest) {
                this._TestService.is_templatetest = true;
                this._TestService.is_subtest = false;
                this._TestService.is_Test = false;
                this.Statusflag = true;
                this.fetchTemplate()

            }else if(!this.registerObj.IsTemplateTest && this.registerObj.IsSubTest){
                this.Subtest = this.registerObj.IsSubTest
                this.Statusflag = false;
                this._TestService.is_templatetest = false;
                this._TestService.is_subtest = true;
                this._TestService.is_Test = false;
                this.fetchTestlist();
            }
            
            this._TestService.populateForm(this.registerObj);
        }

        this.getcategoryNameCombobox();
        this.getserviceNameCombobox();
        this.getParameterNameCombobox();
        this.getCategoryNameCombobox();
        this.getServiceNameCombobox();
        this.getTemplateList();

        this.parameternameFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterParametername();
            });



        this.filteredOptionsCategory = this._TestService.myform.get('CategoryId').valueChanges.pipe(
            startWith(''),
            map(value => this._filtercategory(value)),
        );
        this.filteredOptionsService = this._TestService.myform.get('ServiceID').valueChanges.pipe(
            startWith(''),
            map(value => this._filterservice(value)),
        );

    }


    fetchTestlist() {
      
        var m_data={
            "TestId":this.TestId
        }
        this._TestService.getTestListfor(m_data).subscribe(Visit => {
            console.log(Visit)
            this.DSTestList.data = Visit as TestList[];
        });
        console.log(this.DSTestList.data)
    }

    fetchTemplate() {
        debugger
        var m_data={
            "TestId":this.TestId
        }
        this._TestService.getTemplateListfor(m_data).subscribe(Visit => {
            this.Templatetdatasource.data = Visit as TemplatedetailList[];
        });
        console.log(this.Templatetdatasource.data)
    }



    drop(event: CdkDragDrop<string[]>) {
        this.DSTestList.data = [];
        this.ChargeList = this.dsTemparoryList.data;
        moveItemInArray(this.ChargeList, event.previousIndex, event.currentIndex);
        this.DSTestList.data = this.ChargeList;
    }
    toggle(val) {

        if (val == "1") {
            this._TestService.is_Test = true;
            this.Subtest = 0
            this.Statusflag = false;
            this._TestService.is_templatetest = false;
        } else if (val == "2") {
            this._TestService.is_subtest = true;
            this._TestService.is_Test = false;
            this.Subtest = 1
            this._TestService.is_templatetest = false;
        } else if (val == "3") {
            this._TestService.is_templatetest = true;
            this._TestService.is_subtest = false;
            this._TestService.is_Test = false;
            this.Statusflag = true;
        }


    }



    onSearchClear() {
        this._TestService.myformSearch.reset({
            TestNameSearch: "",
            IsDeletedSearch: "2",
           
        });

        this._TestService.myform.reset();
        this.getParameterNameCombobox();
    }
    onSearch() {
        debugger
        if(this._TestService.myform.get("IsSubTest").value == !this.isChecked)
        this.getParameterNameCombobox();
    else
        this.getSubTestMasterList();
    }


    // parameter filter
    private filterParametername() {
        if (!this.Parametercmb) {
            return;
        }
        // get the search keyword
        let search = this.parameternameFilterCtrl.value;
        if (!search) {
            this.filteredParametername.next(this.Parametercmb.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredParametername.next(
            this.Parametercmb.filter(
                (bank) => bank.ParameterName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    getParameterNameCombobox() {
        this._TestService.getParameterMasterCombo()
            .subscribe((data) => {
                this.paramterList.data = data;
                ;
                this.Parametercmb = data;
            });
        // console.log(this.Parametercmb);
    }



    getCategoryNameCombobox() {

        this._TestService.getCategoryMasterCombo().subscribe((data) => {
            this.CategorycmbList = data;
            if (this.data) {
                const toSelectId = this.CategorycmbList.find(c => c.CategoryId == this.registerObj.CategoryId);
                this._TestService.myform.get('CategoryId').setValue(toSelectId);

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
        this._TestService.getCategoryMasterCombo().subscribe(data => {
            this.CategorycmbList = data;
            this.optionscategory = this.CategorycmbList.slice();
            this.filteredOptionsCategory = this._TestService.myform.get('CategoryId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filtercategory(value) : this.CategorycmbList.slice()),
            );
        });
    }

    getServiceNameCombobox() {

        this._TestService.getServiceMasterCombo().subscribe((data) => {
            this.ServicecmbList = data;
            if (this.data) {
                const toSelectId = this.ServicecmbList.find(c => c.ServiceId == this.registerObj.ServiceID);
                this._TestService.myform.get('ServiceID').setValue(toSelectId);

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
        this._TestService.getServiceMasterCombo().subscribe(data => {
            this.ServicecmbList = data;
            this.optionsservice = this.ServicecmbList.slice();
            this.filteredOptionsService = this._TestService.myform.get('ServiceID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterservice(value) : this.ServicecmbList.slice()),
            );
        });
    }

    chooseFirstOption(auto: MatAutocomplete): void {
        auto.options.first.select();
    }



    getSubTestMasterList() {
        debugger
        
        var m_dat={
            TestName:this._TestService.myform.get('ParameterNameSearch').value + "%" || '%'
        }
        this._TestService.getNewSubTestList(m_dat).subscribe((Menu) => {
            this.subTestList.data = Menu as TestList[];
          
        });

        if(this.subTestList.data.length > 0){
            this.paramterList.data=[];
            debugger
            this.paramterList.data=this.subTestList.data;

        // this.subTestList.data.forEach((element) => {
        //    let i=0;
        //     debugger
        //     this.paramterList.data[i]["ParameterName"]=element.TestName
        //     i++;
        // });
        }

        console.log(this.subTestList.data)
        console.log(this.paramterList.data)
      
    }
       
    

    list = [];
    onAddTemplate() {
        this.list.push(
            {
                TemplateId:this._TestService.mytemplateform.get("TemplateName").value.TemplateId,
                TemplateName: this._TestService.mytemplateform.get("TemplateName").value.TemplateName,
            });
        this.Templatetdatasource.data = this.list
        this._TestService.mytemplateform.get('TemplateName').reset();
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




    onAdd(event) {
        console.log(event)
      
        // for parameters
        this.DSTestList.data = [];
        this.ChargeList = this.dsTemparoryList.data;
        this.isTemplate = this.ChargeList.IsTemplateTest

        this.ChargeList.push(
            {
                ParameterID: event.ParameterID,
                ParameterName: event.ParameterName || "",
            });
        this.DSTestList.data = this.ChargeList;

        let temp = this.paramterList.data;
        this.paramterList.data = []
        temp.splice(temp.findIndex(item => item.ParameterName === event.ParameterName), 1);
        this.paramterList.data = temp;

    }

    Statusflag: any = false;

    onSubmit() {

        if ((this.ServiceID == '' || this.ServiceID == null || this.ServiceID == undefined)) {
            this.toastr.warning('Please select valid Service Name ', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }
          if ((this.vCategoryId == '' || this.vCategoryId == null || this.vCategoryId == undefined)) {
            this.toastr.warning('Please select valid Category Name ', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }

        let submitData
        debugger
        if (!this.Statusflag) {

            if(this.DSTestList.data.length ==0){
                this.toastr.warning('Please select valid Test Data', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                  });
                  return;
            }

            if (!this._TestService.myform.get("TestId").value) {

                let insertPathologyTestMaster = {};

                insertPathologyTestMaster['testName'] = this._TestService.myform.get('TestName').value || "";
                insertPathologyTestMaster['printTestName'] = this._TestService.myform.get('PrintTestName').value || "";
                insertPathologyTestMaster['categoryId'] = this._TestService.myform.get('CategoryId').value.CategoryId || 0;
                insertPathologyTestMaster['isSubTest'] = this.Subtest// this._TestService.myform.get('IsSubTest').value;
                insertPathologyTestMaster['techniqueName'] = this._TestService.myform.get('TechniqueName').value || "";
                insertPathologyTestMaster['machineName'] = this._TestService.myform.get('MachineName').value || "";
                insertPathologyTestMaster['suggestionNote'] = this._TestService.myform.get('SuggestionNote').value || "";
                insertPathologyTestMaster['footNote'] = this._TestService.myform.get('FootNote').value || "";
                insertPathologyTestMaster['isDeleted'] = this._TestService.myform.get('IsDeleted').value || "";
                insertPathologyTestMaster['addedBy'] = this.accountService.currentUserValue.user.id,
                    insertPathologyTestMaster['serviceId'] = this._TestService.myform.get('ServiceID').value.ServiceId || 0;
                insertPathologyTestMaster['isTemplateTest'] = this.Statusflag;
                insertPathologyTestMaster['testId'] = 0;


                let pathTestDetailMaster = []

                this.DSTestList.data.forEach((element) => {

                    let PathDetailsObj = {};
                    PathDetailsObj['testId'] = 0;
                    PathDetailsObj['subTestID'] = 0;
                    PathDetailsObj['parameterID'] = element.ParameterID || 0;

                    pathTestDetailMaster.push(PathDetailsObj);
                });

                console.log(pathTestDetailMaster)
                if (!this.Statusflag) {

                    submitData = {
                        "insertPathologyTestMaster": insertPathologyTestMaster,
                        "pathTestDetailMaster": pathTestDetailMaster

                    };
                }
                console.log(submitData)
                this._TestService.insertPathologyTestMaster(submitData).subscribe(response => {
                    if (response) {
                        this.toastr.success('Record Saved Successfully.', 'Saved !', {
                            toastClass: 'tostr-tost custom-toast-success',
                        });
                        this.onClose();

                    } else {
                        this.toastr.error('New Test Master Data not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    }
                }, error => {
                    this.toastr.error('New Test Master Data not saved !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                });
            }
            else {

                let updatePathologyTestMaster = {};

                updatePathologyTestMaster['testName'] = this._TestService.myform.get('TestName').value || "";
                updatePathologyTestMaster['printTestName'] = this._TestService.myform.get('PrintTestName').value || "";
                updatePathologyTestMaster['categoryId'] = this._TestService.myform.get('CategoryId').value.CategoryId || 0;
                updatePathologyTestMaster['isSubTest'] = this.Subtest,// this._TestService.myform.get('IsSubTest').value;
                    updatePathologyTestMaster['techniqueName'] = this._TestService.myform.get('TechniqueName').value || "";
                updatePathologyTestMaster['machineName'] = this._TestService.myform.get('MachineName').value || "";
                updatePathologyTestMaster['suggestionNote'] = this._TestService.myform.get('SuggestionNote').value || "";
                updatePathologyTestMaster['footNote'] = this._TestService.myform.get('FootNote').value || "";
                updatePathologyTestMaster['isDeleted'] = this._TestService.myform.get('IsDeleted').value || "";
                updatePathologyTestMaster['updatedBy'] = this.accountService.currentUserValue.user.id,
                    updatePathologyTestMaster['serviceId'] = this._TestService.myform.get('ServiceID').value.ServiceId || 0;
                updatePathologyTestMaster['isTemplateTest'] = this.Statusflag;
                updatePathologyTestMaster['testId'] = this.TestId;


                let pathTestDetailMaster = [];
                this.DSTestList.data.forEach((element) => {

                    let PathDetailsObj = {};
                    PathDetailsObj['testId'] = this.TestId;
                    PathDetailsObj['subTestID'] = 0;
                    PathDetailsObj['parameterID'] = element.ParameterID || 0;


                    pathTestDetailMaster.push(PathDetailsObj);
                });

                let submitData;

                if (!this.Statusflag) {

                    let pathTestDetDeletesObj = {};
                    pathTestDetDeletesObj['testId'] = this.TestId;

                    submitData = {
                        "updatePathologyTestMaster": updatePathologyTestMaster,
                        "pathTestDetDelete": pathTestDetDeletesObj,
                        "pathTestDetailMaster": pathTestDetailMaster

                    };
                }

                console.log(submitData)
                this._TestService.updatePathologyTestMaster(submitData).subscribe(response => {
                    if (response) {
                        this.toastr.success('Record Updated Successfully.', 'Saved !', {
                            toastClass: 'tostr-tost custom-toast-success',
                        });
                        this.onClose();
                        // this.onClear()

                    } else {
                        this.toastr.error('New Test Master Data not Updated !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    }
                }, error => {
                    this.toastr.error('New Test Master Data not Updated !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                });

            }
        }
        else {
            if (!this._TestService.myform.get("TestId").value) {

                
            if(this.Templatetdatasource.data.length ==0){
                this.toastr.warning('Please select valid Template Data', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                  });
                  return;
            }

                let insertPathologyTestMaster = {};

                insertPathologyTestMaster['testName'] = this._TestService.myform.get('TestName').value || "";
                insertPathologyTestMaster['printTestName'] = this._TestService.myform.get('PrintTestName').value || "";
                insertPathologyTestMaster['categoryId'] = this._TestService.myform.get('CategoryId').value.CategoryId || 0;
                insertPathologyTestMaster['isSubTest'] = this.Subtest// this._TestService.myform.get('IsSubTest').value;
                insertPathologyTestMaster['techniqueName'] = this._TestService.myform.get('TechniqueName').value || "";
                insertPathologyTestMaster['machineName'] = this._TestService.myform.get('MachineName').value || "";
                insertPathologyTestMaster['suggestionNote'] = this._TestService.myform.get('SuggestionNote').value || "";
                insertPathologyTestMaster['footNote'] = this._TestService.myform.get('FootNote').value || "";
                insertPathologyTestMaster['isDeleted'] = this._TestService.myform.get('IsDeleted').value || "";
                insertPathologyTestMaster['addedBy'] = this.accountService.currentUserValue.user.id,
                    insertPathologyTestMaster['serviceId'] = this._TestService.myform.get('ServiceID').value.ServiceId || 0;
                insertPathologyTestMaster['isTemplateTest'] = this.Statusflag;
                insertPathologyTestMaster['testId'] = 0;


                let pathologyTemplateTest = []

                this.Templatetdatasource.data.forEach((element) => {
                    let PathDetailsObj = {};
                    PathDetailsObj['TestId'] = 0;
                    PathDetailsObj['TemplateId'] = element.TemplateId;
                    pathologyTemplateTest.push(PathDetailsObj);
                });

                submitData = {
                    "insertPathologyTestMaster": insertPathologyTestMaster,
                    "pathologyTemplateTest": pathologyTemplateTest

                };

                console.log(submitData)
                this._TestService.insertPathologyTestMaster(submitData).subscribe(response => {
                    if (response) {
                        this.toastr.success('Record Saved Successfully.', 'Saved !', {
                            toastClass: 'tostr-tost custom-toast-success',
                        });
                        this.onClose();

                    } else {
                        this.toastr.error('New Test Master Data not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    }
                },
                    error => {
                        this.toastr.error('New Test Master Data not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    });
            }
            else {

                let updatePathologyTestMasterobj = {};

                updatePathologyTestMasterobj['testName'] = this._TestService.myform.get('TestName').value || "";
                updatePathologyTestMasterobj['printTestName'] = this._TestService.myform.get('PrintTestName').value || "";
                updatePathologyTestMasterobj['categoryId'] = this._TestService.myform.get('CategoryId').value.CategoryId || 0;
                updatePathologyTestMasterobj['isSubTest'] = this.Subtest,// this._TestService.myform.get('IsSubTest').value;
                    updatePathologyTestMasterobj['techniqueName'] = this._TestService.myform.get('TechniqueName').value || "";
                updatePathologyTestMasterobj['machineName'] = this._TestService.myform.get('MachineName').value || "";
                updatePathologyTestMasterobj['suggestionNote'] = this._TestService.myform.get('SuggestionNote').value || "";
                updatePathologyTestMasterobj['footNote'] = this._TestService.myform.get('FootNote').value || "";
                updatePathologyTestMasterobj['isDeleted'] = this._TestService.myform.get('IsDeleted').value || "";
                updatePathologyTestMasterobj['updatedBy'] = this.accountService.currentUserValue.user.id,
                    updatePathologyTestMasterobj['serviceId'] = this._TestService.myform.get('ServiceID').value.ServiceId || 0;
                updatePathologyTestMasterobj['isTemplateTest'] = this.Statusflag;
                updatePathologyTestMasterobj['testId'] = this.TestId;


                let pathTestDetailMaster = [];

                this.DSTestList.data.forEach((element) => {
                    let UpdatePathDetailsObj = {};
                    let PathDetailsObj = {};
                    PathDetailsObj['TestId'] = this.TestId;
                    PathDetailsObj['TemplateId'] = 0;

                    pathTestDetailMaster.push(PathDetailsObj);
                });

                let pathTemplateDetDelete = {}
                pathTemplateDetDelete['testId'] = this.TestId;

                let updatePathologyTemplate = {};
                updatePathologyTemplate['testId'] = this.TestId;
                updatePathologyTemplate['templateId'] = this.TemplateId;

                submitData = {
                    "updatePathologyTestMaster": updatePathologyTestMasterobj,
                    "pathTemplateDetDelete": pathTemplateDetDelete,
                    "updatePathologyTemplateTest": updatePathologyTemplate

                };


                console.log(submitData)
                this._TestService.updatePathologyTestMaster(submitData).subscribe(response => {
                    if (response) {
                        this.toastr.success('Record Updated Successfully.', 'Saved !', {
                            toastClass: 'tostr-tost custom-toast-success',
                        });
                        this.onClose();
                        // this.onClear()

                    } else {
                        this.toastr.error('New Test Master Data not Updated !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    }
                }, error => {
                    this.toastr.error('New Test Master Data not Updated !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                });

            }

        }



    }


    getTemplateList() {

        this._TestService.getTemplateCombo().subscribe(data => {
            this.TemplateList = data;
            this.optionsTemplate = this.TemplateList.slice();
            this.filteredOptionsisTemplate = this._TestService.mytemplateform.get('TemplateName').valueChanges.pipe(
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




    onClose() {
        this._TestService.myform.reset();
        this.dialogRef.close();
    }

    selectdrop(args) {
        console.log(this.selectedItems);
        this.selectedItems = this.selectedItems.concat(args);

        console.log(this.selectedItems);
        this.selectedToAdd = [];
    }

    //for parameter list
    selectedToAdd: any;
    selectedToRemove: any;
    selectedItems: any = [];
    groupsArray: any = [];

    // AddData(txt) {
    //     this.selectedItems = this.selectedItems.concat(txt);
    //     this.selectedToAdd = [];
    // }

    // assign() {
    //     // ;
    //     this.selectedItems = this.selectedItems.concat(this.selectedToAdd);
    //     this.Parametercmb = this.Parametercmb.filter((selectedData) => {
    //         return this.selectedItems.indexOf(selectedData) < 0;
    //     });
    //     this.selectedToAdd = [];
    //     console.log(this.selectedItems);
    // }

    // unassign() {
    //     this.Parametercmb = this.Parametercmb.concat(this.selectedToRemove);
    //     this.selectedItems = this.selectedItems.filter((selectedData) => {
    //         return this.Parametercmb.indexOf(selectedData) < 0;
    //     });
    //     this.selectedToRemove = [];
    // }

    //  for Template list
    // selectedToAdd1: any;
    // selectedToRemove1: any;
    // selectedItems1: any = [];
    // groupsArray1: any = [];

    // AddData1(txt) {
    //     this.selectedItems1 = this.selectedItems1.concat(txt);
    //     this.selectedToAdd1 = [];
    // }

    // assign1() {
    //     this.selectedItems1 = this.selectedItems1.concat(this.selectedToAdd1);
    //     this.TemplatecmbList = this.TemplatecmbList.filter((selectedData1) => {
    //         return this.selectedItems1.indexOf(selectedData1) < 0;
    //     });
    //     this.selectedToAdd1 = [];
    //     console.log(this.selectedItems1);
    // }

    // unassign1() {
    //     this.TemplatecmbList = this.TemplatecmbList.concat(
    //         this.selectedToRemove1
    //     );
    //     this.selectedItems1 = this.selectedItems1.filter((selectedData1) => {
    //         return this.TemplatecmbList.indexOf(selectedData1) < 0;
    //     });
    //     this.selectedToRemove1 = [];
    // }
}
export class TestList {
    ParameterName: any;
    ParameterID: number;
    PrintParameterName: any;
    MethodName: any;
    UnitName: any;
    ParaMultipleRange: any;
    Formula: any;
    IsNumeric: any;
    TestName:any
    /**
     * Constructor
     *
     * @param TestList
     */
    constructor(TestList) {
        {
            this.ParameterID = TestList.ParameterID || "";
            this.ParameterName = TestList.ParameterName || "";
            this.PrintParameterName = TestList.PrintParameterName || "";
            this. MethodName = TestList. MethodName || "";
            this. UnitName = TestList. UnitName || "";
            this. ParaMultipleRange = TestList. ParaMultipleRange || "";
            this. Formula = TestList. Formula || "";
            this. IsNumeric = TestList. IsNumeric || "";
            this. TestName = TestList. TestName || "";
        }
    }
}
