import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { CompanyMasterService } from "../company-master.service";
import { CompanyMasterComponent } from "../company-master.component";
import { MatDialogRef } from "@angular/material/dialog";
import { takeUntil } from "rxjs/operators";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-company-master-list",
    templateUrl: "./company-master-list.component.html",
    styleUrls: ["./company-master-list.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CompanyMasterListComponent implements OnInit {
    submitted = false;
    CompanytypecmbList: any = [];
    TariffcmbList: any = [];
    // SubGroupcmbList:any=[];

    msg: any;
    dataArray = {};
    isLoading = true;

    //company filter
    public companytypeFilterCtrl: FormControl = new FormControl();
    public filteredCompanytype: ReplaySubject<any> = new ReplaySubject<any>(1);

    //tariff filter
    public tariffFilterCtrl: FormControl = new FormControl();
    public filteredTariff: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();
    getCompanyMaster: any;

    constructor(
        public _companyService: CompanyMasterService,
        public toastr : ToastrService,
      //  public company : CompanyMasterComponent,

        public dialogRef: MatDialogRef<CompanyMasterComponent>
    ) {}

    ngOnInit(): void {
        this.geCompanytypeNameCombobox();
        this.geTariffNameCombobox();
        
        //this.geSubgroupNameCombobox();

        this.tariffFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterTariff();
            });

        this.companytypeFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterCompanytype();
            });
    }

    get f() {
        return this._companyService.myform.controls;
    }

    private filterTariff() {
        if (!this.TariffcmbList) {
            return;
        }
        // get the search keyword
        let search = this.tariffFilterCtrl.value;
        if (!search) {
            this.filteredTariff.next(this.TariffcmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredTariff.next(
            this.TariffcmbList.filter(
                (bank) => bank.TariffName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    private filterCompanytype() {
        // debugger;
        if (!this.CompanytypecmbList) {
            return;
        }
        // get the search keyword
        let search = this.companytypeFilterCtrl.value;
        if (!search) {
            this.filteredCompanytype.next(this.CompanytypecmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter
        this.filteredCompanytype.next(
            this.CompanytypecmbList.filter(
                (bank) => bank.TypeName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    geCompanytypeNameCombobox() {
        this._companyService.getCompanytypeMasterCombo().subscribe((data) => {
            this.CompanytypecmbList = data;
            this._companyService.myform.get("CompTypeId").setValue(this.CompanytypecmbList[0]);
        });
    }

    geTariffNameCombobox() {
        this._companyService.getTariffMasterCombo().subscribe((data) => {
            this.TariffcmbList = data;
            this._companyService.myform
                .get("TariffId")
                .setValue(this.TariffcmbList[0]);
        });
    }
    
    onSubmit() {
        if (this._companyService.myform.valid) {
            if (!this._companyService.myform.get("CompanyId").value) {
                var m_data = {
                    companyMasterInsert: {
                        compTypeId:
                            this._companyService.myform.get("CompTypeId").value
                                .CompanyTypeId,
                        companyName: this._companyService.myform
                            .get("CompanyName")
                            .value.trim(),
                        address: this._companyService.myform
                            .get("Address")
                            .value.trim(),
                        city: this._companyService.myform
                            .get("City")
                            .value.trim(),
                        pinNo: this._companyService.myform
                            .get("PinNo")
                            .value.trim(),
                        phoneNo: this._companyService.myform
                            .get("PhoneNo")
                            .value.trim(),
                        mobileNo: this._companyService.myform
                            .get("MobileNo")
                            .value.trim(),
                        faxNo: this._companyService.myform
                            .get("FaxNo")
                            .value.trim(),
                        tariffId:
                            this._companyService.myform.get("TariffId").value
                                .TariffId,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._companyService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 10,
                        updatedBy: 0,
                        isCancelled: false,
                        isCancelledBy: 0,
                        isCancelledDate: "01/01/1900",
                    },
                };
                console.log(m_data);
                this._companyService
                    .companyMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getCompanyMaster();
                            // this.getGroupMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //     }
                            // });
                        } else {
                            this.toastr.error('Company Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getCompanyMaster();
                    },error => {
                        this.toastr.error('Company Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    companyMasterUpdate: {
                        companyId:
                            this._companyService.myform.get("CompanyId").value,
                        compTypeId:
                            this._companyService.myform.get("CompTypeId").value
                                .CompanyTypeId,
                        companyName: this._companyService.myform
                            .get("CompanyName")
                            .value.trim(),
                        address: this._companyService.myform
                            .get("Address")
                            .value.trim(),
                        city: this._companyService.myform
                            .get("City")
                            .value.trim(),
                        pinNo: this._companyService.myform
                            .get("PinNo")
                            .value.trim(),
                        phoneNo: this._companyService.myform
                            .get("PhoneNo")
                            .value.trim(),
                        mobileNo: this._companyService.myform
                            .get("MobileNo")
                            .value.trim(),
                        faxNo: this._companyService.myform
                            .get("FaxNo")
                            .value.trim(),
                        tariffId:
                            this._companyService.myform.get("TariffId").value
                                .TariffId,
                        isActive: Boolean(
                            JSON.parse(
                                this._companyService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 10,
                        updatedBy: 1,
                        isCancelled: false,
                        isCancelledBy: 0,
                        isCancelledDate: "01/01/1900",
                    },
                };

                this._companyService
                    .companyMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getCompanyMaster();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //     }
                            // });
                        } else {
                            this.toastr.error('Company Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                            
                        }
                        this.getCompanyMaster();
                    },error => {
                        this.toastr.error('Company Data not Updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                       
                     });
            }
            this.onClose();
        }
    }
    // onEdit(row) {
    //     var m_data = {
    //         CompanyId: row.CompanyId,
    //         CompTypeId: row.CompTypeId,
    //         CompanyName: row.CompanyName.trim(),
    //         Address: row.Address.trim(),
    //         City: row.City.trim(),
    //         PinNo: row.PinNo.trim(),
    //         PhoneNo: row.PhoneNo.trim(),
    //         MobileNo: row.MobileNo.trim(),
    //         FaxNo: row.FaxNo.trim(),
    //         TariffId: row.TariffId,
    //         IsDeleted: JSON.stringify(row.IsDeleted),
    //         UpdatedBy: row.UpdatedBy,
    //         IsCancelled: JSON.stringify(row.IsCancelled),
    //         IsCancelledBy: row.IsCancelledBy,
    //         IsCancelledDate: row.IsCancelledDate,
    //     };
    //     this._companyService.populateForm(m_data);
    // }

    onClear() {
        this._companyService.myform.reset();
    }
    onClose() {
        this._companyService.myform.reset();
        this.dialogRef.close();
    }
}
