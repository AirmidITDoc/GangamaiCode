import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { DepartmentMasterService } from "./department-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-department-master",
    templateUrl: "./department-master.component.html",
    styleUrls: ["./department-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DepartmentMasterComponent implements OnInit {
    DepartmentMasterList: any;
    msg: any;

    displayedColumns: string[] = [
        "DepartmentId",
        "DepartmentName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSDepartmentMasterList = new MatTableDataSource<DepartmentMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _departmentService: DepartmentMasterService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getDepartmentMasterList();
    }
    onSearch() {
        this.getDepartmentMasterList();
    }

    onSearchClear() {
        this._departmentService.myformSearch.reset({
            DepartmentNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getDepartmentMasterList();
    }
    getDepartmentMasterList() {
        var param = {
            DepartmentName:this._departmentService.myformSearch.get("DepartmentNameSearch")
                    .value.trim() + "%" || "%",
        };
        this._departmentService
            .getDepartmentMasterList(param)
            .subscribe((Menu) => {
                this.DSDepartmentMasterList.data = Menu as DepartmentMaster[];
                this.DSDepartmentMasterList.sort = this.sort;
                this.DSDepartmentMasterList.paginator = this.paginator;
            });
    }

    onClear() {
        this._departmentService.myform.reset({ IsDeleted: "false" });
        this._departmentService.initializeFormGroup();
    }

    onSubmit() {
        if (this._departmentService.myform.valid) {
            if (!this._departmentService.myform.get("DepartmentId").value) {
                var m_data = {
                    departmentMasterInsert: {
                        departmentName: this._departmentService.myform
                            .get("DepartmentName")
                            .value.trim(),
                        addedBy: 1,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._departmentService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._departmentService
                    .departmentMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getDepartmentMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getDepartmentMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Department Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getDepartmentMasterList();
                    },error => {
                        this.toastr.error('Department Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    departmentMasterUpdate: {
                        departmentID:
                            this._departmentService.myform.get("DepartmentId")
                                .value,
                        departmentName: this._departmentService.myform
                            .get("DepartmentName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._departmentService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                    },
                };

                this._departmentService
                    .departmentMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getDepartmentMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getDepartmentMasterList();
                            //     }
                            // });
                        } else {
                        
                                this.toastr.error('Department Master Data not Updated !, Please check API error..', 'Updated !', {
                                    toastClass: 'tostr-tost custom-toast-error',
                                  });
                        
                        }
                        this.getDepartmentMasterList();
                    },error => {
                        this.toastr.error('Department Data not Updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            DepartmentId: row.DepartmentId,
            DepartmentName: row.DepartmentName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._departmentService.populateForm(m_data);
    }
}

export class DepartmentMaster {
    DepartmentId: number;
    DepartmentName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param DepartmentMaster
     */
    constructor(DepartmentMaster) {
        {
            this.DepartmentId = DepartmentMaster.DepartmentId || "";
            this.DepartmentName = DepartmentMaster.DepartmentName || "";
            this.IsDeleted = DepartmentMaster.IsDeleted || "false";
            this.AddedBy = DepartmentMaster.AddedBy || "";
            this.UpdatedBy = DepartmentMaster.UpdatedBy || "";
        }
    }
}
