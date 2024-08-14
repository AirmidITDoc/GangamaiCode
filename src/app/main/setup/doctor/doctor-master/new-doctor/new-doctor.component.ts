import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { DoctorDepartmentDet, DoctorMaster, DoctorMasterComponent } from "../doctor-master.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DoctorMasterService } from "../doctor-master.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { NotificationServiceService } from "app/core/notification-service.service";
import { map, startWith, takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { SignatureViewComponent } from "../signature-view/signature-view.component";

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
    isLoading: any;
    PrefixcmbList: any = [];
    GendercmbList: any = [];
    DoctortypecmbList: any = [];
    DepartmentcmbList: any = [];
    selectedGenderID: any;
    DeptList: any = [];
    registerObj = new DoctorMaster({});
    docobject: DoctorDepartmentDet;
    msg: any;
    b_AgeYear: any = 0;
    b_AgeMonth: any = 0;
    b_AgeDay: any = 0;
    screenFromString = 'admission-form';

    filteredOptionsPrefix: Observable<string[]>;
    filteredDoctortype: Observable<string[]>;
    filteredOptionsDep: Observable<string[]>;


    isPrefixSelected: boolean = false;
    optionsPrefix: any[] = [];
    optionsDep: any[] = [];
    isdoctypeSelected: boolean = false;

    isDepartmentSelected: boolean = false;
    CurrentDate = new Date();

    // deptlist: any = [];
    vDepartmentid: any;
    displayedColumns = [

        'DeptId',
        'DeptName',
        'action'
    ];

    public departmentFilterCtrl: FormControl = new FormControl();
    public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    DeptSource = new MatTableDataSource<DepartmenttList>();

    dataSource = new MatTableDataSource<DepartmenttList>();
    isAllSelected = false;
    constructor(
        public _doctorService: DoctorMasterService,
        private accountService: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialog: MatDialog,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<NewDoctorComponent>
    ) { }
    onViewSignature(ele: any, type: string) {
        let fileType;
        if (ele) {

            const dialogRef = this.matDialog.open(SignatureViewComponent,
                {
                    width: '900px',
                    height: '500px',
                    data: {
                        docData: type == 'img' ? ele : ele.doc,
                        type: type == 'img' ? "image" : ele.type
                    }
                }
            );
            dialogRef.afterClosed().subscribe(result => {

            });
        }
    }
    toggleSelectAll() {

    }
    ngOnInit(): void {
        this.getDocDeptList();

        if (this.data) {
            this.registerObj = this.data.registerObj;
            this.b_AgeYear = this.data.registerObj.AgeYear;
            this.b_AgeDay = this.data.registerObj.AgeDay;
            this.b_AgeMonth = this.data.registerObj.AgeMonth;

            this.getDocDeptList();
        }
        else {
            this._doctorService.myform.reset();
            this._doctorService.myform.get('isActive').setValue(1);
            this._doctorService.myform.get('IsConsultant').setValue(1);
        }

        this.getPrefixList();
        this.getGendorMasterList();
        this.getDoctortypeNameCombobox();
        this.getDepartmentList();


        this.filteredOptionsPrefix = this._doctorService.myform.get('PrefixID').valueChanges.pipe(
            startWith(''),
            map(value => this._filterPrex(value)),

        );

        this.filteredDoctortype = this._doctorService.myform.get('DoctorTypeId').valueChanges.pipe(
            startWith(''),
            map(value => this._filterDcotype(value)),

        );

        this.filteredOptionsDep = this._doctorService.myform.get('Departmentid').valueChanges.pipe(
            startWith(''),
            map(value => this._filterDep(value)),

        );
    }


    @ViewChild('fname') fname: ElementRef;
    @ViewChild('mname') mname: ElementRef;
    @ViewChild('lname') lname: ElementRef;
    @ViewChild('agey') agey: ElementRef;
    @ViewChild('aged') aged: ElementRef;
    @ViewChild('agem') agem: ElementRef;
    @ViewChild('phone') phone: ElementRef;
    @ViewChild('mobile') mobile: ElementRef;
    @ViewChild('address') address: ElementRef;
    @ViewChild('pan') pan: ElementRef;
    @ViewChild('area') area: ElementRef;
    @ViewChild('AadharCardNo') AadharCardNo: ElementRef;

    @ViewChild('bday') bday: ElementRef;
    //   @ViewChild('gender') gender: MatSelect;
    @ViewChild('mstatus') mstatus: ElementRef;
    @ViewChild('religion') religion: ElementRef;
    @ViewChild('city') city: ElementRef;

    public onEnterprefix(event): void {
        if (event.which === 13) {
            this.fname.nativeElement.focus();
        }
    }
    public onEnterfname(event): void {
        if (event.which === 13) {
            this.mname.nativeElement.focus();
        }
    }
    public onEntermname(event): void {
        if (event.which === 13) {
            this.lname.nativeElement.focus();
        }
    }
    public onEnterlname(event): void {
        if (event.which === 13) {
            this.agey.nativeElement.focus();
            // if(this.mstatus) this.mstatus.focus();
        }
    }



    public onEnteragey(event): void {
        if (event.which === 13) {
            this.agem.nativeElement.focus();
            // this.addbutton.focus();
        }
    }
    public onEnteragem(event): void {
        if (event.which === 13) {
            this.aged.nativeElement.focus();
        }
    }
    public onEnteraged(event): void {
        if (event.which === 13) {
            this.AadharCardNo.nativeElement.focus();
        }
    }

    public onEnterdoctype(event): void {
        if (event.which === 13) {
            this.AadharCardNo.nativeElement.focus();
        }
    }

    public onEntermobile(event): void {
        if (event.which === 13) {
            this.address.nativeElement.focus();
        }
    }


    public onEnterphone(event): void {
        if (event.which === 13) {
            this.address.nativeElement.focus();
        }
    }



    public onEnterdept(event, value): void {
        if (event.which === 13) {
            if (value == undefined) {
                this.toastr.warning('Please Enter Valid Department.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
            //   else {
            //     this.deptdoc.nativeElement.focus();
            //   }
        }
    }


    ageyearcheck(event) {

        if (parseInt(event) > 100) {
            this.toastr.warning('Please Enter Valid Age.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });

            this.agey.nativeElement.focus();
        }
        return;

    }



    // validation
    get f() {
        return this._doctorService.myform.controls;
    }


    getDocDeptList() {
        var m_data = {
            'DepartmentId': this._doctorService.myform.get('Departmentid').value
            //"DoctorId" :this.registerObj.DoctorId
        }
        this._doctorService.getDocDeptwiseList(m_data).subscribe(data => {
            this.dataSource.data = data as DepartmenttList[];
            this.DeptList = this.dataSource.data;
            console.log(this.dataSource);
        },
            error => {
                // this.sIsLoading = '';
            });
    }

    setDropdownObjs1() {

        const toSelect = this.PrefixcmbList.find(c => c.PrefixID == this.registerObj.PrefixID);
        this._doctorService.myform.get('PrefixID').setValue(toSelect);

        const toSelect1 = this.DepartmentcmbList.find(c => c.Departmentid == this.docobject.DepartmentId);
        this._doctorService.myform.get('Departmentid').setValue(toSelect1);

        // const toSelectReligion = this.ReligionList.find(c => c.ReligionId == this.registerObj.ReligionId);
        // this._doctorService.myform.get('ReligionId').setValue(toSelectReligion);

        this._doctorService.myform.updateValueAndValidity();
        // this.dialogRef.close();

    }




    private _filterPrex(value: any): string[] {
        if (value) {
            const filterValue = value && value.PrefixName ? value.PrefixName.toLowerCase() : value.toLowerCase();
            return this.PrefixcmbList.filter(option => option.PrefixName.toLowerCase().includes(filterValue));
        }
    }

    getPrefixList() {

        this._doctorService.getPrefixMasterCombo().subscribe(data => {
            this.PrefixcmbList = data;
            if (this.data) {
                const ddValue = this.PrefixcmbList.filter(c => c.PrefixID == this.registerObj.PrefixID);
                this._doctorService.myform.get('PrefixID').setValue(ddValue[0]);
                this._doctorService.myform.updateValueAndValidity();
                return;
            }
        });
        this.onChangeGenderList(this.registerObj);
    }


    getGendorMasterList() {
        this._doctorService.getGenderMasterCombo().subscribe(data => {
            this.GendercmbList = data;
            const ddValue = this.GendercmbList.find(c => c.GenderId == this.data.registerObj.GenderId);
            this._doctorService.myform.get('GenderId').setValue(ddValue);
        })
    }



    getDoctortypeNameCombobox() {

        this._doctorService.getDoctortypeMasterCombo().subscribe(data => {
            this.DoctortypecmbList = data;
            if (this.data) {
                const ddValue = this.DoctortypecmbList.filter(c => c.Id == this.registerObj.DoctorTypeId);
                this._doctorService.myform.get('DoctorTypeId').setValue(ddValue[0]);
                this._doctorService.myform.updateValueAndValidity();
                return;
            }
        });

    }


    private _filterDcotype(value: any): string[] {
        if (value) {
            const filterValue = value && value.DoctorType ? value.DoctorType.toLowerCase() : value.toLowerCase();
            return this.DoctortypecmbList.filter(option => option.DoctorType.toLowerCase().includes(filterValue));
        }
    }

    getOptionTextPrefix(option) {
        return option && option.PrefixName ? option.PrefixName : '';
    }

    getOptionTextdoctype(option) {
        return option && option.DoctorType ? option.DoctorType : '';

    }
    // getDepartmentNameCombobox() {

    //     this._doctorService.getDepartmentCombobox().subscribe((data) => {
    //         this.DepartmentcmbList = data;
    //         console.log( this.DepartmentcmbList );
    //         this.filteredDepartment.next(this.DepartmentcmbList.slice());
    //         this._doctorService.myform
    //             .get("Departmentid")
    //             .setValue(this.DepartmentcmbList[0]);
    //     });
    // }



    getDepartmentList() {
        this._doctorService.getDepartmentCombobox().subscribe(data => {
            this.DepartmentcmbList = data;
            this.optionsDep = this.DepartmentcmbList.slice();
            this.filteredOptionsDep = this._doctorService.myform.get('Departmentid').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterDep(value) : this.DepartmentcmbList.slice()),
            );

        });
    }



    private _filterDep(value: any): string[] {
        if (value) {
            const filterValue = value && value.departmentName ? value.departmentName.toLowerCase() : value.toLowerCase();
            return this.optionsDep.filter(option => option.departmentName.toLowerCase().includes(filterValue));
        }

    }
    getOptionTextDep(option) {
        return option && option.departmentName ? option.departmentName : '';
    }


    onSubmit() {
        if (this._doctorService.myform.valid) {
            if (!this._doctorService.myform.get("DoctorId").value) {

                var data2 = [];

                this.dataSource.data.forEach((element) => {
                    let DocInsertObj = {};
                    DocInsertObj['DepartmentId'] = element.DeptId
                    DocInsertObj['DoctorId'] = 0;
                    data2.push(DocInsertObj);
                });
                var m_data = {
                    insertDoctorMaster: {
                        doctorId:
                            "0" ||
                            this._doctorService.myform.get("DoctorId").value,
                        prefixID:
                            this._doctorService.myform.get("PrefixID").value
                                .PrefixID,
                        firstName:
                            this._doctorService.myform
                                .get("FirstName")
                                .value.trim() || "%",
                        middleName: this._doctorService.myform
                            .get("MiddleName")
                            .value || "%",
                        lastName:
                            this._doctorService.myform
                                .get("LastName")
                                .value || "%",
                        dateOfBirth: this.registerObj.DateofBirth,//this._doctorService.myform.get("DateofBirth").value || '01/0/1900',
                        address:
                            this._doctorService.myform
                                .get("Address")
                                .value || "%",
                        city:
                            this._doctorService.myform
                                .get("City")
                                .value || "%",
                        pin:
                            this._doctorService.myform
                                .get("Pin")
                                .value || "0",
                        phone:
                            this._doctorService.myform
                                .get("Phone")
                                .value || "0",
                        mobile: this._doctorService.myform
                            .get("Mobile")
                            .value || "%",
                        genderId:
                            this._doctorService.myform.get("GenderId").value.GenderId || 0,
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
                        IsActive: Boolean(
                            JSON.parse(
                                this._doctorService.myform.get("isActive")
                                    .value
                            )
                        ),
                        doctorTypeId: this._doctorService.myform.get("DoctorTypeId").value.Id || 0,
                        ageYear:
                            this._doctorService.myform
                                .get("AgeYear")
                                .value || "0",
                        ageMonth:
                            this._doctorService.myform
                                .get("AgeMonth")
                                .value || "0",
                        ageDay:
                            this._doctorService.myform
                                .get("AgeDay")
                                .value || "0",
                        passportNo:
                            this._doctorService.myform
                                .get("PassportNo")
                                .value || "0",
                        esino:
                            this._doctorService.myform
                                .get("ESINO")
                                .value || "0",
                        regNo:
                            this._doctorService.myform
                                .get("RegNo")
                                .value || "0",
                        regDate: this.registerObj.RegDate,
                        // this._doctorService.myform.get("RegDate").value ||
                        // "01/01/1900",
                        mahRegNo:
                            this._doctorService.myform.get("MahRegNo").value ||
                            "0",
                        PanCardNo: 0,
                        AadharCardNo: 0,
                        mahRegDate: this.registerObj.MahRegDate,
                        // this._doctorService.myform.get("MahRegDate")
                        //     .value || "01/01/1900",

                        isInHouseDoctor: true,
                        isOnCallDoctor: true,
                        Addedby: this.accountService.currentUserValue.user.id,

                        updatedBy: this.accountService.currentUserValue.user.id,
                        // RefDocHospitalName:
                        //     this._doctorService.myform
                        //         .get("RefDocHospitalName")
                        //         .value|| "%",

                    },
                    assignDoctorDepartmentDet: data2,
                };
                console.log(m_data)
                this._doctorService
                    .doctortMasterInsert(m_data)
                    .subscribe((data) => {
                        // this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });

                        }
                    });


            } else {
                var data3 = [];

                this.dataSource.data.forEach((element) => {
                    let DocInsertObj = {};
                    DocInsertObj['DepartmentId'] = element.DeptId;
                    DocInsertObj['DoctorId'] = this._doctorService.myform.get("DoctorId").value;
                    data3.push(DocInsertObj);
                });


                var m_dataUpdate = {
                    updateDoctorMaster: {
                        DoctorId:
                            this._doctorService.myform.get("DoctorId").value ||
                            "0",
                        PrefixID:
                            this._doctorService.myform.get("PrefixID").value.PrefixID,
                        FirstName: this._doctorService.myform
                            .get("FirstName")
                            .value.trim() || "%",
                        MiddleName:
                            this._doctorService.myform
                                .get("MiddleName")
                                .value || "%",
                        LastName: this._doctorService.myform
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
                                .value || "0",
                        Phone:
                            this._doctorService.myform
                                .get("Phone")
                                .value || "0",
                        Mobile: this._doctorService.myform
                            .get("Mobile")
                            .value.trim(),
                        GenderId:
                            this._doctorService.myform.get("GenderId").value.GenderId || 0,
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
                        isActive: Boolean(
                            JSON.parse(
                                this._doctorService.myform.get("isActive")
                                    .value
                            )
                        ),
                        DoctorTypeId: this._doctorService.myform.get("DoctorTypeId").value.Id || 0,
                        AgeYear:
                            this._doctorService.myform
                                .get("AgeYear")
                                .value || "0",
                        AgeMonth:
                            this._doctorService.myform
                                .get("AgeMonth")
                                .value || "0",
                        AgeDay: this._doctorService.myform
                            .get("AgeDay")
                            .value || "0",
                        PassportNo:
                            this._doctorService.myform
                                .get("PassportNo")
                                .value || "0",
                        ESINO:
                            this._doctorService.myform
                                .get("ESINO")
                                .value || "0",
                        RegNo:
                            this._doctorService.myform
                                .get("RegNo")
                                .value || "0",
                        RegDate:
                            this._doctorService.myform.get("RegDate").value ||
                            "01/01/1900", //"01/01/2018",
                        MahRegNo:
                            this._doctorService.myform.get("MahRegNo").value ||
                            "0",
                        MahRegDate:
                            this._doctorService.myform.get("MahRegDate")
                                .value || "01/01/1900", //"01/01/2018",
                        PanCardNo: 0,
                        AadharCardNo: 0,
                        // RefDocHospitalName:
                        //     this._doctorService.myform
                        //         .get("RefDocHospitalName")
                        //         .value || "%",

                        isInHouseDoctor: true,
                        isOnCallDoctor: true,
                        UpdatedBy: this.accountService.currentUserValue.user.id,
                    },
                    deleteAssignDoctorToDepartment: {
                        DoctorId:
                            this._doctorService.myform.get("DoctorId").value,
                    },
                    assignDoctorDepartmentDet: data3,
                };

                console.log(m_dataUpdate);
                this._doctorService.doctortMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });

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



    onChangeDateofBirth(DateOfBirth) {

        if (DateOfBirth) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth);
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
            this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
            this.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
            this.registerObj.DateofBirth = DateOfBirth;
            this._doctorService.myform.get('DateOfBirth').setValue(DateOfBirth);
        }

    }

    onChangeGenderList(prefixObj) {

        if (prefixObj) {
            this._doctorService
                .getGenderCombo(prefixObj.PrefixID)
                .subscribe((data) => {
                    this.GendercmbList = data;
                    this._doctorService.myform.get("GenderId").setValue(this.GendercmbList[0]);
                    // this.selectedGender = this.GenderList[0];
                    this.selectedGenderID = this.GendercmbList[0].GenderId;
                });
        }
    }
    deptlist = [];
    SaveEnter(element) {
        // this.isLoading = 'save';
        this.dataSource.data = [];
        //   this.deptlist =this.DeptList;
        //   this.deptlist.push(
        //       {
        //           DeptId: element.Departmentid,
        //           DeptName: element.departmentName,

        //       });
        //   this.dataSource.data = this.deptlist;

        this.deptlist.push(
            {
                DeptId: element.Departmentid,
                DeptName: element.departmentName,
            });
        this.dataSource.data = this.deptlist;
        return;
    }

    deleteTableRow(element) {
        let index = this.deptlist.indexOf(element);
        if (index >= 0) {
            this.deptlist.splice(index, 1);
            this.dataSource.data = [];
            this.dataSource.data = this.deptlist;
        }
        Swal.fire('Success !', 'List Row Deleted Successfully', 'success');
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

}



export class DepartmenttList {
    DeptId: number;
    DeptName: number;


    constructor(DepartmenttList) {
        this.DeptId = DepartmenttList.DeptId || '';
        this.DeptName = DepartmenttList.DeptName || '';
    }
}