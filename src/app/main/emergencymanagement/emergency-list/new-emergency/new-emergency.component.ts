import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { EmergencyListService } from '../emergency-list.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import Swal from 'sweetalert2';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';

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
  vFirstName: any;
  vMiddleName: any;
  vLastName: any;
  vAddress: any;
  vMobileNo: any;
  vPinNo: any;
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
  
  constructor(
    public _EmergencyListService: EmergencyListService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    public dialogRef:MatDialogRef<NewEmergencyComponent>
  ) { }

  ngOnInit(): void {
    this.getDepartmentList();
    this.getcityList1();
    this.getPrefixList();

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
  public onEnteragem(event,value): void {
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
  onEnteragey($event,value){

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

  Savebtn: boolean = false;
  onSubmit() {
debugger
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
    if (this._EmergencyListService.MyForm.get('FirstName').value == '' || this._EmergencyListService.MyForm.get('FirstName').value== null) {
      this.toastr.warning('Please enter First Name  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._EmergencyListService.MyForm.get('LastName').value == '' || this._EmergencyListService.MyForm.get('LastName').value== null) {
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
    if (this._EmergencyListService.MyForm.get('AgeMonth').value == '' || this._EmergencyListService.MyForm.get('AgeMonth').value== null) {
      this.toastr.warning('Please enter AgeMonth  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._EmergencyListService.MyForm.get('AgeDay').value == '' || this._EmergencyListService.MyForm.get('AgeDay').value== null) {
      this.toastr.warning('Please enter AgeDay  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._EmergencyListService.MyForm.get('Address').value == '' || this._EmergencyListService.MyForm.get('Address').value== null) {
      this.toastr.warning('Please eneter Address  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._EmergencyListService.MyForm.get('PinNo').value == '' || this._EmergencyListService.MyForm.get('PinNo').value== null) {
      this.toastr.warning('Please enter PinNo  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._EmergencyListService.MyForm.get('CityId').value == '' || this._EmergencyListService.MyForm.get('CityId').value== null) {
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
    // if (this._EmergencyListService.MyForm.get('StateId').value == '' || this._EmergencyListService.MyForm.get('StateId').value== null) {
    //   this.toastr.warning('Please Select State Name  ', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // } 
    // if (this._EmergencyListService.MyForm.get('CountryId').value == '' || this._EmergencyListService.MyForm.get('CountryId').value== null) {
    //   this.toastr.warning('Please Select Country Name  ', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // } 
    if (this._EmergencyListService.MyForm.get('MobileNo').value == '' || this._EmergencyListService.MyForm.get('MobileNo').value== null) {
      this.toastr.warning('Please enter MobileNo  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._EmergencyListService.MyForm.get('PhoneNo').value == '' || this._EmergencyListService.MyForm.get('PhoneNo').value== null) {
      this.toastr.warning('Please enter PhoneNo  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._EmergencyListService.MyForm.get('Departmentid').value == '' || this._EmergencyListService.MyForm.get('Departmentid').value== null) {
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
    if (this._EmergencyListService.MyForm.get('DoctorId').value == '' || this._EmergencyListService.MyForm.get('DoctorId').value== null) {
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
   
    if (!this.registerObj.RegId) {
      var m_data = {
        "ipdEmergencyRegInsert": {
          
          "EmgId": 0,
          "RegId ":this.registerObj.RegId || 0,
          "EmgDate": this.dateTimeObj.date || '01/01/1900',// this.dateTimeObj.date,//
          "EmgTime": this.datePipe.transform(this.currentDate, 'hh:mm:ss'),// this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
          "PrefixId": this._EmergencyListService.MyForm.get('PrefixID').value.PrefixID,
          "FirstName": this._EmergencyListService.MyForm.get('FirstName').value || "",
          "MiddleName": this._EmergencyListService.MyForm.get('MiddleName').value || "",
          "LastName":this._EmergencyListService.MyForm.get('LastName').value || "",
          "Address": this._EmergencyListService.MyForm.get('Address').value || "",
         // "City": this._EmergencyListService.MyForm.get('CityId').value.CityName || '',
          "PinNo": '0',// this._registerService.mySaveForm.get("PinNo").value || "0",
         // "DateOfBirth": this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"),// this.registerObj.DateofBirth || "2021-03-31",
          "Age": this.registerObj.AgeYear || 0,//this._registerService.mySaveForm.get("Age").value || "0",
          "GenderID": this._EmergencyListService.MyForm.get('GenderId').value.GenderId || 0,
          "PhoneNo":this._EmergencyListService.MyForm.get('PhoneNo').value || "",// this._registerService.mySaveForm.get("PhoneNo").value || "0",
          "MobileNo": this._EmergencyListService.MyForm.get('MobileNo').value || "",// this._registerService.mySaveForm.get("MobileNo").value || "0",
          "AddedBy": this.accountService.currentUserValue.user.id,
          "UpdatedBy": this.accountService.currentUserValue.user.id,
          "AgeYear": this._EmergencyListService.MyForm.get('AgeYear').value || "0",// this._registerService.mySaveForm.get("AgeYear").value.trim() || "%",
          // "AgeMonth": this.registerObj.AgeMonth || "0",// this._registerService.mySaveForm.get("AgeMonth").value.trim() || "%",
          // "AgeDay": this.registerObj.AgeDay || "0",// this._registerService.mySaveForm.get("AgeDay").value.trim() || "%",
          "CountryId": this._EmergencyListService.MyForm.get('CountryId').value.CountryId,
          "StateId": this._EmergencyListService.MyForm.get('StateId').value.StateId,
          "CityId": this._EmergencyListService.MyForm.get('CityId').value.CityId,
          "departmentId": this._EmergencyListService.MyForm.get('Departmentid').value.DepartmentId,
          "doctorId": this._EmergencyListService.MyForm.get('DoctorId').value.DoctorId || 0,
        
        
        
          // "MaritalStatusId": this._EmergencyListService.MyForm.get('MaritalStatusId').value ? this._EmergencyListService.MyForm.get('MaritalStatusId').value.MaritalStatusId : 0,
          // "IsCharity": false,//Boolean(JSON.parse(this._EmergencyListService.MyForm.get("IsCharity").value)) || "0",
          // "ReligionId": this._EmergencyListService.MyForm.get('ReligionId').value ? this._EmergencyListService.MyForm.get('ReligionId').value.ReligionId : 0,
          // "AreaId": this._EmergencyListService.MyForm.get('AreaId').value ? this._EmergencyListService.MyForm.get('AreaId').value.AreaId : 0,
          // "isSeniorCitizen": 0,
          // "Aadharcardno": this._EmergencyListService.MyForm.get('AadharCardNo').value ? this._EmergencyListService.MyForm.get('AadharCardNo').value : 0,
          // "pancardno": this._EmergencyListService.MyForm.get('PanCardNo').value ? this._EmergencyListService.MyForm.get('PanCardNo').value : 0,
          // "Photo": ''//
        }
      }
      console.log(m_data);
      this._EmergencyListService.regInsert(m_data).subscribe(response => {
        if (response) {

          Swal.fire('Congratulations !', 'Emergency Register Data save Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
              // this.getRegistredPatientCasepaperview(response);
            }
          });
        } else {
          Swal.fire('Error !', 'Register Data  not saved', 'error');
        }
      });
    }
//     else
   
// debugger
//       var m_data1 = {
//         "opdRegistrationUpdate": {
//           "RegID": this.RegID,
//           "PrefixId": this._EmergencyListService.MyForm.get('PrefixID').value.PrefixID,
//           "FirstName": this.registerObj.FirstName || "",
//           "MiddleName": this.registerObj.MiddleName || "",
//           "LastName": this.registerObj.LastName || "",
//           "Address": this.registerObj.Address || "",
//           "City": this._EmergencyListService.MyForm.get('CityId').value.CityName || 0,
//           "PinNo": '0',// this._registerService.mySaveForm.get("PinNo").value || "0",
//           "DateOfBirth": this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"),// this.registerObj.DateofBirth || "2021-03-31",
//           "Age":this.registerObj.Age,
//           "GenderID": this._EmergencyListService.MyForm.get('GenderId').value.GenderId || 0,
//           "PhoneNo": this._EmergencyListService.MyForm.get("PhoneNo").value || "",
//           "MobileNo": this._EmergencyListService.MyForm.get("MobileNo").value || "0",
//           "UpdatedBy": this.accountService.currentUserValue.user.id,
//           "AgeYear": this._EmergencyListService.MyForm.get("AgeYear").value || "0",
//           "AgeMonth": this._EmergencyListService.MyForm.get("AgeMonth").value || "0",
//           "AgeDay": this._EmergencyListService.MyForm.get("AgeDay").value || "0",
//           "CountryId": this._EmergencyListService.MyForm.get('CountryId').value.CountryId,
//           "StateId": this._EmergencyListService.MyForm.get('StateId').value.StateId,
//           "CityId": this._EmergencyListService.MyForm.get('CityId').value.CityId,
//           "MaritalStatusId": this._EmergencyListService.MyForm.get('MaritalStatusId').value ? this._EmergencyListService.MyForm.get('MaritalStatusId').value.MaritalStatusId : 0,
//           "IsCharity": false,// Boolean(JSON.parse(this._EmergencyListService.MyForm.get("IsCharity").value)) || "0",
//           "ReligionId": this._EmergencyListService.MyForm.get('ReligionId').value ? this._EmergencyListService.MyForm.get('ReligionId').value.ReligionId : 0,
//           "AreaId": this._EmergencyListService.MyForm.get('AreaId').value ? this._EmergencyListService.MyForm.get('AreaId').value.AreaId : 0,
//           // "isSeniorCitizen":0,
//           "aadharcardno": this._EmergencyListService.MyForm.get('AadharCardNo').value ? this._EmergencyListService.MyForm.get('AadharCardNo').value : 0,
//           "pancardno": this._EmergencyListService.MyForm.get('PanCardNo').value ? this._EmergencyListService.MyForm.get('PanCardNo').value : 0,
//           "Photo": ''// this.file.name || '',
//         }
//       }
//       console.log(m_data1)
//       this._registerService.regUpdate(m_data1).subscribe(response => {
//         if (response) {
//           Swal.fire('Congratulations !', 'Register Data Udated Successfully !', 'success').then((result) => {
//             if (result.isConfirmed) {
//              debugger
//               this.viewgetPatientAppointmentReportPdf(this.registerObj.VisitId);
//               if(this.Submitflag)
//                 this.getAdmittedPatientCasepaperview(this.registerObj.AdmissionID);
//               this._matDialog.closeAll();
//             }
//           });
//         }

//         else {
//           Swal.fire('Error !', 'Register Data  not Updated', 'error');
//         }

//       });

      
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

  getcityList1() {
    this._EmergencyListService.getCityList().subscribe(data => {
      this.cityList = data;
      this.optionsCity = this.cityList.slice();
      this.filteredOptionsCity = this._EmergencyListService.MyForm.get('CityId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCity(value) : this.cityList.slice()),
      );
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

    });
  }

  private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
      return this.optionsDep.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
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
