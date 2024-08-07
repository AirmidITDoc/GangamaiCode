import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { PhoneAppointListService } from '../phoneappointment/phone-appoint-list.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe, Time } from '@angular/common';
import { RegistrationService } from './registration.service';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { NewRegistrationComponent } from './new-registration/new-registration.component';
import { EditRegistrationComponent } from './edit-registration/edit-registration.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RegistrationComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  registerObj = new RegInsert({});

  hasSelectedContacts: boolean;
  

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  displayedColumns = [
    'RegDate',
    'RegNo',
    'PatientName',
    'AgeYear',
    'GenderName',
    'PhoneNo',
    'MobileNo',
    'Address',
   'action',
  
  ];

  dataSource = new MatTableDataSource<RegInsert>();
  menuActions: Array<string> = [];

  public doctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();

  constructor(
    public _registrationService: RegistrationService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    // get Registration list on page load
     this.getregistrationList();
  }

  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // field validation 
  get f() { return this._registrationService.myFilterform.controls; }

  // clear data from input field 
  onClear() {
    this._registrationService.myFilterform.reset(
      {
        start: [],
        end: []
      }
    );
  }
  // get Registration list on Button click
  getregistrationList() {
    this.sIsLoading = 'loading';
    var D_data = {
      "F_Name": (this._registrationService.myFilterform.get("FirstName").value) + '%' || '%',
      "L_Name": (this._registrationService.myFilterform.get("LastName").value) + '%' || '%',
      "Reg_No": this._registrationService.myFilterform.get("RegNo").value || "0",
      "From_Dt": this.datePipe.transform(this._registrationService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._registrationService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "MobileNo": this._registrationService.myFilterform.get("MobileNo").value  + '%' || '%',
    }
    
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this._registrationService.getRegistrationList(D_data).subscribe(data => {
        this.dataSource.data = data as RegInsert[];
        console.log( this.dataSource.data )
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.sIsLoading = '';
      },
        error => {
          this.sIsLoading = '';
        });
    }, 500);
  }

  newRegistration() {
    const dialogRef = this._matDialog.open(NewRegistrationComponent,
      {
        maxWidth: "90vw",
          height: '450px',
          width: '100%',
      });
    dialogRef.afterClosed().subscribe(result => {
    this. getregistrationList();
    });
  }

  
onEdit(row){
  console.log(row);
  this.registerObj=row;
  this.registerObj["RegId"]=row.RegId;
  this.registerObj["RegID"]=row.RegId;
  this.registerObj["PrefixId"]=row.PrefixID;
    this._registrationService.populateFormpersonal(row);
    
    const dialogRef = this._matDialog.open(NewRegistrationComponent, 
      {   maxWidth: "90vw",
          height: '450px',
          width: '100%',
           data : {
          registerObj :this.registerObj,
          Submitflag:true
        }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this. getregistrationList();
     
    });
  }

  getAdmittedPatientCasepaperview(contact) {
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
    //   this.SpinLoading =true;
    //  this.AdList=true;
    this._registrationService.getAdmittedPatientCasepaaperView(
      contact.AdmissionId
      ).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Admission Paper  Viewer"
          }
        });

        matDialog.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.sIsLoading = ' ';
        });
    });
   
    },100);

  }
}


export class RegInsert
{
    RegId : Number;
    RegID : Number;
    RegDate : Date;
    PatientName:string;
    RegTime : Time; 
    PrefixId : number;
    PrefixID : number;
    FirstName : string;
    MiddleName : string;
    LastName : string;
    Address : string;
    City :string;
    PinNo : string;
    RegNo:string;
    DateofBirth : Date;
    Age: any;
    GenderId : Number;
    PhoneNo: string; 
    MobileNo: string; 
    AddedBy: number;
    AgeYear: any;
    AgeMonth : any;
    AgeDay : any;
    CountryId : number;
    StateId: number;
    CityId: number;
    MaritalStatusId :number;
    IsCharity : Boolean;
    ReligionId : number;
    AreaId : number;
    VillageId : number;
    TalukaId : number;
    PatientWeight: number;
    AreaName : string;
    AadharCardNo: string;
    PanCardNo : string;
    currentDate = new Date();
    AdmissionID:any;
    VisitId:any;
    
    /**
     * Constructor
     *
     * @param RegInsert
     */
     
    constructor(RegInsert) {
        {
           this.RegId = RegInsert.RegId || '';
           this.RegID = RegInsert.RegID || '';
           this.RegDate = RegInsert.RegDate || '';
            this.RegTime = RegInsert.RegTime || '';
            this.PrefixId = RegInsert.PrefixId || '';
            this.PrefixID = RegInsert.PrefixID || '';
            this.PrefixID = RegInsert.PrefixID || '';
            this.FirstName = RegInsert.FirstName || '';
            this.MiddleName = RegInsert.MiddleName || '';
            this.LastName = RegInsert.LastName || '';
            this.Address = RegInsert.Address || '';
            this.RegNo = RegInsert.RegNo || '';
            this.City = RegInsert.City || '';
            this.PinNo = RegInsert.PinNo || '';
            this.DateofBirth = RegInsert.DateofBirth ||this.currentDate;
            this.Age = RegInsert.Age || '';
            this.GenderId = RegInsert.GenderId || '';
            this.PhoneNo= RegInsert.PhoneNo || '';
            this.MobileNo= RegInsert.MobileNo || '';
            this.AddedBy= RegInsert.AddedBy || '';
            this.AgeYear= RegInsert.AgeYear || '';
            this.AgeMonth = RegInsert.AgeMonth || '';
            this.AgeDay = RegInsert.AgeDay || '';
            this.CountryId = RegInsert.CountryId || '';
            this.StateId= RegInsert.StateId || '';
            this.CityId= RegInsert.CityId || '';
            this.MaritalStatusId = RegInsert.MaritalStatusId || '';
            this.IsCharity = RegInsert.IsCharity || '';
            this.ReligionId = RegInsert.ReligionId || '';
            this.AreaId = RegInsert.AreaId || '';
            this.VillageId = RegInsert.VillageId || '';
            this.TalukaId = RegInsert.TalukaId || '';
            this.PatientWeight= RegInsert.PatientWeight || '';
            this.AreaName = RegInsert.AreaName || '';
            this.AadharCardNo= RegInsert.AadharCardNo || '';
            this.PanCardNo = RegInsert.PanCardNo || '';
            this.AdmissionID = RegInsert.AdmissionID || '';
            this.VisitId=RegInsert.VisitId ||''
        }
    }
}
