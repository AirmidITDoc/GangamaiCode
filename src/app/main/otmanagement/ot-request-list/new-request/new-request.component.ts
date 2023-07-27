import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OPIPPatientModel } from 'app/main/opd/op-search-list/search-page/search-page.component';
import { Requestlist } from '../ot-request-list.component';
import { ReplaySubject, Subject } from 'rxjs';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { OTManagementServiceService } from '../../ot-management-service.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent implements OnInit {

 
  personalFormGroup: FormGroup;
  isAlive = false;
  savedValue: number = null;
  isLoadings = false;
  isOpen = false;
  loadID = 0;
  submitted = false;
  now = Date.now();
  searchFormGroup: FormGroup;
  isRegSearchDisabled: boolean = true;
  newRegSelected: any = 'registration';
  selectedAdvanceObj: OPIPPatientModel;
  msg: any = [];
  DoctorList: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  SurgeryList: any = [];
  OTtableList: any = [];
  CategoryList: any = [];
  // CategoryList : any = [];
  Sitelist: any = [];
  Today: any;
  registerObj = new OPIPPatientModel({});
  isLoading: string = '';
  Prefix: any;
  registerObj1 = new Requestlist({});

  IsPathRad: any;
  PatientName: any = '';
  OPIP: any = '';
  Bedname: any = '';
  wardname: any = '';
  classname: any = '';
  tariffname: any = '';
  AgeYear: any = '';
  ipno: any = '';
  patienttype: any = '';
  Adm_Vit_ID: any = 0;
  DepartmentList: any = [];
  options = [];

  // @Input() panelWidth: string | number;
  // @ViewChild('multiUserSearch') multiUserSearchInput: ElementRef;


  screenFromString = 'registration';
  selectedPrefixId: any;

  // @Input() childName: string[];
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
  matDialogRef: any;

  //doctorone filter
  public doctoroneFilterCtrl: FormControl = new FormControl();
  public filteredDoctorone: ReplaySubject<any> = new ReplaySubject<any>(1);


  //doctorone filter
  public surgeryFilterCtrl: FormControl = new FormControl();
  public filteredsurgery: ReplaySubject<any> = new ReplaySubject<any>(1);

  //doctorone filter
  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);


  //doctortwo filter
  public doctortwoFilterCtrl: FormControl = new FormControl();
  public filteredDoctortwo: ReplaySubject<any> = new ReplaySubject<any>(1);



  //Category filter
  public CategoryFilterCtrl1: FormControl = new FormControl();
  public filteredCategory: ReplaySubject<any> = new ReplaySubject<any>(1);



  //Site filter
  public SitetFilterCtrl: FormControl = new FormControl();
  public filteredSite: ReplaySubject<any> = new ReplaySubject<any>(1);

  public departmentFilterCtrl: FormControl = new FormControl();
  public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);


  private _onDestroy = new Subject<void>();

  constructor(
    public _OtManagementService: OTManagementServiceService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewRequestComponent>,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    private router: Router) { }


  ngOnInit(): void {
    
    debugger;
    this.personalFormGroup = this.createOtrequestForm();
    if (this.data) {

      this.registerObj1 = this.data.PatObj;
     
      console.log(this.registerObj1);

      this.setDropdownObjs1();
    }
    this.getSurgeryList();
    this.getOttableList();
    this.getDoctorList();
    this.getDoctor1List();
    this.getDoctor2List();
    this.getCategoryList();
    this.getSiteList();
    this.getDepartmentList();
  
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.PatientName = this.selectedAdvanceObj.PatientName;
      this.OPIP = this.selectedAdvanceObj.IP_OP_Number;
      this.AgeYear = this.selectedAdvanceObj.AgeYear;
      this.classname = this.selectedAdvanceObj.ClassName;
      this.tariffname = this.selectedAdvanceObj.TariffName;
      this.ipno = this.selectedAdvanceObj.IPNumber;
      this.Bedname = this.selectedAdvanceObj.Bedname;
      this.wardname = this.selectedAdvanceObj.WardId;
      // this.Adm_Vit_ID = this.selectedAdvanceObj.OP_IP_ID;
    }
    // console.log(this.selectedAdvanceObj);
    this.Today = new Date().toDateString;
    console.log(this.Today);


    this.doctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();
      });

    this.SitetFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSite();
      });

    this.doctortwoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctortwo();
      });


    this.CategoryFilterCtrl1.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategory();
      });

    this.surgeryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSurgery();
      });

    

     
    this.departmentFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(serviceData => {
        if (serviceData && this.isLoading) {
          this.filteredDepartment = serviceData.filteredDepartment === null ? [] : serviceData.filteredDepartment;
          this.isLoadings = false;
          if (this.filteredDepartment && this.filteredDepartment && this.savedValue !== null && this.filteredDepartment) {
            this.departmentFilterCtrl.setValue(this.savedValue);
          }
          if (serviceData.error) {
            this.departmentFilterCtrl.setValue(this.savedValue);
            this.departmentFilterCtrl.setErrors({ 'serviceFail': serviceData.error });

          }
        }
        this.filterDepartment();
      });

      
    
      setTimeout(function () {

        let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
        element.click();
  
      }, 1000);
    
  }

  closeDialog() {
    console.log("closed")
    this.dialogRef.close();
    // this.personalFormGroup.reset();
  }

  createOtrequestForm() {
    return this.formBuilder.group({
      OTbookingDate: [new Date().toISOString()],
      OTbookingTime: [new Date().toISOString()],
      OP_IP_ID: '',
      OP_IP_Type: '',
      AddedDateTime: [new Date().toISOString()],
      SurgeryId: '',
      SurgeonId: '',
      SurgeonId1: '',
      SurgeryType: '',
      DepartmentId: '',
      CategoryId: ' ',
      IsCancelled: '',
      SiteDescId: '',
      DoctorId: ''

    });
  }

  private filterDepartment() {
    // debugger;

    if (!this.DepartmentList) {
      return;
    }
    // get the search keyword
    let search = this.departmentFilterCtrl.value;
    if (!search) {
      this.filteredDepartment.next(this.DepartmentList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDepartment.next(
      this.DepartmentList.filter(bank => bank.departmentName.toLowerCase().indexOf(search) > -1)
    );

  }


  openChanged(event) {
    this.isOpen = event;
    this.isLoading = event;
    if (event) {
      this.savedValue = this.departmentFilterCtrl.value;
      this.options = [];
      this.departmentFilterCtrl.reset();
      this._OtManagementService.getDepartmentCombo();
    }
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




  // filterSurgery filter code  
  private filterSurgery() {
    if (!this.SurgeryList) {
      return;
    }
    // get the search keyword
    let search = this.surgeryFilterCtrl.value;
    if (!search) {
      this.filteredsurgery.next(this.SurgeryList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredsurgery.next(
      this.SurgeryList.filter(bank => bank.SurgeryName.toLowerCase().indexOf(search) > -1)
    );
  }

  // doctorone filter code  
  private filterDoctorone() {

    if (!this.Doctor1List) {
      return;
    }
    // get the search keyword
    let search = this.doctoroneFilterCtrl.value;
    if (!search) {
      this.filteredDoctorone.next(this.Doctor1List.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctorone.next(
      this.Doctor1List.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }


  // doctorone filter code  
  private filterDoctortwo() {

    if (!this.Doctor2List) {
      return;
    }
    // get the search keyword
    let search = this.doctortwoFilterCtrl.value;
    if (!search) {
      this.filteredDoctortwo.next(this.Doctor2List.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctortwo.next(
      this.Doctor2List.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }


  // area filter code  
  private filterCategory() {

    if (!this.CategoryList) {
      return;
    }
    // get the search keyword
    let search = this.CategoryFilterCtrl1.value;
    if (!search) {
      this.filteredCategory.next(this.CategoryList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredCategory.next(
      this.CategoryList.filter(bank => bank.SurgeryCategoryName.toLowerCase().indexOf(search) > -1)
    );

  }



  // Site filter code  
  private filterSite() {
    if (!this.Sitelist) {
      return;
    }
    // get the search keyword
    let search = this.SitetFilterCtrl.value;
    if (!search) {
      this.filteredSite.next(this.Sitelist.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredSite.next(
      this.Sitelist.filter(bank => bank.SiteDescriptionName.toLowerCase().indexOf(search) > -1)
    );


  }


  setDropdownObjs1() {
    debugger;

    // this._OtManagementService.populateFormpersonal(this.registerObj1);

    // const toSelect = this.SurgeryList.find(c => c.SurgeryId == this.registerObj1.SurgeryId);
    // this.personalFormGroup.get('SurgeryId').setValue(toSelect);

    const toSurgeonId1 = this.DoctorList.find(c => c.DoctorId == this.registerObj1.SurgeonId);
    this._OtManagementService.otreservationFormGroup.get('SurgeonId').setValue(toSurgeonId1);

    const toDepartment = this.DepartmentList.find(c => c.DepartmentId == this.registerObj1.DepartmentId);
    this._OtManagementService.otreservationFormGroup.get('DepartmentId').setValue(toDepartment);

    const toCategory = this.CategoryList.find(c => c.SurgeryCategoryId == this.registerObj1.CategoryId);
    this._OtManagementService.otreservationFormGroup.get('SurgeryCategoryId').setValue(toCategory);

    const toSurgery = this.SurgeryList.find(c => c.SurgeryId == this.registerObj1.SurgeryId);
    this._OtManagementService.otreservationFormGroup.get('SurgeryId').setValue(toSurgery);



    this.personalFormGroup.updateValueAndValidity();


  }
  ngOnDestroys() {
    // this.isAlive = false;
  }



  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }


  getOttableList() {
    this._OtManagementService.getOTtableCombo().subscribe(data => { this.OTtableList = data; })
  }


  getSergeryList() {
    this._OtManagementService.getSurgeryCombo().subscribe(data => { this.SurgeryList = data; })
  }


  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegId + ')';
  }



  getCategoryList() {
    this._OtManagementService.getCategoryCombo().subscribe(data => {
      this.CategoryList = data;
      console.log(data);
      this.filteredCategory.next(this.CategoryList.slice());

    })
  }


  getSurgeryList() {
    this._OtManagementService.getSurgeryCombo().subscribe(data => {
      this.SurgeryList = data;
      console.log(data);
      this.filteredsurgery.next(this.SurgeryList.slice());

    })
  }

  getSiteList() {
    // debugger;
   var m_data = {
      "Id": 1
    }
    this._OtManagementService.getSiteCombo().subscribe(data => {
      this.Sitelist = data;
      console.log(data);
      this.filteredSite.next(this.Sitelist.slice());

    })
  }


  // getDoctor1List() {
  //   this._registerService.getDoctorMaster1Combo().subscribe(data => { this.Doctor1List = data; })
  // }


  getDoctorList() {
    this._OtManagementService.getDoctorMaster().subscribe(
      data => {
        this.DoctorList = data;
        console.log(data)
        // data => {
        //   this.DoctorList = data;
        this.filteredDoctor.next(this.DoctorList.slice());
      })
  }

  getDepartmentList() {
    let cData = this._OtManagementService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      console.log(this.DepartmentList);
      this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }

  getDoctor1List() {

    this._OtManagementService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      console.log(this.Doctor1List);
      this.filteredDoctorone.next(this.Doctor1List.slice());
    })
  }

  getDoctor2List() {
    this._OtManagementService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor2List = data;
      this.filteredDoctortwo.next(this.Doctor2List.slice())
    })
  }


  searchPatientList() {
    // const dialogRef = this._matDialog.open(IPPatientsearchComponent,
    //   {
    //     maxWidth: "90%",
    //     height: "530px !important ", width: '100%',
    //   });

    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log('The dialog was closed - Insert Action', result);
    //   if (result) {
    //     this.registerObj = result as OPIPPatientModel;
    //     if (result) {
    //       this.PatientName = this.registerObj.PatientName;
    //       this.OPIP = this.registerObj.IP_OP_Number;
    //       this.AgeYear = this.registerObj.AgeYear;
    //       this.classname = this.registerObj.ClassName;
    //       this.tariffname = this.registerObj.TariffName;
    //       this.ipno = this.registerObj.IPNumber;
    //       this.Bedname = this.registerObj.Bedname;
    //       this.wardname = this.registerObj.WardId;
    //       this.Adm_Vit_ID = this.registerObj.Adm_Vit_ID;
    //     }
    //   }
    //   // console.log(this.registerObj);
    // });
  }

  OnChangeDoctorList(departmentObj) {
    // debugger;
    console.log("departmentObj", departmentObj)
    this._OtManagementService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(
      data => {
        this.DoctorList = data;
        console.log(this.DoctorList);
        this.filteredDoctor.next(this.DoctorList.slice());
      })
  }

  onClose() {
    this.dialogRef.close();
  }


  onSubmit() {
    debugger;
    let otBookingID = this.registerObj1.OTBookingId;

    this.isLoading = 'submit';
    debugger;
    if (this.Adm_Vit_ID)
      if (!otBookingID) {
        var m_data = {
          "otTableRequestInsert": {
            "OTBookingID": 0,// this._registerService.mySaveForm.get("RegId").value || "0",
            "OTbookingDate": this.dateTimeObj.date,
            "OTbookingTime": this.dateTimeObj.date,
            "oP_IP_ID": this.Adm_Vit_ID || 0,
            "oP_IP_Type": 1,
            "surgeonId": this._OtManagementService.otreservationFormGroup.get('DoctorId').value.DoctorId || 0,
            "SurgeryId": this._OtManagementService.otreservationFormGroup.get('SurgeryId').value.SurgeryId || 0,
            "SurgeryType": this._OtManagementService.otreservationFormGroup.get('SurgeryType').value || 0,
            "DepartmentId": this._OtManagementService.otreservationFormGroup.get('DepartmentId').value.Departmentid || 0,
            "CategoryId": this._OtManagementService.otreservationFormGroup.get('SurgeryCategoryId').value.SurgeryCategoryId || 0,
            "AddedDateTime": this.dateTimeObj.date,
            "AddedBy ": this.accountService.currentUserValue.user.id || 0,
            "IsCancelled": 0,//this.personalFormGroup.get('IsCancelled ').value || '',
            "SiteDescId": this._OtManagementService.otreservationFormGroup.get('SiteDescId').value.SiteDescId || 0


          }
        }
        console.log(m_data);
        this._OtManagementService.RequestInsert(m_data).subscribe(response => {
          if (response) {
            this._OtManagementService
            Swal.fire('Congratulations !', 'OT Request  Data save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();
              }
            });
          } else {
            Swal.fire('Error !', 'Ot Request Data  not saved', 'error');
          }

        });
      }
      else {
        debugger;
        var m_data1 = {
          "otTableRequestUpdate": {
            "OTBookingID": otBookingID || 0,
            "OTbookingDate  ": this.dateTimeObj.date, //this.datePipe.transform(this.dateTimeObj.date,"yyyy-Mm-dd") || opdRegistrationSave"2021-03-31",// this.dateTimeObj.date,//
            "OTbookingTime  ": this.dateTimeObj.time, // this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",

            "oP_IP_ID": 1,//this._OtManagementService.otreservationFormGroup.get('OP_IP_ID').value | 0,
            "oP_IP_Type": 1,
            "surgeonId": this._OtManagementService.otreservationFormGroup.get('SurgeonId1').value.DoctorId || 0,
            "SurgeryId ": this._OtManagementService.otreservationFormGroup.get('SurgeryId').value.SurgeryId || 0,
            "SurgeryType ": this._OtManagementService.otreservationFormGroup.get('SurgeryType').value || 0,

            "DepartmentId ": this._OtManagementService.otreservationFormGroup.get('DepartmentId').value.Departmentid || 0,
            "CategoryId ": this._OtManagementService.otreservationFormGroup.get('SurgeryCategoryId').value.SurgeryCategoryId || 0,

            "AddedDateTime ": this.dateTimeObj.time,
            "AddedBy ": this.accountService.currentUserValue.user.id || 0,
            "IsCancelled ": 0,//this.personalFormGroup.get('IsCancelled ').value || '',
            "SiteDescId ": this._OtManagementService.otreservationFormGroup.get('SiteDescId').value.SiteDescId || 0,

          }
        }
        console.log(m_data1);
        this._OtManagementService.RequestUpdate(m_data1).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'OT Request Data Updated Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();
              }
            });
          } else {
            Swal.fire('Error !', 'OT Request Data  not saved', 'error');
          }

        });
      }
  }
}






