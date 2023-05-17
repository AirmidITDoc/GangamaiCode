import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { SubtpaCompanyMasterService } from "./subtpa-company-master.service";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { fuseAnimations } from "@fuse/animations";

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
        "AddedByName",
        "IsCancelledBy",
        "IsCancelled",
        "IsCancelledDate",
        "IsDeleted",
        "action",
    ];

    DSSubtpaCompanyMasterList = new MatTableDataSource<SubtpacompanyMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _subtpacompanyService: SubtpaCompanyMasterService) {}

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
        this._subtpacompanyService
            .getSubtpacompanyMasterList()
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
                        CompTypeId:
                            this._subtpacompanyService.myform.get("CompTypeId")
                                .value,
                        CompanyName: this._subtpacompanyService.myform
                            .get("CompanyName")
                            .value.trim(),
                        Address:
                            this._subtpacompanyService.myform
                                .get("Address")
                                .value.trim() || "%",
                        City:
                            this._subtpacompanyService.myform
                                .get("City")
                                .value.trim() || "%",
                        PinNo:
                            this._subtpacompanyService.myform
                                .get("PinNo")
                                .value.trim() || "0",
                        PhoneNo:
                            this._subtpacompanyService.myform
                                .get("PhoneNo")
                                .value.trim() || "0",
                        MobileNo:
                            this._subtpacompanyService.myform
                                .get("MobileNo")
                                .value.trim() || "0",
                        FaxNo:
                            this._subtpacompanyService.myform
                                .get("FaxNo")
                                .value.trim() || "0",
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._subtpacompanyService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),

                        IsCancelled: Boolean(
                            JSON.parse(
                                this._subtpacompanyService.myform.get(
                                    "IsCancelled"
                                ).value
                            )
                        ),
                        IsCancelledBy:
                            this._subtpacompanyService.myform.get(
                                "IsCancelledBy"
                            ).value || "0",
                        IsCancelledDate:
                            this._subtpacompanyService.myform.get(
                                "IsCancelledDate"
                            ).value || "01/01/1900",
                    },
                };

                this._subtpacompanyService
                    .subTpaCompanyMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getSubtpacompanyMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    subTpaCompanyMasterUpdate: {
                        SubCompanyId:
                            this._subtpacompanyService.myform.get(
                                "SubCompanyId"
                            ).value,
                        CompTypeId:
                            this._subtpacompanyService.myform.get("CompTypeId")
                                .value,
                        CompanyName: this._subtpacompanyService.myform
                            .get("CompanyName")
                            .value.trim(),
                        Address:
                            this._subtpacompanyService.myform
                                .get("Address")
                                .value.trim() || "%",
                        City:
                            this._subtpacompanyService.myform
                                .get("City")
                                .value.trim() || "%",
                        PinNo:
                            this._subtpacompanyService.myform
                                .get("PinNo")
                                .value.trim() || "0",
                        PhoneNo:
                            this._subtpacompanyService.myform
                                .get("PhoneNo")
                                .value.trim() || "0",
                        MobileNo:
                            this._subtpacompanyService.myform
                                .get("MobileNo")
                                .value.trim() || "0",
                        FaxNo:
                            this._subtpacompanyService.myform
                                .get("FaxNo")
                                .value.trim() || "0",
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._subtpacompanyService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),

                        IsCancelled: Boolean(
                            JSON.parse(
                                this._subtpacompanyService.myform.get(
                                    "IsCancelled"
                                ).value
                            )
                        ),
                        IsCancelledBy:
                            this._subtpacompanyService.myform.get(
                                "IsCancelledBy"
                            ).value || "0",
                        IsCancelledDate:
                            this._subtpacompanyService.myform.get(
                                "IsCancelledDate"
                            ).value || "01/01/1900",
                    },
                };

                this._subtpacompanyService
                    .subTpaCompanyMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getSubtpacompanyMasterList();
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
            IsDeleted: JSON.stringify(row.IsDeleted),
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
    // AddedByName:string;

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
            //       this.AddedByName=SubtpacompanyMaster.AddedByName || '';
        }
    }
}
