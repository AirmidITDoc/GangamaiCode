import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import { CathLabBookingDetail } from '../cath-lab.component';
import { ReplaySubject, Subject } from 'rxjs';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { OTManagementServiceService } from 'app/main/otmanagement/ot-management-service.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-cath-lab',
  templateUrl: './new-cath-lab.component.html',
  styleUrls: ['./new-cath-lab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewCathLabComponent implements OnInit {

  
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
  Anesthestishdoclist1: any = [];
  Anesthestishdoclist2: any = [];
  Today: Date=new Date();
  registerObj = new OPIPPatientModel({});
  registerObj1 = new CathLabBookingDetail({});
  isLoading: string = '';
  Prefix: any;
  
  public value = new Date();
  public dateValue1 : any;
  dateValue: Date = new Date();
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
  OPDate:any;
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
  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);


  //doctortwo filter
  public doctortwoFilterCtrl: FormControl = new FormControl();
  public filteredDoctortwo: ReplaySubject<any> = new ReplaySubject<any>(1);



  //area filter
  public AnesthDoctFilterCtrl1: FormControl = new FormControl();
  public filteredAnesthDoctor1: ReplaySubject<any> = new ReplaySubject<any>(1);



  //area filter
  public AnesthDoctFilterCtrl2: FormControl = new FormControl();
  public filteredAnesthDoctor2: ReplaySubject<any> = new ReplaySubject<any>(1);


  private _onDestroy = new Subject<void>();

  constructor(
    public _OtManagementService: OTManagementServiceService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    // public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<NewCathLabComponent>,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    private router: Router) { }


  ngOnInit(): void {
    
    this.personalFormGroup = this.createOtCathlabForm();

    if (this.data) {

      this.registerObj1 = this.data.PatObj;
      console.log(this.registerObj1);

      this.setDropdownObjs1();
    }


    this.getSergeryList();
    this.getOttableList();
    this.getDoctorList();
    this.getDoctor1List();
    this.getDoctor2List();
    this.getAnesthestishDoctorList1();
    this.getAnesthestishDoctorList2();
    // this.addEmptyRow();

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

    this.AnesthDoctFilterCtrl2.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAnesthDoctor2();
      });

    setTimeout(function () {

      let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
      element.click();

    }, 1000);
  }

  closeDialog() {
    console.log("closed")
    // this.dialogRef.close();
    // this.personalFormGroup.reset();
  }
  createOtCathlabForm() {
    return this.formBuilder.group({
      OTCathLabBokingID: '',
      TranDate: [new Date().toISOString()],
      TranTime: [new Date().toISOString()],
      OP_IP_ID: '',
      OP_IP_Type: '',
      OPDate: [new Date().toISOString()],
      OPTime: [new Date().toISOString()],
      SurgeryId: '',
      Duration: '',
      OTTableId: '',
      SurgeonId: '',
      SurgeonId1: ' ',
      AnestheticsDr: '',
      AnestheticsDr1: '',
      Surgeryname: '',
      ProcedureId: '',
      AnesthType: '',
      UnBooking: '',
      Instruction: '',
      IsAddedBy: '',
      OTBookingID: '',

    });
  }


  setDropdownObjs1() {
    debugger;

    this._OtManagementService.populateFormpersonal(this.registerObj1);

    // const toSelect = this.SurgeryList.find(c => c.SurgeryId == this.registerObj1.SurgeryId);
    // this.personalFormGroup.get('SurgeryId').setValue(toSelect);

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
      this.DoctorList.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
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
  ngOnDestroys() {
    // this.isAlive = false;
  }



  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }


  getOttableList() {
    this._OtManagementService.getOTtableCombo().subscribe(data => {
      this.OTtableList = data;
      console.log(data);
      this.OTtableList.next(this.OTtableList.slice());
    })
  }


  getSergeryList() {
    this._OtManagementService.getSurgeryCombo().subscribe(data => {
      this.SurgeryList = data;
      console.log(data);
      this.filteredDoctor.next(this.SurgeryList.slice());

    })
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

  onClose() {
    // this.dialogRef.close();
  }

  getView() { }
  
 



  onSubmit() {
    debugger;
    let OTCathLabBokingID = this.registerObj1.OTCathLabBokingID;
    this.isLoading = 'submit';

    console.log()
    // if(this.Adm_Vit_ID){

    if (!OTCathLabBokingID) {
      var m_data = {
        "cathLabBookingDetailInsert": {
          "OTCathLabBokingID": 0,
          "tranDate": this.dateTimeObj.date,
          "tranTime": this.dateTimeObj.time, 
          "oP_IP_ID": this.Adm_Vit_ID || 0,
          "oP_IP_Type": 1,
          "opDate":this.dateTimeObj.date,// this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
          "opTime":this.dateTimeObj.time, // this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
          "duration": this._OtManagementService.otreservationFormGroup.get('Duration').value || 0,
          "otTableID": this._OtManagementService.otreservationFormGroup.get('OTTableId').value.OTTableId || 0,
          "surgeonId": this._OtManagementService.otreservationFormGroup.get('SurgeonId').value.DoctorId || 0,
          "surgeonId1": this._OtManagementService.otreservationFormGroup.get('SurgeonId1').value.DoctorID || 0,
          "anestheticsDr": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').value.DoctorId || 0,
          "anestheticsDr1": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value.DoctorId ? this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value.DoctorId : 0,
          "surgeryname": this._OtManagementService.otreservationFormGroup.get('SurgeryId').value.SurgeryName || '',// ? this.personalFormGroup.get('SurgeryId').value.SurgeryId : 0,
          "procedureId": 0,
          "anesthType": this._OtManagementService.otreservationFormGroup.get('AnesthType').value || '',
          "instruction": this._OtManagementService.otreservationFormGroup.get('Instruction').value || '',
          "PatientName": this.PatientName || '',
          "isAddedBy": this.accountService.currentUserValue.user.id || 0,
          "unBooking": false,// Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
          "isNormalOrFuture": 0

        }
      }
      console.log(m_data);
      this._OtManagementService.CathLabBookInsert(m_data).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'OT CathLab  Data  save Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              // this._matDialog.closeAll();
                              
            }
          });
        } else {
          Swal.fire('Error !', 'OT CathLab  Data  not saved', 'error');
        }

      });
    }
    else {
      debugger;
      var m_data1 = {
        "cathLabBookingDetailUpdate": {
          "OTCathLabBokingID": OTCathLabBokingID,
          "tranDate": this.dateTimeObj.date,
          "tranTime": this.dateTimeObj.time, // this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
          "opDate": this.dateTimeObj.date,// this.datePipe.transform(this.personalFormGroup.get('OPDate').value,"yyyy-Mm-dd") ,// this.dateTimeObj.date,//
          "opTime": this.dateTimeObj.time,
          "duration": this._OtManagementService.otreservationFormGroup.get('Duration').value || 0,
          "otTableID": this._OtManagementService.otreservationFormGroup.get('OTTableId').value.OTTableId || 0,
          "surgeonId": this._OtManagementService.otreservationFormGroup.get('SurgeonId').value.DoctorId || 0,
          "surgeonId1": this._OtManagementService.otreservationFormGroup.get('SurgeonId1').value.DoctorID || 0,
          "anestheticsDr": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').value.DoctorId || 0,
          "anestheticsDr1": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value ? this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value.DoctorId : 0,
          "surgeryname": this._OtManagementService.otreservationFormGroup.get('SurgeryId').value.SurgeryName || '',// ? this.personalFormGroup.get('SurgeryId').value.SurgeryId : 0,
          "procedureId": 0,
          "anesthType": this._OtManagementService.otreservationFormGroup.get('AnesthType').value || '',
          "instruction": this._OtManagementService.otreservationFormGroup.get('Instruction').value || '',
          "IsUpdatedBy": this.accountService.currentUserValue.user.id || 0,
          "unBooking": false// Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
          

        }
      }
      console.log(m_data1);
      this._OtManagementService.CathLabBookUpdate(m_data1).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'OT CathLab Data Updated Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              // this._matDialog.closeAll();
            }
          });
        } else {
          Swal.fire('Error !', 'OT CathLab Data  not saved', 'error');
        }

      });
    // }


  }
  }

  addEmptyRow(){}
  // onClose() {

  //    this.dialogRef.close();
  // }



}
