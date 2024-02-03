import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { EditorComponent } from './editor/editor.component';
import { RadiologyTemplateFormComponent } from './radiology-template-form/radiology-template-form.component';
import { RadiologyTemplateMasterService } from './radiology-template-master.service';
import { TemplateReportComponent } from './template-report/template-report.component';
// import { RadioPatientList } from '../radiology/radiologyorder-list/radiologyorder-list.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { RadioPatientList } from 'app/main/radiology/radiology-order-list/radiology-order-list.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-radiology-template-master',
  templateUrl: './radiology-template-master.component.html',
  styleUrls: ['./radiology-template-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RadiologyTemplateMasterComponent implements OnInit {

  RadiologytemplateMasterList: any;
  isLoading = true;
  msg: any;
  reportdata: any = [];
  dataArray= {};
  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  menuActions:Array<string> = [];
  screenFromString = 'opd-casepaper';
  vTemplateName:any;
  vTemplateDesc:any;
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('reportDiv') reportDiv: ElementRef;

  dataSource = new MatTableDataSource<RadioPatientList>();
  displayedColumns: string[] = [
    
    'TemplateId',
    'TemplateName',
    'TemplateDesc',
    'IsDeleted',
    'action'
  ];
   
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  constructor(public _radiologytemplateService: RadiologyTemplateMasterService,
    private accountService: AuthenticationService,
    public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    // public datePipe: DatePipe,
        private advanceDataStored: AdvanceDataStored,
  ) { }

  ngOnInit(): void {
    this.getRadiologytemplateMasterList();

    if (this._ActRoute.url == '/radiology/radiology-order-list')
    {
          this.menuActions.push('Template Details');
       
    }

  }

  onSearch() {
    this.getRadiologytemplateMasterList();
}
onSearchClear(){
    this._radiologytemplateService.myformSearch.reset({
        TemplateNameSearch: "",
        IsDeletedSearch: "2",
    });
    this.getRadiologytemplateMasterList();  
}


  getRadiologytemplateMasterList() {
   
    this.sIsLoading = 'loading-data';
     var m_data={
      "TemplateName":this._radiologytemplateService.myformSearch.get("TemplateNameSearch").value +'%' || '%',
           
     }
    console.log(m_data);
    this._radiologytemplateService.getRadiologytemplateMasterList1(m_data).subscribe(Menu => {
      this.dataSource.data = Menu as RadioPatientList[];
      console.log(this.dataSource)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      
    }, error => this.isLoading = false)
  }

  onClear() {
    this._radiologytemplateService.myform.reset({ IsDeleted: 'false' });
    this._radiologytemplateService.initializeFormGroup();
  }

  onSubmit() {
    if (this._radiologytemplateService.myform.valid) {
      if (!this._radiologytemplateService.myform.get("TemplateId").value) {
        var m_data = {
          insertRadiologyTemplateMaster: {
            "TemplateName": (this._radiologytemplateService.myform.get("TemplateName").value).trim(),
            "TemplateDesc": (this._radiologytemplateService.myform.get("TemplateDesc").value).trim(),
            "IsDeleted": Boolean(JSON.parse(this._radiologytemplateService.myform.get("IsDeleted").value)),
            "AddedBy": this.accountService.currentUserValue.user.id,

          }
        }
        // console.log(m_data);
        this._radiologytemplateService.insertRadiologyTemplateMaster(m_data).subscribe(data => {
          this.msg = data;
          this.getRadiologytemplateMasterList();
        });
        this.notification.success('Record added successfully')
      }
      else {
        var m_dataUpdate = {
          updateRadiologyTemplateMaster: {
            "TemplateId": this._radiologytemplateService.myform.get("TemplateId").value,
            "TemplateName": this._radiologytemplateService.myform.get("TemplateName").value,
            "TemplateDesc": (this._radiologytemplateService.myform.get("TemplateDesc").value).trim(),
            "IsDeleted": Boolean(JSON.parse(this._radiologytemplateService.myform.get("IsDeleted").value)),
            "UpdatedBy": this.accountService.currentUserValue.user.id,

          }
        }
        this._radiologytemplateService.updateRadiologyTemplateMaster(m_dataUpdate).subscribe(data => {
          this.msg = data;
          this.getRadiologytemplateMasterList();
        });
        this.notification.success('Record updated successfully')
      }
      this.onClear();
    }
  }

  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  openTab(row, tabGroup: MatTabGroup): void {
    this.vTemplateName = row.TemplateName;
    this.vTemplateDesc = row.TemplateDesc;
     const tabIndex = row === 'tab1' ? 0 : 1;  
    tabGroup.selectedIndex = tabIndex;
    console.log(row)
    this.getRadiologytemplateMasterList();
  }

  // onEdit(row) {
  //   console.log(row)
   
  //   var m_data = {
  //     "TemplateId": row.TemplateId,
  //     "TemplateName": row.TemplateName.trim(),
  //     "TemplateDesc": row.TemplateDesc.trim(),
  //     "IsDeleted": JSON.stringify(row.IsDeleted),
  //     "UpdatedBy": row.UpdatedBy,
  //   }
  //   console.log(m_data);
  //   this._radiologytemplateService.populateForm(m_data);
  //   const dialogRef = this._matDialog.open(RadiologyTemplateFormComponent,
  //     {
  //       maxWidth: "80%", 
  //       width: "80%",
  //       height: "85%",
  //       data : {
  //         registerObj : m_data,
  //       }
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed - Insert Action', result);
  //     this.getRadiologytemplateMasterList();
  //   });
  // }

  onAdd(tabName: string, tabGroup: MatTabGroup) {
    const tabIndex = tabName === 'tab1' ? 0 : 1;  
    tabGroup.selectedIndex = tabIndex;
   // console.log(row)
    this.getRadiologytemplateMasterList();
    this.onClear();
    // const dialogRef = this._matDialog.open(RadiologyTemplateFormComponent,
    //   {
    //       maxWidth: "80%", 
    //         width: "80%",
    //         height: "85%",
    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed - Insert Action', result);
    //   // this.getRadiologytemplateMasterList();
    // });
  }
 

  getRecord(contact, m):void{
    ;
     console.log(contact,m);

     if (m == "Template Details"){
      
       let xx = {
         RegNo: contact.RegNo,
         AdmissionID: contact.VisitId,
         PatientName: contact.PatientName,
         Doctorname: contact.ConsultantDoctor,
         AdmDateTime: contact.AdmissionTime,
         AgeYear: contact.AgeYear,
        //  PatientType: contact.PatientType,
        
       };
        this.advanceDataStored.storage = new AdvanceDetailObj(xx);
       console.log(this.advanceDataStored.storage);
          const dialogRef = this._matDialog.open(RadiologyTemplateFormComponent, 
          {  maxWidth: "70vw",
             maxHeight: "90vh", width: '100%', height: "100%"
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed - Insert Action', result);
        
        });
     }
}

onDeactive(TemplateId) {
  this.confirmDialogRef = this._matDialog.open(
      FuseConfirmDialogComponent,
      {
          disableClose: false,
      }
  );
  this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to deactive?";
  this.confirmDialogRef.afterClosed().subscribe((result) => {
      if (result) {
          let Query =
          "Update M_Radiology_TemplateMaster set IsDeleted=1 where TemplateId=" +
          TemplateId;
              
          console.log(Query);
          this._radiologytemplateService.deactivateTheStatus(Query)
              .subscribe((data) => (this.msg = data));
          this.getRadiologytemplateMasterList();
      }
      this.confirmDialogRef = null;
      this.getRadiologytemplateMasterList();
  });
}

  OnPrintPop(TemplateId) {

    var m_data = { "TemplateId": TemplateId, }
    // console.log(m_data);
    this._radiologytemplateService.populatePrintForm(m_data);
    const dialogRef = this._matDialog.open(TemplateReportComponent,
      {
        maxWidth: "95vw",
        maxHeight: "95vh", width: '100%', height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getRadiologytemplateMasterList();
    });
  }

  //   print() {
  //     let printContents = document.getElementById('tempReport').innerHTML;
  //     let originalContents = document.body.innerHTML;
  //     document.body.innerHTML = printContents;
  //     window.print();
  //     window.close();
  // }

  printTemplate: any;
  templateHeading: any;

  PrintData(TemplateId) {
    // debugger;
    var D_data = {
      "TemplateId": TemplateId,
    }
    this._radiologytemplateService.Print(D_data).subscribe(report => {
      this.reportdata = report;
      console.log(this.reportdata);
      this.printTemplate = report[0].TemplateDesc;
      this.templateHeading = report[0].TemplateName
      this.print();
    });
  }

  print() {
    // HospitalName, HospitalAddress, AdvanceNo, PatientName
    let popupWin, printContents;
    // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    // popupWin.document.open();
    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
          table th, table td {
          border:1px solid #bdbdbd;
          padding:0.5em;
        }
        `);
    popupWin.document.write(`
    </style>
        <title></title>
    </head>
    `);
    popupWin.document.write(`
      <div>${this.templateHeading}</div>
    `);
      popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
    </html>`);
    popupWin.document.close();
  }

}


export class RadiologytemplateMaster {

  TemplateId: Date;
  TemplateName: Date;
  TemplateDesc: any;
  IsDeleted: String;

  RadDate: Date;
  RadTime: Date;
  RegNo: any;
  PatientName: String;
  PatientType: number;
  TestName:String;
  ConsultantDoctor: any;
  CategoryName:String;
  AgeYear:number;
  GenderName:String;
  PBillNo: number;
  
  


  /**
   * Constructor
   *
   * @param RadiologytemplateMaster
   */
  constructor(RadiologytemplateMaster) {
      {
          
          this.TemplateId = RadiologytemplateMaster.TemplateId || '';
          this.TemplateName = RadiologytemplateMaster.TemplateName;
          this.TemplateDesc = RadiologytemplateMaster.TemplateDesc;
          this.IsDeleted= RadiologytemplateMaster.IsDeleted;

          this.RadDate = RadiologytemplateMaster.RadDate || '';
          this.RadTime = RadiologytemplateMaster.RadTime;
          this.RegNo = RadiologytemplateMaster.RegNo;
          this.PatientName= RadiologytemplateMaster.PatientName;
          this.PBillNo= RadiologytemplateMaster.PBillNo;
          this.PatientType = RadiologytemplateMaster.PatientType || '0';
          this.ConsultantDoctor = RadiologytemplateMaster.ConsultantDoctor || '';
          this.TestName = RadiologytemplateMaster.TestName || '0';
          this.CategoryName = RadiologytemplateMaster.CategoryName || '';
          this.AgeYear= RadiologytemplateMaster.AgeYear;
          this.GenderName= RadiologytemplateMaster.GenderName;
      }
  }
}
