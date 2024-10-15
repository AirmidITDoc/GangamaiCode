import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { CityMasterService } from "./city-master.service";
import { takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { NewCityComponent } from "./new-city/new-city.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";

@Component({
    selector: "app-city-master",
    templateUrl: "./city-master.component.html",
    styleUrls: ["./city-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CityMasterComponent implements OnInit {
  
    msg: any;
  private _onDestroy = new Subject<void>();

    displayedColumns: string[] = [
        "CityId",
        "CityName",
        "StateId",
        "IsDeleted",
        "action",
    ];

    DSCityMasterList = new MatTableDataSource<CityMaster>();
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "CityMaster/List",
        columnsList: [
            { heading: "Code", key: "CityId", sort: false, align: 'left', emptySign: 'NA' },
            { heading: "City Name", key: "CityName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "State Name", key: "StateId", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "IsDeleted", key: "isActive", type: 'status', align: "center" },
            { heading: "Action", key: "action", align: "right", type: "action", action: [2, 3] } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "CityId",
        sortOrder: 0,
        filters: [
            { fieldName: "CityName", fieldValue: "", opType: OperatorComparer.Contains }
        ],
        row: 10
    }

    constructor(public _cityService: CityMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
      
        // this.getCityMasterCombo();
     
        //     this.cityFilterCtrl.valueChanges
        //     .pipe(takeUntil(this._onDestroy))
        //     .subscribe(() => {
        //         this.filterCity();
        //     });
    }

   
    changeStatus(status: any) {
        switch (status.id) {
            case 1:
                //this.onEdit(status.data)
                break;
            case 2:
                this.onEdit(status.data)
                break;
            case 5:
                this.onDeactive(status.data.genderId);
                break;
            default:
                break;
        }
    }
    onSearchClear() {
        this._cityService.myformSearch.reset({
            CityNameSearch: "",
            IsDeletedSearch: "2",
        });
      
    }

    onDeactive(genderId) {
        debugger
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            debugger
            if (result) {
                this._cityService.deactivateTheStatus(genderId).subscribe((data: any) => {
                    this.msg = data
                    if (data.StatusCode == 200) {
                        this.toastr.success(
                            "Record updated Successfully.",
                            "updated !",
                            {
                                toastClass:
                                    "tostr-tost custom-toast-success",
                            }
                        );
                        // this.getGenderMasterList();
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }
    
    

    onClear() {
        this._cityService.myform.reset({ IsDeleted: "false" });
        this._cityService.initializeFormGroup();
    }

    
    onEdit(row) {
        var m_data = {
            CityId: row.CITYID,
            CityName: row.CITYNAME,
            StateId: row.STATEID,
            StateName: row.STATENAME,
            IsDeleted: JSON.stringify(row.ISDELETED),
            UpdatedBy: row.UpdatedBy,
        };
        console.log(row);
        this._cityService.populateForm(m_data);
    }

    
    newCityMaster(){
        const dialogRef = this._matDialog.open(NewCityComponent,
          {
            maxWidth: "85vw",
            height: '65%',
            width: '70%',
          });
        dialogRef.afterClosed().subscribe(result => {
           console.log('The dialog was closed - Insert Action', result);
           
        });
      }
}

export class CityMaster {
    CityId: number;
    CityName: string;
    StateId: number;
    StateName: string;
    CountryId: number;
    CountryName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param CityMaster
     */
    constructor(CityMaster) {
        {
            this.CityId = CityMaster.CityId || "";
            this.CityName = CityMaster.CityName || "";
            this.StateId = CityMaster.StateId || "";
            this.StateName = CityMaster.StateName || "";
            this.CountryId = CityMaster.CountryId || "";
            this.CountryName = CityMaster.CountryName || "";
            this.IsDeleted = CityMaster.IsDeleted || "false";
            this.AddedBy = CityMaster.AddedBy || "";
            this.UpdatedBy = CityMaster.UpdatedBy || "";
        }
    }
}
