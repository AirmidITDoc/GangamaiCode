import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { LocationMasterService } from "./location-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { NewlocationComponent } from "./newlocation/newlocation.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: "app-location-master",
    templateUrl: "./location-master.component.html",
    styleUrls: ["./location-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LocationMasterComponent implements OnInit {
    LocationMasterList: any;
    sIsLoading: string = '';
    msg: any;
    hasSelectedContacts: boolean;

    displayedColumns: string[] = [
        "LocationId",
        "LocationName",
        "IsActive",
        "action",
    ];

    DSLocationMasterList = new MatTableDataSource<LocationMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _locationService: LocationMasterService,
        public toastr: ToastrService,
        private _fuseSidebarService: FuseSidebarService,
        public _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.getLocationMasterList();
    }
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._locationService.myformSearch.controls; }

    onSearch() {
        this.getLocationMasterList();
    }

    onSearchClear() {
        this._locationService.myformSearch.reset({
            LocationNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getLocationMasterList();
    }

    newLocation() {
        const dialogRef = this._matDialog.open(NewlocationComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "35%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getLocationMasterList();
        });
    }

    getLocationMasterList() {
        var param = {
            LocationName: this._locationService.myformSearch.get("LocationNameSearch")
                .value.trim() + "%" || "%",
        };
        this._locationService.getLocationMasterList(param).subscribe((Menu) => {
            this.DSLocationMasterList.data = Menu as LocationMaster[];
            this.DSLocationMasterList.sort = this.sort;
            this.DSLocationMasterList.paginator = this.paginator;
        });
    }

    onClear() {
        this._locationService.myform.reset({ IsDeleted: "false" });
        this._locationService.initializeFormGroup();
    }

    onEdit(contact) {
        // var m_data = {
        //     LocationId: row.LocationId,
        //     LocationName: row.LocationName.trim(),
        //     IsDeleted: JSON.stringify(row.IsActive),
        // };
        // this._locationService.populateForm(m_data);

        const dialogRef = this._matDialog.open(NewlocationComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "35%",
                data: {
                    Obj: contact
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getLocationMasterList();
        });
    }

      onDeactive(LocationId){
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
            const tableItem = this.DSLocationMasterList.data.find(item => item.LocationId === LocationId);
            console.log("table:",tableItem)
        
            if (tableItem.IsActive) {
                Query = "Update LocationMaster set IsActive=0 where LocationId=" + LocationId;
            } else {
                Query = "Update LocationMaster set IsActive=1 where LocationId=" + LocationId;
            }
        
            console.log("query:", Query);
        
            this._locationService.deactivateTheStatus(Query)
                .subscribe(
                    (data) => {
                        Swal.fire('Changed!', 'Location Status has been Changed.', 'success');
                        this.getLocationMasterList();
                    },
                    (error) => {
                        Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                    }
                );
        }
        
      });
      }
}
export class LocationMaster {
    LocationId: number;
    LocationName: string;
    IsDeleted: boolean;
    IsActive: any;
    // UpdatedBy: number;

    /**
     * Constructor
     *
     * @param LocationMaster
     */
    constructor(LocationMaster) {
        {
            this.LocationId = LocationMaster.LocationId || "";
            this.LocationName = LocationMaster.LocationName || "";
            this.IsDeleted = LocationMaster.IsDeleted || "";
            this.IsActive = LocationMaster.IsActive || "";
            // this.UpdatedBy = LocationMaster.UpdatedBy || "";
        }
    }
}
