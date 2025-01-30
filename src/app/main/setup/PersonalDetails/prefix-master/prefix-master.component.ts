import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { PrefixMasterService } from "./prefix-master.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { NewprefixMasterComponent } from "./newprefix-master/newprefix-master.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: "app-prefix-master",
    templateUrl: "./prefix-master.component.html",
    styleUrls: ["./prefix-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PrefixMasterComponent implements OnInit {
    GendercmbList: any = [];
    msg: any;
    sIsLoading: string = '';
    hasSelectedContacts: boolean;

    displayedColumns: string[] = [
        "PrefixID",
        "PrefixName",
        "GenderName",
        "IsDeleted",
        "action",
    ];

    isLoading: String = '';

    dsPrefixMasterList = new MatTableDataSource<PrefixMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._PrefixService.myformSearch.controls; }

    options: any[] = [];
    constructor(public _PrefixService: PrefixMasterService,
        public toastr: ToastrService,
        private _fuseSidebarService: FuseSidebarService,
        private _httpClient: HttpClient,
        public _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.getPrefixMasterList();
        // this.getGenderNameCombobox();
    }

    newPrefix() {
        const dialogRef = this._matDialog.open(NewprefixMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "40%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getPrefixMasterList();
        });
    }

    // new dropdown code
    // apiUrl = 'Generic/GetByProc?procName=RetrieveGenderMasterForCombo';
    // onSelectionChange(selectedOption: any) {
    //     console.log('Selected option:', selectedOption);
    // }
    // displayOption(option: any): string {
    //     return option ? option.GenderName : '';
    // }

    onSearch() {
        this.getPrefixMasterList();
    }

    onSearchClear() {
        this._PrefixService.myformSearch.reset({
            PrefixNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getPrefixMasterList();
    }

    // getGenderNameCombobox() {
    //     this._PrefixService.getGenderMasterCombo().subscribe((data) => (this.GendercmbList = data));

    // }

    // getGenderNameCombobox() {
    //     this._PrefixService.getGenderMasterCombo().subscribe(data => {
    //         this.GendercmbList = data;
    //         console.log(this.GendercmbList);
    //     });
    // }

    getPrefixMasterList() {
        var Param = {
            PrefixName:
                this._PrefixService.myformSearch.get("PrefixNameSearch").value.trim() + "%" || "%",
            // p_IsDeleted:
            //     this._PrefixService.myformSearch.get("IsDeletedSearch").value,
        };
        // console.log(Param)
        this._PrefixService.getPrefixMasterList(Param).subscribe((Menu) => {
            this.dsPrefixMasterList.data = Menu as PrefixMaster[];
            this.dsPrefixMasterList.sort = this.sort;
            this.dsPrefixMasterList.paginator = this.paginator;
            console.log(this.dsPrefixMasterList)
        });
    }

    onEdit(row) {
        // var m_data = {
        //     PrefixID: row.PrefixID,
        //     PrefixName: row.PrefixName,
        //     SexID: row.SexID,
        //     IsDeleted: JSON.stringify(row.IsActive),
        //     UpdatedBy: row.UpdatedBy,
        // };
        // this._PrefixService.populateForm(m_data);
        const dialogRef = this._matDialog.open(NewprefixMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "40%",
                data: {
                    Obj: row
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getPrefixMasterList();
        });
    }

        onDeactive(PrefixID) {
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
                    const tableItem = this.dsPrefixMasterList.data.find(item => item.PrefixID === PrefixID);
                    console.log("table:", tableItem)
    
                    if (tableItem.IsActive) {
                        Query = "Update DB_PrefixMaster set IsActive=0 where PrefixID=" + PrefixID;
                    } else {
                        Query = "Update DB_PrefixMaster set IsActive=1 where PrefixID=" + PrefixID;
                    }
    
                    console.log("query:", Query);
    
                    this._PrefixService.deactivateTheStatus(Query)
                        .subscribe(
                            (data) => {
                                Swal.fire('Changed!', 'Prefix Status has been Changed.', 'success');
                                this.getPrefixMasterList();
                            },
                            (error) => {
                                Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                            }
                        );
                }
    
            });
        }
}

export class PrefixMaster {
    PrefixID: number;
    PrefixName: string;
    SexID: number;
    IsDeleted: boolean;
    IsActive: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param PrefixMaster
     */
    constructor(PrefixMaster) {
        {
            this.PrefixID = PrefixMaster.PrefixID || 0;
            this.PrefixName = PrefixMaster.PrefixName || "";
            this.SexID = PrefixMaster.SexID || 0;
            this.IsDeleted = PrefixMaster.IsDeleted || "false";
            this.IsActive = PrefixMaster.IsActive || "";
            this.AddedBy = PrefixMaster.AddedBy || 0;
            this.UpdatedBy = PrefixMaster.UpdatedBy || 0;
        }
    }
}
