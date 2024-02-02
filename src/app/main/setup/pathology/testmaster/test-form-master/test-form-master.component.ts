import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { takeUntil } from "rxjs/operators";
import { TestmasterComponent } from "../testmaster.component";
import { TestmasterService } from "../testmaster.service";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table";
import { element } from "protractor";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-test-form-master",
    templateUrl: "./test-form-master.component.html",
    styleUrls: ["./test-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TestFormMasterComponent implements OnInit {
    displayedColumns: string[] = [
     "ParameterName"    
    ];
    Parametercmb: any = [];
    paraselect: any = ["new"];
    CategorycmbList: any = [];
    TemplatecmbList: any = [];
    ServicecmbList: any = [];
    msg: any;
    ChargeList:any=[];
    registerObj:any;
    DSTestList = new MatTableDataSource<TestList>();
    dsTemparoryList = new MatTableDataSource<TestList>();
    vCategoryId:any;
    //parametername filter
    public parameternameFilterCtrl: FormControl = new FormControl();
    public filteredParametername: ReplaySubject<any> = new ReplaySubject<any>(1);

    //category filter
    public categoryFilterCtrl: FormControl = new FormControl();
    public filteredCategory: ReplaySubject<any> = new ReplaySubject<any>(1);

    //service filter
    public serviceFilterCtrl: FormControl = new FormControl();
    public filteredService: ReplaySubject<any> = new ReplaySubject<any>(1);

    // Template filter
    public templateFilterCtrl: FormControl = new FormControl();
    public filteredTemplate: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    constructor(
        public _TestService: TestmasterService,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<TestmasterComponent>
    ) {}

    ngOnInit(): void {
        if (this.data) {
            this.registerObj = this.data.registerObj;
            console.log(this.registerObj);
            this.vCategoryId = this.registerObj.CategoryName;
            this.registerObj.CategoryName = this.data.registerObj.CategoryName;
           
          }
        this.getCategoryNameCombobox();
        this.getServiceNameCombobox();
        this.getParameterNameCombobox();
        //this.getTemplateNameCombobox();

        this.parameternameFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterParametername();
            });

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

        this.templateFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterTemplate();
            });
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
            .subscribe((data) => (this.Parametercmb = data));
           // console.log(this.Parametercmb);
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
            this.CategorycmbList.filter(
                (bank) => bank.CategoryName.toLowerCase().indexOf(search) > -1
            )
        );
    }
    getCategoryNameCombobox() {
         this._TestService.getCategoryMasterCombo().subscribe((data) => {
            this.CategorycmbList = data;
            console.log(this.CategorycmbList)
             //this._TestService.myform.get("CategoryId").setValue(this.CategorycmbList[0]);
             if (this.data) {
                console.log(this.data)
                const selectedCategory = this.CategorycmbList.filter(c => c.CategoryName == this.registerObj.CategoryName);
                this._TestService.myform.get('CategoryId').setValue(selectedCategory);
               console.log(selectedCategory)
                console.log(this.registerObj.CategoryName)
              } 
        });
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
            this.ServicecmbList.filter(
                (bank) => bank.ServiceName.toLowerCase().indexOf(search) > -1
            )
        );
    }
    getServiceNameCombobox() {
        this._TestService.getServiceMasterCombo().subscribe((data) => {
            this.ServicecmbList = data;
            this._TestService.myform.get("ServiceID").setValue(this.ServicecmbList[0]);
            if (this.data) {
                const selectedService = this.ServicecmbList.filter(c => c.ServiceID == this.registerObj.TestName);
                this._TestService.myform.get('ServiceID').setValue(selectedService);
                console.log(selectedService)
                console.log(this.registerObj.TestName)
              } 
        });
    }

    // Service name filter
    private filterTemplate() {
        if (!this.TemplatecmbList) {
            return;
        }
        // get the search keyword
        let search = this.serviceFilterCtrl.value;
        if (!search) {
            this.filteredTemplate.next(this.TemplatecmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredTemplate.next(
            this.TemplatecmbList.filter(
                (bank) => bank.TemplateId.toLowerCase().indexOf(search) > -1
            )
        );
    }
    // getTemplateNameCombobox() {
    //     this._TestService.getTemplateMasterCombo()
    //         .subscribe((data) => (this.TemplatecmbList = data));
    // }
 
    getSubTestMasterList() {  
        this._TestService.getNewSubTestMasterList().subscribe((Menu) => {
            this.DSTestList.data = Menu as TestList[];
            console.log(this.DSTestList) 
        });
    }
    OnAdd(event) {
        this.DSTestList.data = [];
        this.ChargeList = this.dsTemparoryList.data;
        this.ChargeList.push(
            {
                ParameterName : this._TestService.AddParameterFrom.get('ParameterName').value.ParameterName || "",
            });
        this.DSTestList.data = this.ChargeList
       // console.log(this.ChargeList);
      // this._TestService.AddParameterFrom.get('ParameterName').setValue("");
        this._TestService.AddParameterFrom.reset();   
    }
   
    onSubmit(){
if(!this._TestService.myform.get("TestId").value)  {

let insertPathologyTestMaster ={};

insertPathologyTestMaster['testName'] = this._TestService.myform.get('TestName').value || "";
insertPathologyTestMaster['printTestName'] =this._TestService.myform.get('PrintTestName').value || "";
insertPathologyTestMaster['categoryId'] = this._TestService.myform.get('CategoryId').value.CategoryId || 0;
insertPathologyTestMaster['isSubTest'] = this._TestService.myform.get('IsSubTest').value;
insertPathologyTestMaster['techniqueName'] = this._TestService.myform.get('TechniqueName').value || "";
insertPathologyTestMaster['machineName'] =this._TestService.myform.get('MachineName').value || "";
insertPathologyTestMaster['suggestionNote'] = this._TestService.myform.get('SuggestionNote').value || "";
insertPathologyTestMaster['footNote'] = this._TestService.myform.get('FootNote').value || "";
insertPathologyTestMaster['isDeleted'] = this._TestService.myform.get('IsDeleted').value || "";
insertPathologyTestMaster['addedBy'] = 1;
insertPathologyTestMaster['serviceId'] = this._TestService.myform.get('ServiceName').value.ServiceID || 0;
insertPathologyTestMaster['isTemplateTest'] = true;
insertPathologyTestMaster['testId'] = 0;

let pathTestDetailMaster = []
this.DSTestList.data.forEach((element) => {
    let PathDetailsObj={};
    PathDetailsObj['testId'] =  0;
    PathDetailsObj['subTestID'] = 0;
    PathDetailsObj['parameterID'] = element.ParameterID || 0;
    pathTestDetailMaster.push(PathDetailsObj);
});
let pathTestDetDelete={};
pathTestDetDelete['testId'] = 0;

let submitData = {
    "insertPathologyTestMaster": insertPathologyTestMaster,
    "pathTestDetailMaster": pathTestDetailMaster,
    "pathTestDetDelete":pathTestDetDelete
  };

  console.log(submitData);

  this._TestService.insertPathologyTestMaster(submitData).subscribe(response => {
    if (response) {
      this.toastr.success('Record Saved Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      this.onClose();
      this.onClear()
      
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
else{
    
      let updatePathologyTestMaster ={};

      updatePathologyTestMaster['testName'] = this._TestService.myform.get('TestName').value || "";
      updatePathologyTestMaster['printTestName'] =this._TestService.myform.get('PrintTestName').value || "";
      updatePathologyTestMaster['categoryId'] = this._TestService.myform.get('CategoryId').value.CategoryId || 0;
      updatePathologyTestMaster['isSubTest'] = this._TestService.myform.get('IsSubTest').value;
      updatePathologyTestMaster['techniqueName'] = this._TestService.myform.get('TechniqueName').value || "";
      updatePathologyTestMaster['machineName'] =this._TestService.myform.get('MachineName').value || "";
      updatePathologyTestMaster['suggestionNote'] = this._TestService.myform.get('SuggestionNote').value || "";
      updatePathologyTestMaster['footNote'] = this._TestService.myform.get('FootNote').value || "";
      updatePathologyTestMaster['isDeleted'] = this._TestService.myform.get('IsDeleted').value || "";
      updatePathologyTestMaster['updatedBy'] = 0;
      updatePathologyTestMaster['serviceId'] = this._TestService.myform.get('ServiceName').value.ServiceID || 0;
      updatePathologyTestMaster['isTemplateTest'] = true;
      updatePathologyTestMaster['testId'] = 0;

      let updatePathologyTemplateTest = []
    this.DSTestList.data.forEach((element) => {
    let UpdatePathDetailsObj={};
    UpdatePathDetailsObj['testId'] =  0;
    UpdatePathDetailsObj['templateId'] = 0;
    updatePathologyTemplateTest.push(UpdatePathDetailsObj);
});
  let pathTestDetDelete={};
  pathTestDetDelete['testId'] = 0;
 
let submitData = {
    "updatePathologyTestMaster": updatePathologyTestMaster,
    "updatePathologyTemplateTest": updatePathologyTemplateTest,
    "pathTestDetDelete":pathTestDetDelete
  };
  console.log(submitData);

  this._TestService.insertPathologyTestMaster(submitData).subscribe(response => {
    if (response) {
      this.toastr.success('Record Updated Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      this.onClose();
      this.onClear()
      
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
 

    // onSubmits() {
    //     debugger;
    //     if (this._TestService.myform.valid) {
    //         if (!this._TestService.myform.get("TestId").value) {
    //             if (this._TestService.myform.get("IsSubTest").value == 1) {
    //                 var data2 = [];
    //                 for (var val of this._TestService.myform.get("ParameterId1")
    //                     .value) {
    //                     var data = {
    //                         testId: this._TestService.myform.get("TestId")
    //                             .value,
    //                         subTestID: "0", //this._TestService.myform.get("SubTestID").value || "%",
    //                         parameterID: val,
    //                     };
    //                     data2.push(data);
    //                 }
    //             } else {
    //                 var data2 = [];
    //             }

    //             var m_data = {
    //                 insertPathologyTestMaster: {
    //                     // "TestId":"0",
    //                     testName: this._TestService.myform
    //                         .get("TestName")
    //                         .value.trim(),
    //                     printTestName: this._TestService.myform
    //                         .get("PrintTestName")
    //                         .value.trim(),
    //                     categoryId:
    //                         this._TestService.myform.get("CategoryId").value,
    //                     isSubTest:
    //                         Boolean(
    //                             JSON.parse(
    //                                 this._TestService.myform.get("IsSubTest")
    //                                     .value
    //                             )
    //                         ) || 0,
    //                     techniqueName:
    //                         this._TestService.myform
    //                             .get("TechniqueName")
    //                             .value.trim() || "%",
    //                     machineName:
    //                         this._TestService.myform
    //                             .get("MachineName")
    //                             .value.trim() || "%",
    //                     suggestionNote:
    //                         this._TestService.myform
    //                             .get("SuggestionNote")
    //                             .value.trim() || "%",
    //                     footNote:
    //                         this._TestService.myform
    //                             .get("FootNote")
    //                             .value.trim() || "%",
    //                     isDeleted: 0,
    //                     addedBy: 1,
    //                     serviceId:
    //                         this._TestService.myform.get("ServiceID").value,
    //                     isTemplateTest: parseInt(
    //                         this._TestService.myform.get("IsTemplateTest").value
    //                     ),
    //                     isCategoryPrint:
    //                         Boolean(
    //                             JSON.parse(
    //                                 this._TestService.myform.get(
    //                                     "IsCategoryPrint"
    //                                 ).value
    //                             )
    //                         ) || 0,
    //                     isPrintTestName:
    //                         Boolean(
    //                             JSON.parse(
    //                                 this._TestService.myform.get(
    //                                     "IsPrintTestName"
    //                                 ).value
    //                             )
    //                         ) || 0,
    //                 },
    //                 pathologyTemplateTest: {
    //                     testId: "0",
    //                     templateId: "0",
    //                 },
    //                 pathTestDetailMaster: data2,
    //             };

    //             this._TestService
    //                 .insertPathologyTestMaster(m_data)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         Swal.fire(
    //                             "Saved !",
    //                             "Record saved Successfully !",
    //                             "success"
    //                         ).then((result) => {
    //                             if (result.isConfirmed) {
    //                             }
    //                         });
    //                     } else {
    //                         Swal.fire(
    //                             "Error !",
    //                             "Appoinment not saved",
    //                             "error"
    //                         );
    //                     }
    //                 });
    //         } else {
    //             var m_dataUpdate = {
    //                 updatePathologyTestMaster: {
    //                     testId: this._TestService.myform.get("TestId").value,
    //                     testName: this._TestService.myform
    //                         .get("TestName")
    //                         .value.trim(),
    //                     printTestName: this._TestService.myform
    //                         .get("PrintTestName")
    //                         .value.trim(),
    //                     categoryId:
    //                         this._TestService.myform.get("CategoryId").value,
    //                     isSubTest:
    //                         Boolean(
    //                             JSON.parse(
    //                                 this._TestService.myform.get("IsSubTest")
    //                                     .value
    //                             )
    //                         ) || 0,
    //                     techniqueName:
    //                         this._TestService.myform
    //                             .get("TechniqueName")
    //                             .value.trim() || "%",
    //                     machineName:
    //                         this._TestService.myform
    //                             .get("MachineName")
    //                             .value.trim() || "%",
    //                     suggestionNote:
    //                         this._TestService.myform
    //                             .get("SuggestionNote")
    //                             .value.trim() || "%",
    //                     footNote:
    //                         this._TestService.myform
    //                             .get("FootNote")
    //                             .value.trim() || "%",
    //                     isDeleted: 0,
    //                     updatedBy: 1,
    //                     serviceId:
    //                         this._TestService.myform.get("ServiceID").value ||
    //                         0,
    //                     isTemplateTest: parseInt(
    //                         this._TestService.myform.get("IsTemplateTest").value
    //                     ),
    //                     isCategoryPrint:
    //                         Boolean(
    //                             JSON.parse(
    //                                 this._TestService.myform.get(
    //                                     "IsCategoryPrint"
    //                                 ).value
    //                             )
    //                         ) || 0,
    //                     isPrintTestName:
    //                         Boolean(
    //                             JSON.parse(
    //                                 this._TestService.myform.get(
    //                                     "IsPrintTestName"
    //                                 ).value
    //                             )
    //                         ) || 0,
    //                 },
    //             };
    //             console.log(m_dataUpdate);
    //             this._TestService
    //                 .updatePathologyTestMaster(m_dataUpdate)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         Swal.fire(
    //                             "Updated !",
    //                             "Record updated Successfully !",
    //                             "success"
    //                         ).then((result) => {
    //                             if (result.isConfirmed) {
    //                             }
    //                         });
    //                     } else {
    //                         Swal.fire(
    //                             "Error !",
    //                             "Appoinment not updated",
    //                             "error"
    //                         );
    //                     }
    //                 });
    //         }
    //         this.onClose();
    //     }
    // }
    onEdit(row) {
        var m_data = {
            TestId: row.TestId,
            TestName: row.TestName.trim(),
            PrintTestName: row.PrintTestName.trim(),
            CategoryId: row.CategoryId,
            IsSubTest: JSON.stringify(row.IsSubTest),
            TechniqueName: row.TechniqueName.trim(),
            MachineName: row.MachineName.trim(),
            SuggestionNote: row.SuggestionNote.trim(),
            FootNote: row.FootNote.trim(),
            ServiceName: row.ServiceName.trim(),
            IsTemplateTest: row.IsTemplateTest,
            IsCategoryPrint: JSON.stringify(row.IsCategoryPrint),
            IsPrintTestName: JSON.stringify(row.IsPrintTestName),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };

        this._TestService.populateForm(m_data);
    }

    onClear() {
        this._TestService.myform.reset();
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
    //     // debugger;
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
    /**
     * Constructor
     *
     * @param TestList
     */
    constructor(TestList) {
        {
            this.ParameterName = TestList.ParameterName || "";
        }
    }
}
