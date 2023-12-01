import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { DoctortypeMasterService } from "./doctortype-master.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-doctortype-master",
    templateUrl: "./doctortype-master.component.html",
    styleUrls: ["./doctortype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DoctortypeMasterComponent implements OnInit {
    isLoading = true;
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = ["Id", "DoctorType","IsDeleted", "action"];

    DSDoctorTypeMasterList = new MatTableDataSource<DoctortypeMaster>();

    constructor(public _doctortypeService: DoctortypeMasterService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getDoctortypeMasterList();
    }
    onSearch() {
        this.getDoctortypeMasterList();
    }
    onSearchClear() {
        this._doctortypeService.myformSearch.reset({
            DoctorTypeSearch: "",
            IsDeletedSearch: "2",
        });
        this.getDoctortypeMasterList();
    }

    getDoctortypeMasterList() {
        var vdata={
            "DoctorType":this._doctortypeService.myformSearch.get('DoctorTypeSearch').value.trim() || "%"       
        }
        this._doctortypeService.getDoctortypeMasterList(vdata).subscribe((Menu) => {
             this.DSDoctorTypeMasterList.data = Menu as DoctortypeMaster[];
            });
        // var m = {
        //     DoctorType: this._doctortypeService.myformSearch.get('DoctorTypeSearch').value.trim() || "%"
        // };
        // console.log(m);
        //      this._doctortypeService.getDoctortypeMasterList(m).subscribe((Menu) => {
        //     this.DSDoctorTypeMasterList.data = Menu as DoctortypeMaster[];
        //     this.DSDoctorTypeMasterList.sort = this.sort;
        //     this.DSDoctorTypeMasterList.paginator = this.paginator;
        // });
        // console.log(this.DSDoctorTypeMasterList);
    }
  

   
    onClear() {
        this._doctortypeService.myform.reset({ IsDeleted: "false" });
        this._doctortypeService.initializeFormGroup();
    }

    onSubmit() {
        if (this._doctortypeService.myform.valid) {
            if (!this._doctortypeService.myform.get("Id").value) {
                var m_data = {
                    doctortTypeMasterInsert: {
                        doctorType: this._doctortypeService.myform
                            .get("DoctorType")
                            .value.trim(),
                        IsActive: Boolean(
                            JSON.parse(
                                this._doctortypeService.myform.get("isActive")
                                    .value
                            )
                        ),
                    },
                };

                this._doctortypeService
                    .doctortTypeMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getDoctortypeMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //     }
                            // });
                        } else {
                            this.toastr.error('DoctorType Master Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getDoctortypeMasterList();
                    },error => {
                        this.toastr.error('DoctorType Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    doctorTypeMasterUpdate: {
                        id: this._doctortypeService.myform.get("Id").value,
                        doctorType:
                            this._doctortypeService.myform.get("DoctorType")
                                .value,
                                IsActive: Boolean(
                            JSON.parse(
                                this._doctortypeService.myform.get("isActive")
                                    .value
                            )
                        ),
                    },
                };
                this._doctortypeService
                    .doctorTypeMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getDoctortypeMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //     }
                            // });
                        } else {
                            this.toastr.error('DoctorType Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getDoctortypeMasterList();
                    },error => {
                        this.toastr.error('DoctorType Data not Updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
                    
                    
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            Id: row.Id,
            DoctorType: row.DoctorType.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
        };
        this._doctortypeService.populateForm(m_data);
    }
}

export class DoctortypeMaster {
    Id: number;
    DoctorType: string;
    isActive: boolean;
    /**
     * Constructor
     *
     * @param DoctortypeMaster
     */
    constructor(DoctortypeMaster) {
        {
            this.Id = DoctortypeMaster.Id || "";
            this.DoctorType = DoctortypeMaster.DoctorType || "";
            this.isActive = DoctortypeMaster.isActive || true;
        }
    }
}

