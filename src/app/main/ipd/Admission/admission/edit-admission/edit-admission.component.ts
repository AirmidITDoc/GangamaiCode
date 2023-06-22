import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AdmissionService } from '../admission.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AdmissionPersonlModel, Editdetail } from '../admission.component';
import { fuseAnimations } from '@fuse/animations';


@Component({
  selector: 'app-edit-admission',
  templateUrl: './edit-admission.component.html',
  styleUrls: ['./edit-admission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditAdmissionComponent implements OnInit {

  
  @ViewChild('myButton') myButton: ElementRef;
  dateTimeObj: any;
  isCompanySelected: boolean = false;
  registerObj = new AdmissionPersonlModel({});
  HospitalList: any = [];
  TariffList: any = [];
  DepartmentList: any = [];
  PatientTypeList: any = [];
  DoctorList: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  RelationshipList: any = [];
  CompanyList: any = [];
  SubTPACompList: any = [];
  DepartmentID: any = [];
  AdmissionID: any;
  AdmittedDoc1: any;
  DoctorId: any;
  PatientName: any;
  AdmissionDate: any;
  RelativeName: any;
  RelativeAddress: any;
  RelatvieMobileNo: any;
  selectedAdvanceObj: Editdetail;
  screenFromString = 'admission-form';
  AdmittedDoc2:any;
  public departmentFilterCtrl: FormControl = new FormControl();
  public filtereddepartment: ReplaySubject<any> = new ReplaySubject<any>(1);


  //doctorone filter
  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);


  private _onDestroy = new Subject<void>();

  constructor(
    public _AdmissionService: AdmissionService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    // public dialogRef: MatDialogRef<ListComponent>,
    private router: Router,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored) { }

  ngOnInit(): void {
   
    if (this.data) {

      this.registerObj = this.data.PatObj;
      this.AdmissionID = this.registerObj.AdmissionID;
      this.PatientName = this.registerObj.PatientName;
      this.AdmissionDate = this.registerObj.AdmissionDate;
      this.DoctorId = this.registerObj.DoctorId;
      this.AdmittedDoc1 = this.registerObj.AdmittedDoctor1ID;
      this.AdmittedDoc2 = this.registerObj.AdmittedDoctor2ID;

      console.log(this.registerObj);
    }

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      // console.log(this.selectedAdvanceObj);
    }
    debugger;
    // dropdown list fill code
    this.getHospitalList();
    this.getDepartmentList();
    this.getDoctorList();
    this.getDoctor1List();
    this.getDoctor2List();

    this.getTariffList();
    this.getRelationshipList();
    this.getPatientTypeList();
    this.getCompanyList();
    this.getSubTPACompList();

    this.departmentFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDepartment();
      });

    this.doctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();
      });


    setTimeout(function () {
      let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
      element.click();
    }, 1000);

  }

  setDropdownObjs() {
debugger;

    this.registerObj.AdmissionDate=new Date();

    // const toSelectHospital = this.HospitalList.find(c => c.HospitalId == this.registerObj.HospitalId);
    // this._AdmissionService.mySaveForm.get('HospitalId').setValue(toSelectHospital);

    const toSelect = this.DepartmentList.find(c => c.Departmentid == this.registerObj.Departmentid);
    this._AdmissionService.mySaveForm.get('Departmentid').setValue(toSelect);

    const toSelectDoc1 = this.DoctorList.find(c => c.DoctorId == this.registerObj.DoctorId);
    this._AdmissionService.mySaveForm.get('AdmittedDoctorId').setValue(toSelectDoc1);

    const toSelectDoc2 = this.Doctor1List.find(c => c.DoctorID == this.registerObj.AdmittedDoctor1ID);
    this._AdmissionService.mySaveForm.get('AdmittedDoctorId1').setValue(toSelectDoc2);

    const toSelectDoc3 = this.Doctor2List.find(c => c.DoctorID == this.registerObj.AdmittedDoctor2ID);
    this._AdmissionService.mySaveForm.get('AdmittedDoctor2').setValue(toSelectDoc3);


    const toSelectRelation = this.RelationshipList.find(c => c.RelationshipId == this.registerObj.RelationshipId);
    this._AdmissionService.mySaveForm.get('RelationshipId').setValue(toSelectRelation);


    // const toSelectPatientTypeId = this.PatientTypeList.find(c => c.PatientTypeID == this.registerObj.PatientTypeID);
    // this._AdmissionService.mySaveForm.get('PatientTypeID').setValue(toSelectPatientTypeId);


    const toSelectCompanyId = this.CompanyList.find(c => c.CompanyId == this.registerObj.CompanyId);
    this._AdmissionService.mySaveForm.get('CompanyId').setValue(toSelectCompanyId);

    
    const toSelectSubCompTpa = this.SubTPACompList.find(c => c.SubCompanyId == this.registerObj.SubCompanyId);
    this._AdmissionService.mySaveForm.get("SubCompanyId").setValue(toSelectSubCompTpa);

    this._AdmissionService.mySaveForm.updateValueAndValidity();

    
    if (this.registerObj.PatientTypeID == 2) {
      this._AdmissionService.mySaveForm.get('CompanyId').clearValidators();
      this._AdmissionService.mySaveForm.get('SubCompanyId').clearValidators();
      this._AdmissionService.mySaveForm.get('CompanyId').updateValueAndValidity();
      this._AdmissionService.mySaveForm.get('SubCompanyId').updateValueAndValidity();
      this.isCompanySelected = true;
    } else {
      this._AdmissionService.mySaveForm.get('CompanyId').setValidators([Validators.required]);
      // this.VisitFormGroup.get('SubCompanyId').setValidators([Validators.required]);
      this.isCompanySelected = false;
    }
  }

  



  private filterDepartment() {
    // debugger;
    if (!this.DepartmentList) {
      return;
    }
    // get the search keyword
    let search = this.departmentFilterCtrl.value;
    if (!search) {
      this.filtereddepartment.next(this.DepartmentList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filtereddepartment.next(
      this.DepartmentList.filter(department => department.departmentName.toLowerCase().indexOf(search) > -1)
    );
  }

  // doctorone filter code  
  private filterDoctor() {

    if (!this.DoctorList) {
      return;
    }
    // get the search keyword
    let search = this.doctorFilterCtrl.value;
    if (!search) {
      this.filteredDoctor.next(this.DoctorList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctor.next(
      this.DoctorList.filter(bank => bank.Doctorname.toLowerCase().indexOf(search) > -1)
    );
  }

  // OnChangeDoctorList(departmentObj) {
  //   debugger;
  //    this._AdmissionService.getDoctorMasterCombo(departmentObj).subscribe(data =>{ 
  //      this.DoctorList = data;

  //     const toSelectDoc1 = this.DoctorList.find(c => c.DoctorId == this.registerObj.AdmittedDoctor1ID);
  //     this._AdmissionService.mySaveForm.get('DoctorId').setValue(toSelectDoc1);

  //     ; })

  // }

  getTariffList() {
    this._AdmissionService.getTariffCombo().subscribe(data => {
      this.TariffList = data;
      // this._AdmissionService.mySaveForm.get('TariffId').setValue(this.TariffList[0]);
      const toSelect = this.TariffList.find(c => c.TariffId == this.data.PatObj.TariffId);
      this._AdmissionService.mySaveForm.get('TariffId').setValue(toSelect);
    });
  }

  getDepartmentList() {
    // debugger;

    this._AdmissionService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;

      // this.departmentFilterCtrl.valueChanges

      this.filtereddepartment.next(this.DepartmentList.slice());

      const toSelect = this.DepartmentList.find(c => c.Departmentid == this.selectedAdvanceObj.Departmentid);
      this._AdmissionService.mySaveForm.get('Departmentid').setValue(this.DepartmentID);
      // this.OnChangeDoctorList(this.DepartmentID);
    });
  }

  // getDepartmentList() {
  //   let cData = this._AdmissionService.getDepartmentCombo().subscribe(data => {
  //     this.DepartmentList = data;
  //     this.filtereddepartment.next(this.DepartmentList.slice());
  //   });
  // }

  getHospitalList() {
    this._AdmissionService.getHospitalCombo().subscribe(data => {
      this.HospitalList = data;
      this._AdmissionService.mySaveForm.get('HospitalId').setValue(this.HospitalList[0]);
    });
  }


  OnChangeDoctorList(departmentObj) {
    this._AdmissionService.getDoctorMasterCombo(departmentObj.DepartmentId).subscribe(data => {
      this.DoctorList = data;

      if ((this.data.PatObj.DoctorId != 0) && (this.data.PatObj.DoctorId != undefined)) {
        const toSelect = this.DoctorList.find(c => c.DoctorId == this.data.PatObj.DoctorId);
        this._AdmissionService.mySaveForm.get('AdmittedDoctorId').setValue(toSelect);
      }
    })
  }


  getDoctorList() {
    this._AdmissionService.getDoctorMaster().subscribe(data => {
      this.DoctorList = data;

      this.filteredDoctor.next(this.DoctorList.slice());

      const toSelect = this.DoctorList.find(c => c.DoctorId == this.data.PatObj.DoctorId);
      this._AdmissionService.mySaveForm.get('AdmittedDoctorId').setValue(this.DoctorId);
      // }
    })
  }

  getDoctor1List() {
    this._AdmissionService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;

      const toSelect = this.Doctor1List.find(c => c.DoctorID == this.data.PatObj.AdmittedDoctor1);
      this._AdmissionService.mySaveForm.get('AdmittedDoctor1').setValue(toSelect);
      // }
    })
  }

  getDoctor2List() {
    this._AdmissionService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor2List = data;
      if ((this.data.PatObj.DoctorID != 0) && (this.data.PatObj.DoctorID != undefined)) {
        const toSelect = this.Doctor2List.find(c => c.DoctorID == this.data.PatObj.DoctorID);
        this._AdmissionService.mySaveForm.get('AdmittedDoctor2').setValue(toSelect);
      }
    })
  }

  getRelationshipList() {
    this._AdmissionService.getRelationshipCombo().subscribe(data => { this.RelationshipList = data; })
  }


  getCompanyList() {
    this._AdmissionService.getCompanyCombo().subscribe(data => {
      this.CompanyList = data;

      if ((this.data.PatObj.CompanyId != 0) && (this.data.PatObj.CompanyId != undefined)) {
        const toSelect = this.CompanyList.find(c => c.CompanyId == this.data.PatObj.CompanyId);
        this._AdmissionService.mySaveForm.get('CompanyId').setValue(toSelect);
      }
    })
  }

  getSubTPACompList() {
    this._AdmissionService.getSubTPACompCombo().subscribe(data => {
      this.SubTPACompList = data;
      console.log(this.SubTPACompList );
      if ((this.data.PatObj.SubCompanyId != 0) && (this.data.PatObj.SubCompanyId != undefined)) {
        const toSelect = this.SubTPACompList.find(c => c.SubCompanyId == this.data.PatObj.SubCompanyId);
        this._AdmissionService.mySaveForm.get('SubCompanyId').setValue(toSelect);
      }
    })
  }

  // getPatientTypeList() {
  //   this._AdmissionService.getPatientTypeCombo().subscribe(data => {
  //     this.PatientTypeList = data;

  //     const toSelect = this.PatientTypeList.find(c => c.PatientTypeID == this.data.PatObj.PatientTypeID);
  //     this._AdmissionService.mySaveForm.get('PatientTypeID').setValue(toSelect);
  //    // this.onChangePatient(toSelect);
  //   });
  // }
  getPatientTypeList() {
    this._AdmissionService.getPatientTypeCombo().subscribe(data => {
      this.PatientTypeList = data;
      this._AdmissionService.mySaveForm.get('PatientTypeID').setValue(this.PatientTypeList[0]);
    })
  }
  onDoctorOneChange(value) {
    console.log(this._AdmissionService.mySaveForm.get('DoctorId').value);
  }

  onChangePatient(value) {
    console.log(value);

    if (value.PatientTypeId == 2) {
      this._AdmissionService.mySaveForm.get('CompanyId').clearValidators();
      this._AdmissionService.mySaveForm.get('SubCompanyId').clearValidators();
      this._AdmissionService.mySaveForm.get('CompanyId').updateValueAndValidity();
      this._AdmissionService.mySaveForm.get('SubCompanyId').updateValueAndValidity();
      this.isCompanySelected = true;
    } else {
      this._AdmissionService.mySaveForm.get('CompanyId').setValidators([Validators.required]);
      // this.VisitFormGroup.get('SubCompanyId').setValidators([Validators.required]);
      this.isCompanySelected = false;
    }
  }

  onClose() {
    // this.dialogRef.close();
  }

  onSubmit() {
    console.log(this._AdmissionService.mySaveForm.get('PatientTypeID').value);
debugger;

let company=0;
if(this.registerObj.CompanyId==0)
company=0;
else
company=this._AdmissionService.mySaveForm.get('CompanyId').value.CompanyId || 0;


    let subcompany=0;
    if(this._AdmissionService.mySaveForm.get('PatientTypeID').value.PatientTypeId==2)
    subcompany=this._AdmissionService.mySaveForm.get('SubCompanyId').value.SubCompanyId;
    else
    subcompany=0;

    debugger;
    var m_data = {
      "admissionNewUpdate": {
        "AdmissionId": this.AdmissionID,// this._AdmissionService.mySaveForm.get('AdmissionId').value || 0,
        "AdmissionDate": this.dateTimeObj.date,// this._AdmissionService.mySaveForm.get('AdmissionDate').value || "2021-03-31",
        "AdmissionTime": this.dateTimeObj.time,//this.personalFormGroup.get('AppTime').value || "2021-03-31",
         "PatientTypeId": this._AdmissionService.mySaveForm.get('PatientTypeID').value.PatientTypeId || 0,
         "HospitalId":0,
        "CompanyId":company,// this._AdmissionService.mySaveForm.get('CompanyId').value.CompanyId || 0,
        "TariffId": this._AdmissionService.mySaveForm.get('TariffId').value.TariffId || 0,
        "DepartmentId": this._AdmissionService.mySaveForm.get('Departmentid').value.Departmentid || 0,
        "AdmittedNameID": this._AdmissionService.mySaveForm.get('AdmittedDoctorId').value.DoctorId  || 0,
        "RelativeName": this._AdmissionService.mySaveForm.get('RelativeName').value || "",
        "RelativeAddress": this._AdmissionService.mySaveForm.get('RelativeAddress').value || "",
        "RelativePhoneNo": this._AdmissionService.mySaveForm.get('RelatvieMobileNo').value || "",
        "RelationshipId": 0,//this._AdmissionService.mySaveForm.get('RelationshipId').value.RelationshipId || 0,
        "IsMLC" : this._AdmissionService.mySaveForm.get('IsMLC').value || 0,
        "MotherName" :'',// this._AdmissionService.mySaveForm.get('SubCompanyId').value.SubCompanyId || 0,
        "AdmittedDoctor1": this._AdmissionService.mySaveForm.get('AdmittedDoctorId1').value.DoctorID || 0,
        "AdmittedDoctor2": this._AdmissionService.mySaveForm.get('AdmittedDoctor2').value.DoctorID || 0,
        "RefByTypeId" :0,// this._AdmissionService.mySaveForm.get('SubCompanyId').value.SubCompanyId || 0,
        "RefByName" :0,// this._AdmissionService.mySaveForm.get('SubCompanyId').value.SubCompanyId || 0,
        "isUpdatedBy" :  this.accountService.currentUserValue.user.id,
        "SubTpaComId" : subcompany,// this._AdmissionService.mySaveForm.get('SubCompanyId').value.SubCompanyId || 0,
        "IsPackagePatient":0
      }

    }


    // let admissionNewUpdate = {};
    // // this.isLoading = 'submit';
    // let submissionObj = {};
   
    // // debugger;
    // admissionNewUpdate['AdmissionId'] = this.AdmissionID;
    // admissionNewUpdate['AdmissionDate'] = this.dateTimeObj.date;
    // admissionNewUpdate['AdmissionTime'] = this.dateTimeObj.time;

    // admissionNewUpdate['patientTypeId'] = this._AdmissionService.mySaveForm.get('PatientTypeID').value.PatientTypeId || 0;
    // admissionNewUpdate['HospitalId'] =0;
    // admissionNewUpdate['CompanyId'] =company || 0;
    // admissionNewUpdate['TariffId'] = this._AdmissionService.mySaveForm.get('TariffId').value.TariffId || 0;

    // admissionNewUpdate['DepartmentId'] =  this._AdmissionService.mySaveForm.get('Departmentid').value.Departmentid || 0;
    // admissionNewUpdate['AdmittedNameID'] = this._AdmissionService.mySaveForm.get('AdmittedDoctorId').value.DoctorId  || 0;
    // admissionNewUpdate['RelativeName'] = this._AdmissionService.mySaveForm.get('RelativeName').value || "";
    // admissionNewUpdate['RelativeAddress'] =  this._AdmissionService.mySaveForm.get('RelativeAddress').value || "";

    // admissionNewUpdate['RelativePhoneNo'] =  this._AdmissionService.mySaveForm.get('RelatvieMobileNo').value || "";
    // admissionNewUpdate['RelationshipId'] = 0;
    // admissionNewUpdate['IsMLC'] = this._AdmissionService.mySaveForm.get('IsMLC').value || 0;
    // admissionNewUpdate['MotherName'] = "";

    // admissionNewUpdate['AdmittedDoctor1'] = this._AdmissionService.mySaveForm.get('AdmittedDoctorId1').value.DoctorID || 0;
    // admissionNewUpdate['AdmittedDoctor2'] =  this._AdmissionService.mySaveForm.get('AdmittedDoctor2').value.DoctorID || 0;
    // admissionNewUpdate['RefByTypeId'] = 0;
    // admissionNewUpdate['RefByName'] = 0;

    // admissionNewUpdate['isUpdatedBy'] =  this.accountService.currentUserValue.user.id;
    // admissionNewUpdate['SubTpaComId'] = subcompany|| '';
    // admissionNewUpdate['IsPackagePatient'] = 0;
   

    // submissionObj['admissionNewUpdate'] = admissionNewUpdate;
    // console.log(submissionObj);
    this._AdmissionService.AdmissionUpdate(m_data).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'Admission Data Updated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();

          }
        });
      } else {
        Swal.fire('Error !', 'Admission Data  not Updated', 'error');
      }
      // this.isLoading = '';

    });

  }



  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }



  //   triggerClick() {
  //     let el: HTMLElement = this.myButton.nativeElement as HTMLElement;
  //     setTimeout(()=> el.click(), 5000);
  // }


}
// exec update_Admission_new 10,'','',1,1,1,1,1,'','','',1,1,'',1,1,1,1,1,1
