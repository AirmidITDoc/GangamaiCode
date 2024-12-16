import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
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
import { ConcessionReasonMasterModule } from "app/main/setup/billing/concession-reason-master/concession-reason-master.module";
import { AirmidAutocompleteComponent } from "app/main/shared/componets/airmid-autocomplete/airmid-autocomplete.component";

@Component({
    selector: "app-new-doctor",
    templateUrl: "./new-doctor.component.html",
    styleUrls: ["./new-doctor.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewDoctorComponent implements OnInit {

    myForm: FormGroup

    //isLoading: any;
    //submitted = false;
    //data1: [];

    //selectedGenderID: any;
    registerObj = new DoctorMaster({});
    //docobject: DoctorDepartmentDet;
    //msg: any;
    //screenFromString = 'admission-form';

    signature: any;


    //CurrentDate = new Date();
    // vDepartmentid: any;
    // vCityId: any;
    // vPrefixID: any = 0
    // b_AgeYear: any = 0;
    // b_AgeMonth: any = 0;
    // b_AgeDay: any = 0;
    // vDoctypeId: any;

    // displayedColumns = [

    //     'DeptId',
    //     'DeptName',
    //     'action'
    // ];



    // new Api
    autocompleteModeprefix: string = "Prefix";
    autocompleteModegender: string = "Gender";
    autocompleteModecity: string = "City";
    autocompleteModedepartment: string = "Department";
    autocompleteModedoctorty: string = "DoctorType";

    DeptSource = new MatTableDataSource<DepartmenttList>();

    //isAllSelected = false;
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
        this.myForm = this._doctorService.createdDoctormasterForm();
        if (this.data.doctorId > 0) {
            this._doctorService.getDoctorById(this.data.doctorId).subscribe((response) => {
                this.registerObj = response;
                // if (this.registerObj.dateofBirth) {
                //     const todayDate = new Date();
                //     const dob = new Date(this.registerObj.dateofBirth);
                //     const timeDiff = Math.abs(Date.now() - dob.getTime());
                //     this.registerObj.ageYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
                //     this.registerObj.ageMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
                //     this.registerObj.ageDay = Math.abs(todayDate.getDate() - dob.getDate());
                // }
                this._doctorService.getSignature(this.registerObj.signature).subscribe(data => {
                    this.sanitizeImagePreview = data["data"] as string;
                    this.registerObj.signature = data["data"] as string;
                });
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
        else {
            this.myForm.reset();
            this.myForm.get('isActive').setValue(1);
            this.myForm.get('IsConsultant').setValue(1);
        }
        // this.getDepartmentList();
    }


    // @ViewChild('fname') fname: ElementRef;
    // @ViewChild('mname') mname: ElementRef;
    // @ViewChild('lname') lname: ElementRef;
    // @ViewChild('agey') agey: ElementRef;
    // @ViewChild('aged') aged: ElementRef;
    // @ViewChild('agem') agem: ElementRef;
    // @ViewChild('phone') phone: ElementRef;
    // @ViewChild('mobile') mobile: ElementRef;
    // @ViewChild('address') address: ElementRef;
    // @ViewChild('pan') pan: ElementRef;
    // @ViewChild('area') area: ElementRef;
    // @ViewChild('AadharCardNo') AadharCardNo: ElementRef;

    // @ViewChild('bday') bday: ElementRef;
    // //   @ViewChild('gender') gender: MatSelect;
    // @ViewChild('mstatus') mstatus: ElementRef;
    // @ViewChild('religion') religion: ElementRef;
    // @ViewChild('city') city: ElementRef;

    // public onEnterprefix(event, value): void {

    //     if (event.which === 13) {

    //         console.log(value)
    //         if (value == undefined) {
    //             this.toastr.warning('Please Enter Valid Prefix.', 'Warning !', {
    //                 toastClass: 'tostr-tost custom-toast-warning',
    //             });
    //             return;
    //         } else {
    //             this.fname.nativeElement.focus();
    //         }
    //     }


    // }
    // public onEnterfname(event): void {
    //     if (event.which === 13) {
    //         this.mname.nativeElement.focus();
    //     }
    // }
    // public onEntermname(event): void {
    //     if (event.which === 13) {
    //         this.lname.nativeElement.focus();
    //     }
    // }
    // public onEnterlname(event): void {
    //     if (event.which === 13) {
    //         this.agey.nativeElement.focus();
    //         // if(this.mstatus) this.mstatus.focus();
    //     }
    // }

    // public onEntercity(event): void {
    //     if (event.which === 13) {
    //         this.agem.nativeElement.focus();
    //         // this.addbutton.focus();
    //     }
    // }


    // public onEnteragey(event, value): void {
    //     if (event.which === 13) {
    //         this.agem.nativeElement.focus();

    //         this.ageyearcheck(value);
    //     }
    // }
    // public onEnteragem(event): void {
    //     if (event.which === 13) {
    //         this.aged.nativeElement.focus();
    //     }
    // }
    // public onEnteraged(event): void {
    //     if (event.which === 13) {
    //         this.AadharCardNo.nativeElement.focus();
    //     }
    // }

    // public onEnterdoctype(event): void {
    //     if (event.which === 13) {
    //         this.AadharCardNo.nativeElement.focus();
    //     }
    // }

    // public onEntermobile(event): void {
    //     if (event.which === 13) {
    //         this.address.nativeElement.focus();
    //     }
    // }

    // public onEnterAadharCardNo(event): void {
    //     if (event.which === 13) {
    //         this.address.nativeElement.focus();
    //     }
    // }
    // public onEnterphone(event): void {
    //     if (event.which === 13) {
    //         this.address.nativeElement.focus();
    //     }
    // }
    // public onEnterpan(event): void {
    //     if (event.which === 13) {
    //         this.address.nativeElement.focus();
    //     }
    // }


    // public onEnteraddress(event): void {
    //     if (event.which === 13) {
    //         this.address.nativeElement.focus();
    //     }
    // }

    // ageyearcheck(event) {

    //     if (parseInt(event) > 100) {
    //         this.toastr.warning('Please Enter Valid Age.', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });

    //         this.agey.nativeElement.focus();
    //     }
    //     return;

    // }
    // public onEnterdept(event, value): void {
    //     if (event.which === 13) {
    //         if (value == undefined) {
    //             this.toastr.warning('Please Enter Valid Department.', 'Warning !', {
    //                 toastClass: 'tostr-tost custom-toast-warning',
    //             });
    //             return;
    //         }
    //         //   else {
    //         //     this.deptdoc.nativeElement.focus();
    //         //   }
    //     }
    // }
    // validation
    // get f() {
    //     return this.myForm.controls;
    // }



    // setDropdownObjs1() {

    //     // const toSelect = this.PrefixcmbList.find(c => c.PrefixID == this.registerObj.prefixId);
    //     // this.myForm.get('PrefixID').setValue(toSelect);

    //     // const toSelect1 = this.DepartmentcmbList.find(c => c.Departmentid == this.docobject.DepartmentId);
    //     // this.myForm.get('Departmentid').setValue(toSelect1);

    //     // const toSelectReligion = this.ReligionList.find(c => c.ReligionId == this.registerObj.ReligionId);
    //     // this.myForm.get('ReligionId').setValue(toSelectReligion);

    //     this.myForm.updateValueAndValidity();
    //     // this.dialogRef.close();

    // }




    //selectedItems = [];
    removeDepartment(item) {
        let removedIndex = this.myForm.value.MDoctorDepartmentDets.findIndex(x => x.DepartmentId == item.DepartmentId);
        this.myForm.value.MDoctorDepartmentDets.splice(removedIndex, 1);
        this.myForm.controls['MDoctorDepartmentDets'].setValue(this.myForm.value.MDoctorDepartmentDets);
    }


    Savebtn: boolean = false;
    onSubmit() {
        debugger
        if (!this.myForm.get("DoctorId").value) {
            var data2 = [];
            if (this.myForm.valid) {
                // for (let i = 0; i < this.myForm.value.Departmentid.length; i++)
                //     data2.push({ "doctorId": 0, "departmentId": this.myForm.value.Departmentid[i].value, "docDeptId": 0 });
                // var mdata =
                // {
                //     "doctorId": 0,
                //     "prefixId": this.myForm.get("PrefixID").value || "",
                //     "firstName": this.myForm.get("FirstName").value.trim() || "",
                //     "middleName": this.myForm.get("MiddleName").value.trim() || "",
                //     "lastName": this.myForm.get("LastName").value.trim() || "",
                //     "dateofBirth": "2021-03-31T12:27:24.771Z",
                //     "address": this.myForm.get("Address").value.trim() || "",
                //     "city": this.myForm.get("CityId").value || "",
                //     "pin": "0",
                //     "phone": "0",
                //     "mobile": this.myForm.get("MobileNo").value || "",
                //     "genderId": "1",// this.myForm.get("GenderId").value || "",
                //     "education": this.myForm.get("Education").value.trim() || "",
                //     "isConsultant": true,
                //     "isRefDoc": true,
                //     "isActive": true,
                //     "doctorTypeId": 1,//this.myForm.get("DoctorTypeId").value || "0",// this.doctorId,
                //     "ageYear": this.myForm.get("AgeYear").value.toString() || "0",
                //     "ageMonth": this.myForm.get("AgeMonth").value.toString() || "",
                //     "ageDay": this.myForm.get("AgeDay").value.toString() || "",
                //     "passportNo": "0",
                //     "esino": this.myForm.get("ESINO").value || "0",
                //     "regNo": this.myForm.get("RegNo").value || "0",
                //     "regDate": this.myForm.get("RegDate").value || "1999-08-06",
                //     "mahRegNo": this.myForm.get("MahRegNo").value || "0",
                //     "mahRegDate": this.myForm.get("MahRegDate").value || "1999-08-06",
                //     "refDocHospitalName": this.myForm.get("RefDocHospitalName").value || "0",
                //     "isInHouseDoctor": true,
                //     "isOnCallDoctor": true,
                //     "panCardNo": this.myForm.get("Pancardno").value || "0",
                //     "aadharCardNo": this.myForm.get("AadharCardNo").value || "0",
                //     "mDoctorDepartmentDets": data2
                // }
                // console.log(mdata)
                this._doctorService.doctortMasterInsert(this.myForm.value).subscribe((response) => {
                    this.toastr.success(response.message);
                    this.onClear(true);
                }, (error) => {
                    this.toastr.error(error.message);
                });
            }
        } else {

            // var data3 = [];
            // this.selectedItems.forEach((element) => {
            //     let DocInsertObj = {};
            //     DocInsertObj["docDeptId"] = 1
            //     DocInsertObj['departmentId'] = this.departmentId;
            //     DocInsertObj['doctorId'] = !this.myForm.get("DoctorId").value ? "0" : this.myForm.get("DoctorId").value || "0";
            //     data2.push(DocInsertObj);
            // });

            // console.log("update data3:", data3);
            var mdataUpdate = {};
            // var mdataUpdate = {

            //     "doctorId": 0,
            //     // "prefixId": this.myForm.get("PrefixID").value.PrefixID,
            //     "prefixId": this.PrefixId,
            //     "firstName": this.myForm.get("FirstName").value.trim() || "",
            //     "middleName": this.myForm.get("MiddleName").value.trim() || "",
            //     "lastName": this.myForm.get("LastName").value.trim() || "",
            //     "dateofBirth": "2021-03-31T12:27:24.771Z",
            //     "address": this.myForm.get("Address").value.trim() || "",
            //     "city": this.cityId,
            //     "pin": "0",
            //     "phone": this.myForm.get("Phone").value || "0",
            //     "mobile": this.myForm.get("MobileNo").value || "",
            //     "genderId": this.genderId,
            //     "education": this.myForm.get("Education").value.trim() || "",
            //     "isConsultant": true,
            //     "isRefDoc": true,
            //     "doctorTypeId": this.doctorId,
            //     "ageYear": this.myForm.get("AgeYear").value.toString() || "0",
            //     "ageMonth": this.myForm.get("AgeMonth").value.toString() || "",
            //     "ageDay": this.myForm.get("AgeDay").value.toString() || "",
            //     "passportNo": 0,
            //     "esino": this.myForm.get("ESINO").value || "0",
            //     "regNo": this.myForm.get("RegNo").value || "0",
            //     "regDate": this.myForm.get("RegDate").value || "1999-08-06",
            //     // "regDate":this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || this.dateTimeObj.date,
            //     "mahRegNo": this.myForm.get("MahRegNo").value || "0",
            //     "mahRegDate": this.myForm.get("MahRegDate").value || "0",
            //     "refDocHospitalName": this.myForm.get("RefDocHospitalName").value || "0",
            //     "isInHouseDoctor": true,
            //     "isOnCallDoctor": true,
            //     "panCardNo": this.myForm.get("Pancardno").value || "0",
            //     "aadharCardNo": this.myForm.get("AadharCardNo").value || "0",
            //     "mDoctorDepartmentDets": data3
            // }

            console.log(mdataUpdate);
            this._doctorService.doctortMasterUpdate(mdataUpdate).subscribe((data) => {
                if (data) {
                    this.toastr.success(data.message, 'updated !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                    this.onClose();
                } else {
                    this.toastr.error('Doctor-from Master Master Data not updated !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            });
        }
        // }
        // this.onClose();
    }

    onClear(val: boolean) {
        this.myForm.reset();
    }
    onClose() {
        this.myForm.reset();
        this.dialogRef.close();
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    //   new Api?
    // PrefixId = 0;
    // genderId = 0;
    // cityId = 0;
    // cityName = '';
    // doctorId = 0;
    // doctorName = '';
    // departmentId = 0;
    // departmentName = '';

    // selectChangeprefix(obj: any) {
    //     debugger
    //     this.PrefixId = obj.value;
    // }

    // selectChangegender(obj: any) {
    //     console.log(obj)
    //     this.genderId = obj.value;
    // }

    // selectChangecity(obj: any) {
    //     console.log(obj)
    //     this.cityId = obj.value;
    //     this.cityName = obj.text;
    // }

    // selectChangedoctorTy(obj: any) {
    //     this.doctorId = obj.value;
    //     this.doctorName = obj.text;
    // }

    // selectChangedep(obj: any) {
    //     this.departmentId = obj.value;
    //     this.departmentName = obj.value;
    // }

    getValidationMessages() {
        return {
            PrefixID: [
                { name: "required", Message: "Prefix Name is required" }
            ],
            FirstName: [
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            MiddleName: [
                { name: "required", Message: "Middle Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            LastName: [
                { name: "required", Message: "Last Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            Address: [
                { name: "required", Message: "Address is required" }
            ],
            Phone: [
                { name: "required", Message: "Phone no is required" },
                { name: "pattern", Message: "Enter valid numbers" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 15 digits not allowed." }
            ],
            GenderId: [
                { name: "required", Message: "Gender is required" }
            ],
            Education: [
                { name: "required", Message: "Education is required" },
                { name: "pattern", Message: "only char allowed." }
            ],
            esino: [
                { name: "required", Message: "ESINO is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 15 digits not allowed." }
            ],
            RegNo: [
                { name: "required", Message: "RegNo is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 15 digits not allowed." }
            ],
            mahRegNo: [
                { name: "required", Message: "mahRegNo is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 15 digits not allowed." }
            ],
            RefDocHospitalName: [
                { name: "required", Message: "RefDoc Hospital Name is required" }
            ],
            Pancardno: [
                { name: "required", Message: "Pancard No is required" }
            ],
            AadharCardNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "AadharCard No is required" },
                { name: "minLength", Message: "12 digit required." },
                { name: "maxLength", Message: "More than 12 digits not allowed." }
            ],
            City: [
                { name: "required", Message: "City is required" }
            ],
            DoctorTypeId: [
                { name: "required", Message: "Doctor Type is required" }
            ],
            Departmentid: [
                { name: "required", Message: "Department is required" }
            ]
        };
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