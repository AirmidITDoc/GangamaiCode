import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { BillingClassMasterService } from "./billing-class-master.service";
import { fuseAnimations } from "@fuse/animations";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-billing-class-master",
    templateUrl: "./billing-class-master.component.html",
    styleUrls: ["./billing-class-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BillingClassMasterComponent implements OnInit {
    PrefixMasterList: any;
    GendercmbList: any = [];
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        "ClassId",
        "ClassName",

        "IsDeleted",
        "action",
    ];

    DSBillingClassMasterList = new MatTableDataSource<BillingClassMaster>();

    constructor(public _billingClassService: BillingClassMasterService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getClassMasterList();
    }
    onSearch() {
        this.getClassMasterList();
    }

    onSearchClear() {
        this._billingClassService.myformSearch.reset({
            ClassNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getClassMasterList();
    }
    getClassMasterList() {
        var param = {
            ClassName:
                this._billingClassService.myformSearch
                    .get("ClassNameSearch")
                    .value.trim() || "%",
        };
        this._billingClassService
            .getClassMasterList(param)
            .subscribe((Menu) => {
                this.DSBillingClassMasterList.data =
                    Menu as BillingClassMaster[];
                this.DSBillingClassMasterList.sort = this.sort;
                this.DSBillingClassMasterList.paginator = this.paginator;
            });
    }

    onClear() {
        this._billingClassService.myform.reset({ IsDeleted: "false" });
        this._billingClassService.initializeFormGroup();
    }

    onSubmit() {
        if (this._billingClassService.myform.valid) {
            if (!this._billingClassService.myform.get("ClassId").value) {
                var m_data = {
                    classMasterInsert: {
                        className: this._billingClassService.myform
                            .get("ClassName")
                            .value.trim(),
                        isActive: Boolean(
                            JSON.parse(
                                this._billingClassService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                    },
                };

                this._billingClassService
                    .classMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getClassMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getClassMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Billing Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getClassMasterList();
                    },error => {
                        this.toastr.error('Billing Master Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    classMasterUpdate: {
                        classId:
                            this._billingClassService.myform.get("ClassId")
                                .value,
                        className:
                            this._billingClassService.myform.get("ClassName")
                                .value,
                        isActive: Boolean(
                            JSON.parse(
                                this._billingClassService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                    },
                };

                this._billingClassService
                    .classMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getClassMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getClassMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Billing Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getClassMasterList();
                    },error => {
                        this.toastr.error('Billing Master Data not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            ClassId: row.ClassId,
            ClassName: row.ClassName.trim(),
            IsDeleted: JSON.stringify(row.IsActive),
        };
        this._billingClassService.populateForm(m_data);
    }
}
export class BillingClassMaster {
    ClassId: number;
    ClassName: string;
    IsDeleted: boolean;

    /**
     * Constructor
     *
     * @param BillingClassMaster
     */
    constructor(BillingClassMaster) {
        {
            this.ClassId = BillingClassMaster.ClassId || "";
            this.ClassName = BillingClassMaster.ClassName || "";
            this.IsDeleted = BillingClassMaster.IsDeleted || "false";
        }
    }
}
