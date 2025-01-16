import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { fuseAnimations } from '@fuse/animations';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { AppointmentSreviceService } from '../../appointment/appointment-srevice.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-patientcertificate',
  templateUrl: './patientcertificate.component.html',
  styleUrls: ['./patientcertificate.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PatientcertificateComponent implements OnInit {

  isRegIdSelected: boolean = false;
  vConsentText: any;
  DepartmentList: any = [];
  TemplateList: any = [];
  PatientName: any;
  vOPDNo: any;
  Gender: any;
  Age: any;
  patientsource: any;
  CompanyName: any;
  TarrifName: any;
  DoctorName: any;
  vConditionOP: boolean = false;
  vConditionIP: boolean = false;
  OP_IP_Id: any = 0;
  OP_IPType: any = 0;
  RegId: any;
  registerObj1: any;
  filteredOptions: any;
  noOptionFound: boolean = false;
  PatientListfilteredOptionsIP: any;
  PatientListfilteredOptionsOP: any;
  vWardName: any;
  vBedNo: any;
  vPatientName: any;
  vGenderName: any;
  vAgeYear: any;
  vAge: any;
  vRegNo: any;
  vCompanyName: any;
  vTariffName: any;
  vOP_MobileNo: any;
  GendercmbList: any = [];
  optionsGender: any[] = [];
  selectedType: any = '';
  vOtReqOPD: any;
  vOtReqIPD: any;
  vDepartmentName: any;
  vIPDNo: any;
  vAdmissionID: any;
  vConsentName:any
  registerObj: any;
  isDepartmentSelected: boolean = false;
  isTemplateSelected: boolean = false;
  filteredOptionsDep: Observable<string[]>;
  optionsDep: any[] = [];
  selectedDepartment: string = '';
  selectedTemplate: string = '';
  vConsentId:any;
  vTemplateId:any;
  vVisitedId:any;
  vCertificateId:any;
  Vopipid:any;
  optionsTemp: any[] = [];
  filteredOptionsTemp: Observable<string[]>;
  vDoctorName:any;
  sIsLoading: string = '';
  vCertificateName:any;  
  isButtonDisabled: boolean = false;
  isDropdownDisabled: boolean = false;

  editorConfig: AngularEditorConfig = {
    // color:true,
    editable: true,
    spellcheck: true,
    height: '14rem',
    minHeight: '14rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,

  };
  onBlur(e: any) {
    this.vConsentText = e.target.innerHTML;
  }
  
  dsCertficateTemp = new MatTableDataSource<certificateTemp>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'CertificateDate', 
    'CertificateName',
    'CertificateText',
    // 'CreatedBy',
    'Action'
  ]

  constructor(
    public _AppointmentServiceService: AppointmentSreviceService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<PatientcertificateComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getCertificateDropDownList();
    
    if(this.data){
      this.registerObj1=this.data.Obj;
      console.log("Certificate RegisterObj:",this.registerObj1)

      this.vWardName=this.registerObj1.RoomName;
      this.vBedNo=this.registerObj1.BedName;
      this.vGenderName=this.registerObj1.GenderName;
      this.vPatientName = this.registerObj1.PatientName;
      this.vAgeYear = this.registerObj1.AgeYear;
     this.RegId = this.registerObj1.RegId;
      this.vVisitedId = this.registerObj1.VisitId
      this.vAge=this.registerObj1.Age;
      this.vRegNo =this.registerObj1.RegNo; 
      this.vOPDNo = this.registerObj1.OPDNo;
      this.vCompanyName = this.registerObj1.CompanyName;
      this.vTariffName = this.registerObj1.TariffName; 
      this.vOP_MobileNo = this.registerObj1.MobileNo;
      this.vDoctorName = this.registerObj1.Doctorname;
      this.vDepartmentName=this.registerObj1.DepartmentName;
      this.vConsentName=this.registerObj1.ConsentName;
      this.vConsentId=this.registerObj1.ConsentId;
      this.vConsentText=this.registerObj1.ConsentText;
      
      this.selectedDepartment=this.registerObj1.ConsentDeptId;
      this.selectedTemplate=this.registerObj1.ConsentTempId;
      this.vTemplateId=this.registerObj1.ConsentTempId

      // this.getSiteList();
      this.getCertificateDropDownList();
      this.getCertificateList();
      this._AppointmentServiceService.mycertificateForm.get('Template').enable();
    }
  }

  getCertificateList(){
    
    this.sIsLoading = 'loading-data';

    const D_data = {
      "VisitedID": this.vVisitedId,
    };
    console.log('data:',D_data)
    this._AppointmentServiceService.getCertificateList(D_data).subscribe(Visit => {
    this.dsCertficateTemp.data = Visit as certificateTemp[];
    this.dsCertficateTemp.sort = this.sort;
    this.dsCertficateTemp.paginator = this.paginator;
    console.log('check:',this.dsCertficateTemp.data)
    this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  selectedTemplateOption: any; 
  registerObjDet:any;
  onTemplateSelect(option) {
    
    console.log(option)

    this.registerObjDet = option.CertificateDesc;
  }

addTemplateDescription() {
  debugger
  this.isButtonDisabled=false;
  if (this.selectedTemplate == '' || this.selectedTemplate == null || this.selectedTemplate == undefined) {
    this.toastr.warning('Please select Template Name ', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
  if (this._AppointmentServiceService.mycertificateForm.get('Template').value) {
    if(!this.TemplateList.find(item => item.ConsentId == this._AppointmentServiceService.mycertificateForm.get('Template').value.ConsentId))
   {
    this.toastr.warning('Please select Valid Template Name', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
   }
  }
  
  this.vConsentText = this.registerObjDet || '';
  this.registerObjDet='';
  
}

resetTemplateSelection(){
  // this._AppointmentServiceService.mycertificateForm.reset({Language: '1'}); 
  
  const templateControl = this._AppointmentServiceService.mycertificateForm.get('Template');
  templateControl.setValue(''); 
  this.selectedTemplate = '';
  this._AppointmentServiceService.mycertificateForm.patchValue({ Language: '1' });
  this.isTemplateSelected = false;
}

  onSave(){ 
    this.isButtonDisabled=false;
    if (this.vConsentText == '' || this.vConsentText == null || this.vConsentText== undefined) {
      this.toastr.warning('Please enter ConsentText  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this.selectedTemplate == '' || this.selectedTemplate == null || this.selectedTemplate == undefined) {
      this.toastr.warning('Please enter select Template ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._AppointmentServiceService.mycertificateForm.get('Template').value) {
      if(!this.TemplateList.find(item => item.ConsentId == this._AppointmentServiceService.mycertificateForm.get('Template').value.ConsentId))
     {
      this.toastr.warning('Please select Valid Template Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
     }
    }

    Swal.fire({
      title: 'Do you want to Save the Certificate Recode ',
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

  onSubmit() {
    
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd'); 

    if(!this.vCertificateId){

      var m_dataInsert={
        "saveTCertificateInformationparams": {
          "certificateId": 0,
          "certificateDate": formattedDate,
          "certificateTime": formattedTime,
          "visitId":this.vVisitedId,
          "certificateTempId": this._AppointmentServiceService.mycertificateForm.get("Template").value.CertificateId || 0,
          "certificateName": this._AppointmentServiceService.mycertificateForm.get("Template").value.CertificateName || '',
          "certificateText": this._AppointmentServiceService.mycertificateForm.get("ConsentText").value || '',
          "createdBy": this._loggedService.currentUserValue.user.id,
        }
      }
      console.log("insertJson:", m_dataInsert);

      this._AppointmentServiceService.CertificateInsert(m_dataInsert).subscribe(response =>{
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onSubList()
        } else {
          this.toastr.error('Record not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
    else{
      var m_dataUpdate={
          "updateTCertificateInformationparams": {
          "certificateId": this.vCertificateId,
          "certificateDate": formattedDate,
          "certificateTime": formattedTime,
          "visitId":this.vVisitedId,
          "certificateTempId":this._AppointmentServiceService.mycertificateForm.get("Template").value.CertificateId || 0,
          "certificateName": this._AppointmentServiceService.mycertificateForm.get("Template").value.CertificateName || '',
          "certificateText": this._AppointmentServiceService.mycertificateForm.get("ConsentText").value || '',
          "modifiedBy": this._loggedService.currentUserValue.user.id,
        }
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._AppointmentServiceService.CertificateUpdate(m_dataUpdate).subscribe(response =>{
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onSubList()
        } else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  }

  certificateId:any;
  getCertificateDropDownList() {
    
    this.isTemplateSelected = true;

    const templateControl = this._AppointmentServiceService.mycertificateForm.get('Template');
  templateControl.setValue('');  // Clear the current selected value
  
    this._AppointmentServiceService.getCertificateCombo().subscribe(
      data => {
        this.TemplateList = data;
        console.log(this.TemplateList)
        this.optionsTemp = this.TemplateList.slice();
        this.filteredOptionsTemp = this._AppointmentServiceService.mycertificateForm.get('Template').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterTemp(value) : this.TemplateList.slice()),
        );
      })
  }

  private _filterTemp(value: any): string[] {
    
    if (value) {
      const filterValue = value && value.CertificateName ? value.CertificateName.toLowerCase() : value.toLowerCase();
      this.isTemplateSelected = false;
      return this.optionsTemp.filter(option => option.CertificateName.toLowerCase().includes(filterValue));
    }

  }

  getOptionTextTemp(option) {    
    return option && option.CertificateName ? option.CertificateName : '';
  }

OnEdit(row) { 
  
  console.log('Row data received:', row);

  const matchedTemplate = this.TemplateList.find(
      item => item.CertificateName.trim() === row.CertificateName.trim()
  );

  if (matchedTemplate) {

      this.selectedTemplate = matchedTemplate;

      this._AppointmentServiceService.mycertificateForm.get('Template').setValue(matchedTemplate);

      console.log('Matched Template:', matchedTemplate);
  } else {
      console.warn('No matching template found for CertificateName:', row.CertificateName);
  }

  this._AppointmentServiceService.mycertificateForm.get('ConsentText').setValue(row.CertificateText);

  const m_data = {
      certificateId: row.CertificateId,
      // Template: matchedTemplate ? matchedTemplate.CertificateName : null,
      ConsentText: row.CertificateText,
  };

  console.log('Data sent to editCertficateForm:', m_data);

  this._AppointmentServiceService.editCertficateForm(m_data);

  console.log('Selected Template after setting:', this.selectedTemplate);
  console.log('ConsentText updated to:', row.CertificateText);

  this.isDropdownDisabled = true;  
  this._AppointmentServiceService.mycertificateForm.get('Template').disable();
  this.isButtonDisabled= true;
}

onSubList(){
  this.getCertificateList();
  this._AppointmentServiceService.mycertificateForm.reset({Language: '1'}); 
}

  

  onClose() {
    this._AppointmentServiceService.mycertificateForm.reset({Language: '1'});    
    this.dialogRef.close();
  }
  onClear() {
    this._AppointmentServiceService.mycertificateForm.reset({Language: '1'});   
  }

}

export class certificateTemp {

  CertificateDate : Date;
  CreatedBy : any;
  CetificateName: any;
  CertificateText: any;
 
  constructor(certificateTemp) {
 
    this.CertificateDate = certificateTemp.CertificateDate || '';
    this.CreatedBy = certificateTemp.CreatedBy || '';
   this.CetificateName =certificateTemp.CetificateName  || '';
   this.CertificateText = certificateTemp.CertificateText || '';
  } 
}
