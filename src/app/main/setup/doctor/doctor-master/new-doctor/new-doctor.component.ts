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
                for (var val of this._doctorService.myform.get("Departmentid")
                    .value) {
                    var data = {
                        DepartmentId: val,
                        DoctorId: 0,
                    };
                    data2.push(data);
                }
                console.log(data2);
                var m_data = {
                    insertDoctorMaster: {
                        DoctorId:
                            "0" ||
                            this._doctorService.myform.get("DoctorId").value,
                        PrefixID:
                            this._doctorService.myform.get("PrefixID").value.PrefixID,
                        FirstName:
                            this._doctorService.myform
                                .get("FirstName")
                                .value.trim() || "%",
                        MiddleName: this._doctorService.myform
                            .get("MiddleName")
                            .value.trim(),
                        LastName:
                            this._doctorService.myform
                                .get("LastName")
                                .value.trim() || "%",
                        DateofBirth:
                            this._doctorService.myform.get("DateofBirth").value,
                        Address:
                            this._doctorService.myform
                                .get("Address")
                                .value.trim() || "%",
                        City:
                            this._doctorService.myform
                                .get("City")
                                .value.trim() || "%",
                        Pin:
                            this._doctorService.myform
                                .get("Pin")
                                .value.trim() || "0",
                        Phone:
                            this._doctorService.myform
                                .get("Phone")
                                .value.trim() || "0",
                        Mobile: this._doctorService.myform
                            .get("Mobile")
                            .value.trim(),
                        GenderId:
                            this._doctorService.myform.get("GenderId").value,
                        Education:
                            this._doctorService.myform
                                .get("Education")
                                .value.trim() || "%",
                        IsConsultant: Boolean(
                            JSON.parse(
                                this._doctorService.myform.get("IsConsultant")
                                    .value
                            )
                        ),
                        IsRefDoc: Boolean(
                            JSON.parse(
                                this._doctorService.myform.get("IsRefDoc").value
                            )
                        ),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._doctorService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        DoctorTypeId:0,//his._doctorService.myform.get("DoctorTypeId")                 .value,
                        AgeYear:
                            this._doctorService.myform
                                .get("AgeYear")
                                .value.trim() || "0",
                        AgeMonth:
                            this._doctorService.myform
                                .get("AgeMonth")
                                .value.trim() || "0",
                        AgeDay:
                            this._doctorService.myform
                                .get("AgeDay")
                                .value.trim() || "0",
                        PassportNo:
                            this._doctorService.myform
                                .get("PassportNo")
                                .value.trim() || "0",
                        ESINO:
                            this._doctorService.myform
                                .get("ESINO")
                                .value.trim() || "0",
                        RegNo:
                            this._doctorService.myform
                                .get("RegNo")
                                .value.trim() || "0",
                        RegDate:
                            this._doctorService.myform.get("RegDate").value ||
                            "01/01/1900",
                        MahRegNo:
                            this._doctorService.myform.get("MahRegNo").value ||
                            "0",
                        MahRegDate:
                            this._doctorService.myform.get("MahRegDate")
                                .value || "01/01/1900",
                        RefDocHospitalName:
                            this._doctorService.myform
                                .get("RefDocHospitalName")
                                .value.trim() || "%",
                        AddedBy: this.accountService.currentUserValue.user.id,
                    },
                    assignDoctorDepartmentDet: data2,
                };
                console.log(m_data);
                this._doctorService
                    .doctortMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                    });

                // this.notification.success("Record added successfully");
            } else {
                var data3 = [];
                for (var val of this._doctorService.myform.get("DepartmentId")
                    .value) {
                    var data4 = {
                        DepartmentId: val,
                        DoctorId:
                            this._doctorService.myform.get("DoctorId").value,
                    };
                    data3.push(data4);
                }
                var m_dataUpdate = {
                    updateDoctorMaster: {
                        DoctorId:
                            this._doctorService.myform.get("DoctorId").value ||
                            "0",
                        PrefixID:
                            this._doctorService.myform.get("PrefixID").value,
                        FirstName: this._doctorService.myform
                            .get("FirstName")
                            .value.trim(),
                        MiddleName:
                            this._doctorService.myform
                                .get("MiddleName")
                                .value.trim() || "%",
                        LastName: this._doctorService.myform
                            .get("LastName")
                            .value.trim(),
                        DateofBirth:
                            this._doctorService.myform.get("DateofBirth").value,
                        Address:
                            this._doctorService.myform
                                .get("Address")
                                .value.trim() || "%",
                        City:
                            this._doctorService.myform
                                .get("City")
                                .value.trim() || "%",
                        Pin:
                            this._doctorService.myform
                                .get("Pin")
                                .value.trim() || "0",
                        Phone:
                            this._doctorService.myform
                                .get("Phone")
                                .value.trim() || "0",
                        Mobile: this._doctorService.myform
                            .get("Mobile")
                            .value.trim(),
                        GenderId:
                            this._doctorService.myform.get("GenderId").value,
                        Education:
                            this._doctorService.myform
                                .get("Education")
                                .value.trim() || "%",
                        IsConsultant: Boolean(
                            JSON.parse(
                                this._doctorService.myform.get("IsConsultant")
                                    .value
                            )
                        ),
                        IsRefDoc: Boolean(
                            JSON.parse(
                                this._doctorService.myform.get("IsRefDoc").value
                            )
                        ),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._doctorService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        DoctorTypeId:
                            this._doctorService.myform.get("DoctorTypeId")
                                .value,
                        AgeYear:
                            this._doctorService.myform
                                .get("AgeYear")
                                .value.trim() || "0",
                        AgeMonth:
                            this._doctorService.myform
                                .get("AgeMonth")
                                .value.trim() || "0",
                        AgeDay: this._doctorService.myform
                            .get("AgeDay")
                            .value.trim(),
                        PassportNo:
                            this._doctorService.myform
                                .get("PassportNo")
                                .value.trim() || "0",
                        ESINO:
                            this._doctorService.myform
                                .get("ESINO")
                                .value.trim() || "0",
                        RegNo:
                            this._doctorService.myform
                                .get("RegNo")
                                .value.trim() || "0",
                        RegDate:
                            this._doctorService.myform.get("RegDate").value ||
                            "01/01/1900", //"01/01/2018",
                        MahRegNo:
                            this._doctorService.myform.get("MahRegNo").value ||
                            "0",
                        MahRegDate:
                            this._doctorService.myform.get("MahRegDate")
                                .value || "01/01/1900", //"01/01/2018",
                        RefDocHospitalName:
                            this._doctorService.myform
                                .get("RefDocHospitalName")
                                .value.trim() || "%",
                        UpdatedBy: this.accountService.currentUserValue.user.id,
                    },
                    deleteAssignDoctorToDepartment: {
                        DoctorId:
                            this._doctorService.myform.get("DoctorId").value,
                    },
                    assignDoctorDepartmentDet: data3,
                };

                console.log(m_dataUpdate);
                this._doctorService
                    .doctortMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                    });

                // this.notification.success("Record updated successfully");
            }
            this.onClose();
        }
    }
    onEdit(row) {
        var m_data = {
            DoctorId: row.DoctorId,
            PrefixID: row.PrefixID,
            FirstName: row.ServiceShortDesc.trim(),
            MiddleName: row.MiddleName.trim(),
            LastName: row.LastName.trim(),
            DateofBirth: row.DateofBirth,
            Address: row.Address.trim(),
            City: row.City.trim(),
            Pin: row.Pin.trim(),
            Phone: row.Phone.trim(),
            Mobile: row.Mobile.trim(),
            GenderId: row.GenderId,
            Education: row.Education.trim(),
            IsConsultant: Boolean(JSON.stringify(row.IsConsultant)),
            IsRefDoc: Boolean(JSON.stringify(row.IsRefDoc)),
            IsDeleted: Boolean(JSON.stringify(row.IsDeleted)),
            DoctorTypeId: row.DoctorTypeId,
            AgeYear: row.AgeYear.trim(),
            AgeMonth: row.AgeMonth.trim(),
            AgeDay: row.AgeDay.trim(),
            PassportNo: row.PassportNo.trim(),
            ESINO: row.ESINO.trim(),
            RegNo: row.RegNo.trim(),
            RegDate: row.RegDate,
            MahRegNo: row.MahRegNo.trim(),
            MahRegDate: row.MahRegDate,
            AddedByName: row.AddedByName.trim(),
            RefDocHospitalName: row.RefDocHospitalName.trim(),
            UpdatedBy: row.UpdatedBy,
            DepartmentId: row.DepartmentId,
            DepartmentName: row.DepartmentName.trim(),
        };

        this._doctorService.populateForm(m_data);
        console.log(row);
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
            this._doctorService
                .getGenderCombo(prefixObj.PrefixID)
                .subscribe((data) => {
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
