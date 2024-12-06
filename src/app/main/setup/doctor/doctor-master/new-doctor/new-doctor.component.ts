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

@Component({
    selector: "app-new-doctor",
    templateUrl: "./new-doctor.component.html",
    styleUrls: ["./new-doctor.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewDoctorComponent implements OnInit {

    myForm: FormGroup

    isLoading: any;
    submitted = false;
    data1: [];
    PrefixcmbList: any = [];
    GendercmbList: any = [];
    DoctortypecmbList: any = [];
    DepartmentcmbList: any = [];
    cityList:any=[];
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



    // new Api
    autocompleteModeprefix:string="Prefix";
    autocompleteModegender:string="Gender";
    autocompleteModecity:string="City";
    autocompleteModedepartment: string = "Department";
    autocompleteModedoctorty: string = "DoctorType";

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
        this.myForm = this._doctorService.createdDoctormasterForm();
        this.getPrefixList();
        this.getcityList();
       //this.getDoctortypeNameCombobox();
       
       if (this.data) {
            debugger
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
            console.log(this.registerObj )
            this._doctorService.getSignature(this.registerObj.Signature).subscribe(data => {
                this.sanitizeImagePreview = data["data"] as string;
                this.registerObj.Signature = data["data"] as string;
            });
        }
        else {
            this.myForm.reset();
            this.myForm.get('isActive').setValue(1);
            this.myForm.get('IsConsultant').setValue(1);
        }
        this.getDepartmentList();

        this.filteredOptionsPrefix = this.myForm.get('PrefixID').valueChanges.pipe(
            startWith(''),
            map(value => this._filterPrex(value)),

        );

        this.filteredDoctortype = this.myForm.get('DoctorTypeId').valueChanges.pipe(
            startWith(''),
            map(value => this._filterDcotype(value)),

        );

        this.filteredOptionsDep = this.myForm.get('Departmentid').valueChanges.pipe(
            startWith(''),
            map(value => this._filterDep(value)),

        );

        this.filteredOptionsPrefix = this.myForm.get('PrefixID').valueChanges.pipe(
            startWith(''),
            map(value => this._filterPrex(value)),
      
          );
      
          this.filteredDoctortype = this.myForm.get('DoctorTypeId').valueChanges.pipe(
            startWith(''),
            map(value => this._filterDcotype(value)),
      
          );
          
            
          this.filteredOptionsCity = this.myForm.get('CityId').valueChanges.pipe(
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
    //   @ViewChild('gender') gender: MatSelect;
    @ViewChild('mstatus') mstatus: ElementRef;
    @ViewChild('religion') religion: ElementRef;
    @ViewChild('city') city: ElementRef;

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

    public onEntercity(event): void {
        if (event.which === 13) {
          this.agem.nativeElement.focus();
          // this.addbutton.focus();
        }
      }


      public onEnteragey(event, value): void {
        if (event.which === 13) {
            this.agem.nativeElement.focus();
    
            this.ageyearcheck(value);
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

    public onEnterAadharCardNo(event): void {
        if (event.which === 13) {
          this.address.nativeElement.focus();
        }
      }
    public onEnterphone(event): void {
        if (event.which === 13) {
            this.address.nativeElement.focus();
        }
    }
    public onEnterpan(event): void {
        if (event.which === 13) {
          this.address.nativeElement.focus();
        }
      }
    

public onEnteraddress(event): void {
    if (event.which === 13) {
      this.address.nativeElement.focus();
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
        return this.myForm.controls;
    }


    getDocDeptList() {
        var m_data = {
           // "DoctorId": this.registerObj.DoctorId
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

        const toSelect = this.PrefixcmbList.find(c => c.PrefixID == this.registerObj.prefixId);
        this.myForm.get('PrefixID').setValue(toSelect);

        // const toSelect1 = this.DepartmentcmbList.find(c => c.Departmentid == this.docobject.DepartmentId);
        // this.myForm.get('Departmentid').setValue(toSelect1);

        // const toSelectReligion = this.ReligionList.find(c => c.ReligionId == this.registerObj.ReligionId);
        // this.myForm.get('ReligionId').setValue(toSelectReligion);

        this.myForm.updateValueAndValidity();
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
    //         this.myForm.get('GenderId').setValue(ddValue);
    //     })
    // }



    // getDoctortypeNameCombobox() {

    //     this._doctorService.getDoctortypeMasterCombo().subscribe(data => {
    //         this.DoctortypecmbList = data;
    //         if (this.data) {
    //             const ddValue = this.DoctortypecmbList.filter(c => c.Id == this.registerObj.DoctorTypeId);
    //             this.myForm.get('DoctorTypeId').setValue(ddValue[0]);
    //             this.myForm.updateValueAndValidity();
    //             return;
    //         }
    //     });

    // }


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
    //         this.myForm
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
            this.filteredOptionsDep = this.myForm.get('Departmentid').valueChanges.pipe(
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

    Savebtn:boolean=false;
    onSubmit() {
        // debugger

        // if ((this.vCityId == '' || this.vCityId == null || this.vCityId == undefined)) {
        //     this.toastr.warning('Please select valid City ', 'Warning !', {
        //         toastClass: 'tostr-tost custom-toast-warning',
        //     });
        //     return;
        // }
        // if ((this.vPrefixID == '' || this.vPrefixID == null || this.vPrefixID == undefined)) {
        //     this.toastr.warning('Please select valid City', 'Warning !', {
        //         toastClass: 'tostr-tost custom-toast-warning',
        //     });
        //     return;
        // }
        //  if ((this.vDoctypeId == '' || this.vDoctypeId == null || this.vDoctypeId == undefined)) {
        //     this.toastr.warning('Please select valid Doctor Type', 'Warning !', {
        //         toastClass: 'tostr-tost custom-toast-warning',
        //     });
        //     return;
        // }

        // if (this.myForm.get("DoctorId").value) {
        //     var data2 = [];
        //     this.selectedItems.forEach((element) => {
        //         let DocInsertObj = {};
        //         // DocInsertObj['DepartmentId'] = element.DepartmentId;
        //         DocInsertObj["docDeptId"]=1
        //         DocInsertObj['departmentId'] = this.departmentId;
        //         DocInsertObj['doctorId'] = !this.myForm.get("DoctorId").value ? "0" : this.myForm.get("DoctorId").value || "0";
        //         data2.push(DocInsertObj);
        //     });
        //     console.log("Insert data2:", data2);

        //     // var m_data = {
        //     //     doctorId: !this.myForm.get("DoctorId").value ? "0" : this.myForm.get("DoctorId").value || "0",
        //     //     prefixID: this.myForm.get("PrefixID").value.PrefixID,
        //     //     firstName: this.myForm.get("FirstName").value.trim() || "",
        //     //     middleName: this.myForm.get("MiddleName").value.trim() || "",
        //     //     lastName: this.myForm.get("LastName").value.trim() || "",
        //     //   //  dateOfBirth: this.registerObj.DateofBirth,//this.datePipe.transform(this.registerObj.DateofBirth, 'MM/dd/yyyy') || '01/01/1900',
        //     //     City: this.myForm.get("CityId").value.CityName || "",
        //     //     address: this.myForm.get("Address").value || "",
        //     //     phone: this.myForm.get("Phone").value || "0",
        //     //     mobile: this.myForm.get("MobileNo").value || "",
        //     //     genderId: this.myForm.get("GenderId").value.GenderId || 0,
        //     //     education: this.myForm.get("Education").value.trim() || "",
        //     //     isConsultant: Boolean(JSON.parse(this.myForm.get("IsConsultant").value)),
        //     //     isRefDoc: Boolean(JSON.parse(this.myForm.get("IsRefDoc").value)),
        //     //     IsActive: Boolean(JSON.parse(this.myForm.get("isActive").value)),
        //     //     doctorTypeId: this.myForm.get("DoctorTypeId").value.Id || 0,
        //     //     passportNo: this.myForm.get("PassportNo").value || "0",
        //     //     esino: this.myForm.get("ESINO").value || "0",
        //     //     regNo: this.myForm.get("RegNo").value || "0",
        //     //     // regDate:this.registerObj.RegDate,// this.myForm.get("RegDate").value || '01/01/1900',//this.datePipe.transform(this.registerObj.RegDate, 'MM/dd/yyyy') || '01/01/1900',
        //     //     mahRegNo: this.myForm.get("MahRegNo").value || "0",
        //     //     PanCardNo: this.myForm.get("Pancardno").value || "0",
        //     //     AadharCardNo:  this.myForm.get("AadharCardNo").value || "0",
        //     //     // mahRegDate:this.registerObj.MahRegDate,// this.datePipe.transform(this.registerObj.MahRegDate, 'MM/dd/yyyy') || '01/01/1900',
        //     //     isInHouseDoctor: true,
        //     //     isOnCallDoctor: true,
        //     //     Addedby: this.accountService.currentUserValue.userId,
        //     //     updatedBy: this.accountService.currentUserValue.userId,
        //     //     Signature: this.signature || '',
        //     //     Departments: data2
        //     // };

        //     console.log("insert mdata:", mdata)

        //     if (!this.myForm.get("DoctorId").value) {
        //         this._doctorService.doctortMasterInsert(mdata).subscribe((data) => {
        //             if (data) {
        //                 this.toastr.success('Record Saved Successfully.', 'Saved !', {
        //                     toastClass: 'tostr-tost custom-toast-success',
        //                 });
        //             }
        //             this.onClose();
        //         });
        //     } else {
        //         this._doctorService.doctortMasterUpdate(mdata).subscribe((data) => {
        //             this.msg = data;
        //             if (data) {
        //                 this.toastr.success('Record updated Successfully.', 'updated !', {
        //                     toastClass: 'tostr-tost custom-toast-success',
        //                 });
        //             }
        //             this.onClose();
        //         });
        //     }
        // }

        // if (!this.myForm.get("DoctorId").value) {
                          
            var data2 = [];
            // this.selectedItems.forEach((element) => {
            //     let DocInsertObj = {};
            //     // DocInsertObj['DepartmentId'] = element.DepartmentId;
            //         DocInsertObj["docDeptId"]=1,
            //         DocInsertObj['doctorId'] = this.myForm.get("DoctorId").value ? "0" : this.myForm.get("DoctorId").value || "0";
            //         DocInsertObj['departmentId'] = this.myForm.get("Departmentid").value ? "0" : this.myForm.get("Departmentid").value || "0";
            //         data2.push(DocInsertObj);
            // });

            // this.selectedItems.forEach((element) => {
                        let DocInsertObj = {};
                        // DocInsertObj['DepartmentId'] = element.DepartmentId;
                        DocInsertObj["docDeptId"]=1
                        DocInsertObj['departmentId'] =1,// this.departmentId;
                        DocInsertObj['doctorId'] = 22,//!this.myForm.get("DoctorId").value ? "0" : this.myForm.get("DoctorId").value || "0";
                        data2.push(DocInsertObj);
                    // });



            console.log("Insert data2:",data2);

            var mdata =

            {              
                "doctorId": 0,
                "prefixId":this.myForm.get("PrefixID").value || "",
                "firstName": this.myForm.get("FirstName").value.trim() || "",
                "middleName": this.myForm.get("MiddleName").value.trim() || "",
                "lastName": this.myForm.get("LastName").value.trim() || "",
                "dateofBirth": "2021-03-31T12:27:24.771Z",
                "address": this.myForm.get("Address").value.trim() || "",
                "city":this.myForm.get("CityId").value || "",
                "pin": "0", 
                "phone": "0",
                "mobile": this.myForm.get("MobileNo").value || "",
                "genderId": "1",//this.myForm.get("GenderId").value || "",
                "education": this.myForm.get("Education").value.trim() || "",
                "isConsultant": true,
                "isRefDoc": true,
                "isActive": true,
                "doctorTypeId": 1,//this.myForm.get("DoctorTypeId").value || "0",// this.doctorId,
                "ageYear": this.myForm.get("AgeYear").value.toString() || "0",
                "ageMonth": this.myForm.get("AgeMonth").value.toString() || "",
                "ageDay": this.myForm.get("AgeDay").value.toString() || "",
                "passportNo": "0",
                "esino": this.myForm.get("ESINO").value || "0",
                "regNo": this.myForm.get("RegNo").value || "0",                
                "regDate": this.myForm.get("RegDate").value || "1999-08-06",
                // "regDate":this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || this.dateTimeObj.date,
                "mahRegNo": this.myForm.get("MahRegNo").value || "0",
                "mahRegDate": this.myForm.get("MahRegDate").value || "1999-08-06",
                "refDocHospitalName": this.myForm.get("RefDocHospitalName").value || "0",
                "isInHouseDoctor": true,
                "isOnCallDoctor": true,
                "panCardNo": this.myForm.get("Pancardno").value || "0",
                "aadharCardNo": this.myForm.get("AadharCardNo").value || "0",
                "mDoctorDepartmentDets": data2
            }
            console.log("Insert mdata:",mdata);
            
var d={
    
        "doctorId": 0,
        "prefixId": 154,
        "firstName": "shilpa",
        "middleName": "xyz",
        "lastName": "meshram",
        "dateofBirth": "1999-08-06",
        "address": "satara",
        "city": "pune",
        "pin": "string",
        "phone": "8764655455",
        "mobile": "string",
        "genderId": "0",
        "education": "string",
        "isConsultant": true,
        "isRefDoc": true,
        "isActive": true,
        "doctorTypeId": 2223,
        "ageYear": "string",
        "ageMonth": "string",
        "ageDay": "string",
        "passportNo": "string",
        "esino": "string",
        "regNo": "string",
        "regDate": "1999-08-06",
        "mahRegNo": "string",
        "mahRegDate": "1999-08-06",
        "refDocHospitalName": "string",
        "isInHouseDoctor": true,
        "isOnCallDoctor": true,
        "panCardNo": "string",
        "aadharCardNo": "1236578935",
        "mDoctorDepartmentDets": [
          {
            "docDeptId": 0,
            "doctorId": 0,
            "departmentId": 898
          }
        ]
      }
      

            this._doctorService.doctortMasterInsert(d).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
              this.toastr.error(error.message);
            });
            
        // } 
        
        // else {
          
        //     var data3 = [];
        //     this.selectedItems.forEach((element) => {
        //         let DocInsertObj = {};
        //         DocInsertObj["docDeptId"]=1
        //         DocInsertObj['departmentId'] = this.departmentId;
        //         DocInsertObj['doctorId'] = !this.myForm.get("DoctorId").value ? "0" : this.myForm.get("DoctorId").value || "0";
        //         data2.push(DocInsertObj);
        //     });

        //     console.log("update data3:",data3);

        //     var mdataUpdate={
              
        //        "doctorId": 0,
        //         // "prefixId": this.myForm.get("PrefixID").value.PrefixID,
        //         "prefixId":this.PrefixId,
        //         "firstName": this.myForm.get("FirstName").value.trim() || "",
        //         "middleName": this.myForm.get("MiddleName").value.trim() || "",
        //         "lastName": this.myForm.get("LastName").value.trim() || "",
        //         "dateofBirth": "2021-03-31T12:27:24.771Z",
        //         "address": this.myForm.get("Address").value.trim() || "",
        //         "city": this.cityId,
        //         "pin": "0",
        //         "phone": this.myForm.get("Phone").value || "0",
        //         "mobile": this.myForm.get("MobileNo").value || "",
        //         "genderId": this.genderId,
        //         "education": this.myForm.get("Education").value.trim() || "",
        //         "isConsultant": true,
        //         "isRefDoc": true,
        //         "doctorTypeId": this.doctorId,
        //         "ageYear": this.myForm.get("AgeYear").value.toString() || "0",
        //         "ageMonth": this.myForm.get("AgeMonth").value.toString() || "",
        //         "ageDay": this.myForm.get("AgeDay").value.toString() || "",
        //         "passportNo": 0,
        //         "esino": this.myForm.get("ESINO").value || "0",
        //         "regNo": this.myForm.get("RegNo").value || "0",
        //         "regDate": this.myForm.get("RegDate").value || "1999-08-06",
        //         // "regDate":this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || this.dateTimeObj.date,
        //         "mahRegNo": this.myForm.get("MahRegNo").value || "0",
        //         "mahRegDate": this.myForm.get("MahRegDate").value || "0",
        //         "refDocHospitalName": this.myForm.get("RefDocHospitalName").value || "0",
        //         "isInHouseDoctor": true,
        //         "isOnCallDoctor": true,
        //         "panCardNo": this.myForm.get("Pancardno").value || "0",
        //         "aadharCardNo": this.myForm.get("AadharCardNo").value || "0",
        //         "mDoctorDepartmentDets": data3
        //     }

        //     console.log(mdataUpdate);
        //     this._doctorService.doctortMasterUpdate(mdataUpdate).subscribe((data) => {
        //             this.msg = data;
        //             if (data) {
        //                 this.toastr.success('Record updated Successfully.', 'updated !', {
        //                     toastClass: 'tostr-tost custom-toast-success',
        //                   });  
        //                    this.Savebtn=false;
        //             } else {
        //                 this.toastr.error('Doctor-from Master Master Data not updated !, Please check API error..', 'Error !', {
        //                     toastClass: 'tostr-tost custom-toast-error',
        //                   });
        //             }
        //         });
        // }
        this.onClose();
    }

    onClear(val:boolean) {
        this.myForm.reset();
    }
    onClose() {
        this.myForm.reset();
        this.dialogRef.close();
    }




    onChangeDateofBirth(DateOfBirth) {
        if (DateOfBirth) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth);
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            // this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
            // this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
            // this.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
            // this.registerObj.DateofBirth = DateOfBirth;
            this.myForm.get('DateOfBirth').setValue(DateOfBirth);
        }

    }
    onChangeRegDate(RegDate) {
        // if (RegDate) {
        //     this.registerObj.RegDate = new Date(RegDate);
        // }
        // else {
        //     this.registerObj.RegDate = null;
        // }
    }
    onChangeMahRegDate(MahRegDate) {
        // if (MahRegDate) {
        //     this.registerObj.MahRegDate = new Date(MahRegDate);
        // }
        // else {
        //     this.registerObj.MahRegDate = null;
        // }
    }

    onChangeGenderList(prefixObj) {
        if (prefixObj) {
            this._doctorService
                .getGenderCombo(prefixObj.PrefixID)
                .subscribe((data) => {
                    this.GendercmbList = data;
                    this.myForm.get("GenderId").setValue(this.GendercmbList[0]);
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
      //this.registerObj.DateofBirth = d;
      //this.personalFormGroup.get('DateOfBirth').setValue(moment().add(Number(e.target.value), 'days').format("DD-MMM-YYYY"));
    }
    else if (mode == "Month") {
      d.setMonth(d.getMonth() - Number(e.target.value));
     // this.registerObj.DateofBirth = d;
    }
    else if (mode == "Year") {
      d.setFullYear(d.getFullYear() - Number(e.target.value));
      //this.registerObj.DateofBirth = d;
    }
    let todayDate = new Date();
    //const timeDiff = Math.abs(Date.now() - this.registerObj.DateofBirth.getTime());
    // this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    // this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - this.registerObj.DateofBirth.getMonth());
    // this.registerObj.AgeDay = Math.abs(todayDate.getDate() - this.registerObj.DateofBirth.getDate());
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
        //const ddValue = this.PrefixcmbList.filter(c => c.PrefixID == this.registerObj.PrefixID);
        // this.myForm.get('PrefixID').setValue(ddValue[0]);
        this.myForm.updateValueAndValidity();
        return;
      }
    });
    this.onChangeGenderList(this.registerObj);
  }


  getPrefixList() {
    this._doctorService.getPrefixMasterCombo().subscribe(data => {
        this.PrefixcmbList = data;
        this.optionsPrefix = this.PrefixcmbList.slice();
        this.filteredOptionsPrefix = this.myForm.get('PrefixID').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filterPrex(value) : this.PrefixcmbList.slice()),
        );

    });
}

  getcityList() {

    this._doctorService.getCityList().subscribe(data => {
      this.cityList = data;
      this.optionsCity = this.cityList.slice();
      this.filteredOptionsCity = this.myForm.get('CityId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCity(value) : this.cityList.slice()),
      );

    });

  }

  getCitylist() {
    
    this._doctorService.getCityList().subscribe(data => {
      this.cityList = data;
      if (this.data) {
        // const ddValue = this.cityList.filter(c => c.CityId == this.registerObj.City);
        // this.myForm.get('CityId').setValue(ddValue[0]);
        this.myForm.updateValueAndValidity();
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



//   new Api?
PrefixId=0;
genderId=0;
cityId=0;
cityName='';
doctorId=0;
doctorName='';
departmentId=0;
departmentName='';

selectChangeprefix(obj:any){
    console.log(obj)
    this.PrefixId=obj.value;
}

selectChangegender(obj:any){
    console.log(obj)
    this.genderId=obj.value;
}

selectChangecity(obj:any){
    console.log(obj)
    this.cityId=obj.value;
    this.cityName=obj.text;
}

selectChangedoctorTy(obj:any){
    this.doctorId=obj.value;
    this.doctorName=obj.text;
}

selectChangedep(obj:any){
    this.departmentId=obj.value;
    this.departmentName=obj.value;
}

getValidationMessages() {
    return {
        PrefixID: [
            { name: "required", Message: "Prefix Name is required" }
        ]
    };
}
getValidationCityMessages() {
    return {
        CityId: [
            { name: "required", Message: "City Name is required" }
        ]
    };
}
getValidationDoctorTypeMessages(){
    return {
        DoctorTypeId: [
            { name: "required", Message: "Doctor Type is required" }
        ]
    };
}
getValidationDepartmentMessages(){
    return {
        Departmentid: [
            { name: "required", Message: "Department Name is required" }
        ]
    };
}
getValidationGenderMessages(){
    return {
        GenderId: [
            { name: "required", Message: "Gender is required" }
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