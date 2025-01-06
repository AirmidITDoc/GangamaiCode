import { Component, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ReplaySubject, Subject } from 'rxjs';
import { OTManagementServiceService } from '../../ot-management-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { NewCathLabComponent } from './new-cath-lab/new-cath-lab.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-cath-lab',
  templateUrl: './cath-lab.component.html',
  styleUrls: ['./cath-lab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CathLabComponent implements OnInit {

  hasSelectedContacts: boolean;
  personalFormGroup: UntypedFormGroup;
  searchFormGroup : UntypedFormGroup;
  registerObj = new CathLabBookingDetail({});
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
  
  AnesthType:any ='';

  displayedColumns = [
    
  'RegNo',
  'PatientName',
  'OPDate',
  // 'OPTime',
  'Duration',
  // 'OTTableID',
  'OTTableName',
  // 'SurgeonId',
  'SurgeonName',
  'AnathesDrName',
  'AnathesDrName1',
  'Surgeryname',
  'AnesthType',
  'UnBooking',
  // 'IsAddedBy',
  'AddedBy',
  'TranDate',
  'instruction',
  'action'

  ];
  dataSource = new MatTableDataSource<CathLabBookingDetail>();
  isChecked = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _OtManagementService: OTManagementServiceService,
    public formBuilder: UntypedFormBuilder,

    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    // public dialogRef: MatDialogRef<NewCathLabComponent>,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe) {
      // dialogRef.disableClose = true;
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
    var D_data= {
     
        "FromDate": this.datePipe.transform(this.searchFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
        "ToDate":  this.datePipe.transform(this.searchFormGroup.get("end").value, "yyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
        "OTTableID": this.searchFormGroup.get("OTTableID").value || 0
      
    } 
     console.log(D_data);
      this.D_data1=D_data;
       this._OtManagementService.getcathlabBooking(D_data).subscribe(reg=> {
        this.dataArray =  reg as CathLabBookingDetail[];
        this.dataSource.data =  reg as CathLabBookingDetail[];
        console.log( this.dataSource.data);
        console.log( this.dataArray);
        this.sIsLoading = '';
      },
      error => {
        this.sIsLoading = '';
      });


    
   
      this.getCathLabBookingList();
  }


  get f() { return this.personalFormGroup.controls; }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
 
  
  createSearchForm() {
    return this.formBuilder.group({
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      OTTableID: [''],
     
    });
  }
     

   
  getCathLabBookingList() {
    debugger;
    this.sIsLoading = 'loading-data';
    var m_data ={
      "FromDate": this.datePipe.transform(this.searchFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
      "ToDate":  this.datePipe.transform(this.searchFormGroup.get("end").value, "yyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
      "OTTableID": this.searchFormGroup.get("OTTableID").value || 0
    }

    console.log(m_data);
    this._OtManagementService.getcathlabBooking(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as CathLabBookingDetail[];
      console.log(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


  addNewCathlabBooking(){
debugger;   
   const dialogRef = this._matDialog.open(NewCathLabComponent,
     {
       maxWidth: "70%",
       height: '95%',
       width: '100%',
     });
     dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this._OtManagementService.getcathlabBooking(this.D_data1).subscribe(reg=> {
          this.dataArray = reg;
          this.dataSource.data =  reg as CathLabBookingDetail[];
          console.log( this.dataSource.data);
          console.log( this.dataArray);
          this.sIsLoading = '';
        },
        error => {
          this.sIsLoading = '';
        });
    });
}



ngOnChanges(changes: SimpleChanges) {
  // changes.prop contains the old and the new value...
  // console.log(changes.dataArray.currentValue, 'new arrrrrrr');
  this.dataSource.data = changes.dataArray.currentValue as CathLabBookingDetail[];
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
 
 
 this._OtManagementService.populateFormpersonal(PatInforObj);

this.advanceDataStored.storage = new CathLabBookingDetail(PatInforObj);

const dialogRef = this._matDialog.open(NewCathLabComponent,
  {
    maxWidth: "70%",
    height: '70%',
    width: '100%',
    data: {
      PatObj: PatInforObj 
    }
  });
dialogRef.afterClosed().subscribe(result => {
  this._OtManagementService.getcathlabBooking(this.D_data1).subscribe(reg=> {
    this.dataArray = reg;
    this.dataSource.data =  reg as CathLabBookingDetail[];
    console.log( this.dataSource.data);
    console.log( this.dataArray);
    this.sIsLoading = '';
  },
  error => {
    this.sIsLoading = '';
  });

});
  // if(contact) this.dialogRef.close(PatInforObj);
}



  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  onClear() {
    // this.personalFormGroup.reset();
    // this.dialogRef.close();
  }
  onClose() {
  // this.personalFormGroup.reset();
  // this.dialogRef.close();
}
  changec()
  { 

this.buttonColor='red';
// this.buttonColor: ThemePalette = 'primary';
  }
}



export class CathLabBookingDetail {
  OTCathLabBokingID: any;
  OP_IP_ID: any;
  RegNo: number;
  PatientName: string;

  OPDate: Date;
  OPTime: Date;
  Duration: number;
  OTTableID: Number;
  OTTableName: any;
  SurgeonId: number;
  SurgeonId1:number;
  AdmissionID:any;
  SurgeonName: any;
  AnestheticsDr:any ;
  AnestheticsDr1: any;
  Surgeryname: any;
  AnesthType: any;
  UnBooking: any;

  IsAddedBy: any;
  AddedBy: any;
  TranDate: Date;
  instruction: any;
  Instruction:any;
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(CathLabBookingDetail) {
    {
      this.OTCathLabBokingID = CathLabBookingDetail. OTCathLabBokingID || '';
      this.OP_IP_ID = CathLabBookingDetail.OP_IP_ID || '';
      this.RegNo = CathLabBookingDetail. RegNo || '';
      this.PatientName = CathLabBookingDetail.PatientName || '';
      this.AdmissionID = CathLabBookingDetail.AdmissionID || 0;
       this.OPDate = CathLabBookingDetail.OPDate || '';
      this.OPTime = CathLabBookingDetail.OPTime || '';
      this.Duration = CathLabBookingDetail.Duration || '';
      this.OTTableID = CathLabBookingDetail.OTTableID || '';
      this.OTTableName = CathLabBookingDetail.OTTableName || '';
      this.SurgeonId = CathLabBookingDetail.SurgeonId || '';
      this.SurgeonId1 = CathLabBookingDetail.SurgeonId1 || '';
      this.SurgeonName = CathLabBookingDetail.SurgeonName || '';
      this.AnestheticsDr = CathLabBookingDetail.AnestheticsDr || '';

      this.AnestheticsDr1 = CathLabBookingDetail.AnestheticsDr1 || '';
      this.Surgeryname = CathLabBookingDetail.Surgeryname || '';
      this.AnesthType = CathLabBookingDetail.AnesthType || '';
      this. UnBooking = CathLabBookingDetail. UnBooking || '';
      this.IsAddedBy = CathLabBookingDetail.IsAddedBy || '';
      this.AddedBy = CathLabBookingDetail.AddedBy || '';
      this.TranDate = CathLabBookingDetail.TranDate || '';
      this.instruction = CathLabBookingDetail.instruction || '';
      this.Instruction=CathLabBookingDetail.Instruction || ''
    }
  }
}