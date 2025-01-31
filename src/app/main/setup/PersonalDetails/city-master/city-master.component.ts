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
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { NewcityMasterComponent } from "./newcity-master/newcity-master.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: "app-city-master",
    templateUrl: "./city-master.component.html",
    styleUrls: ["./city-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CityMasterComponent implements OnInit {
    CityMasterList: any;
    // StatecmbList: any = [];
    msg: any;
    sIsLoading: string = '';
    hasSelectedContacts: boolean;
    // CitycmbList: any = [];

    //state filter
    // public stateFilterCtrl: FormControl = new FormControl();
    // public filteredState: ReplaySubject<any> = new ReplaySubject<any>(1);
    // public cityFilterCtrl: FormControl = new FormControl();
    // public filteredCity: ReplaySubject<any> = new ReplaySubject<any>(1);


    private _onDestroy = new Subject<void>();

    displayedColumns: string[] = [
        "CityId",
        "CityName",
        //"STATEID",
        "StateName",
        //  "COUNTRYID",
        "CountryName",
        // "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSCityMasterList = new MatTableDataSource<CityMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._cityService.myformSearch.controls; }

    constructor(public _cityService: CityMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,) { }

    ngOnInit(): void {
        this.getCityMasterList();
        // this.getStateNameCombobox();
        // this.getCityMasterCombo();


        // this.stateFilterCtrl.valueChanges
        //     .pipe(takeUntil(this._onDestroy))
        //     .subscribe(() => {
        //         this.filterState();
        //     });

        // this.cityFilterCtrl.valueChanges
        // .pipe(takeUntil(this._onDestroy))
        // .subscribe(() => {
        //     this.filterCity();
        // });
    }

    // apiUrl = 'Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional'; 
    // apiParams = {
    //     Id: 10181
    //      };

    // onSelectionChange(selectedOption: any) {
    //     console.log('Selected option:', selectedOption);
    // }
    // displayOption(option: any): string {
    //     return option ? option.StateName : '';
    // }

    onSearch() {
        this.getCityMasterList();
    }

    onSearchClear() {
        this._cityService.myformSearch.reset({
            CityNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getCityMasterList();
    }
    // private filterCity() {
    //     // debugger;
    //     if (!this.CitycmbList) {
    //         return;
    //     }
    //     // get the search keyword
    //     let search = this.cityFilterCtrl.value;
    //     if (!search) {
    //         this.filteredCity.next(this.CitycmbList.slice());
    //         return;
    //     } else {
    //         search = search.toLowerCase();
    //     }
    //     // filter
    //     this.filteredCity.next(
    //         this.CitycmbList.filter(
    //             (bank) => bank.CityName.toLowerCase().indexOf(search) > -1
    //         )
    //     );     
    // }
    // getCityMasterCombo() {
    //     this._cityService.getCityMasterCombo().subscribe((data) => {
    //         this.CitycmbList = data;
    //         this.filteredCity.next(this.CitycmbList.slice());
    //              console.log(this.CitycmbList)
    //     });
    // }

    // onChangeCityList(CityObj) {

    //   //  debugger
    //     if (CityObj) {
    //       this._cityService.getStateList(CityObj.CityId).subscribe((data: any) => {
    //            this.StatecmbList = data;
    //        console.log( this.StatecmbList);

    //        this._cityService.myform.get('StateId').setValue(this.StatecmbList[0]);  
    //       });

    //     }
    //   }


    // private filterState() {
    //     if (!this.StatecmbList) {
    //         return;
    //     }
    //     // get the search keyword
    //     let search = this.stateFilterCtrl.value;
    //     if (!search) {
    //         this.filteredState.next(this.StatecmbList.slice());
    //         return;
    //     } else {
    //         search = search.toLowerCase();
    //     }
    //     // filter the banks
    //     this.filteredState.next(
    //         this.StatecmbList.filter(
    //             (bank) => bank.StateName.toLowerCase().indexOf(search) > -1

    //         )
    //     );
    // }

    getCityMasterList() {
        var param = {
            CityName:
                this._cityService.myformSearch
                    .get("CityNameSearch")
                    .value.trim() || "%",
        };
        this._cityService.getCityMasterList(param).subscribe((Menu) => {
            this.DSCityMasterList.data = Menu as CityMaster[];
            this.DSCityMasterList.sort = this.sort;
            this.DSCityMasterList.paginator = this.paginator;
        });
    }

    // getStateNameCombobox() {
    //     this._cityService.getStateMasterCombo().subscribe((data) => {
    //             this.StatecmbList = data
    //         });
    //         console.log(this.StatecmbList)
    // }


    // onClear() {
    //     this._cityService.myform.reset({ IsDeleted: "false" });
    //     this._cityService.initializeFormGroup();
    // }

    // onSubmit() {
    //     if (this._cityService.myform.valid) {
    //         if (!this._cityService.myform.get("CityId").value) {
    //             var m_data = {
    //                 cityMasterInsert: {
    //                     cityName: this._cityService.myform.get("CityName").value.CityName,
    //                     stateId:
    //                         this._cityService.myform.get("StateId").value.StateId,
    //                     addedBy: 1,
    //                     isDeleted: Boolean(
    //                         JSON.parse(
    //                             this._cityService.myform.get("IsDeleted").value
    //                         )
    //                     ),
    //                 },
    //             };

    //             this._cityService.cityMasterInsert(m_data).subscribe((data) => {
    //                 this.msg = data;
    //                 if (data) {
    //                     this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                         toastClass: 'tostr-tost custom-toast-success',
    //                       });
    //                     this.getCityMasterList();
    //                     // Swal.fire(
    //                     //     "Saved !",
    //                     //     "Record saved Successfully !",
    //                     //     "success"
    //                     // ).then((result) => {
    //                     //     if (result.isConfirmed) {
    //                     //         this.getCityMasterList();
    //                     //     }
    //                     // });
    //                 } else {
    //                     this.toastr.error('City Master Data not saved !, Please check API error..', 'Error !', {
    //                         toastClass: 'tostr-tost custom-toast-error',
    //                       });
    //                 }
    //                 this.getCityMasterList();
    //             },error => {
    //                 this.toastr.error('City Data not saved !, Please check API error..', 'Error !', {
    //                  toastClass: 'tostr-tost custom-toast-error',
    //                });
    //              } );
    //         } else {
    //             var m_dataUpdate = {
    //                 cityMasterUpdate: {
    //                     cityId: this._cityService.myform.get("CityId").value,
    //                     cityName: this._cityService.myform.get("CityName").value.CityName,
    //                     stateId:
    //                         this._cityService.myform.get("StateId").value
    //                             .StateId,
    //                     isDeleted: Boolean(
    //                         JSON.parse(
    //                             this._cityService.myform.get("IsDeleted").value
    //                         )
    //                     ),
    //                     updatedBy: 1,
    //                 },
    //             };

    //             this._cityService
    //                 .cityMasterUpdate(m_dataUpdate)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record updated Successfully.', 'updated !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
    //                           this.getCityMasterList();
    //                         // Swal.fire(
    //                         //     "Updated !",
    //                         //     "Record updated Successfully !",
    //                         //     "success"
    //                         // ).then((result) => {
    //                         //     if (result.isConfirmed) {
    //                         //         this.getCityMasterList();
    //                         //     }
    //                         // });
    //                     } else {
    //                         this.toastr.error('City Master Data not updated !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
    //                     this.getCityMasterList();
    //                 },error => {
    //                     this.toastr.error('City Data not Updated !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  } );
    //         }
    //         this.onClear();
    //     }
    // }

    newCity() {
        const dialogRef = this._matDialog.open(NewcityMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "40%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getCityMasterList();
        });
    }
    onEdit(row) {
        // var m_data = {
        //     CityId: row.CITYID,
        //     CityName: row.CITYNAME,
        //     StateId: row.STATEID,
        //     StateName: row.STATENAME,
        //     // CountryId: row.COUNTRYID,
        //     //  CountryName: row.COUNTRYNAME,
        //     IsDeleted: JSON.stringify(row.ISDELETED),
        //     UpdatedBy: row.UpdatedBy,
        // };
        // console.log(row);
        // this._cityService.populateForm(m_data);
        const dialogRef = this._matDialog.open(NewcityMasterComponent,
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
            this.getCityMasterList();
        });
    }
    onDeactive(CityId) {
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
                const tableItem = this.DSCityMasterList.data.find(item => item.CityId === CityId);
                console.log("table:", tableItem)

                if (tableItem.IsDeleted) {
                    Query = "Update M_CityMaster set IsDeleted=0 where CityId=" + CityId;
                } else {
                    Query = "Update M_CityMaster set IsDeleted=1 where CityId=" + CityId;
                }

                console.log("query:", Query);

                this._cityService.deactivateTheStatus(Query)
                    .subscribe(
                        (data) => {
                            Swal.fire('Changed!', 'City Status has been Changed.', 'success');
                            this.getCityMasterList();
                        },
                        (error) => {
                            Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                        }
                    );
            }

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
