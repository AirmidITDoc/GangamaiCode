import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { DepartmentMasterService } from "./department-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MatDialog } from "@angular/material/dialog";
import { NewdepartmentComponent } from "./newdepartment/newdepartment.component";

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
    sIsLoading: string = '';
    hasSelectedContacts: boolean;

    displayedColumns: string[] = [
        "DepartmentId",
        "DepartmentName",
        // "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSDepartmentMasterList = new MatTableDataSource<DepartmentMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _departmentService: DepartmentMasterService,
        public toastr: ToastrService,
        private _fuseSidebarService: FuseSidebarService,
        public _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.getDepartmentMasterList();
    }
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._departmentService.myformSearch.controls; }

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
            DepartmentName: this._departmentService.myformSearch.get("DepartmentNameSearch")
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

    newDepartment() {
        const dialogRef = this._matDialog.open(NewdepartmentComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "35%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getDepartmentMasterList();
        });
    }

    onEdit(row) {
        // var m_data = {
        //     DepartmentId: row.DepartmentId,
        //     DepartmentName: row.DepartmentName.trim(),
        //     IsDeleted: JSON.stringify(row.IsDeleted),
        //     UpdatedBy: row.UpdatedBy,
        // };
        // this._departmentService.populateForm(m_data);
        const dialogRef = this._matDialog.open(NewdepartmentComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "35%",
                data: {
                    Obj: row
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getDepartmentMasterList();
        });
    }

    onDeactive(DepartmentId) {
        debugger
        Swal.fire({
            title: 'Confirm Status',
            text: 'Are you sure you want to Change Status?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes,Change Status!'
        }).then((result) => {
            debugger

            if (result.isConfirmed) {
                let Query;
                const tableItem = this.DSDepartmentMasterList.data.find(item => item.DepartmentId === DepartmentId);
                console.log("table:", tableItem)

                if (tableItem.IsDeleted) {
                    Query = "Update M_DepartmentMaster set IsDeleted=0 where DepartmentId=" + DepartmentId;
                } else {
                    Query = "Update M_DepartmentMaster set IsDeleted=1 where DepartmentId=" + DepartmentId;
                }

                console.log("query:", Query);

                this._departmentService.deactivateTheStatus(Query)
                    .subscribe(
                        (data) => {
                            Swal.fire('Changed!', 'Department Status has been Changed.', 'success');
                            this.getDepartmentMasterList();
                        },
                        (error) => {
                            Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                        }
                    );
            }

        });
    }
}

export class DepartmentMaster {
    DepartmentId: number;
    DepartmentName: string;
    IsDeleted: boolean;
    IsActive: boolean;
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
            this.IsActive = DepartmentMaster.IsActive || "false";
            this.AddedBy = DepartmentMaster.AddedBy || "";
            this.UpdatedBy = DepartmentMaster.UpdatedBy || "";
        }
    }
}
