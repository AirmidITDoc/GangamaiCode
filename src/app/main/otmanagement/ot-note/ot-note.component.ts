import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import Swal from 'sweetalert2';
import { OTReservationDetail } from '../ot-reservation/ot-reservation.component';
import { ReplaySubject, Subject } from 'rxjs';
import { OTManagementServiceService } from '../ot-management-service.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatTableDataSource } from '@angular/material/table';
import { debug } from 'console';

@Component({
  selector: 'app-ot-note',
  templateUrl: './ot-note.component.html',
  styleUrls: ['./ot-note.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OTNoteComponent implements OnInit {

  personalFormGroup: FormGroup;

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
  Anesthestishdoclist1: any = [];
  Anesthestishdoclist2: any = [];
  Today: Date = new Date();
  registerObj = new OPIPPatientModel({});
  isLoading: string = '';
  Prefix: any;
  OPDate: any;
  ID: any;
  registerObj1 = new OTReservationDetail({});

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
  public dateValue: Date = new Date();
  options = [];

  vSelectedOption: any = '';
  vPatientName: any = '';
  vAgeYear: any = '';
  vAge: any = '';
  vGenderName: any = '';
  vDepartmentName: any = '';
  vOP_IP_MobileNo: any = '';
  vDoctorName: any = '';
  vTariffName: any = '';
  vCompanyName: any = '';
  vWardName: any = '';
  vBedNo: any = '';
  RegId: any = '';
  vAdmissionID: any = '';
  vRegNo: any = '';
  vIPDNo: any = '';
  vOPIP_ID: any = '';
  OP_IPType: any = 2;
  vOPDNo: any = '';
  vDescription:any;
  vDoctor:any;
  isDoctorSelected: boolean = false;
  DocDoctorName:any;
  filteredOptionsDoctorsearch:any;
  noOptionFound: boolean = false;

  screenFromString = 'otBooking-form';
  selectedPrefixId: any;
  selectedDoctor: any;
  sIsLoading: string = '';

  matDialogRef: any;

  //doctorone filter
  public doctoroneFilterCtrl: FormControl = new FormControl();
  public filteredDoctorone: ReplaySubject<any> = new ReplaySubject<any>(1);

  //doctorone filter
  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  //doctortwo filter
  public doctortwoFilterCtrl: FormControl = new FormControl();
  public filteredDoctortwo: ReplaySubject<any> = new ReplaySubject<any>(1);

  //AnesthDoct filter
  public AnesthDoctFilterCtrl1: FormControl = new FormControl();
  public filteredAnesthDoctor1: ReplaySubject<any> = new ReplaySubject<any>(1);

  //Category filter
  public CategoryFilterCtrl1: FormControl = new FormControl();
  public filteredCategory: ReplaySubject<any> = new ReplaySubject<any>(1);

  //AnesthDoct filter
  public AnesthDoctFilterCtrl2: FormControl = new FormControl();
  public filteredAnesthDoctor2: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  constructor(
    public _OtManagementService: OTManagementServiceService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OTNoteComponent>,
    // public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    private router: Router) { }

  editorConfig: AngularEditorConfig = {
    // color:true,
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '15rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,

  };
  onBlur(e: any) {
    this.vDescription = e.target.innerHTML;
  }
  displayedColumns = [
    'DoctorId',
    'DoctorName',
    'Amount'
  ];
  dataSource = new MatTableDataSource<OTNoteDetail>();

  ngOnInit(): void {
    console.log(this.data)
    this.personalFormGroup = this._OtManagementService.createOtNoteForm();

    this.vSelectedOption = this.OP_IPType === true ? 'IP' : 'OP';

    if (this.data) {
      debugger
      this.registerObj1 = this.data.Obj;

      // ip and op edit
      if (this.registerObj1.OP_IP_Type === true) {
        // Fetch IP-specific information
        console.log("IIIIIIIIIIIIIPPPPPPPPP:", this.registerObj1);
        this.vWardName = this.registerObj1.RoomName;
        this.vBedNo = this.registerObj1.BedName;
        this.vGenderName = this.registerObj1.GenderName;
        this.vPatientName = this.registerObj1.PatientName;
        this.vAgeYear = this.registerObj1.AgeYear;
        this.RegId = this.registerObj1.RegID;
        this.vAdmissionID = this.registerObj1.AdmissionID
        this.vAge = this.registerObj1.AgeYear;
        this.vRegNo = this.registerObj1.RegNo;
        this.vIPDNo = this.registerObj1.OPDNo;
        this.vCompanyName = this.registerObj1.CompanyName;
        this.vTariffName = this.registerObj1.TariffName;
        this.vOP_IP_MobileNo = this.registerObj1.MobileNo;
        this.vDoctorName = this.registerObj1.DoctorName;
        this.vDepartmentName = this.registerObj1.DepartmentName;
        this.vSelectedOption = 'IP';
        this.vOPIP_ID = this.registerObj1.OP_IP_ID;

        this.setDropdownObjs1();
        this.getDoctorList();
        this.getOttableList();
        this.getDoctor2List();
        this.getAnesthestishDoctorList1();
        this.getAnesthestishDoctorList2();
      } else if (this.registerObj1.OP_IP_Type === false) {
        // Fetch OP-specific information
        console.log("OOOOOOOPPPPPPPPP:", this.registerObj1);
        this.vWardName = this.registerObj1.RoomName;
        this.vBedNo = this.registerObj1.BedName;
        this.vGenderName = this.registerObj1.GenderName;
        this.vPatientName = this.registerObj1.PatientName;
        this.vAgeYear = this.registerObj1.AgeYear;
        this.RegId = this.registerObj1.RegID;
        this.vAdmissionID = this.registerObj1.AdmissionID
        this.vAge = this.registerObj1.AgeYear;
        this.vRegNo = this.registerObj1.RegNo;
        this.vOPDNo = this.registerObj1.OPDNo;
        this.vCompanyName = this.registerObj1.CompanyName;
        this.vTariffName = this.registerObj1.TariffName;
        this.vOP_IP_MobileNo = this.registerObj1.MobileNo;
        this.vDoctorName = this.registerObj1.DoctorName;
        this.vDepartmentName = this.registerObj1.DepartmentName;
        this.vSelectedOption = 'OP';
        this.vOPIP_ID = this.registerObj1.OP_IP_ID;

        this.setDropdownObjs1();
        this.getDoctorList();
        this.getOttableList();
        this.getDoctor2List();
        this.getAnesthestishDoctorList1();
        this.getAnesthestishDoctorList2();
      }

      console.log(this.registerObj1);

      this.setDropdownObjs1();
    }

    this.getSergeryList();
    this.getOttableList();
    this.getDoctorList();
    this.getDoctor1List();
    this.getDoctor2List();
    this.getCategoryList();
    this.getAnesthestishDoctorList1();
    this.getAnesthestishDoctorList2();
    // this.addEmptyRow();

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
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
    console.log(this.selectedAdvanceObj);

    this.doctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();
      });

    this.doctoroneFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctorone();
      });

    this.doctortwoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctortwo();
      });


    this.AnesthDoctFilterCtrl1.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAnesthDoctor1();
      });


    this.CategoryFilterCtrl1.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategory();
      });

    this.AnesthDoctFilterCtrl2.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAnesthDoctor2();
      });

    setTimeout(function () {

      let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
      element.click();

    }, 1000);

    this.getDoctorNameCombobox();

  }
  // createOtCathlabForm() {
  //   return this.formBuilder.group({
  //     OTCathLabBokingID: '',
  //     TranDate: [new Date().toISOString()],
  //     TranTime: [new Date().toISOString()],
  //     OP_IP_ID: '',
  //     OP_IP_Type: '',
  //     OPDate: [new Date().toISOString()],
  //     OPTime: [new Date().toISOString()],
  //     SurgeryId: '',
  //     Duration: '',
  //     OTTableId: '',
  //     SurgeonId: '',
  //     SurgeonId1: ' ',
  //     AnestheticsDr: '',
  //     AnestheticsDr1: '',
  //     Surgeryname: '',
  //     ProcedureId: '',
  //     AnesthType: '',
  //     UnBooking: '',
  //     Instruction: '',
  //     IsAddedBy: '',
  //     OTBookingID: '',
  //     Assistantscrub: '',
  //     Circulatingstaff: '',
  //     AnathesticNAme: '',
  //     OtNote: '',
  //     Extra: '',
  //     Pre: ''

  //   });
  // }

  onSave(){

  }
  onDoctorSelect(option){
    debugger
    console.log("selectedDoctorOption:", option)
    this.selectedDoctor=option;
  }
  addDoctor() {
    debugger
    if (this.selectedDoctor) {
      // Add the selected doctor to the data source
      this.dataSource.data.push({
        DoctorId: this.selectedDoctor.DoctorId,
        DoctorName: this.selectedDoctor.Doctorname,
        Amount:0
      });
      this.dataSource._updateChangeSubscription(); // Update the data source
      this.clearSelection(); // Clear the selection after adding
    }
  }
  clearSelection() {
    this.personalFormGroup.get('DoctorId').setValue('');
    this.selectedDoctor = null;
  }
  onAmountChange(contact: any, amount: number) {
    contact.Amount = amount;
  }
    //Doctor list 
    getDoctorNameCombobox() {
      debugger
      var vdata = {
          "@Keywords": `${this.personalFormGroup.get('DoctorId').value}%`
      }
      console.log(vdata)
      this._OtManagementService.getDoctorMasterComboList(vdata).subscribe(data => {
          this.filteredOptionsDoctorsearch = data;
          console.log(this.filteredOptionsDoctorsearch)
          if (this.filteredOptionsDoctorsearch.length == 0) {
              this.noOptionFound = true;
          } else {
              this.noOptionFound = false;
          }
      });
  }
  getOptionTextDoctor(option) {
      return option && option.Doctorname ? option.Doctorname : '';
  }

  closeDialog() {
    this.personalFormGroup.reset();
    this.dataSource.data=[];
  }

  setDropdownObjs1() {
    debugger;

    this._OtManagementService.populateFormpersonal(this.registerObj1);

    // const toSelect = this.SurgeryList.find(c => c.SurgeryId == this.registerObj1.SurgeryId);
    // this.personalFormGroup.get('SurgeryId').setValue(toSelect);

    console.log(this.DoctorList);
    console.log(this.OTtableList);
    console.log(this.Anesthestishdoclist1);
    console.log(this.Anesthestishdoclist2);

    const toSurgeonId1 = this.DoctorList.find(c => c.DoctorId == this.registerObj1.SurgeonId);
    this._OtManagementService.otreservationFormGroup.get('SurgeonId').setValue(toSurgeonId1);

    const toOTTableId = this.OTtableList.find(c => c.OTTableId == this.registerObj1.OTTableID);
    this._OtManagementService.otreservationFormGroup.get('OTTableId').setValue(toOTTableId);

    const toSelectAnestheticsDr = this.Anesthestishdoclist1.find(c => c.DoctorId == this.registerObj1.AnestheticsDr);
    this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').setValue(toSelectAnestheticsDr);

    const toSelectAnestheticsDr1 = this.Anesthestishdoclist2.find(c => c.Anesthestishdoclist2 == this.registerObj1.AnestheticsDr1);
    this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').setValue(toSelectAnestheticsDr1);

    this.personalFormGroup.updateValueAndValidity();
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
  private filterAnesthDoctor1() {

    if (!this.Anesthestishdoclist1) {
      return;
    }
    // get the search keyword
    let search = this.AnesthDoctFilterCtrl1.value;
    if (!search) {
      this.filteredAnesthDoctor1.next(this.Anesthestishdoclist1.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredAnesthDoctor1.next(
      this.Anesthestishdoclist1.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );

  }



  // area filter code  
  private filterAnesthDoctor2() {
    if (!this.Anesthestishdoclist2) {
      return;
    }
    // get the search keyword
    let search = this.AnesthDoctFilterCtrl2.value;
    if (!search) {
      this.filteredAnesthDoctor2.next(this.Anesthestishdoclist2.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredAnesthDoctor2.next(
      this.Anesthestishdoclist2.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
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



  getAnesthestishDoctorList1() {
    this._OtManagementService.getAnesthestishDoctorCombo().subscribe(data => {
      this.Anesthestishdoclist1 = data;
      console.log(data);
      this.filteredAnesthDoctor1.next(this.Anesthestishdoclist1.slice());

    })
  }


  getAnesthestishDoctorList2() {
    this._OtManagementService.getAnesthestishDoctorCombo().subscribe(data => {
      this.Anesthestishdoclist2 = data;
      console.log(data);
      this.filteredAnesthDoctor2.next(this.Anesthestishdoclist2.slice());

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


  getCategoryList() {
    this._OtManagementService.getCategoryCombo().subscribe(data => {
      this.CategoryList = data;
      console.log(data);
      this.filteredCategory.next(this.CategoryList.slice());

    })
  }

  onClose() {
    this.personalFormGroup.reset();
    this.dialogRef.close();
  }


  onSubmit() {
    debugger;
    let otBookingID = this.registerObj1.OTBookingID;

    this.isLoading = 'submit';

    if (this.Adm_Vit_ID) {
      if (!otBookingID) {
        var m_data = {
          "otTableBookingDetailInsert": {
            "OTBookingID": 0,// this._registerService.mySaveForm.get("RegId").value || "0",
            "tranDate": this.dateTimeObj.date, //this.datePipe.transform(this.dateTimeObj.date,"yyyy-Mm-dd") || opdRegistrationSave"2021-03-31",// this.dateTimeObj.date,//
            "tranTime": this.dateTimeObj.time, // this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
            "oP_IP_ID": this.Adm_Vit_ID,// this._OtManagementService.otreservationFormGroup.get('OP_IP_ID').value | 0,
            "oP_IP_Type": 1,
            "opDate": this.dateTimeObj.date,// this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
            "opTime": this.dateTimeObj.time,// this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
            "duration": this._OtManagementService.otreservationFormGroup.get('Duration').value || 0,
            "otTableID": 1,// this._OtManagementService.otreservationFormGroup.get('OTTableId').value.OTTableId || 0,
            "surgeonId": 1,//this._OtManagementService.otreservationFormGroup.get('SurgeonId').value.DoctorId || 0,
            "surgeonId1": 1,//this._OtManagementService.otreservationFormGroup.get('SurgeonId1').value.DoctorID || 0,
            "anestheticsDr": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').value.DoctorId || 0,
            "anestheticsDr1": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value ? this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value.DoctorId : 0,
            "surgeryname": this._OtManagementService.otreservationFormGroup.get('SurgeryId').value.SurgeryName || '',// ? this.personalFormGroup.get('SurgeryId').value.SurgeryId : 0,
            "procedureId": 0,
            "anesthType": this._OtManagementService.otreservationFormGroup.get('AnesthType').value || '',
            "instruction": this._OtManagementService.otreservationFormGroup.get('Instruction').value || '',
            // "PatientName": this.PatientName || '',
            "isAddedBy": this.accountService.currentUserValue.user.id || 0,
            "unBooking": false,// Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
            // "isNormalOrFuture": 0

          }
        }
        console.log(m_data);
        this._OtManagementService.ReservationInsert(m_data).subscribe(response => {
          if (response) {
            this._OtManagementService
            Swal.fire('Congratulations !', 'OT Note  Data save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();
                //  this.addEmptyRow();

              }
            });
          } else {
            Swal.fire('Error !', 'Ot Note Data  not saved', 'error');
          }

        });
      }
      else {
        debugger;
        var m_data1 = {
          "otTableBookingDetailUpdate": {
            "OTBookingID": otBookingID,
            "tranDate": this.dateTimeObj.date, //this.datePipe.transform(this.dateTimeObj.date,"yyyy-Mm-dd") || opdRegistrationSave"2021-03-31",// this.dateTimeObj.date,//
            "tranTime": this.dateTimeObj.time, // this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
            "opDate": this.dateTimeObj.date,// this.datePipe.transform(this.personalFormGroup.get('OPDate').value,"yyyy-Mm-dd") ,// this.dateTimeObj.date,//
            "opTime": this.dateTimeObj.time,
            "duration": this._OtManagementService.otreservationFormGroup.get('Duration').value || 0,
            "otTableID": this._OtManagementService.otreservationFormGroup.get('OTTableId').value.OTTableId || 0,
            "surgeonId": this._OtManagementService.otreservationFormGroup.get('SurgeonId').value.DoctorId || 0,
            "surgeonId1": this._OtManagementService.otreservationFormGroup.get('SurgeonId1').value.DoctorID || 0,
            "anestheticsDr": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').value.DoctorId || 0,
            "anestheticsDr1": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value ? this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value.DoctorId : 0,
            "surgeryname": this._OtManagementService.otreservationFormGroup.get('SurgeryId').value.SurgeryName || 0,// ? this.personalFormGroup.get('SurgeryId').value.SurgeryId : 0,
            "procedureId": 0,
            "anesthType": this._OtManagementService.otreservationFormGroup.get('AnesthType').value || '',
            "instruction": this._OtManagementService.otreservationFormGroup.get('Instruction').value || '',
            // "PatientName": this.PatientName || '',
            "IsUpdatedBy": this.accountService.currentUserValue.user.id || 0,
            "unBooking": false,// Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",


          }
        }
        console.log(m_data1);
        this._OtManagementService.ReservationUpdate(m_data1).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'OT NOTE Data Updated Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();
              }
            });
          } else {
            Swal.fire('Error !', 'OT Note Data  not saved', 'error');
          }

        });
      }
    }
  }
}
export class OTNoteDetail {
  DoctorId:any;
DoctorName: any;
Amount:any;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OTNoteDetail) {
    {     
    this.DoctorId=OTNoteDetail.DoctorId || '',
    this.DoctorName=OTNoteDetail.DoctorName || ''
    this.Amount=OTNoteDetail.Amount || ''
    }
  }
}

