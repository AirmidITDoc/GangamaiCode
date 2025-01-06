import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import { CathLabBookingDetail } from '../cath-lab.component';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { OTManagementServiceService } from 'app/main/otmanagement/ot-management-service.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { CathLabService } from '../../cath-lab.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-new-cath-lab',
  templateUrl: './new-cath-lab.component.html',
  styleUrls: ['./new-cath-lab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewCathLabComponent implements OnInit {

  
  personalFormGroup: UntypedFormGroup;

  submitted = false;
  now = Date.now();
  searchFormGroup: UntypedFormGroup;
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
  myForm:UntypedFormGroup;
  filteredOptions: any;
  noOptionFound: boolean = false;
  RegId:any;
  vAdmissionID:any;
  PatientListfilteredOptions:any;
  isRegIdSelected: boolean = false;
  isSurgen2Selected: boolean = false;
  isAnestheticsDrSelected: boolean = false;
  isAnestheticsDr1Selected: boolean = false;

  
  // @Input() panelWidth: string | number;
  // @ViewChild('multiUserSearch') multiUserSearchInput: ElementRef;


  
  filteredOptionSurgery: Observable<string[]>;
  filteredOptionsSurgen1: Observable<string[]>;
  filteredOptionsSurgeon2: Observable<string[]>;
  filteredOptionsAnestheticsDr: Observable<string[]>;
  filteredOptionsAnestheticsDr1: Observable<string[]>;
  // filteredOptionsRegSearch: Observable<string[]>;


  optionsSurgery: any[] = [];
  optionsSurgeon1: any[] = [];
  optionsSurgeon2: any[] = [];
  optionsAnestheticsDr: any[] = [];
  optionsAnestheticsDr1: any[] = [];

  
  
  isSurgerySelected: boolean = false;
  isSurgenSelected: boolean = false;
  isPrefixSelected: boolean = false;
  isCitySelected: boolean = false;
  // isCompanySelected: boolean = false;
  // isCompanyselected: boolean = false;

  screenFromString = 'registration';
  selectedPrefixId: any;

  // @Input() childName: string[];
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
  matDialogRef: any;
  private _onDestroy = new Subject<void>();

  constructor(
    public _OtManagementService: OTManagementServiceService,
    public _CathLabService :CathLabService,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewCathLabComponent>,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    private router: Router) { }


  ngOnInit(): void {
    this.myForm = this.createMyForm();
    this.personalFormGroup = this.createOtCathlabForm();

    if (this.data) {

      this.registerObj1 = this.data.PatObj;
      console.log(this.registerObj1);

      this.setDropdownObjs1();
    }


    this.getSurgeryList();
    this.getOttableList();
    this.getDoctorList();
    this.getSergeon2List();
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



  getSearchList() {
    var m_data = {
      "Keyword": `${this.myForm.get('RegID').value}%`
    }
    if (this.myForm.get('RegID').value.length >= 1) {
      this._OtManagementService.getAdmittedpatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData)
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


  // getSergeryList() {
  //   this._OtManagementService.getSurgeryCombo().subscribe(data => {
  //     this.SurgeryList = data;
  //     console.log(data);
  //     // this.filteredDoctor.next(this.SurgeryList.slice());

  //   })
  // }
  getSurgeryList() {
    this._OtManagementService.getSurgeryCombo().subscribe(data => {
      this.SurgeryList = data;
      this.optionsSurgery = this.SurgeryList.slice();
      this.filteredOptionSurgery = this._OtManagementService.otreservationFormGroup.get('SurgeryId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSurgery(value) : this.SurgeryList.slice()),
      );

    });

  }
  private _filterSurgery(value: any): string[] {
    if (value) {
      const filterValue = value && value.SurgeryName ? value.SurgeryName.toLowerCase() : value.toLowerCase();
      return this.optionsSurgery.filter(option => option.SurgeryName.toLowerCase().includes(filterValue));
    }

  }

  
  getOptionTextSurgery(option) {
    return option && option.SurgeryName ? option.SurgeryName : '';
  }


  // getAnesthestishDoctorList1() {
  //   this._OtManagementService.getAnesthestishDoctorCombo().subscribe(data => {
  //     this.Anesthestishdoclist1 = data;
  //     console.log(data);
  //     // this.filteredAnesthDoctor1.next(this.Anesthestishdoclist1.slice());

  //   })
  // }

  getAnesthestishDoctorList1() {
    this._OtManagementService.getAnesthestishDoctorCombo().subscribe(data => {
      this.Anesthestishdoclist1 = data;
      this.optionsAnestheticsDr = this.Anesthestishdoclist1.slice();
      this.filteredOptionsAnestheticsDr = this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterAnestheticsDr(value) : this.Anesthestishdoclist1.slice()),
      );

    });

  }
  private _filterAnestheticsDr(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsAnestheticsDr.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }

  
  getOptionTextAnestheticsDr(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }


  // getAnesthestishDoctorList2() {
  //   this._OtManagementService.getAnesthestishDoctorCombo().subscribe(data => {
  //     this.Anesthestishdoclist2 = data;
  //     console.log(data);
  //     // this.filteredAnesthDoctor2.next(this.Anesthestishdoclist2.slice());

  //   })
  // }

  getAnesthestishDoctorList2() {
    this._OtManagementService.getAnesthestishDoctorCombo().subscribe(data => {
      this.Anesthestishdoclist2 = data;
      this.optionsAnestheticsDr1 = this.Anesthestishdoclist2.slice();
      this.filteredOptionsAnestheticsDr1 = this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterAnestheticsDr1(value) : this.Anesthestishdoclist2.slice()),
      );

    });

  }
  private _filterAnestheticsDr1(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsAnestheticsDr.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }

  
  getOptionTextAnestheticsDr1(option) {
    return option && option.DoctorName ? option.DoctorName : '';
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



  getDoctorList() {
    this._OtManagementService.getDoctorMaster().subscribe(data => {
      this.DoctorList = data;
      this.optionsSurgeon1 = this.DoctorList.slice();
      this.filteredOptionsSurgen1 = this._OtManagementService.otreservationFormGroup.get('SurgeonId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSurgen1(value) : this.DoctorList.slice()),
      );

    });

  }
  private _filterSurgen1(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsSurgeon1.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }

  
  getOptionTextSurgeon1(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }


  // getDoctor1List() {

  //   this._OtManagementService.getDoctorMaster1Combo().subscribe(data => {
  //     this.Doctor1List = data;
  //     console.log(this.Doctor1List);
  //     // this.filteredDoctorone.next(this.Doctor1List.slice());
  //   })
  // }

  
  getSergeon2List() {
    this._OtManagementService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      this.optionsSurgeon2 = this.Doctor1List.slice();
      this.filteredOptionsSurgeon2 = this._OtManagementService.otreservationFormGroup.get('SurgeonId1').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSurgen2(value) : this.Doctor1List.slice()),
      );

    });

  }
  private _filterSurgen2(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsSurgeon2.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }

  
  getOptionTextSurgeon2(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }


  getDoctor2List() {
    this._OtManagementService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor2List = data;
      // this.filteredDoctortwo.next(this.Doctor2List.slice())
    })
  }


  onClose() {
    // this.dialogRef.close();
  }

  getView() { }
  
 
  
@ViewChild('duration') duration: ElementRef;
@ViewChild('SurgeonId') SurgeonId: ElementRef;
@ViewChild('SurgeonId2') SurgeonId2: ElementRef;
@ViewChild('OTTable') OTTable: MatSelect;
@ViewChild('AnestheticsDr') AnestheticsDr: ElementRef;
@ViewChild('AnestheticsDr1') AnestheticsDr1: ElementRef;
@ViewChild('AnesthType') AnesthType: ElementRef;
@ViewChild('Instruction') Instruction: ElementRef;




public onEnterSurgery(event): void {
  if (event.which === 13) {
    this.duration.nativeElement.focus();
  }
}

public onEnterduration(event): void {
  if (event.which === 13) {
    this.SurgeonId.nativeElement.focus();
  }
}

public onEnterSurgen1(event): void {
  if (event.which === 13) {
    this.SurgeonId2.nativeElement.focus();
  }
}
public onEnterSurgen2(event): void {
  if (event.which === 13) {
    this.AnestheticsDr.nativeElement.focus();
  }
}

public onEnterAnestheticsDr(event): void {
  if (event.which === 13) {
    
    if(this.OTTable) this.OTTable.focus();
    
  }
}
public onEnterOTTable(event): void {
  if (event.which === 13) {
    this.AnestheticsDr1.nativeElement.focus();
  }
}
public onEnterAnestheticsDr1(event): void {
  if (event.which === 13) {
    this.AnesthType.nativeElement.focus();
  }
}

public onEnterAnesthType(event): void {
  if (event.which === 13) {
    this.Instruction.nativeElement.focus();
  }
}

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
          "isAddedBy": this.accountService.currentUserValue.userId || 0,
          "unBooking": false,// Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
          "isNormalOrFuture": 0

        }
      }
      console.log(m_data);
      this._OtManagementService.CathLabBookInsert(m_data).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'OT CathLab  Data  save Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
                              
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
          "IsUpdatedBy": this.accountService.currentUserValue.userId || 0,
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

