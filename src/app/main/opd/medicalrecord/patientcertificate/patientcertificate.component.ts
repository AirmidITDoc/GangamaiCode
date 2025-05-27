import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AppointmentlistService } from '../../appointment-list/appointmentlist.service';

@Component({
  selector: 'app-patientcertificate',
  templateUrl: './patientcertificate.component.html',
  styleUrls: ['./patientcertificate.component.scss'],
      encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class PatientcertificateComponent {

  registerObj:any;
  vOPDNo: any;
  vPatientName: any;
  vDoctorName: any;
  vAgeYear: any;
  vDepartmentName: any;
  vOP_MobileNo: any;
  vTariffName: any;
  vCompanyName: any;
  vWardName:any;
  vBedNo:any;
  vGenderName:any;
  RegId:any;
  vVisitedId:any;
  vAge:any;
  vRegNo:any;
  vRefDocName:any;
  mycertificateForm: FormGroup;
  vCertificateId:any;
vConsentText:any;
isButtonDisabled: boolean = false;
selectedTemplate:string=''
registerObjDet:any;

  dsCertficateTemp = new MatTableDataSource<certificateTemp>();
  displayedColumns: string[] = [
    'CertificateDate', 
    'CertificateName',
    'CertificateText',
    'Action'
  ]
  autocompleteModeTemplate:string=''

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '24rem',
    minHeight: '24rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,
  };
  
  onBlur(e: any) {
    // this.vConsentText = e.target.innerHTML;
    throw new Error('Method not implemented.');
  }

  constructor(
    public _AppointmentServiceService: AppointmentlistService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<PatientcertificateComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private _loggedService: AuthenticationService
  ) { 
    this.mycertificateForm = this.CreatePatientCertiform();}

  ngOnInit(): void {
    if(this.data){
      this.registerObj=this.data;
      console.log("Certificate RegisterObj:",this.registerObj)

      this.vWardName=this.registerObj.RoomName;
      this.vBedNo=this.registerObj.BedName;
      this.vGenderName=this.registerObj.GenderName;
      this.vPatientName = this.registerObj.patientName;
      this.vAgeYear = this.registerObj.ageYear;
     this.RegId = this.registerObj.regId;
      this.vVisitedId = this.registerObj.visitId
      this.vAge=this.registerObj.Age;
      this.vRegNo =this.registerObj.regNoWithPrefix; 
      this.vOPDNo = this.registerObj.opdNo;
      this.vCompanyName = this.registerObj.companyName;
      this.vTariffName = this.registerObj.tariffName; 
      this.vOP_MobileNo = this.registerObj.mobileNo;
      this.vDoctorName = this.registerObj.doctorname;
      this.vDepartmentName=this.registerObj.departmentName;
      this.vRefDocName=this.registerObj.refDocName
      this.selectedTemplate=this.registerObj.ConsentTempId;
    }
  }

  CreatePatientCertiform() {
    return this._formBuilder.group({
      RegID: [''],
      PatientType: ['OP'],
      MobileNo: '',
      PatientName: '',
      ConsentName: '',
      ConsentText: [''],
      Template: [''],
      Department: [''],
      Language: ['1'],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      certificateId:''
    })
  }
  onSave(){

  }

  addTemplateDescription() {
    
    this.isButtonDisabled=false;
    if (this.selectedTemplate == '' || this.selectedTemplate == null || this.selectedTemplate == undefined) {
      this.toastr.warning('Please select Template Name ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.mycertificateForm.get('Template').value) {
    //   if(!this.TemplateList.find(item => item.ConsentId == this.mycertificateForm.get('Template').value.ConsentId))
    //  {
    //   this.toastr.warning('Please select Valid Template Name', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    //  }
    }
    
    this.vConsentText = this.registerObjDet || '';
    this.registerObjDet='';
    
  }

  selectChangeTemplate(data){
    this.registerObjDet = data.CertificateDesc;
  }

  onClose() {
    // this._AppointmentServiceService.mycertificateForm.reset({Language: '1'});    
    this.dialogRef.close();
  }

  getValidationMessages(){
    return {
      Template: [
          // { name: "required", Message: "Service is required" }
      ]
  };
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
