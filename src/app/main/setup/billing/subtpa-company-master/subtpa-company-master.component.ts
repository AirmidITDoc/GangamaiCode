import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { SubtpaCompanyMasterService } from "./subtpa-company-master.service";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-subtpa-company-master",
    templateUrl: "./subtpa-company-master.component.html",
    styleUrls: ["./subtpa-company-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SubtpaCompanyMasterComponent implements OnInit {
    submitted = false;
    CompanytypecmbList: any = [];
    msg: any;

    displayedColumns: string[] = [
        "SubCompanyId",
        "TypeName",
        "CompanyName",
        "Address",
        "City",
        "PinNo",
        "PhoneNo",
        "MobileNo",
        "FaxNo",
        "AddedBy",
        // "IsCancelledBy",
        // "IsCancelled",
        // "IsCancelledDate",
        "IsDeleted",
        "action",
    ];

    DSSubtpaCompanyMasterList = new MatTableDataSource<SubtpacompanyMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _subtpacompanyService: SubtpaCompanyMasterService,
        public toastr : ToastrService,) {}

    //company filter
    public companytypeFilterCtrl: FormControl = new FormControl();
    public filteredCompanytype: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    ngOnInit(): void {
        this.getSubtpacompanyMasterList();
        this.getCompanytypeNameCombobox();

        this.companytypeFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterCompanytype();
            });
    }

    onSearch() {
        this.getSubtpacompanyMasterList();
    }

    onSearchClear() {
        this._subtpacompanyService.myformSearch.reset({
            CompanyNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getSubtpacompanyMasterList();
    }

    get f() {
        return this._subtpacompanyService.myform.controls;
    }

    private filterCompanytype() {
        // debugger;
        if (!this.CompanytypecmbList) {
            return;
        }
        // get the search keyword
        let search = this.companytypeFilterCtrl.value;
        if (!search) {
            this.filteredCompanytype.next(this.CompanytypecmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter
        this.filteredCompanytype.next(
            this.CompanytypecmbList.filter(
                (bank) => bank.TypeName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    getSubtpacompanyMasterList() {
        var param = {
            CompanyName:
                this._subtpacompanyService.myformSearch
                    .get("CompanyNameSearch")
                    .value.trim() || "%",
        };
        this._subtpacompanyService
            .getSubtpacompanyMasterList(param)
            .subscribe((Menu) => {
                this.DSSubtpaCompanyMasterList.data =
                    Menu as SubtpacompanyMaster[];
                this.DSSubtpaCompanyMasterList.sort = this.sort;
                this.DSSubtpaCompanyMasterList.paginator = this.paginator;
            });
    }

    getCompanytypeNameCombobox() {
        this._subtpacompanyService
            .getCompanytypeCombobox()
            .subscribe((data) => {
                this.CompanytypecmbList = data;
                this.filteredCompanytype.next(this.CompanytypecmbList.slice());
                this._subtpacompanyService.myform
                    .get("SubCompanyId")
                    .setValue(this.CompanytypecmbList[0]);
            });
    }

    onClear() {
        this._subtpacompanyService.myform.reset({ IsDeleted: "false" });
        this._subtpacompanyService.initializeFormGroup();
    }

    onSubmit() {
        if (this._subtpacompanyService.myform.valid) {
            if (!this._subtpacompanyService.myform.get("SubCompanyId").value) {
                var m_data = {
                    subTpaCompanyMasterInsert: {
                        compTypeId:
                            this._subtpacompanyService.myform.get("CompTypeId")
                                .value.CompanyTypeId,
                        companyName: this._subtpacompanyService.myform
                            .get("CompanyName")
                            .value.trim(),
                        address: this._subtpacompanyService.myform
                            .get("Address")
                            .value.trim(),
                        city: this._subtpacompanyService.myform
                            .get("City")
                            .value.trim(),
                        pinNo: this._subtpacompanyService.myform
                            .get("PinNo")
                            .value.trim(),
                        phoneNo: this._subtpacompanyService.myform
                            .get("PhoneNo")
                            .value.trim(),
                        mobileNo: this._subtpacompanyService.myform
                            .get("MobileNo")
                            .value.trim(),
                        faxNo: this._subtpacompanyService.myform
                            .get("FaxNo")
                            .value.trim(),
                        isActive: Boolean(
                            JSON.parse(
                                this._subtpacompanyService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        addedBy: 10,
                        updatedBy: 0,
                        isCancelled: false,
                        isCancelledBy: "0",
                        isCancelledDate: "01/01/1900",
                    },
                };
                console.log(m_data);
                this._subtpacompanyService
                    .subTpaCompanyMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getSubtpacompanyMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getSubtpacompanyMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Sub TPACompany Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }

                        this.getSubtpacompanyMasterList();
                    },error => {
                        this.toastr.error('Sub TPACompany Master Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    subTpaCompanyMasterUpdate: {
                        subCompanyID:
                            this._subtpacompanyService.myform.get(
                                "SubCompanyId"
                            ).value,
                        compTypeId:
                            this._subtpacompanyService.myform.get("CompTypeId")
                                .value.CompanyTypeId,
                        companyName: this._subtpacompanyService.myform
                            .get("CompanyName")
                            .value.trim(),
                        address: this._subtpacompanyService.myform
                            .get("Address")
                            .value.trim(),
                        city: this._subtpacompanyService.myform
                            .get("City")
                            .value.trim(),
                        pinNo: this._subtpacompanyService.myform
                            .get("PinNo")
                            .value.trim(),
                        phoneNo: this._subtpacompanyService.myform
                            .get("PhoneNo")
                            .value.trim(),
                        mobileNo: this._subtpacompanyService.myform
                            .get("MobileNo")
                            .value.trim(),
                        faxNo: this._subtpacompanyService.myform
                            .get("FaxNo")
                            .value.trim(),
                        updatedBy: 1,
                        isDeleted: 1,

                        isCancelled: false,
                        isCancelledBy: "0",
                        isCancelledDate: "01/01/1900",
                    },
                };

                this._subtpacompanyService
                    .subTpaCompanyMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getSubtpacompanyMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getSubtpacompanyMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Sub TPACompany Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getSubtpacompanyMasterList();
                    },error => {
                        this.toastr.error('Sub TPACompany Master Data not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            SubCompanyId: row.SubCompanyId,
            CompTypeId: row.CompTypeId,
            CompanyName: row.CompanyName.trim(),
            Address: row.Address.trim(),
            City: row.City.trim(),
            PinNo: row.PinNo.trim(),
            PhoneNo: row.PhoneNo.trim(),
            MobileNo: row.MobileNo.trim(),
            FaxNo: row.FaxNo.trim(),
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
            IsCancelled: JSON.stringify(row.IsCancelled),
            IsCancelledBy: row.IsCancelledBy,
            IsCancelledDate: row.IsCancelledDate,
        };
        this._subtpacompanyService.populateForm(m_data);
    }
}

export class SubtpacompanyMaster {
    SubCompanyId: number;
    CompTypeId: number;
    CompanyName: string;
    Address: string;
    City: string;
    PinNo: string;
    PhoneNo: string;
    MobileNo: string;
    BankName: string;
    FaxNo: String;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    IsCancelled: boolean;
    IsCancelledBy: number;
    IsCancelledDate: Date;

    /**
     * Constructor
     *
     * @param SubtpacompanyMaster
     */
    constructor(SubtpacompanyMaster) {
        {
            this.SubCompanyId = SubtpacompanyMaster.SubCompanyId || "";
            this.CompTypeId = SubtpacompanyMaster.CompTypeId || "";
            this.CompanyName = SubtpacompanyMaster.CompanyName || "";
            this.Address = SubtpacompanyMaster.Address || "";
            this.City = SubtpacompanyMaster.City || "";
            this.PinNo = SubtpacompanyMaster.PinNo || "";
            this.PhoneNo = SubtpacompanyMaster.PhoneNo || "";
            this.MobileNo = SubtpacompanyMaster.MobileNo || "";
            this.FaxNo = SubtpacompanyMaster.FaxNo || "";
            this.IsDeleted = SubtpacompanyMaster.IsDeleted || "false";
            this.AddedBy = SubtpacompanyMaster.AddedBy || "";
            this.UpdatedBy = SubtpacompanyMaster.UpdatedBy || "";
            this.IsCancelled = SubtpacompanyMaster.IsCancelled || "";
            this.IsCancelledBy = SubtpacompanyMaster.IsCancelledBy || "";
            this.IsCancelledDate = SubtpacompanyMaster.IsCancelledDate || "";
        }
    }
}
