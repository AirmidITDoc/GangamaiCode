import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { EmergencyListService } from '../emergency-list.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import Swal from 'sweetalert2';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { EmergencyList } from '../emergency-list.component';

@Component({
  selector: 'app-new-emergency',
  templateUrl: './new-emergency.component.html',
  styleUrls: ['./new-emergency.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewEmergencyComponent implements OnInit {

  dateTimeObj: any;
  screenFromString = 'emergency-form';
  vPrefixID: any;
  vFirstName: any;
  vMiddleName: any;
  vLastName: any;
  vAddress: any;
  vMobileNo: any;
  vPinNo: any;
  vAgeYear:any;
  vAgeMonth:any;
  vAgeDay:any;
  vPhoneNo:any;
  optionsPrefix: any[] = [];
  optionsCity: any[] = [];
  optionsDep: any[] = [];
  optionsDoc: any[] = [];
  PrefixcmbList: any = [];
  GendercmbList: any = [];
  DoctorList: any = [];
  cityList: any = [];
  countryList: any = [];
  stateList: any = [];
  DepartmentList: any = [];
  vDoctorId: any = 0;
  vDepartmentid: any = 0;
  vCityId: any = 0;
  DateofBirth: Date;
  GenderList: any = [];
  selectedGenderID: any;
  filteredOptionsPrefix: Observable<string[]>;
  isPrefixSelected: boolean = false;
  filteredOptionsCity: Observable<string[]>;
  filteredOptionsDep: Observable<string[]>;
  isCitySelected: boolean = false;
  filteredOptionsDoc: Observable<string[]>;

  isDepartmentSelected: boolean = false;
  isDoctorSelected: boolean = false;
  selectedState = "";
  selectedStateID: any;
  selectedCountry: any;
  selectedCountryID: any;
  registerObj = new AdmissionPersonlModel({});
  currentDate = new Date();
  RegId: any=0;
  
  constructor(
    public _EmergencyListService: EmergencyListService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef:MatDialogRef<NewEmergencyComponent>
  ) { }

  dateStyle?: string = 'Date';
    OnChangeDobType(e) {
        this.dateStyle = e.value;
    }
    CalcDOB(mode, e) {
      let d = new Date();
      if (mode == "Day") {
          d.setDate(d.getDate() - Number(e.target.value));
          this.registerObj.DateofBirth = d;
          //this._EmergencyListService.MyForm.get('DateOfBirth').setValue(moment().add(Number(e.target.value), 'days').format("DD-MMM-YYYY"));
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

  ngOnInit(): void {
    this.getDepartmentList();
    this.getcityList1();
    this.getPrefixList();

    if(this.data){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.vFirstName = this.registerObj.FirstName
      this.vLastName = this.registerObj.LastName
      this.vMiddleName = this.registerObj.MiddleName
      this.vAddress = this.registerObj.Address
      this.vPinNo = this.registerObj.PinNo
      this.vAgeDay=this.registerObj.AgeDay
      this.vAgeMonth=this.registerObj.AgeMonth
      this.vAgeYear=this.registerObj.AgeYear
      this.vMobileNo=this.registerObj.MobileNo
      this.vPhoneNo=this.registerObj.PhoneNo
      this.vDepartmentid = this.registerObj.DepartmentName;
      this.vDoctorId = this.registerObj.DoctorName;
      this.RegId=this.registerObj.RegId;

      this.onChangeCityList(this.registerObj.CityId);
    }
    console.log("vFirstName:", this.vFirstName)
    console.log("vLastName:", this.vLastName)
    console.log("vMiddleName:", this.vMiddleName)
    console.log("vAddress:", this.vAddress)
    console.log("vPinNo:", this.vPinNo)
    console.log("vAgeDay:", this.vAgeDay)
    console.log("vAgeMonth:", this.vAgeMonth)
    console.log("vAgeYear:", this.vAgeYear)
    console.log("vMobileNo:", this.vMobileNo)
    console.log("vPhoneNo:", this.vPhoneNo)
  }



  @ViewChild('fname') fname: ElementRef;
  @ViewChild('mname') mname: ElementRef;
  @ViewChild('lname') lname: ElementRef;
  @ViewChild('agey') agey: ElementRef;
  @ViewChild('aged') aged: ElementRef;
  @ViewChild('agem') agem: ElementRef;
  @ViewChild('deptdoc') deptdoc: ElementRef;
  @ViewChild('mobile') mobile: ElementRef;
  @ViewChild('address') address: ElementRef;
  
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
     // this.mstatus.nativeElement.focus();
      // if(this.mstatus) this.mstatus.focus();
    }
  }
  public onEntercity(event): void {
    if (event.which === 13) {

       // this.ptype.nativeElement.focus();
    }
  }
  public onEnterdept(event, value): void {
    if (event.which === 13) {
      if (value == undefined) {
        this.toastr.warning('Please Enter Valid Department.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else {
        this.deptdoc.nativeElement.focus();
      }
    }
  }

  
  public onEnterdeptdoc(event): void {
    if (event.which === 13) {
      
       // this.admitdoc1.nativeElement.focus();
      
    }

  }
  public onEnterbday(event): void {
    if (event.which === 13) {
        this.agey.nativeElement.focus();

    }
}
  public onEnteragey(event):void{
    if (event.which === 13) {
      this.agem.nativeElement.focus();
    }
  }
  public onEnteragem(event): void {
    if (event.which === 13) {
      this.aged.nativeElement.focus();
    }
  }
  public onEnteraged(event): void {
    if (event.which === 13) {
     /// this.pan.nativeElement.focus();
    }
  }
  onEntermobile($event){

  }
  onEnterphone($event){

  }
  
  ageyearcheck(event) {
    
    if (parseInt(event) > 100) {
      this.toastr.warning('Please Enter Valid Age.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });

      this.agey.nativeElement.focus();
    }
    return;
    // else{
    //   this.agem.nativeElement.focus();
    // }
  }
  agemonthcheck(event) {

    if (event > 12) {
      this.toastr.warning('Please Enter Valid Month.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }

  agedaycheck(event) {

    if (event > 31) {
      this.toastr.warning('Please Enter Valid Ageday.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }

  onSave(){
    if (this._EmergencyListService.MyForm.get('PrefixID').value == '' || this._EmergencyListService.MyForm.get('PrefixID').value== null) {
      this.toastr.warning('Please Select Prefix Name  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._EmergencyListService.MyForm.get('PrefixID').value) {
      if(!this.PrefixcmbList.find(item => item.PrefixID == this._EmergencyListService.MyForm.get('PrefixID').value.PrefixID)){
        this.toastr.warning('Please select Valid Prefix Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    } 
    if (this.vFirstName == '' || this.vFirstName == null || this.vFirstName == undefined) {
      this.toastr.warning('Please enter First Name  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this.vLastName == '' || this.vLastName == null || this.vLastName == undefined) { 
      this.toastr.warning('Please enter Last Name  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._EmergencyListService.MyForm.get('AgeYear').value == '' || this._EmergencyListService.MyForm.get('AgeYear').value== null) {
      this.toastr.warning('Please enter AgeYear  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }    
    if (this.vCityId == '' || this.vCityId == null || this.vCityId == undefined) {
      this.toastr.warning('Please Select City Name  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._EmergencyListService.MyForm.get('CityId').value) {
      if(!this.cityList.find(item => item.CityId == this._EmergencyListService.MyForm.get('CityId').value.CityId))
      {
        this.toastr.warning('Please select Valid Prefix Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }  
    if (this.vDepartmentid == '' || this.vDepartmentid == null || this.vDepartmentid == undefined) {
      this.toastr.warning('Please select Department  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._EmergencyListService.MyForm.get('Departmentid').value) {
      if(!this.DepartmentList.find(item => item.DepartmentName == this._EmergencyListService.MyForm.get('Departmentid').value.DepartmentName))
     {
      this.toastr.warning('Please select Valid Department Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
     }
    } 
    if (this.vDoctorId == '' || this.vDoctorId == null || this.vDoctorId == undefined) {
      this.toastr.warning('Please select Doctor  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._EmergencyListService.MyForm.get('DoctorId').value) {
      if(!this.DoctorList.find(item => item.Doctorname == this._EmergencyListService.MyForm.get('DoctorId').value.Doctorname))
      {
        this.toastr.warning('Please select Valid Doctor Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    
    Swal.fire({
      title: 'Do you want to Save the Emergency Recode ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!" ,
      cancelButtonText: "No, Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
          this.onSubmit();
      }
    });

  }
  Savebtn: boolean = false;
  onSubmit() {
  debugger
    
    if (!this.registerObj.EmgId) {
      var m_data = { 
          "emgId": 0,
          "regId ":this.registerObj.RegId || 0,
          "emgDate": this.dateTimeObj.date || '01/01/1900',// this.dateTimeObj.date,//
          "emgTime": this.datePipe.transform(this.currentDate, 'hh:mm:ss'),// this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
          "prefixId": this._EmergencyListService.MyForm.get('PrefixID').value.PrefixID,
          "firstName": this._EmergencyListService.MyForm.get('FirstName').value || "",
          "middleName": this._EmergencyListService.MyForm.get('MiddleName').value || "",
          "lastName":this._EmergencyListService.MyForm.get('LastName').value || "",
          "address": this._EmergencyListService.MyForm.get('Address').value || "",
          "genderID": this._EmergencyListService.MyForm.get('GenderId').value.GenderId || 0,
          "mobileNo": this._EmergencyListService.MyForm.get('MobileNo').value || "",// this._registerService.mySaveForm.get("MobileNo").value || "0",
          "addedBy": this.accountService.currentUserValue.user.id,
          "updatedBy": this.accountService.currentUserValue.user.id,
          "ageYear": this._EmergencyListService.MyForm.get('AgeYear').value || "0",// this._registerService.mySaveForm.get("AgeYear").value.trim() || "%",
          "cityId": this._EmergencyListService.MyForm.get('CityId').value.CityId,
          "departmentId": this._EmergencyListService.MyForm.get('Departmentid').value.DepartmentId,
          "doctorId": this._EmergencyListService.MyForm.get('DoctorId').value.DoctorId || 0,
       
      }
      var m_data1 = { 
          "bedId": 0      
      }
      let submitData={
        "ipdEmergencyRegInsert":m_data,
        "ipdEmergencyAdv":m_data1
      }
      console.log("dfdf:",submitData);
      this._EmergencyListService.regInsert(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.OnReset()
        } else {
          this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
    else{
      debugger

      var m_dataUpdate = {
                
          "emgId": this.registerObj.EmgId,
          "regId": this.registerObj.RegId || 0,
          "emgDate": this.dateTimeObj.date || '01/01/1900',
          "emgTime": this.datePipe.transform(this.currentDate, 'hh:mm:ss'),
          "prefixId": this._EmergencyListService.MyForm.get('PrefixID').value.PrefixID,
          "genderID": this._EmergencyListService.MyForm.get('GenderId').value.GenderId || 0,
          "firstName": this._EmergencyListService.MyForm.get('FirstName').value || "",
          "middleName": this._EmergencyListService.MyForm.get('MiddleName').value || "",
          "lastName": this._EmergencyListService.MyForm.get('LastName').value || "",
          "address": this._EmergencyListService.MyForm.get('Address').value || "",
          "cityId": this._EmergencyListService.MyForm.get('CityId').value.CityId,
          "ageYear": this._EmergencyListService.MyForm.get('AgeYear').value || "0",
          "mobileNo": this._EmergencyListService.MyForm.get('MobileNo').value || "",
          "departmentId":this._EmergencyListService.MyForm.get('Departmentid').value.DepartmentId,
          "doctorId": this._EmergencyListService.MyForm.get('DoctorId').value.DoctorId || 0,
          "updatedBy": this.accountService.currentUserValue.user.id,
        }
      var m_dataUpdate1 = {
          "bedId": 0
      }
      let updateData={
        "ipdEmergencyRegEdit":m_dataUpdate,
        "ipdEmergencyAdv":m_dataUpdate1
      }
      console.log(updateData)
      this._EmergencyListService.emgUpdate(updateData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.OnReset()
        }
        else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }

      });

    }
         
    }


  onChangeCityList(CityObj) {
    if (CityObj) {
      this._EmergencyListService.getStateList(CityObj.CityId).subscribe((data: any) => {
        this.stateList = data;
        this.selectedState = this.stateList[0].StateName;
        this.selectedStateID = this.stateList[0].StateId;
        this._EmergencyListService.MyForm.get('StateId').setValue(this.stateList[0]);
        this.selectedStateID = this.stateList[0].StateId;
        this.onChangeCountryList(this.selectedStateID);
      });
      
    }
    else {
      this.selectedState = null;
      this.selectedStateID = null;
      this.selectedCountry = null;
      this.selectedCountryID = null;
    }
  }

  onChangeCountryList(StateId) {
    if (StateId > 0) {
      this._EmergencyListService.getCountryList(StateId).subscribe(data => {
        this.countryList = data;
        this.selectedCountry = this.countryList[0].CountryName;
        this._EmergencyListService.MyForm.get('CountryId').setValue(this.countryList[0]);
        this._EmergencyListService.MyForm.updateValueAndValidity();
      });
    }
  }

  onChangeDateofBirth(DateOfBirth) {
    // console.log(DateOfBirth)
  //   if (DateOfBirth) {     
  //     const todayDate = new Date();
  //     const dob = new Date(DateOfBirth);
  //     const timeDiff = Math.abs(Date.now() - dob.getTime());
  //     this._EmergencyListService.MyForm.get('AgeYear').setValue(Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25));
  //     this._EmergencyListService.MyForm.get('AgeMonth').setValue(Math.abs(todayDate.getMonth() - dob.getMonth()));
  //     this._EmergencyListService.MyForm.get('AgeDay').setValue(Math.abs(todayDate.getDate() - dob.getDate()));
  //     this._EmergencyListService.MyForm.get('DateOfBirth').setValue(DateOfBirth);
  // }

  if (DateOfBirth) {
    const todayDate = new Date();
    const dob = new Date(DateOfBirth);
    const timeDiff = Math.abs(Date.now() - dob.getTime());
    this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
    this.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
    this.registerObj.DateofBirth = DateOfBirth;
    this._EmergencyListService.MyForm.get('DateOfBirth').setValue(DateOfBirth);
}

}

  getcityList1() {
    debugger
    this._EmergencyListService.getCityList().subscribe(data => {
      this.cityList = data;
      this.optionsCity = this.cityList.slice();
      this.filteredOptionsCity = this._EmergencyListService.MyForm.get('CityId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCity(value) : this.cityList.slice()),
      );

      if (this.data) {
        debugger
        const CValue = this.cityList.filter(item => item.CityId == this.registerObj.CityId);
        console.log("CityId:",CValue)
        this._EmergencyListService.MyForm.get('CityId').setValue(CValue[0]);
        this._EmergencyListService.MyForm.updateValueAndValidity();
        this.onChangeCityList(CValue[0]);
        
      }
    });

  }

  private _filterCity(value: any): string[] {
    if (value) {
      const filterValue = value && value.CityName ? value.CityName.toLowerCase() : value.toLowerCase();
      return this.optionsCity.filter(option => option.CityName.toLowerCase().includes(filterValue));
    }

  }

  private _filterPrex(value: any): string[] {
    if (value) {
      const filterValue = value && value.PrefixName ? value.PrefixName.toLowerCase() : value.toLowerCase();
      return this.PrefixcmbList.filter(option => option.PrefixName.toLowerCase().includes(filterValue));
    }
  }

  getPrefixList() {
    
    this._EmergencyListService.getPrefixMasterCombo().subscribe(data => {
      this.PrefixcmbList = data;
      this.optionsPrefix = this.PrefixcmbList.slice();
      this.filteredOptionsPrefix = this._EmergencyListService.MyForm.get('PrefixID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterPrex(value) : this.PrefixcmbList.slice()),

      );
      if (this.data) {
        const PValue = this.PrefixcmbList.filter(item => item.PrefixID == this.data.Obj.PrefixId);
        console.log("Prefix:",PValue)
        this._EmergencyListService.MyForm.get('PrefixID').setValue(PValue[0]);
        this._EmergencyListService.MyForm.updateValueAndValidity();
        this.onChangeGenderList(PValue[0]);
        return;
      }
    });
   
  }

  getDepartmentList() {
    
    this._EmergencyListService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this._EmergencyListService.MyForm.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );
      if (this.data) {
        
        const DValue = this.DepartmentList.filter(item => item.DepartmentId == this.registerObj.DepartmentId);
        console.log("Departmentid:",DValue)
        this._EmergencyListService.MyForm.get('Departmentid').setValue(DValue[0]);
        this._EmergencyListService.MyForm.updateValueAndValidity();
        this.OnChangeDoctorList(DValue[0]);
        return;
      }
    });
  }

  private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.departmentName ? value.departmentName.toLowerCase() : value.toLowerCase();
      return this.optionsDep.filter(option => option.departmentName.toLowerCase().includes(filterValue));
    }

  }
  getOptionTextPrefix(option) {
    return option && option.PrefixName ? option.PrefixName : '';
  }

  getOptionTextCity1(option) {
    return option && option.CityName ? option.CityName : '';
  }

  getOptionTextDoc(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }

  getOptionTextDep(option) {
    return option && option.DepartmentName ? option.DepartmentName : '';
  }


  OnChangeDoctorList(departmentObj) {
    debugger
    console.log(departmentObj)
    this._EmergencyListService.MyForm.get('DoctorId').reset();
    var vdata={
      "Id":departmentObj.DepartmentId
    } 

    this.isDepartmentSelected = true;
    this._EmergencyListService.getDoctorMasterCombo(vdata).subscribe(
      data => {
        this.DoctorList = data;
        console.log(this.DoctorList)
        this.optionsDoc = this.DoctorList.slice();
        this.filteredOptionsDoc = this._EmergencyListService.MyForm.get('DoctorId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
        );
        if(this.registerObj){
          debugger
          const dVaule=this.DoctorList.filter(item=>item.DoctorId == this.registerObj.DoctorId)
          this._EmergencyListService.MyForm.get('DoctorId').setValue(dVaule[0])
        }
        console.log("doctor ndfkdf:",this._EmergencyListService.MyForm.get('DoctorId').value)
      })
  }

  private _filterDoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      this.isDoctorSelected = false;
      return this.optionsDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }

  }


  onChangeGenderList(prefixObj) {
    if (prefixObj) {
      this._EmergencyListService
        .getGenderCombo(prefixObj.PrefixID)
        .subscribe((data) => {
          this.GendercmbList = data;
          this._EmergencyListService.MyForm.get("GenderId").setValue(this.GendercmbList[0]);
          // this.selectedGenderID = this.GenderList[0].GenderId;
        });
    }
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  onClose() {
    this._matDialog.closeAll();
  }
  OnReset() {
    this._EmergencyListService.MyForm.reset();
    this.dialogRef.close();
  }
}
