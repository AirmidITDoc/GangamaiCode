import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { OTManagementServiceService } from '../../ot-management-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Requestlist } from '../ot-request.component';
import { fuseAnimations } from '@fuse/animations';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewRequestComponent implements OnInit {
  myForm:FormGroup;
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
  filteredOptions: any;
  noOptionFound: boolean = false;
  RegId:any;
  vAdmissionID:any;
  PatientListfilteredOptions:any;
  isRegIdSelected: boolean = false;

  
  filteredOptionautoDepartment: Observable<string[]>;
  filteredOptionsSurgeryCategory: Observable<string[]>;
  filteredOptionsSurgeon: Observable<string[]>;
  filteredOptionsSurgeon2: Observable<string[]>;
  filteredOptionsSite: Observable<string[]>;
  filteredOptionsSurgery: Observable<string[]>;
  filteredOptionsRegSearch: Observable<string[]>;


  optionsDepartment: any[] = [];
  optionsSurgeryCategory: any[] = [];
  optionsSurgeon: any[] = [];
  optionsSurgeon2: any[] = [];
  optionsSite: any[] = [];
  optionsSurgery: any[] = [];
  // optionsSurgery: any[] = [];
  
  
  isSurgerySelected: boolean = false;


  // @Input() panelWidth: string | number;
  // @ViewChild('multiUserSearch') multiUserSearchInput: ElementRef;


  screenFromString = 'registration';
  selectedPrefixId: any;

  // @Input() childName: string[];
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
  matDialogRef: any;

  
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
    this.myForm = this.createMyForm();
    
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
      this.Adm_Vit_ID = this.selectedAdvanceObj.OP_IP_ID;
    }
    // console.log(this.selectedAdvanceObj);
    this.Today = new Date().toDateString;
    console.log(this.Today);



     
    // this.departmentFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(serviceData => {
    //     if (serviceData && this.isLoading) {
    //       this.filteredDepartment = serviceData.filteredDepartment === null ? [] : serviceData.filteredDepartment;
    //       this.isLoadings = false;
    //       if (this.filteredDepartment && this.filteredDepartment && this.savedValue !== null && this.filteredDepartment) {
    //         this.departmentFilterCtrl.setValue(this.savedValue);
    //       }
    //       if (serviceData.error) {
    //         this.departmentFilterCtrl.setValue(this.savedValue);
    //         this.departmentFilterCtrl.setErrors({ 'serviceFail': serviceData.error });

    //       }
    //     }
    //     this.filterDepartment();
    //   });

      
    
      setTimeout(function () {

        let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
        element.click();
  
      }, 1000);
    
  }

   
  createMyForm() {
    return this.formBuilder.group({
      RegID: '',
      // PatientName: '',
      // WardName: '',
      // StoreId: '',
      // RegID: [''],
      // Op_ip_id: ['1'],
      // AdmissionID: 0

    })
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

  
  getSearchList() {
    var m_data = {
      "Keyword": `${this.myForm.get('RegID').value}%`
    }
    if (this.myForm.get('RegID').value.length >= 1) {
      this._OtManagementService.getAdmittedpatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        this.PatientListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }

      });
    }


  }

  getSelectedObj(obj) {
    this.registerObj = obj;
    // this.PatientName = obj.FirstName + '' + obj.LastName;
    this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.PatientName;
    this.RegId = obj.RegID;
    this.vAdmissionID = obj.AdmissionID

    console.log(obj);
  }

 

  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.PatientName + ' (' + option.RegID + ')';
  }

 

  // openChanged(event) {
  //   this.isOpen = event;
  //   this.isLoading = event;
  //   if (event) {
  //     this.savedValue = this.departmentFilterCtrl.value;
  //     this.options = [];
  //     this.departmentFilterCtrl.reset();
  //     this._OtManagementService.getDepartmentCombo();
  //   }
  // }


  setDropdownObjs1() {
    

    this._OtManagementService.populateFormpersonal(this.registerObj1);

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


  // getOptionText(option) {
  //   if (!option) return '';
  //   return option.FirstName + ' ' + option.LastName + ' (' + option.RegId + ')';
  // }



  // getCategoryList() {
  //   this._OtManagementService.getCategoryCombo().subscribe(data => {
  //     this.CategoryList = data;
  //     console.log(data);
  //     this.filteredCategory.next(this.CategoryList.slice());

  //   })
  // }

  getCategoryList() {
    debugger
    this._OtManagementService.getCategoryCombo().subscribe(data => {
      this.CategoryList = data;
      this.optionsSurgeryCategory = this.CategoryList.slice();
      this.filteredOptionsSurgeryCategory = this._OtManagementService.otreservationFormGroup.get('SurgeryCategoryId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSurgeryCategory(value) : this.CategoryList.slice()),
      );

    });

  }
  private _filterSurgeryCategory(value: any): string[] {
    if (value) {
      const filterValue = value && value.SurgeryCategoryName ? value.SurgeryCategoryName.toLowerCase() : value.toLowerCase();
      return this.optionsSurgeryCategory.filter(option => option.SurgeryCategoryName.toLowerCase().includes(filterValue));
    }

  }
  
  
  getOptionTextautoSurgeryCategory(option) {
    return option && option.SurgeryCategoryName ? option.SurgeryCategoryName : '';
  }
  // getSurgeryList() {
  //   this._OtManagementService.getSurgeryCombo().subscribe(data => {
  //     this.SurgeryList = data;
  //     console.log(data);
  //     this.filteredsurgery.next(this.SurgeryList.slice());

  //   })
  // }

  getSurgeryList() {
    debugger
    this._OtManagementService.getSurgeryCombo().subscribe(data => {
      this.SurgeryList = data;
      this.optionsSurgery = this.SurgeryList.slice();
      this.filteredOptionsSurgery = this._OtManagementService.otreservationFormGroup.get('SurgeryId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this.Surgery(value) : this.SurgeryList.slice()),
      );

    });

  }
  private Surgery(value: any): string[] {
    if (value) {
      const filterValue = value && value.SurgeryName ? value.SurgeryName.toLowerCase() : value.toLowerCase();
      return this.optionsSurgery.filter(option => option.SurgeryName.toLowerCase().includes(filterValue));
    }

  }


  getOptionTextautoSurgery(option) {
    return option && option.SurgeryName ? option.SurgeryName : '';
  }

  // getSiteList() {
  //   // 
  //  var m_data = {
  //     "Id": 1
  //   }
  //   this._OtManagementService.getSiteCombo().subscribe(data => {
  //     this.Sitelist = data;
  //     console.log(data);
  //     this.filteredSite.next(this.Sitelist.slice());

  //   })
  // }


  getSiteList() {
    var m_data = {
          "Id": 1
        }
    this._OtManagementService.getSiteCombo().subscribe(data => {
      this.Sitelist = data;
      this.optionsSite = this.Sitelist.slice();
      this.filteredOptionsSite = this._OtManagementService.otreservationFormGroup.get('SiteDescId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._Site(value) : this.Sitelist.slice()),
      );

    });

  }
  private _Site(value: any): string[] {
    if (value) {
      const filterValue = value && value.SiteDescriptionName ? value.SiteDescriptionName.toLowerCase() : value.toLowerCase();
      return this.optionsSite.filter(option => option.SiteDescriptionName.toLowerCase().includes(filterValue));
    }

  }

  
  getOptionTextautoSiteDesc(option) {
    return option && option.SiteDescriptionName ? option.SiteDescriptionName : '';
  }

  // getDoctor1List() {
  //   this._registerService.getDoctorMaster1Combo().subscribe(data => { this.Doctor1List = data; })
  // }


  // getDoctorList() {
  //   this._OtManagementService.getDoctorMaster().subscribe(
  //     data => {
  //       this.DoctorList = data;
  //       console.log(data)
  //       // data => {
  //       //   this.DoctorList = data;
  //       // this.filteredDoctor.next(this.DoctorList.slice());
  //     })
  // }

  // getDepartmentList() {
  //   let cData = this._OtManagementService.getDepartmentCombo().subscribe(data => {
  //     this.DepartmentList = data;
  //     console.log(this.DepartmentList);
  //     this.filteredDepartment.next(this.DepartmentList.slice());
  //   });
  // }

  getDoctorList() {
    debugger
    this._OtManagementService.getDoctorMaster().subscribe(data => {
      this.DoctorList = data;
      this.optionsSurgeon = this.DoctorList.slice();
      this.filteredOptionsSurgeon = this._OtManagementService.otreservationFormGroup.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctor(value) : this.DoctorList.slice()),
      );

    });

  }


  private _filterDoctor(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsSurgeon.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }

  
  getOptionTextSurgeonId1(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  getOptionTextautoSurgeonName(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }

  getDepartmentList() {
    this._OtManagementService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDepartment = this.DepartmentList.slice();
      this.filteredOptionautoDepartment = this._OtManagementService.otreservationFormGroup.get('DepartmentId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDepartment(value) : this.DepartmentList.slice()),
      );

    });

  }


  private _filterDepartment(value: any): string[] {
    if (value) {
      const filterValue = value && value.departmentName ? value.departmentName.toLowerCase() : value.toLowerCase();
      return this.optionsDepartment.filter(option => option.departmentName.toLowerCase().includes(filterValue));
    }

  }

  
  getOptionTextautoDepartment(option) {
    return option && option.departmentName ? option.departmentName : '';
  }
  getDoctor1List() {

    this._OtManagementService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      console.log(this.Doctor1List);
      // this.filteredDoctorone.next(this.Doctor1List.slice());
    })
  }

  getDoctor2List() {
    this._OtManagementService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor2List = data;
      // this.filteredDoctortwo.next(this.Doctor2List.slice())
    })
  }

 
  
  @ViewChild('SurgeryCategory') SurgeryCategory: ElementRef;
  @ViewChild('SurgeonId1') SurgeonId1: ElementRef;
  @ViewChild('Site') Site: ElementRef;
  @ViewChild('OTTable') OTTable: MatSelect;
  @ViewChild('SurgeonName') SurgeonName: ElementRef;
  @ViewChild('SurgeryId') SurgeryId: ElementRef;
  @ViewChild('AnesthType') AnesthType: ElementRef;
  @ViewChild('Instruction') Instruction: ElementRef;
  
  
  
  
  public onEnterDepartmentId(event): void {
    if (event.which === 13) {
      this.SurgeryCategory.nativeElement.focus();
    }
  }
  
  public onEnterSurgeryCategory(event): void {
    if (event.which === 13) {
      this.SurgeonId1.nativeElement.focus();
    }
  }
  
  public onEnterSystem(event): void {
    if (event.which === 13) {
      this.Site.nativeElement.focus();
    }
  }
  public onEnterSite(event): void {
    if (event.which === 13) {
      this.SurgeonName.nativeElement.focus();
    }
  }
  
  public onEnterSurgeonName(event): void {
    if (event.which === 13) {
      this.SurgeryId.nativeElement.focus();
      
    }
  }
  
  public onEnterSurgery(event): void {
    if (event.which === 13) {
      this.SurgeonName.nativeElement.focus();
    }
  }
  
  // public onEnterSurgeonName(event): void {
  //   if (event.which === 13) {
  //     this.SurgeonName.nativeElement.focus();
      
  //   }
  // }
  
  OnChangeDoctorList(departmentObj) {
    // 
    console.log("departmentObj", departmentObj)
    this._OtManagementService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(
      data => {
        this.DoctorList = data;
        console.log(this.DoctorList);
        // this.filteredDoctor.next(this.DoctorList.slice());
      })
  }

  onClose() {
    this.dialogRef.close();
  }


  onSubmit() {
    
    let otBookingID = this.registerObj1.OTBookingId;

    this.isLoading = 'submit';
    
    // if (this.Adm_Vit_ID)
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





