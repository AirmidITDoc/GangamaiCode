import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { DoctortypeMasterService } from "./doctortype-master.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "app/core/services/authentication.service";

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
    currentStatus = 2;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = ["Id", "DoctorType","AddedByName","IsActive", "action"];

    DSDoctorTypeMasterList = new MatTableDataSource<DoctortypeMaster>();
    DSDoctorTypeMasterList1 = new MatTableDataSource<DoctortypeMaster>();
    tempList = new MatTableDataSource<DoctortypeMaster>();

    constructor(public _doctortypeService: DoctortypeMasterService,
        public _loggedService:AuthenticationService,
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
    resultsLength=0;
    getDoctortypeMasterList() {
        var vdata={
            "DoctorType":this._doctortypeService.myformSearch.get('DoctorTypeSearch').value.trim() +"%" || "%"       
        }
        this._doctortypeService.getDoctortypeMasterList(vdata).subscribe((Menu) => {
             this.DSDoctorTypeMasterList.data = Menu as DoctortypeMaster[];
             this.DSDoctorTypeMasterList1.data = Menu as DoctortypeMaster[];
            // this.resultsLength= this.DSDoctorTypeMasterList.data.length;
              this.DSDoctorTypeMasterList.sort = this.sort;
               this.DSDoctorTypeMasterList.paginator = this.paginator;
            });
       
    }
  

   
    onClear() {
        this._doctortypeService.myform.reset({ isActive: "true" });
        this._doctortypeService.initializeFormGroup();
    }
 
    onSubmit() {
        if (this._doctortypeService.myform.valid) {
            if (!this._doctortypeService.myform.get("Id").value) {
                var m_data = {
                    "doctortTypeMasterInsert": {
                       "doctorType": this._doctortypeService.myform.get("DoctorType").value.trim(),
                       "isActive": Boolean(JSON.parse(this._doctortypeService.myform.get("isActive").value )
                        ),
                          "addedBy": this._loggedService.currentUserValue.user.id
                    },
                };

                this._doctortypeService.doctortTypeMasterInsert(m_data).subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getDoctortypeMasterList();
                           
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
                    "doctorTypeMasterUpdate": {
                        "id": this._doctortypeService.myform.get("Id").value,
                        "doctorType":
                            this._doctortypeService.myform.get("DoctorType")
                                .value,
                                "IsActive": Boolean(
                            JSON.parse(
                                this._doctortypeService.myform.get("isActive")
                                    .value
                            )
                        ),
                        "updatedBy":this._loggedService.currentUserValue.user.id
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

    onDeactive(row) { 
        Swal.fire({
            title: 'Confirm Status',
            text: 'Are you sure you want to Change Status?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes,Change Status!'
        }).then((result) => {
            if (result.isConfirmed) {
                let Query
                if (row.IsActive) {
                    Query = "Update DoctorTypeMaster set IsActive=0 where Id=" + row.Id;
                }
                else {
                     Query = "Update DoctorTypeMaster set IsActive=1 where Id=" + row.Id;
                }
                console.log(Query);
                this._doctortypeService.deactivateTheStatus(Query)
                    .subscribe((data) => {
                        // Handle success response
                        Swal.fire('Changed!', 'Doctor Type Status has been Changed.', 'success');
                        this.getDoctortypeMasterList();
                    }, (error) => {
                        // Handle error response
                        Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                    });
            }
        });
    }

    onFilterChange() {
       
        if (this.currentStatus == 1) {
            this.tempList.data = []
            this.DSDoctorTypeMasterList.data= this.DSDoctorTypeMasterList1.data
            for (let item of this.DSDoctorTypeMasterList.data) {
                if (item.IsActive) this.tempList.data.push(item)

            }

            this.DSDoctorTypeMasterList.data = [];
            this.DSDoctorTypeMasterList.data = this.tempList.data;
        }
        else if (this.currentStatus == 0) {
            this.DSDoctorTypeMasterList.data= this.DSDoctorTypeMasterList.data
            this.tempList.data = []

            for (let item of this.DSDoctorTypeMasterList.data) {
                if (!item.IsActive) this.tempList.data.push(item)

            }
            this.DSDoctorTypeMasterList.data = [];
            this.DSDoctorTypeMasterList.data = this.tempList.data;
        }
        else {
            this.DSDoctorTypeMasterList.data= this.DSDoctorTypeMasterList1.data
            this.tempList.data = this.DSDoctorTypeMasterList.data;
        }


    }
    toggle(val: any) {
        if (val == "2") {
            this.currentStatus = 2;
        } else if (val == "1") {
            this.currentStatus = 1;
        }
        else {
            this.currentStatus = 0;

        }
    }
    onEdit(row) {
        var m_data = {
            Id: row.Id,
            DoctorType: row.DoctorType.trim(),
            IsActive: row.IsActive,
        };
        this._doctortypeService.populateForm(m_data);
    }
}

export class DoctortypeMaster {
    Id: number;
    DoctorType: string;
    isActive: boolean;
    IsActive:any;
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
            this.IsActive = DoctortypeMaster.IsActive || true;
        }
    }
}

