import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { AdvanceDataStored } from '../advance';
import { MatDialog } from '@angular/material/dialog';
import { CompanyListService } from './company-list.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { CompanyBillComponent } from '../ip-search-list/company-bill/company-bill.component';
import { AdvanceDetailObj } from '../ip-search-list/ip-search-list.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { AdmissionPersonlModel } from '../Admission/admission/admission.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CompanyListComponent implements OnInit {
  myFilterform:FormGroup;
  fromDate ="01/01/1900"// this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate ="01/01/1900"// this.datePipe.transform(Date.now(), 'yyyy-MM-dd');

  menuActions: Array<string> = [];
  constructor(
    public _CompanyListService: CompanyListService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _ActRoute: Router,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored
  ) { }

  autocompleteModedeptdoc: string = "ConDoctor";
    optionsSearchDoc: any[] = [];
  
  
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  
    ngAfterViewInit() {
      // Assign the template to the column dynamically
      this.gridConfig.columnsList.find(col => col.key === 'patientTypeID')!.template = this.actionsTemplate;
      this.gridConfig.columnsList.find(col => col.key === 'isMLC')!.template = this.actionsTemplate1;
      this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  
    }
  
    gridConfig: gridModel = {
      apiUrl: "Admission/AdmissionList",
      columnsList: [
        { heading: "PatientType", key: "patientTypeID", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 100},
        // { heading: "-", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 110 },
        { heading: "IsMLC", key: "isMLC", sort: true, align: 'left', emptySign: 'NA',type: gridColumnTypes.template, width: 80},
        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA'},
        { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Date", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', width: 170, type: 8 },
        { heading: "DoctorName", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "RefDocName", key: "refDocName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "IPDNo", key: "ipdno", sort: true, align: 'left', emptySign: 'NA'},
        { heading: "PatientType", key: "PatientType", sort: true, align: 'left', emptySign: 'NA'},
        { heading: "WardName", key: "WardId", sort: true, align: 'left', emptySign: 'NA', type: 14 },
        { heading: "TariffName", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ClassName", key: "className", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "RelativeName", key: "relativeName", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 14 },
        {
          heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
          template: this.actionButtonTemplate  // Assign ng-template to the column
        }
  
        //   { heading: "RelatvieMobileNo", key: "relatvieMobileNo", sort: true, align: 'left', emptySign: 'NA', width: 100, type:14 },
        // {
        //     heading: "Action", key: "action", align: "right", width: 400 ,sticky:true, type: gridColumnTypes.action, actions: [
        //         {
        //             action: gridActions.edit, callback: (data: any) => {
        //                 this.EditRegistration(data);
        //             }
        //         },
  
        //         {
        //             action: gridActions.edit, callback: (data: any) => {
        //                 this.onbedTransfer(data);
        //             }
        //         },
        //         {
        //           action: gridActions.edit, callback: (data: any) => {
        //               this.ondischarge(data);
        //           }
        //       },
        //       {
        //         action: gridActions.edit, callback: (data: any) => {
        //             this.ondischargesummarydata(data);
        //         }
        //     },
        //         {
        //             action: gridActions.print, callback: (data: any) => {
        //                 this.getAdmittedPatientCasepaperview(data);
        //             }
        //         },
        //         {
        //             action: gridActions.print , callback: (data: any) => {
        //                 this.getAdmittedPatientCasepaperTempview(data);
        //             }
        //         },
        //         {
        //             action: gridActions.edit, callback: (data: any) => {
        //                 this.getEditAdmission(data);
        //             }
        //         },
        //         {
        //           action: gridActions.edit, callback: (data: any) => {
        //               this.NewMLc(data);
        //           }
        //       },
        //         {
        //             action: gridActions.delete, callback: (data: any) => {
  
        //                 // this.AppointmentCancle(data);
  
        //             }
        //         }
        //       ]
        // } //Action 1-view, 2-Edit,3-delete
      ],
  
      sortField: "AdmissionId",
      sortOrder: 0,
      filters: [{ fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue:this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Admtd_Dschrgd_All", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "M_Name", fieldValue: "%", opType: OperatorComparer.Equals },
      { fieldName: "IPNo", fieldValue: "0", opType: OperatorComparer.Equals }
      ]
  
    }
  

  ngOnInit(): void {
    this.myFilterform = this._CompanyListService.filterForm();
    if (this._ActRoute.url == '/ipd/companylist') {
      this.menuActions.push('Company Bill'); 
    }
  }

  getRecord(contact, m): void { 
    if(contact.CompanyId){
      if (m == "Company Bill") {
        
        this.advanceDataStored.storage = new AdvanceDetailObj(contact); 
        if (!contact.IsBillGenerated) {
        const dialogRef = this._matDialog.open(CompanyBillComponent,
          {
            maxWidth: "90%",
            width: '98%',
            height: '95%',
          });
        dialogRef.afterClosed().subscribe(result => {
         
        });
        }else Swal.fire("Bill already Generated")
      }
    }
   else{
     // Swal.fire('Selected Patient is not company patient')

      Swal.fire({
        title: 'Selected Patient is not company patient',
        text: "Please Select Compnay Patient!",
        icon: "warning",  
        cancelButtonColor: "#d33",
        confirmButtonText: "Ok" 
      });
    }
  }
 
  onClear() {
  
    this._CompanyListService.myFilterform.reset();
    this._CompanyListService.myFilterform.get("IsDischarge").setValue(0);
    this._CompanyListService.myFilterform.get("FirstName").setValue('');
    this._CompanyListService.myFilterform.get("MiddleName").setValue('');
    this._CompanyListService.myFilterform.get("LastName").setValue('');
      }
  IsDischarge: any;
  onChangeIsactive(SiderOption) {
    this.IsDischarge = SiderOption.checked;
    if (SiderOption.checked == true) {
      this._CompanyListService.myFilterform.get('IsDischarge').setValue(1);
      this._CompanyListService.myFilterform.get('start').setValue((new Date()).toISOString());
      this._CompanyListService.myFilterform.get('end').setValue((new Date()).toISOString());
    }
    else {
      this._CompanyListService.myFilterform.get('IsDischarge').setValue(0);
      this._CompanyListService.myFilterform.get('start').setValue(''),
        this._CompanyListService.myFilterform.get('end').setValue('')
    }
  }
  printDischargeslip(contact) {
  
  }


  printDischargesummary(contact) {

  }
}
