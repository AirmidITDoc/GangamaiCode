import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { UnitmasterService } from "./unitmaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";

@Component({
    selector: "app-unitmaster",
    templateUrl: "./unitmaster.component.html",
    styleUrls: ["./unitmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class UnitmasterComponent implements OnInit {
    displayedColumns: string[] = [
        "UnitId",
        "UnitName",
       // "AddedBy",
        "IsDeleted",
        "action",
    ];
    resultsLength=0;
    PrefixMasterList: any;
    GendercmbList: any = [];
    msg: any;
    currentStatus=0;
    DSUnitmasterList = new MatTableDataSource<PathunitMaster>();
    DSUnitmasterList1 = new MatTableDataSource<PathunitMaster>();
    tempList = new MatTableDataSource<PathunitMaster>();
    @ViewChild(MatSort) sort: MatSort;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        public _unitmasterService: UnitmasterService,
        public toastr: ToastrService,
        private accountService: AuthenticationService,
        private _fuseSidebarService: FuseSidebarService,
        public _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.getUnitMasterList();
    }
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
      }
    onSearch() {
        this.getUnitMasterList();
    }

    onSearchClear() {
        this._unitmasterService.myformSearch.reset({
            UnitNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getUnitMasterList();
    }

    getUnitMasterList() {
        var param = {
            UnitName: this._unitmasterService.myformSearch.get('UnitNameSearch').value + "%" || "%",
        };
        this._unitmasterService.getUnitMasterList(param).subscribe((data) => {
            this.DSUnitmasterList.data = data as PathunitMaster[];
            this.DSUnitmasterList1.data = data as PathunitMaster[];
            this.tempList.data = this.DSUnitmasterList.data;
            console.log( this.DSUnitmasterList)
            this.resultsLength=  this.DSUnitmasterList.data.length
            this.DSUnitmasterList.sort = this.sort;
            this.DSUnitmasterList.paginator = this.paginator;
        });
    }

    onClear() {
        this._unitmasterService.myform.reset({ IsDeleted: "false" });
        this._unitmasterService.initializeFormGroup();
    }

    onSubmit() {
        if (this._unitmasterService.myform.valid) {
            if (!this._unitmasterService.myform.get("UnitId").value) {
                var m_data = {
                    insertUnitMaster: {
                        unitName: this._unitmasterService.myform
                            .get("UnitName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._unitmasterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: this.accountService.currentUserValue.user.id,
                    },
                };

                this._unitmasterService
                    .insertUnitMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });
                            this.getUnitMasterList();
                        } else {
                            this.toastr.error('Unit Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                            });
                        }
                        this.getUnitMasterList();
                    }, error => {
                        this.toastr.error('Unit not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    });
            } else {
                var m_dataUpdate = {
                    updateUnitMaster: {
                        unitId: this._unitmasterService.myform.get("UnitId")
                            .value,
                        unitName:
                            this._unitmasterService.myform.get("UnitName")
                                .value,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._unitmasterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy:this.accountService.currentUserValue.user.id,
                    },
                };
                this._unitmasterService
                    .updateUnitMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });
                            this.getUnitMasterList();
                        } else {
                            this.toastr.error('Unit Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                            });
                        }
                        this.getUnitMasterList();
                    }, error => {
                        this.toastr.error('Unit not updated !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    });
            }
            this.onClear();
        }
    }
        toggle(val: any) {
        if (val == "2") {
            this.currentStatus = 2;
        } else if(val=="1") {
            this.currentStatus = 1;
        }
        else{
            this.currentStatus = 0;

        }
    }
    onFilterChange(){
        debugger
      
        if (this.currentStatus == 1) {
            this.tempList.data = []
            this.DSUnitmasterList.data= this.DSUnitmasterList1.data
            for (let item of this.DSUnitmasterList.data) {
                if(item.IsDeleted)this.tempList.data.push(item)
            }
      debugger
            this.DSUnitmasterList.data = [];
            this.DSUnitmasterList.data = this.tempList.data;
        }
        else if (this.currentStatus == 0) {
            this.DSUnitmasterList.data= this.DSUnitmasterList1.data
            this.tempList.data = []
            for (let item of this.DSUnitmasterList.data) {
                if (!item.IsDeleted) this.tempList.data.push(item)
      
            }
            this.DSUnitmasterList.data = [];
            this.DSUnitmasterList.data = this.tempList.data;
        }
        else {
            this.DSUnitmasterList.data= this.DSUnitmasterList1.data
            this.tempList.data = this.DSUnitmasterList.data;
        }
      
    }
    onDeactive(UnitId) {
       
            Swal.fire({
                title: 'Confirm Status',
                text: 'Are you sure you want to Change Active Status?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes,Change Status!'
            }).then((result) => {
          if (result.isConfirmed) {
            debugger
            let Query 
            if (!this.DSUnitmasterList.data.find(item => item.UnitId === UnitId).IsDeleted){
                 Query ="Update M_PathUnitMaster set IsDeleted=1 where UnitId=" +UnitId;}
            else{
             Query = "Update M_PathUnitMaster set IsDeleted=0 where UnitId=" +UnitId;}
                this._unitmasterService.deactivateTheStatus(Query)
                .subscribe((data) => (this.msg = data));
            this.getUnitMasterList();
          }
        });
      }
    onEdit(row) {
        var m_data = {
            UnitId: row.UnitId,
            UnitName: row.UnitName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._unitmasterService.populateForm(m_data);
    }
}

export class PathunitMaster {
    UnitId: number;
    UnitName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param PathunitMaster
     */
    constructor(PathunitMaster) {
        {
            this.UnitId = PathunitMaster.UnitId || "";
            this.UnitName = PathunitMaster.UnitName || "";
            this.IsDeleted = PathunitMaster.IsDeleted || "false";
            this.AddedBy = PathunitMaster.AddedBy || "";
            this.UpdatedBy = PathunitMaster.UpdatedBy || "";
        }
    }
}
