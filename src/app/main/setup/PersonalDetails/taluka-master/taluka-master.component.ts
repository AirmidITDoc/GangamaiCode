import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { TalukaMasterService } from "./taluka-master.service";
import { takeUntil } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-taluka-master",
    templateUrl: "./taluka-master.component.html",
    styleUrls: ["./taluka-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TalukaMasterComponent implements OnInit {
    TalukaMasterList: any;
    CitycmbList: any = [];
    msg: any;

    public cityFilterCtrl: UntypedFormControl = new UntypedFormControl();
    public filteredCity: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    displayedColumns: string[] = [
        "TalukaID",
        "TalukaNAME",
        "CityNAME",
        "AddedBy",
        "ISDELETED",
        "action",
    ];

    DSTalukaMasterList = new MatTableDataSource<TalukaMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _TalukaService: TalukaMasterService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getTalukaMasterList();
        this.getCityMasterCombo();

        this.cityFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterCity();
            });
    }
    onSearch() {
        this.getTalukaMasterList();
    }
    onSearchClear() {
        this._TalukaService.myformSearch.reset({
            TalukaNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getTalukaMasterList();
    }

    private filterCity() {
        // debugger;
        if (!this.CitycmbList) {
            return;
        }
        // get the search keyword
        let search = this.cityFilterCtrl.value;
        if (!search) {
            this.filteredCity.next(this.CitycmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter
        this.filteredCity.next(
            this.CitycmbList.filter(
                (bank) => bank.CityName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    getTalukaMasterList() {
        var param = {
            TalukaName:
                this._TalukaService.myformSearch
                    .get("TalukaNameSearch")
                    .value.trim() || "%",
        };
        this._TalukaService.getTalukaMasterList(param).subscribe((Menu) => {
            this.DSTalukaMasterList.data = Menu as TalukaMaster[];
            console.log(this.DSTalukaMasterList.data);
            this.DSTalukaMasterList.sort = this.sort;
            this.DSTalukaMasterList.paginator = this.paginator;
        });
    }

    getCityMasterCombo() {
        this._TalukaService.getCityMasterCombo().subscribe((data) => {
            this.CitycmbList = data;
            this.filteredCity.next(this.CitycmbList.slice());
        });
    }

    onClear() {
        this._TalukaService.myForm.reset({ IsDeleted: "false" });
        this._TalukaService.initializeFormGroup();
    }

    onSubmit() {
        if (this._TalukaService.myForm.valid) {
            if (!this._TalukaService.myForm.get("TalukaId").value) {
                var m_data = {
                    talukaMasterInsert: {
                        talukaName: this._TalukaService.myForm
                            .get("TalukaName")
                            .value.trim(),
                        cityId: this._TalukaService.myForm.get("CityId").value
                            .CityId,

                        addedBy: 1,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._TalukaService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                this._TalukaService
                    .talukaMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = m_data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getTalukaMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getTalukaMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Taluka Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getTalukaMasterList();
                    },error => {
                        this.toastr.error('Taluka Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     } );
            } else {
                var m_dataUpdate = {
                    talukaMasterUpdate: {
                        talukaId:
                            this._TalukaService.myForm.get("TalukaId").value,
                        talukaName: this._TalukaService.myForm
                            .get("TalukaName")
                            .value.trim(),
                        cityId: this._TalukaService.myForm.get("CityId").value
                            .CityId,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._TalukaService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                    },
                };
                this._TalukaService
                    .talukaMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = m_dataUpdate;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getTalukaMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getTalukaMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Taluka Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getTalukaMasterList();
                    },error => {
                        this.toastr.error('Taluka Master Data not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data1 = {
            TalukaId: row.TalukaID,
            TalukaName: row.TalukaNAME,
            CityId: row.CityID,
            IsDeleted: JSON.stringify(row.ISDELETED),
            UpdatedBy: row.UpdatedBy,
        };
        console.log(m_data1);
        this._TalukaService.populateForm(m_data1);
    }
}

export class TalukaMaster {
    TalukaId: number;
    TalukaName: string;
    CityId: number;
    CityName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param TalukaMaster
     */
    constructor(TalukaMaster) {
        {
            this.TalukaId = TalukaMaster.TalukaId || "";
            this.TalukaName = TalukaMaster.TalukaName || "";
            this.CityId = TalukaMaster.CityId || "";
            this.CityName = TalukaMaster.CityName || "";
            this.IsDeleted = TalukaMaster.IsDeleted || "false";
            this.AddedBy = TalukaMaster.AddedBy || "";
            this.UpdatedBy = TalukaMaster.UpdatedBy || "";
        }
    }
}
