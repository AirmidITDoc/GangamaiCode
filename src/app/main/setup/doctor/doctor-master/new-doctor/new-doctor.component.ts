import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { DoctorMasterComponent } from "../doctor-master.component";
import { MatDialogRef } from "@angular/material/dialog";
import { DoctorMasterService } from "../doctor-master.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { NotificationServiceService } from "app/core/notification-service.service";
import { takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
    selector: "app-new-doctor",
    templateUrl: "./new-doctor.component.html",
    styleUrls: ["./new-doctor.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewDoctorComponent implements OnInit {
    submitted = false;
    data1: [];

    PrefixcmbList: any = [];
    GendercmbList: any = [];
    DoctortypecmbList: any = [];
    DepartmentcmbList: any = [];
    selectedGenderID: any;
    msg: any;

    public departmentFilterCtrl: FormControl = new FormControl();
    public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

    public prefixFilterCtrl: FormControl = new FormControl();
    public filteredPrefix: ReplaySubject<any> = new ReplaySubject<any>(1);

    public doctortypeFilterCtrl: FormControl = new FormControl();
    public filteredDoctortype: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    constructor(
        public _doctorService: DoctorMasterService,
        private accountService: AuthenticationService,
        // public notification: NotificationServiceService,
        public dialogRef: MatDialogRef<DoctorMasterComponent>
    ) { }

    ngOnInit(): void {
        // this.editor = new Editor();
        this._doctorService.myform.reset();

        this.getPrefixNameCombobox();
        this.getGenderNameCombobox();
        this.getDoctortypeNameCombobox();
        this.getDepartmentNameCombobox();

        this.prefixFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterPrefix();
            });

        this.departmentFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterDepartment();
            });

        this.doctortypeFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterDoctortype();
            });
    }

    // validation
    get f() {
        return this._doctorService.myform.controls;
    }

    private filterPrefix() {
        if (!this.PrefixcmbList) {
            return;
        }
        // get the search keyword
        let search = this.prefixFilterCtrl.value;
        if (!search) {
            this.filteredPrefix.next(this.PrefixcmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredPrefix.next(
            this.PrefixcmbList.filter(
                (bank) => bank.PrefixName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    private filterDepartment() {
        // debugger;
        if (!this.DepartmentcmbList) {
            return;
        }
        // get the search keyword
        let search = this.departmentFilterCtrl.value;
        if (!search) {
            this.filteredDepartment.next(this.DepartmentcmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter
        this.filteredDepartment.next(
            this.DepartmentcmbList.filter(
                (bank) => bank.DepartmentName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    private filterDoctortype() {
        // debugger;
        if (!this.DoctortypecmbList) {
            return;
        }
        // get the search keyword
        let search = this.doctortypeFilterCtrl.value;
        if (!search) {
            this.filteredDoctortype.next(this.DoctortypecmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter
        this.filteredDoctortype.next(
            this.DoctortypecmbList.filter(
                (bank) => bank.DoctorType.toLowerCase().indexOf(search) > -1
            )
        );
    }
    getPrefixNameCombobox() {
        // this._doctorService.getPrefixMasterCombo().subscribe(data =>this.PrefixcmbList =data);
        this._doctorService.getPrefixMasterCombo().subscribe((data) => {
            this.PrefixcmbList = data;
            this.filteredPrefix.next(this.PrefixcmbList.slice());
        });
    }

    getGenderNameCombobox() {
        this._doctorService
            .getGenderMasterCombo()
            .subscribe((data) => (this.GendercmbList = data));
    }

    getDoctortypeNameCombobox() {
        // this._doctorService.getDoctortypeMasterCombo().subscribe(data =>this.DoctortypecmbList =data);
        this._doctorService.getDoctortypeMasterCombo().subscribe((data) => {
            this.DoctortypecmbList = data;
            this.filteredDoctortype.next(this.DoctortypecmbList.slice());
            this._doctorService.myform
                .get("DoctorTypeId")
                .setValue(this.DoctortypecmbList[0]);
        });
    }

    getDepartmentNameCombobox() {
        // this._doctorService.getDepartmentCombobox().subscribe(data =>this.DepartmentcmbList =data);

        this._doctorService.getDepartmentCombobox().subscribe((data) => {
            this.DepartmentcmbList = data;
            console.log(data);
            this.filteredDepartment.next(this.DepartmentcmbList.slice());
            this._doctorService.myform
                .get("Departmentid")
                .setValue(this.DepartmentcmbList[0]);
        });
    }

    onSubmit() {
        if (this._doctorService.myform.valid) {
            if (!this._doctorService.myform.get("DoctorId").value) {
                var data2 = [];
                // for (var val of this._doctorService.myform.get("Departmentid")
                //     .value) {
                var data = {
                    doctorId: 0,
                    departmentId:
                        this._doctorService.myform.get("Departmentid").value
                            .Departmentid,
                };
                data2.push(data);
                //}
                console.log(data2);
                var m_data = {
                    insertDoctorMaster: {
                        prefixID:
                            this._doctorService.myform.get("PrefixID").value
                                .PrefixID,
                        firstName:
                            this._doctorService.myform
                                .get("FirstName")
                                .value.trim() || "%",
                        middleName: this._doctorService.myform
                            .get("MiddleName")
                            .value.trim(),
                        lastName:
                            this._doctorService.myform
                                .get("LastName")
                                .value.trim() || "%",
                        dateOfBirth:
                            this._doctorService.myform.get("DateofBirth")
                                .value || "01/01/1900",
                        address:
                            this._doctorService.myform
                                .get("Address")
                                .value.trim() || "%",
                        city:
                            this._doctorService.myform
                                .get("City")
                                .value.trim() || "%",
                        pin:
                            this._doctorService.myform
                                .get("Pin")
                                .value.trim() || "0",
                        phone:
                            this._doctorService.myform
                                .get("Phone")
                                .value.trim() || "0",
                        mobile: this._doctorService.myform
                            .get("Mobile")
                            .value.trim(),
                        genderId:
                            this._doctorService.myform.get("GenderId").value
                                .GenderId,
                        education:
                            this._doctorService.myform
                                .get("Education")
                                .value.trim() || "%",
                        isConsultant: Boolean(
                            JSON.parse(
                                this._doctorService.myform.get("IsConsultant")
                                    .value
                            )
                        ),
                        isRefDoc: Boolean(
                            JSON.parse(
                                this._doctorService.myform.get("IsRefDoc").value
                            )
                        ),
                        isActive: Boolean(
                            JSON.parse(
                                this._doctorService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        doctorTypeId:
                            this._doctorService.myform.get("DoctorTypeId").value
                                .Id || 0,
                        ageYear:
                            this._doctorService.myform
                                .get("AgeYear")
                                .value.trim() || "0",
                        ageMonth:
                            this._doctorService.myform
                                .get("AgeMonth")
                                .value.trim() || "0",
                        ageDay:
                            this._doctorService.myform
                                .get("AgeDay")
                                .value.trim() || "0",
                        passportNo:
                            this._doctorService.myform
                                .get("PassportNo")
                                .value.trim() || "0",
                        esino:
                            this._doctorService.myform
                                .get("ESINO")
                                .value.trim() || "0",
                        regNo:
                            this._doctorService.myform
                                .get("RegNo")
                                .value.trim() || "0",
                        regDate:
                            this._doctorService.myform.get("RegDate").value ||
                            "01/01/1900",
                        mahRegNo:
                            this._doctorService.myform.get("MahRegNo").value ||
                            "0",
                        mahRegDate:
                            this._doctorService.myform.get("MahRegDate")
                                .value || "01/01/1900",
                        addedBy: 1,
                        updatedBy: 1,
                        isInHouseDoctor: true,
                        isOnCallDoctor: true,
                        doctorId:
                            this._doctorService.myform.get("DoctorId").value ||
                            "0",
                    },
                    assignDoctorDepartmentDet: data2,
                };
                console.log(m_data);
                this._doctorService
                    .doctortMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                    });
            } else {
                var data3 = [];
                // for (var val of this._doctorService.myform.get("DepartmentId")
                //     .value) {
                var data4 = {
                    departmentId:
                        this._doctorService.myform.get("Departmentid").value
                            .Departmentid || "0",
                    doctorId:
                        this._doctorService.myform.get("DoctorId").value || "0",
                };
                data3.push(data4);
                //  }
                var m_dataUpdate = {
                    updateDoctorMaster: {
                        doctorId:
                            this._doctorService.myform.get("DoctorId").value ||
                            "0",
                        prefixID:
                            this._doctorService.myform.get("PrefixID").value
                                .PrefixID,
                        firstName:
                            this._doctorService.myform
                                .get("FirstName")
                                .value.trim() || "%",
                        middleName:
                            this._doctorService.myform
                                .get("MiddleName")
                                .value.trim() || "%",
                        lastName:
                            this._doctorService.myform
                                .get("LastName")
                                .value.trim() || "%",
                        dateOfBirth:
                            this._doctorService.myform.get("DateofBirth")
                                .value || "01/01/1900",
                        address:
                            this._doctorService.myform
                                .get("Address")
                                .value.trim() || "%",
                        city:
                            this._doctorService.myform
                                .get("City")
                                .value.trim() || "%",
                        pin:
                            this._doctorService.myform
                                .get("Pin")
                                .value.trim() || "0",
                        phone:
                            this._doctorService.myform
                                .get("Phone")
                                .value.trim() || "0",
                        mobile:
                            this._doctorService.myform
                                .get("Mobile")
                                .value.trim() || "0",
                        genderID:
                            this._doctorService.myform.get("GenderId").value
                                .GenderId,
                        education:
                            this._doctorService.myform
                                .get("Education")
                                .value.trim() || "%",
                        isConsultant: Boolean(
                            JSON.parse(
                                this._doctorService.myform.get("IsConsultant")
                                    .value
                            )
                        ),
                        isRefDoc: Boolean(
                            JSON.parse(
                                this._doctorService.myform.get("IsRefDoc").value
                            )
                        ),
                        isActive: Boolean(
                            JSON.parse(
                                this._doctorService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        doctorTypeId:
                            this._doctorService.myform.get("DoctorTypeId").value
                                .Id || 0,
                        ageYear:
                            this._doctorService.myform.get("AgeYear").value ||
                            "0",
                        ageMonth:
                            this._doctorService.myform.get("AgeMonth").value ||
                            "0",
                        ageDay:
                            this._doctorService.myform.get("AgeDay").value ||
                            "0",
                        passportNo:
                            this._doctorService.myform.get("PassportNo")
                                .value || "0",
                        esino:
                            this._doctorService.myform.get("ESINO").value ||
                            "0",
                        regNo:
                            this._doctorService.myform.get("RegNo").value ||
                            "0",
                        regDate:
                            this._doctorService.myform.get("RegDate").value ||
                            "01/01/1900",
                        mahRegNo:
                            this._doctorService.myform.get("MahRegNo").value ||
                            "0",
                        mahRegDate:
                            this._doctorService.myform.get("MahRegDate")
                                .value || "01/01/1900",

                        updatedBy: 1,
                        isInHouseDoctor: true,
                        isOnCallDoctor: true,
                    },
                    deleteAssignDoctorToDepartment: {
                        doctorId:
                            this._doctorService.myform.get("DoctorId").value,
                    },
                    assignDoctorDepartmentDet: data3,
                };

                console.log(m_dataUpdate);
                this._doctorService
                    .doctortMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Record not updated",
                                "error"
                            );
                        }
                    });
            }
            this.onClose();
        }
    }
   

    onClear() {
        this._doctorService.myform.reset();
    }
    onClose() {
        this._doctorService.myform.reset();
        this.dialogRef.close();
    }

    onChangeGenderList(prefixObj) {
        if (prefixObj) {
            this._doctorService.getGenderCombo(prefixObj).subscribe((data) => {
                this.GendercmbList = data;
                this._doctorService.myform
                    .get("GenderId")
                    .setValue(this.GendercmbList[0]);
                // this.selectedGender = this.GenderList[0];
                this.selectedGenderID = this.GendercmbList[0].GenderId;
            });
        }
    }
}
