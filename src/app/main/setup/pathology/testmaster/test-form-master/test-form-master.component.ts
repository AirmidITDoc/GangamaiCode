import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { takeUntil } from "rxjs/operators";
import { TestmasterComponent } from "../testmaster.component";
import { TestmasterService } from "../testmaster.service";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";

@Component({
    selector: "app-test-form-master",
    templateUrl: "./test-form-master.component.html",
    styleUrls: ["./test-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TestFormMasterComponent implements OnInit {
    Parametercmb: any = [];
    paraselect: any = ["new"];

    // paraselect = new parameterselect({});
    CategorycmbList: any = [];
    TemplatecmbList: any = [];
    ServicecmbList: any = [];
    msg: any;

    //parametername filter
    public parameternameFilterCtrl: FormControl = new FormControl();
    public filteredParametername: ReplaySubject<any> = new ReplaySubject<any>(
        1
    );

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

        public dialogRef: MatDialogRef<TestmasterComponent>
    ) {}

    ngOnInit(): void {
        this.getCategoryNameCombobox();
        this.getServiceNameCombobox();
        this.getParameterNameCombobox();
        this.getTemplateNameCombobox();

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

    getCategoryNameCombobox() {
        // this._TestService.getCategoryMasterCombo().subscribe(data =>this.CategorycmbList =data);
        this._TestService.getCategoryMasterCombo().subscribe((data) => {
            this.CategorycmbList = data;
            this._TestService.myform
                .get("CategoryId")
                .setValue(this.CategorycmbList[0]);
        });
    }

    getServiceNameCombobox() {
        // this._TestService.getServiceMasterCombo().subscribe(data =>this.ServicecmbList =data);

        this._TestService.getServiceMasterCombo().subscribe((data) => {
            this.ServicecmbList = data;
            this._TestService.myform
                .get("ServiceID")
                .setValue(this.ServicecmbList[0]);
        });
    }

    getTemplateNameCombobox() {
        this._TestService
            .getTemplateMasterCombo()
            .subscribe((data) => (this.TemplatecmbList = data));
    }

    getParameterNameCombobox() {
        this._TestService
            .getParameterMasterCombo()
            .subscribe((data) => (this.Parametercmb = data));
    }

    addSelectedOption(selectedElements, keyName) {
        // debugger;
        let addedElement = "";
        if (selectedElements) {
            selectedElements.forEach((element) => {
                addedElement += element[keyName] + ",\n";
            });
            if (keyName == "parameterlist") {
                this._TestService.myform
                    .get("parametertxt")
                    .setValue(addedElement);
            }
        }
    }

    onSubmit() {
        debugger;
        if (this._TestService.myform.valid) {
            if (!this._TestService.myform.get("TestId").value) {
                if (this._TestService.myform.get("IsSubTest").value == 1) {
                    var data2 = [];
                    for (var val of this._TestService.myform.get("ParameterId1")
                        .value) {
                        var data = {
                            parameterID: val,
                            TestId: this._TestService.myform.get("TestId")
                                .value,
                            SubTestID: "0", //this._TestService.myform.get("SubTestID").value || "%",
                        };
                        data2.push(data);
                    }
                } else {
                    var data2 = [];
                }

                var m_data = {
                    insertPathologyTestMaster: {
                        // "TestId":"0",
                        TestName: this._TestService.myform
                            .get("TestName")
                            .value.trim(),
                        PrintTestName: this._TestService.myform
                            .get("PrintTestName")
                            .value.trim(),
                        CategoryId:
                            this._TestService.myform.get("CategoryId").value,
                        IsSubTest:
                            Boolean(
                                JSON.parse(
                                    this._TestService.myform.get("IsSubTest")
                                        .value
                                )
                            ) || 0,
                        TechniqueName:
                            this._TestService.myform
                                .get("TechniqueName")
                                .value.trim() || "%",
                        MachineName:
                            this._TestService.myform
                                .get("MachineName")
                                .value.trim() || "%",
                        SuggestionNote:
                            this._TestService.myform
                                .get("SuggestionNote")
                                .value.trim() || "%",
                        FootNote:
                            this._TestService.myform
                                .get("FootNote")
                                .value.trim() || "%",
                        ServiceID:
                            this._TestService.myform.get("ServiceID").value,
                        IsTemplateTest: parseInt(
                            this._TestService.myform.get("IsTemplateTest").value
                        ),
                        IsCategoryPrint:
                            Boolean(
                                JSON.parse(
                                    this._TestService.myform.get(
                                        "IsCategoryPrint"
                                    ).value
                                )
                            ) || 0,
                        IsPrintTestName:
                            Boolean(
                                JSON.parse(
                                    this._TestService.myform.get(
                                        "IsPrintTestName"
                                    ).value
                                )
                            ) || 0,
                    },
                    pathologyTemplateTest: {
                        TestId: "0",
                        TemplateId: "0",
                    },
                    pathTestDetailMaster: data2,
                };

                this._TestService
                    .insertPathologyTestMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                    });
            } else {
                var m_dataUpdate = {
                    updatePathologyTestMaster: {
                        TestId: this._TestService.myform.get("TestId").value,
                        TestName: this._TestService.myform
                            .get("TestName")
                            .value.trim(),
                        PrintTestName: this._TestService.myform
                            .get("PrintTestName")
                            .value.trim(),
                        CategoryId:
                            this._TestService.myform.get("CategoryId").value,
                        IsSubTest:
                            Boolean(
                                JSON.parse(
                                    this._TestService.myform.get("IsSubTest")
                                        .value
                                )
                            ) || 0,
                        TechniqueName:
                            this._TestService.myform
                                .get("TechniqueName")
                                .value.trim() || "%",
                        MachineName:
                            this._TestService.myform
                                .get("MachineName")
                                .value.trim() || "%",
                        SuggestionNote:
                            this._TestService.myform
                                .get("SuggestionNote")
                                .value.trim() || "%",
                        FootNote:
                            this._TestService.myform
                                .get("FootNote")
                                .value.trim() || "%",
                        ServiceID:
                            this._TestService.myform.get("ServiceID").value ||
                            0,
                        IsTemplateTest: parseInt(
                            this._TestService.myform.get("IsTemplateTest").value
                        ),
                        IsCategoryPrint:
                            Boolean(
                                JSON.parse(
                                    this._TestService.myform.get(
                                        "IsCategoryPrint"
                                    ).value
                                )
                            ) || 0,
                        IsPrintTestName:
                            Boolean(
                                JSON.parse(
                                    this._TestService.myform.get(
                                        "IsPrintTestName"
                                    ).value
                                )
                            ) || 0,
                    },
                };
                console.log(m_dataUpdate);
                this._TestService
                    .updatePathologyTestMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                    });
            }
            this.onClose();
        }
    }
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

    AddData(txt) {
        this.selectedItems = this.selectedItems.concat(txt);
        this.selectedToAdd = [];
    }

    assign() {
        // debugger;
        this.selectedItems = this.selectedItems.concat(this.selectedToAdd);
        this.Parametercmb = this.Parametercmb.filter((selectedData) => {
            return this.selectedItems.indexOf(selectedData) < 0;
        });
        this.selectedToAdd = [];
        console.log(this.selectedItems);
    }

    unassign() {
        this.Parametercmb = this.Parametercmb.concat(this.selectedToRemove);
        this.selectedItems = this.selectedItems.filter((selectedData) => {
            return this.Parametercmb.indexOf(selectedData) < 0;
        });
        this.selectedToRemove = [];
    }

    //  for Template list
    selectedToAdd1: any;
    selectedToRemove1: any;
    selectedItems1: any = [];
    groupsArray1: any = [];

    AddData1(txt) {
        this.selectedItems1 = this.selectedItems1.concat(txt);
        this.selectedToAdd1 = [];
    }

    assign1() {
        this.selectedItems1 = this.selectedItems1.concat(this.selectedToAdd1);
        this.TemplatecmbList = this.TemplatecmbList.filter((selectedData1) => {
            return this.selectedItems1.indexOf(selectedData1) < 0;
        });
        this.selectedToAdd1 = [];
        console.log(this.selectedItems1);
    }

    unassign1() {
        this.TemplatecmbList = this.TemplatecmbList.concat(
            this.selectedToRemove1
        );
        this.selectedItems1 = this.selectedItems1.filter((selectedData1) => {
            return this.TemplatecmbList.indexOf(selectedData1) < 0;
        });
        this.selectedToRemove1 = [];
    }
}
