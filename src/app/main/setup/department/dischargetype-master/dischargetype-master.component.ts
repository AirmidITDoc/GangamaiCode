import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { DischargetypeMasterService } from "./dischargetype-master.service";
import { MatAccordion } from "@angular/material/expansion";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { fuseAnimations } from "@fuse/animations";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { NewnewDischargetypeComponent } from "./newnew-dischargetype/newnew-dischargetype.component";

@Component({
    selector: "app-dischargetype-master",
    templateUrl: "./dischargetype-master.component.html",
    styleUrls: ["./dischargetype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DischargetypeMasterComponent implements OnInit {

    sIsLoading: string = '';
    hasSelectedContacts: boolean;
    step = 0;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    setStep(index: number) {
        this.step = index;
    }

    msg: any;
    SearchName: string;

    displayedColumns: string[] = [
        "DischargeTypeId",
        "DischargeTypeName",
        // "AddedBy",
        "IsDeleted",
        "action",
    ];

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    DSDischargeTypeMasterList = new MatTableDataSource<DischargeTypeMaster>();

    constructor(
        public _dischargetypeService: DischargetypeMasterService,
        public toastr: ToastrService,
        private _fuseSidebarService: FuseSidebarService,

        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.getdischargetypeMasterList();
    }
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._dischargetypeService.myformSearch.controls; }


    getdischargetypeMasterList() {
        var m_data = {
            DischargeTypeName: this._dischargetypeService.myformSearch.get("DischargeTypeNameSearch")
                .value.trim() + "%" || "%",
        };
        this._dischargetypeService
            .getdischargetypeMasterList(m_data).subscribe((Menu) => {
                this.DSDischargeTypeMasterList.data =
                    Menu as DischargeTypeMaster[];
                this.DSDischargeTypeMasterList.sort = this.sort;
                this.DSDischargeTypeMasterList.paginator = this.paginator;
                console.log(this.DSDischargeTypeMasterList);
            });
    }
    onSearch() {
        this.getdischargetypeMasterList();
    }

    onDeactive(DischargeTypeId) {
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
                const tableItem = this.DSDischargeTypeMasterList.data.find(item => item.DischargeTypeId === DischargeTypeId);
                console.log("table:", tableItem)

                if (tableItem.IsActive) {
                    Query = "Update DischargeTypeMaster set IsActive=0 where DischargeTypeId=" + DischargeTypeId;
                } else {
                    Query = "Update DischargeTypeMaster set IsActive=1 where DischargeTypeId=" + DischargeTypeId;
                }

                console.log("query:", Query);

                this._dischargetypeService.deactivateTheStatus(Query)
                    .subscribe(
                        (data) => {
                            Swal.fire('Changed!', 'DischargeType Status has been Changed.', 'success');
                            this.getdischargetypeMasterList();
                        },
                        (error) => {
                            Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                        }
                    );
            }

        });
    }

    onSearchClear() {
        this._dischargetypeService.myformSearch.reset({
            DischargeTypeNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getdischargetypeMasterList();
    }
    newDischarge() {
        const dialogRef = this._matDialog.open(NewnewDischargetypeComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "35%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getdischargetypeMasterList();
        });
    }

    onEdit(row) {
        // var m_data = {
        //     DischargeTypeId: row.DischargeTypeId,
        //     DischargeTypeName: row.DischargeTypeName.trim(),
        //     IsDeleted: JSON.stringify(row.IsDeleted),
        //     UpdatedBy: row.UpdatedBy,
        // };
        // this._dischargetypeService.populateForm(m_data);
        const dialogRef = this._matDialog.open(NewnewDischargetypeComponent,
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
            this.getdischargetypeMasterList();
        });
    }
}
export class DischargeTypeMaster {
    DischargeTypeId: number;
    DischargeTypeName: string;
    IsDeleted: boolean;
    IsActive: boolean;
    AddedBy: number;
    UpdatedBy: number;

    IsDeletedSearch: number;
    /**
     * Constructor
     *
     * @param DischargeTypeMaster
     */
    constructor(DischargeTypeMaster) {
        {
            this.DischargeTypeId = DischargeTypeMaster.DischargeTypeId || "";
            this.DischargeTypeName =
                DischargeTypeMaster.DischargeTypeName || "";
            this.IsDeleted = DischargeTypeMaster.IsDeleted || "false";
            this.IsActive = DischargeTypeMaster.IsActive || "";
            this.AddedBy = DischargeTypeMaster.AddedBy || "";
            this.UpdatedBy = DischargeTypeMaster.UpdatedBy || "";
            this.IsDeletedSearch = DischargeTypeMaster.IsDeletedSearch || "";
        }
    }
}
