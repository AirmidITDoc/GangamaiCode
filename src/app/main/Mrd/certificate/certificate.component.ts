import { Component, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MrdService } from '../mrd.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReplaySubject, Subject } from 'rxjs';
import { NewCertificateComponent } from './new-certificate/new-certificate.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CertificateComponent implements OnInit {

  searchFormGroup : UntypedFormGroup;
  registerObj = new CharityPatientdetail({});
  options = [];
  filteredOptions: any;
  noOptionFound: boolean = false;
  selectedHName: any;
  selectedPrefixId: any;
  buttonColor:any;
  isCompanySelected: boolean = false;
  public now: Date = new Date();
  isLoading: string = '';
  screenFromString = 'admission-form';
  submitted = false;
  sIsLoading: string = '';
  minDate:Date;
  hasSelectedContacts: boolean;
  AnesthType:any ='';

  displayedColumns = [
    
  'RegNo',
  'IPDNo',
  'PatientName',
  'Address',
  'GenderName',
  'AgeYear',
  'DepartmentName',
  'AdmissionDate',
  'DischargeDate',
  'TotalAmt',
  'ConcessionAmt',
  'NetPayableAmt',
  'Ischarity',
  'PaidAmount',
  'PBillNo',
  'ConcessionReason',
  'AnnualIncome',
  'RationCardNo',
  'IsIndientOrWeaker',
  'BillNo',
  'buttons'

  ];
  dataSource = new MatTableDataSource<CharityPatientdetail>();
  isChecked = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _MrdService: MrdService,
    public formBuilder: UntypedFormBuilder,
    public _NursingStationService:MrdService,
    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<CertificateComponent>,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe) {
      dialogRef.disableClose = true;
     }


  doctorNameCmbList: any = [];
  D_data1:any;
  dataArray = {};
  public doctorFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);
  
    //department filter
    public departmentFilterCtrl: UntypedFormControl = new UntypedFormControl();
    public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);
  
  private _onDestroy = new Subject<void>();


  ngOnInit(): void {

    this.searchFormGroup = this.createSearchForm();
    debugger;
    this.minDate = new Date();
     
      this.getCharityPatientList();
  }


  // get f() { return this.personalFormGroup.controls; }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
 
  
  createSearchForm() {
    return this.formBuilder.group({
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      F_Name: [''],
      L_Name: [''],
    });
  }
     

   
  getCharityPatientList() {
    debugger;
    // this.sIsLoading = 'loading-data';
    var m_data ={
      "F_Name": (this.searchFormGroup.get("F_Name").value).trim() + '%' || '%',
      "L_Name": (this.searchFormGroup.get("L_Name").value ).trim() + '%' || '%',
      "FromDate": this.datePipe.transform(this.searchFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
      "ToDate":  this.datePipe.transform(this.searchFormGroup.get("end").value, "yyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
     
    }

    console.log(m_data);
    this._MrdService.getCharitypatientList(m_data).subscribe(Visit => {
      console.log(Visit);
      this.dataSource.data = Visit as CharityPatientdetail[];
      console.log(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

 
  addNewCertificate(){

debugger;   
    // let m_data ={
    //   Regno:
    // }
const dialogRef = this._matDialog.open(NewCertificateComponent,
     {
       maxWidth: "85%",
       height: '95%',
       width: '100%',
     });
     dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      // this._MrdService.getcathlabBooking(this.D_data1).subscribe(reg=> {
      //     this.dataArray = reg;
      //     this.dataSource.data =  reg as CharityPatientdetail[];
      //     console.log( this.dataSource.data);
      //     console.log( this.dataArray);
      //     this.sIsLoading = '';
      //   },
      //   error => {
      //     this.sIsLoading = '';
      //   });
    });
}

addNewCasepaper(){
  const dialogRef = this._matDialog.open(NewCertificateComponent,
    {
      maxWidth: "85%",
      height: '115%',
      width: '100%',
    });
    dialogRef.afterClosed().subscribe(result => {
     console.log(result);
     // this._MrdService.getcathlabBooking(this.D_data1).subscribe(reg=> {
     //     this.dataArray = reg;
     //     this.dataSource.data =  reg as CharityPatientdetail[];
     //     console.log( this.dataSource.data);
     //     console.log( this.dataArray);
     //     this.sIsLoading = '';
     //   },
     //   error => {
     //     this.sIsLoading = '';
     //   });
   });
}


ngOnChanges(changes: SimpleChanges) {
  // changes.prop contains the old and the new value...
  // console.log(changes.dataArray.currentValue, 'new arrrrrrr');
  this.dataSource.data = changes.dataArray.currentValue as CharityPatientdetail[];
  this.dataSource.sort =this.sort;
  this.dataSource.paginator=this.paginator;
}

onEdit(contact){
  debugger;
 console.log(contact);

 if(contact.AnesthType)
 this.AnesthType =contact.AnesthType.trim();

 let PatInforObj = {};
 PatInforObj['OTCathLabBokingID'] = contact.OTCathLabBokingID,

 PatInforObj['PatientName'] = contact.PatientName,
 PatInforObj['OTTableName'] = contact.OTTableName,
 
 PatInforObj['OTTableID'] = contact.OTTableID,
 PatInforObj['RegNo'] = contact.RegNo,
 PatInforObj['SurgeonId'] = contact.SurgeonId,
 PatInforObj['SurgeonId1'] = contact.SurgeonId1,
 PatInforObj['SurgeonName'] = contact.SurgeonName,
 PatInforObj['Surgeryname'] = 'Mild one',//contact.Surgeryname,

 PatInforObj['AnathesDrName'] = contact.AnathesDrName,
 PatInforObj['AnathesDrName1'] = contact.AnathesDrName1,
 PatInforObj['AnesthType'] =  this.AnesthType
 PatInforObj['AnestheticsDr'] = contact.AnestheticsDr,
 PatInforObj['AnestheticsDr1'] = contact.AnestheticsDr1,
 PatInforObj['Duration'] = contact.Duration,
 PatInforObj['OPDate'] = contact.OPDate,
 PatInforObj['OPTime'] = contact.OPTime,
 PatInforObj ['OP_IP_ID'] = contact.OP_IP_ID,
 
 PatInforObj['TranDate'] = contact.TranDate,
 PatInforObj['UnBooking'] = contact.UnBooking,
 PatInforObj['Instruction'] = contact.instruction,
 PatInforObj['AddedBy'] = contact.AddedBy,
 PatInforObj['Adm_Vit_ID'] = contact.OP_IP_ID
 

 console.log(PatInforObj);
 
 
//  this._MrdService.populateFormpersonal(PatInforObj);

this.advanceDataStored.storage = contact;

const dialogRef = this._matDialog.open(NewCertificateComponent,
  {
    maxWidth: "90%",
    height: '96%',
    width: '100%',
    data: {
      PatObj: contact 
    }
  });
dialogRef.afterClosed().subscribe(result => {
  console.log('The dialog was closed - Insert Action', result);

});
//   if(contact) this.dialogRef.close(PatInforObj);
}



  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  onClear() {
    // this.personalFormGroup.reset();
    this.dialogRef.close();
  }
  onClose() {
  // this.personalFormGroup.reset();
  this.dialogRef.close();
}
  changec()
  { 

this.buttonColor='red';
// this.buttonColor: ThemePalette = 'primary';
  }
}



export class CharityPatientdetail {
  RegNo: any;
  IPDNo: any;
  PatientName: string;
  Address: any;
  GenderName: any;
  AgeYear: any;
  DepartmentName: any;
  AdmissionDate: any;
  Ischarity:any;
  PaidAmount:any;
  TotalAmt:any;
  ConcessionAmt:any;
  NetPayableAmt:any;
  PBillNo:any ;
  ConcessionReason: any;
  AnnualIncome: any;
  RationCardNo: any;
  IsIndientOrWeaker: any;

  BillNo: any;

  /**
   * Constructor
   *
   * @param contact
   */
  constructor(CharityPatientdetail) {
    {
     
      this.RegNo = CharityPatientdetail. RegNo || '';
      this.PatientName = CharityPatientdetail.PatientName || '';
      this.IPDNo = CharityPatientdetail.IPDNo || 0;
      this.Address = CharityPatientdetail.Address || '';
      this.GenderName = CharityPatientdetail.GenderName || '';
      this.AgeYear = CharityPatientdetail.AgeYear || '';
      this.DepartmentName = CharityPatientdetail.DepartmentName || 0;
      this.AdmissionDate = CharityPatientdetail.AdmissionDate || '';
      this.Ischarity = CharityPatientdetail.Ischarity || '';
      this.PaidAmount = CharityPatientdetail.PaidAmount || '';
      this.TotalAmt = CharityPatientdetail.TotalAmt || '';
      this.ConcessionAmt = CharityPatientdetail.ConcessionAmt || '';
      this.NetPayableAmt = CharityPatientdetail.NetPayableAmt || '';
      this.PBillNo = CharityPatientdetail.PBillNo || '';
      this.ConcessionReason = CharityPatientdetail.ConcessionReason || '';
      this.AnnualIncome = CharityPatientdetail.AnnualIncome || '';
      this. RationCardNo = CharityPatientdetail. RationCardNo || '';
      this.IsIndientOrWeaker = CharityPatientdetail.IsIndientOrWeaker || '';
      this.BillNo = CharityPatientdetail.BillNo || '';
     
    }
  }
}
