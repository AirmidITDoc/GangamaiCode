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
import { DatePipe } from "@angular/common";

@Component({
    selector: "app-new-doctor",
    templateUrl: "./new-doctor.component.html",
    styleUrls: ["./new-doctor.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewDoctorComponent implements OnInit {

    isLoading: any;
    submitted = false;
    data1: [];
    PrefixcmbList: any = [];
    GendercmbList: any = [];
    DoctortypecmbList: any = [];
    DepartmentcmbList: any = [];
    cityList: any = [];
    selectedGenderID: any;
    registerObj = new DoctorMaster({});
    docobject: DoctorDepartmentDet;
    msg: any;
    screenFromString = 'admission-form';

    filteredOptionsPrefix: Observable<string[]>;
    filteredDoctortype: Observable<string[]>;
    filteredOptionsDep: Observable<string[]>;
    filteredOptionsCity: Observable<string[]>;
    signature: any;

    isCitySelected: boolean = false;
    isDepartmentSelected: boolean = false;
    isdoctypeSelected: boolean = false;
    isPrefixSelected: boolean = false;
    optionsPrefix: any[] = [];
    optionsDep: any[] = [];
    optionsCity: any[] = [];

    CurrentDate = new Date();
    vDepartmentid: any;
    vCityId: any;
    vPrefixID: any = 0
    b_AgeYear: any = 0;
    b_AgeMonth: any = 0;
    b_AgeDay: any = 0;
    vDoctypeId: any;

    displayedColumns = [

        'DeptId',
        'DeptName',
        'action'
    ];

    public departmentFilterCtrl: FormControl = new FormControl();
    public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    DeptSource = new MatTableDataSource<DepartmenttList>();
    isAllSelected = false;
    sanitizeImagePreview: any;
    constructor(
        public _doctorService: DoctorMasterService,
        private accountService: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<NewDoctorComponent>
    ) { }
    onViewSignature() {
        const dialogRef = this.matDialog.open(SignatureViewComponent,
            {
                width: '900px',
                height: '400px',
                data: {

                }
            }
        );
        dialogRef.afterClosed().subscribe(result => {
            this.sanitizeImagePreview = result;
            this.signature = this.sanitizeImagePreview;
        });
    }
    toggleSelectAll() {

    }
    ngOnInit(): void {
        this.getPrefixList();
        this.getcityList();
        this.getDoctortypeNameCombobox();

        if (this.data) {
            if (this.data.registerObj.DateofBirth) {
                const todayDate = new Date();
                const dob = new Date(this.data.registerObj.DateofBirth);
                const timeDiff = Math.abs(Date.now() - dob.getTime());
                this.data.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
                this.data.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
                this.data.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
                this.registerObj = this.data.registerObj;
                this.b_AgeYear = this.data.registerObj.AgeYear;
                this.b_AgeDay = this.data.registerObj.AgeDay;
                this.b_AgeMonth = this.data.registerObj.AgeMonth;
                console.log(this.registerObj)
                this.getDocDeptList();
                this.getCitylist();
                this.getprefixList();
            }
            this.registerObj = this.data.registerObj;
            console.log(this.registerObj)
            this._doctorService.getSignature(this.registerObj.Signature).subscribe(data => {
                this.sanitizeImagePreview = data["data"] as string;
                this.registerObj.Signature = data["data"] as string;
            });
        }
        else {
            this._doctorService.myform.reset();
            this._doctorService.myform.get('isActive').setValue(1);
            this._doctorService.myform.get('IsConsultant').setValue(1);
        }
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

        this.filteredOptionsPrefix = this._doctorService.myform.get('PrefixID').valueChanges.pipe(
            startWith(''),
            map(value => this._filterPrex(value)),

        );

        this.filteredDoctortype = this._doctorService.myform.get('DoctorTypeId').valueChanges.pipe(
            startWith(''),
            map(value => this._filterDcotype(value)),

        );


        this.filteredOptionsCity = this._doctorService.myform.get('CityId').valueChanges.pipe(
            startWith(''),
            map(value => this._filtercity(value)),

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
    @ViewChild('mstatus') mstatus: ElementRef;
    @ViewChild('religion') religion: ElementRef;
    @ViewChild('city') city: ElementRef;

    @ViewChild('agey1') agey1: ElementRef;
    @ViewChild('agem1') agem1: ElementRef;
    @ViewChild('aged1') aged1: ElementRef;


    @ViewChild('ESINO') ESINO: ElementRef;
    @ViewChild('RegNo') RegNo: ElementRef;
    @ViewChild('RegDate') RegDate: ElementRef;
    @ViewChild('Edu') Edu: ElementRef;
    @ViewChild('MahRegNo') MahRegNo: ElementRef;
    @ViewChild('MahRegDate') MahRegDate: ElementRef;
    @ViewChild('HospitalName') HospitalName: ElementRef;
    @ViewChild('doctype') doctype: ElementRef;
    @ViewChild('dept') dept: ElementRef;




    public onEnterprefix(event, value): void {
        if (event.which === 13) {
            console.log(value)
            if (value == undefined) {
                this.toastr.warning('Please Enter Valid Prefix.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } else {
                this.fname.nativeElement.focus();
            }
        }


    }
    public onEnterfname(event): void {
        if (event.which === 13 && this._doctorService.myform.get("FirstName").valid) {
            this.mname.nativeElement.focus();
        }
    }
    public onEntermname(event): void {
        if (event.which === 13 && this._doctorService.myform.get("MiddleName").valid) {
            this.lname.nativeElement.focus();
        }
    }
    public onEnterlname(event): void {
        if (event.which === 13 && this._doctorService.myform.get("LastName").valid) {
            this.agey.nativeElement.focus();
            // if(this.mstatus) this.mstatus.focus();
        }
    }

    public onEntercity(event): void {
        if (event.which === 13) {
            this.ESINO.nativeElement.focus();

        }
    }


    public onEnteragey(event, value): void {
        if (event.which === 13) {
            this.pan.nativeElement.focus();

            this.ageyearcheck(value);
        }
    }
    public onEnteragem(event): void {
        if (event.which === 13) {
            this.pan.nativeElement.focus();
        }
    }
    public onEnteraged(event): void {
        if (event.which === 13) {
            this.pan.nativeElement.focus();
        }
    }

    public onEnterdoctype(event): void {
        if (event.which === 13) {
            this.dept.nativeElement.focus();
        }
    }

    public onEntermobile(event): void {
        if (event.which === 13 && this._doctorService.myform.get("MobileNo").valid) {
            this.address.nativeElement.focus();
        }
    }

    public onEnterAadharCardNo(event): void {
        if (event.which === 13 && this._doctorService.myform.get("AadharCardNo").valid) {
            this.mobile.nativeElement.focus();
        }
    }

    public onEnterpan(event): void {
        if (event.which === 13) {
            this.AadharCardNo.nativeElement.focus();
        }
    }


    public onEnteraddress(event): void {
        if (event.which === 13) {
            this.city.nativeElement.focus();
        }
    }


    public onEnterESINO(event): void {

        console.log(this._doctorService.myform.get("ESINO").valid)

        if (event.which === 13 && this._doctorService.myform.get("ESINO").valid) {
            this.RegNo.nativeElement.focus();
        }
    }
    public onEnterRegNo(event): void {
        if (event.which === 13 && this._doctorService.myform.get("RegNo").valid) {
            this.RegDate.nativeElement.focus();
        }
    }
    public onEnterRegDate(event): void {
        if (event.which === 13) {
            this.Edu.nativeElement.focus();
        }
    }
    public onEnterEdu(event): void {
        if (event.which === 13) {
            this.MahRegNo.nativeElement.focus();
        }
    }
    public onEnterMahRegNo(event): void {
        if (event.which === 13 && this._doctorService.myform.get("MahRegNo").valid) {
            this.MahRegDate.nativeElement.focus();
        }
    }

    public onEnterMahRegDate(event): void {
        if (event.which === 13) {
            this.HospitalName.nativeElement.focus();
        }
    }
    public onEnterHospitalName(event): void {
        if (event.which === 13) {
            this.doctype.nativeElement.focus();
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
    // validation
    get f() {
        return this._doctorService.myform.controls;
    }


    getDocDeptList() {
        var m_data = {
            "DoctorId": this.registerObj.DoctorId
        }
        this._doctorService.getDocDeptwiseList(m_data).subscribe(data => {
            this.selectedItems = data as any[];
            debugger
            this.selectedItems.forEach((item: any) => {
                var itm = this.DepartmentcmbList.find(x => x.DepartmentId == item.DepartmentId);
                if (itm)
                    itm.selected = true;
            });
        });
    }

    setDropdownObjs1() {

        const toSelect = this.PrefixcmbList.find(c => c.PrefixID == this.registerObj.PrefixID);
        this._doctorService.myform.get('PrefixID').setValue(toSelect);

        // const toSelect1 = this.DepartmentcmbList.find(c => c.Departmentid == this.docobject.DepartmentId);
        // this._doctorService.myform.get('Departmentid').setValue(toSelect1);

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


    // getGendorMasterList() {
    //     this._doctorService.getGenderCombo().subscribe(data => {
    //         this.GendercmbList = data;
    //         const ddValue = this.GendercmbList.find(c => c.GenderId == this.data.registerObj.GenderId);
    //         this._doctorService.myform.get('GenderId').setValue(ddValue);
    //     })
    // }



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
        let that = this;
        this._doctorService.getDepartmentCombobox().subscribe(data => {
            // data.forEach((obj, i) => obj.selected = false)
            this.DepartmentcmbList = data;
            if (that.data)
                this.getDocDeptList();
            this.optionsDep = this.DepartmentcmbList.slice();
            this.filteredOptionsDep = this._doctorService.myform.get('Departmentid').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterDep(value) : this.DepartmentcmbList.slice()),
            );

        });
    }
    selectedItems = [];
    toggleSelection(item: any) {
        item.selected = !item.selected;
        if (item.selected) {
            this.selectedItems.push(item);
        } else {
            const i = this.selectedItems.findIndex(value => value.DepartmentId === item.DepartmentId);
            this.selectedItems.splice(i, 1);
        }

    }
    remove(e) {
        this.toggleSelection(e);
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

    onSave() {
      
        if ((this.vPrefixID == '' || this.vPrefixID == null || this.vPrefixID == undefined)) {
            this.toastr.warning('Please select valid Prefix', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this._doctorService.myform.get("FirstName").value == '') {
            this.toastr.warning('Please Enter FirstName', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if (this._doctorService.myform.get("LastName").value == '') {
            this.toastr.warning('Please Enter LastName', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if (this._doctorService.myform.get("MobileNo").value == '') {
            this.toastr.warning('Please Enter MobileNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if ((this.vCityId == '' || this.vCityId == null || this.vCityId == undefined)) {
            this.toastr.warning('Please select valid City ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
       
        if (this._doctorService.myform.get("Education").value == '') {
            this.toastr.warning('Please Enter valid Doctor Education', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
       
        if ((this.vDoctypeId == '' || this.vDoctypeId == null || this.vDoctypeId == undefined)) {
            this.toastr.warning('Please select valid Doctor Type', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        // Department validation chipset 
        if (this.selectedItems.length == 0){
            this.toastr.warning('Please select valid Department', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        Swal.fire({
            title: 'Do you want to Save the Doctor Master ',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Save it!",
            cancelButtonText: "No, Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                this.onSubmit();
            }
        });

    }

    onSubmit() {

        // if (this._doctorService.myform.valid) {
        var data2 = [];
        this.selectedItems.forEach((element) => {
            let DocInsertObj = {};
            DocInsertObj['DepartmentId'] = element.DepartmentId
            DocInsertObj['DoctorId'] = !this._doctorService.myform.get("DoctorId").value ? "0" : this._doctorService.myform.get("DoctorId").value || "0";
            data2.push(DocInsertObj);
        });
        var m_data = {
            doctorId: !this._doctorService.myform.get("DoctorId").value ? "0" : this._doctorService.myform.get("DoctorId").value || "0",
            prefixID: this._doctorService.myform.get("PrefixID").value.PrefixID,
            firstName: this._doctorService.myform.get("FirstName").value.trim() || "",
            middleName: this._doctorService.myform.get("MiddleName").value.trim() || "",
            lastName: this._doctorService.myform.get("LastName").value.trim() || "",
            dateOfBirth: this.registerObj.DateofBirth,//this.datePipe.transform(this.registerObj.DateofBirth, 'MM/dd/yyyy') || '01/01/1900',
            City: this._doctorService.myform.get("CityId").value.CityId || 0,
            address: this._doctorService.myform.get("Address").value || "",
            phone: this._doctorService.myform.get("Phone").value || "0",
            mobile: this._doctorService.myform.get("MobileNo").value || "",
            genderId: this._doctorService.myform.get("GenderId").value.GenderId || 0,
            education: this._doctorService.myform.get("Education").value.trim() || "",
            isConsultant: Boolean(JSON.parse(this._doctorService.myform.get("IsConsultant").value)),
            isRefDoc: Boolean(JSON.parse(this._doctorService.myform.get("IsRefDoc").value)),
            IsActive: Boolean(JSON.parse(this._doctorService.myform.get("isActive").value)),
            doctorTypeId: this._doctorService.myform.get("DoctorTypeId").value.Id || 0,
            passportNo: this._doctorService.myform.get("PassportNo").value || "0",
            esino: this._doctorService.myform.get("ESINO").value || "0",
            regNo: this._doctorService.myform.get("RegNo").value || "0",
            regDate: this.datePipe.transform(this.registerObj.RegDate, "MM-dd-yyyy") || '01/01/1900',
            mahRegNo: this._doctorService.myform.get("MahRegNo").value || "0",
            PanCardNo: this._doctorService.myform.get("Pancardno").value || "0",
            AadharCardNo: this._doctorService.myform.get("AadharCardNo").value || "0",
            mahRegDate: this.datePipe.transform(this.registerObj.MahRegDate, "MM-dd-yyyy") || '01/01/1900',
            isInHouseDoctor: true,
            isOnCallDoctor: true,
            Addedby: this.accountService.currentUserValue.user.id,
            updatedBy: this.accountService.currentUserValue.user.id,
            Signature: this.signature || '',
            Departments: data2
        };
        console.log(m_data)
        debugger
        if (!this._doctorService.myform.get("DoctorId").value) {
            this._doctorService.doctortMasterInsert(m_data).subscribe((data) => {
                if (data) {
                    this.toastr.success('Record Saved Successfully.', 'Saved !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                }
                this.onClose();
            });
        } else {

            this._doctorService.doctortMasterUpdate(m_data).subscribe((data) => {
                this.msg = data;
                if (data) {
                    this.toastr.success('Record updated Successfully.', 'updated !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                }
                this.onClose();
            });
        }
        // }
        // else {
        //     this.toastr.warning('Please Enter All Valid Data ..', 'Warning !', {
        //         toastClass: 'tostr-tost custom-toast-warning',
        //     });
        //     return;
        // }
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
    onChangeRegDate(RegDate) {
        if (RegDate) {
            debugger
            this.registerObj.RegDate = new Date(RegDate);
        }
        else {
            this.registerObj.RegDate = null;
        }
    }
    onChangeMahRegDate(MahRegDate) {
        if (MahRegDate) {
            debugger
            this.registerObj.MahRegDate = new Date(MahRegDate);
        }
        else {
            this.registerObj.MahRegDate = null;
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
    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }


    public onEnterbday(event): void {
        if (event.which === 13) {
            this.address.nativeElement.focus();
        }
    }
    dateStyle?: string = 'Date';
    OnChangeDobType(e) {
        this.dateStyle = e.value;
    }
    CalcDOB(mode, e) {
        let d = new Date();
        if (mode == "Day") {
            d.setDate(d.getDate() - Number(e.target.value));
            this.registerObj.DateofBirth = d;
            //this.personalFormGroup.get('DateOfBirth').setValue(moment().add(Number(e.target.value), 'days').format("DD-MMM-YYYY"));
        }
        else if (mode == "Month") {
            d.setMonth(d.getMonth() - Number(e.target.value));
            this.registerObj.DateofBirth = d;
        }
        else if (mode == "Year") {
            d.setFullYear(d.getFullYear() - Number(e.target.value));
            this.registerObj.DateofBirth = d;
        }
        let todayDate = new Date();
        const timeDiff = Math.abs(Date.now() - this.registerObj.DateofBirth.getTime());
        this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - this.registerObj.DateofBirth.getMonth());
        this.registerObj.AgeDay = Math.abs(todayDate.getDate() - this.registerObj.DateofBirth.getDate());
    }



    private _filterprex(value: any): string[] {
        if (value) {
            const filterValue = value && value.PrefixName ? value.PrefixName.toLowerCase() : value.toLowerCase();

            return this.optionsPrefix.filter(option => option.PrefixName.toLowerCase().includes(filterValue));
        }

    }



    getprefixList() {
        debugger
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


    getPrefixList() {
        this._doctorService.getPrefixMasterCombo().subscribe(data => {
            this.PrefixcmbList = data;
            this.optionsPrefix = this.PrefixcmbList.slice();
            this.filteredOptionsPrefix = this._doctorService.myform.get('PrefixID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterPrex(value) : this.PrefixcmbList.slice()),
            );

        });
    }

    getcityList() {

        this._doctorService.getCityList().subscribe(data => {
            this.cityList = data;
            this.optionsCity = this.cityList.slice();
            this.filteredOptionsCity = this._doctorService.myform.get('CityId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterCity(value) : this.cityList.slice()),
            );

        });

    }

    getCitylist() {

        this._doctorService.getCityList().subscribe(data => {
            this.cityList = data;
            if (this.data) {
                const ddValue = this.cityList.filter(c => c.CityId == this.registerObj.City);
                this._doctorService.myform.get('CityId').setValue(ddValue[0]);
                this._doctorService.myform.updateValueAndValidity();
                return;
            }
        });

    }


    getOptionTextCity(option) {
        return option && option.CityName ? option.CityName : '';

    }


    private _filterCity(value: any): string[] {
        if (value) {
            const filterValue = value && value.CityName ? value.CityName.toLowerCase() : value.toLowerCase();

            return this.optionsCity.filter(option => option.CityName.toLowerCase().includes(filterValue));
        }

    }

    private _filtercity(value: any): string[] {
        if (value) {
            const filterValue = value && value.CityName ? value.CityName.toLowerCase() : value.toLowerCase();
            return this.cityList.filter(option => option.CityName.toLowerCase().includes(filterValue));
        }
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