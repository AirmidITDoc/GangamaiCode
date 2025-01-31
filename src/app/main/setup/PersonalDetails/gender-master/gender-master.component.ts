import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { GenderMasterService } from "./gender-master.service";
import { MatDialog} from "@angular/material/dialog";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { NewgenderMasterComponent } from "./newgender-master/newgender-master.component";
import Swal from "sweetalert2";

@Component({
    selector: "app-gender-master",
    templateUrl: "./gender-master.component.html",
    styleUrls: ["./gender-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GenderMasterComponent implements OnInit {
    GenderMasterList: any;
    msg: any;
    sIsLoading: string = '';
    hasSelectedContacts: boolean;

    displayedColumns: string[] = [
        "GenderId",
        "GenderName",
        "IsDeleted",
        "action",
    ];

    DSGenderMasterList = new MatTableDataSource<GenderMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._GenderService.myformSearch.controls; }
    
    constructor(
        public _GenderService: GenderMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
    ) { }

    ngOnInit(): void {
        this.getGenderMasterList();
    }

    newGender() {
        const dialogRef = this._matDialog.open(NewgenderMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "30%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getGenderMasterList();
        });
    }

    onSearch() {
        this.getGenderMasterList();
    }

    onSearchClear() {
        this._GenderService.myformSearch.reset({
            GenderNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getGenderMasterList();
    }

    getGenderMasterList(){
         this.sIsLoading='loading-data';
            var vdata={
              "GenderName":this._GenderService.myformSearch.get('GenderNameSearch').value + '%' || '%',
            }
            console.log("GenderName:",vdata)
            this._GenderService.getGenderMasterList(vdata).subscribe(data=>{
              this.DSGenderMasterList.data=data as unknown as GenderMaster[];
              console.log("data:",this.DSGenderMasterList.data);
              this.DSGenderMasterList.sort=this.sort;
              this.DSGenderMasterList.paginator=this.paginator;
              this.sIsLoading='';
            },
          error=>{
            this.sIsLoading='';
          });
    }

    onEdit(row) {
        // var m_data = {
        //     GenderId: row.GenderId,
        //     GenderName: row.GenderName.trim(),
        //     IsDeleted: JSON.stringify(row.IsActive),
        // };
        // this._GenderService.populateForm(m_data);

        const dialogRef = this._matDialog.open(NewgenderMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "30%",
                data: {
                    Obj: row
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getGenderMasterList();
        });
    }

    onDeactive(GenderId) {
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
                const tableItem = this.DSGenderMasterList.data.find(item => item.GenderId === GenderId);
                console.log("table:", tableItem)

                if (tableItem.IsActive) {
                    Query = "Update DB_Gendermaster set IsActive=0 where GenderId=" + GenderId;
                } else {
                    Query = "Update DB_Gendermaster set IsActive=1 where GenderId=" + GenderId;
                }

                console.log("query:", Query);

                this._GenderService.deactivateTheStatus(Query)
                    .subscribe(
                        (data) => {
                            Swal.fire('Changed!', 'Gender Status has been Changed.', 'success');
                            this.getGenderMasterList();
                        },
                        (error) => {
                            Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                        }
                    );
            }

        });
    }
}

export class GenderMaster {
    GenderId: number;
    GenderName: string;
    IsDeleted: boolean;
    IsActive: boolean;

    /**
     * Constructor
     *
     * @param GenderMaster
     */
    constructor(GenderMaster) {
        {
            this.GenderId = GenderMaster.GenderId || 0;
            this.GenderName = GenderMaster.GenderName || "";
            this.IsDeleted = GenderMaster.IsDeleted || "true";
            this.IsActive = GenderMaster.IsActive || "";
        }
    }
}
