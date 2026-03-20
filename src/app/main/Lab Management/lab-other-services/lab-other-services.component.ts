import { DatePipe } from '@angular/common';
import { Component, ComponentRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { ReportVerifyDetailsComponent } from 'app/main/pathology/result-entry/report-verify-details/report-verify-details.component';
import { OutsourceDetailsComponent } from 'app/main/pathology/result-entry/outsource-details/outsource-details.component';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SMSDetailsPopupOverComponent } from 'app/main/shared/componets/email-send/smsdetails-popup-over/smsdetails-popup-over.component';
import { WhatsappDetPopUpOverComponent } from 'app/main/shared/componets/email-send/whatsapp-det-pop-up-over/whatsapp-det-pop-up-over.component';
import { Subscription } from 'rxjs';
import { OutsourceDetailsPopoverComponent } from 'app/main/pathology/result-entry/outsource-details-popover/outsource-details-popover.component';
import { permissionCodes } from 'app/main/shared/model/permission.model';
import { RadioLabOutsourceComponent } from 'app/main/radiology/radiology-order-list/radio-lab-outsource/radio-lab-outsource.component';
import { LabOtherServicesService } from './lab-other-services.service';
import { NewRadResultTemplateComponent } from '../lab-radiology/new-rad-result-template/new-rad-result-template.component';

@Component({
  selector: 'app-lab-other-services',
  templateUrl: './lab-other-services.component.html',
  styleUrls: ['./lab-other-services.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LabOtherServicesComponent {
  myformSearch: FormGroup;
  f_name: any = ""
  regNo: any = "0"
  l_name: any = ""
  status: any = "0"
  opipType: any = "4";
  page: PageNames = PageNames.PATIENT;
  pathFiles: PageNames = PageNames.PATIENT_PATHFILES;
  autocompleteModeCategoryId: string = "RadioCategory";
  autocompleteModegroupName: string = "GroupName";
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  vUnitId = 0;
  reportlogFormGroup: FormGroup

  @ViewChild('actionOnFirstTemplate') actionOnFirstTemplate!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('actionsCompleted') actionsCompleted!: TemplateRef<any>;
  @ViewChild('actionsverify') actionsverify!: TemplateRef<any>;
  @ViewChild('outSourcePopOver') outSourcePopOver!: TemplateRef<any>;

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  fromdate = this.fromDate ? this.datePipe.transform(this.fromDate, "yyyy-MM-dd") : "";
  todate = this.toDate ? this.datePipe.transform(this.toDate, "yyyy-MM-dd") : "";

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'actionOnFirst')!.template = this.actionOnFirstTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'isCompleted')!.template = this.actionsCompleted;
    this.gridConfig.columnsList.find(col => col.key === 'isVerified')!.template = this.actionsverify;
    this.gridConfig.columnsList.find(col => col.key === 'outSourceLabName')!.template = this.outSourcePopOver;
  }

  allColumns = [
    {
      heading: "-", key: "actionOnFirst", type: gridColumnTypes.template, align: "center", width: 150,
      template: this.actionOnFirstTemplate
    },
    {
      heading: "Status", key: "isCompleted", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.template,
      template: this.actionsCompleted
    },
    {
      heading: "Verify", key: "isVerified", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.template,
      template: this.actionsverify
    },
    //  { heading: "DOA", key: "visitTime", sort: true, align: 'left', emptySign: 'NA', width: 200},
    { heading: "RadDate", key: "radTime", sort: true, align: 'left', emptySign: 'NA', width: 160 },
    { heading: "UHID", key: "labRequestNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "Patient Name ", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
    // { heading: "Age | Gender", key: "genderName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Test Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Bill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Group Name", key: "groupName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "OutSourceName", key: "outSourceLabName", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.template },
    {
      heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate
    }
  ]

  allFilters = [
    { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    // { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "From_Dt", fieldValue: this.fromdate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.todate, opType: OperatorComparer.Equals },
    { fieldName: "IsCompleted", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "TestType", fieldValue: "1", opType: OperatorComparer.Equals },
    { fieldName: "OP_IP_Type", fieldValue: "3", opType: OperatorComparer.Equals },
    { fieldName: "CategoryId", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "GroupId", fieldValue: "0", opType: OperatorComparer.Equals },
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.RadiologyList,
    apiUrl: "Radiology/LabRadiologyList",
    columnsList: this.allColumns,
    sortField: "RadReportId",
    sortOrder: 0,
    filters: this.allFilters
  }

  constructor(
    public _RadioloyOrderlistService: LabOtherServicesService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,
    public toastr: ToastrService,
    private overlay: Overlay,
    public _whatsppService: WhatsAppEmailService,
  ) { }

  ngOnInit(): void {
    this.myformSearch = this._RadioloyOrderlistService.filterForm()
    this.reportlogFormGroup = this._RadioloyOrderlistService.createReportlogForm();
    this.vUnitId = this.accountService.currentUserValue.user.storeId
  }

  CategoryId = "0"
  CategoryView(value) {

    if (value.value !== 0)
      this.CategoryId = value.value
    else
      this.CategoryId = "0"

    this.onChangeFirst();
  }

  GroupId = "0"
  groupView(value) {
    if (value.value != 0) {
      this.GroupId = value.value
    } else {
      this.GroupId = "0"
    }
    this.onChangeFirst();
  }
  onChangeFirst() {
    // debugger
    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
    this.f_name = this.myformSearch.get('FirstNameSearch').value + "%"
    this.l_name = this.myformSearch.get('LastNameSearch').value + "%"
    this.status = this.myformSearch.get('StatusSearch').value
    this.opipType = this.myformSearch.get('PatientTypeSearch').value
    this.GroupId = this.myformSearch.get('GroupId').value || 0
    this.CategoryId = this.myformSearch.get('CategoryId').value || '0'
    this.getfilterdata();
  }

  getfilterdata() {
    // debugger
    this.gridConfig = {
      apiUrl: "Radiology/LabRadiologyList",
      columnsList: this.allColumns,
      sortField: "RadReportId",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name ", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
        // { fieldName: "Reg_No", fieldValue: String(this.regNo), opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "IsCompleted", fieldValue: String(this.status), opType: OperatorComparer.Equals },
        { fieldName: "TestType", fieldValue: "1", opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: "4", opType: OperatorComparer.Equals },
        { fieldName: "CategoryId", fieldValue: String(this.CategoryId), opType: OperatorComparer.Equals },
        { fieldName: "GroupId", fieldValue: String(this.GroupId), opType: OperatorComparer.Equals },
      ]

    }
    console.log(this.gridConfig)
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'RegNoSearch')
      this.myformSearch.get('RegNoSearch').setValue("")

    if (event == 'FirstNameSearch')
      this.myformSearch.get('FirstNameSearch').setValue("")

    if (event == 'LastNameSearch')
      this.myformSearch.get('LastNameSearch').setValue("")

    this.onChangeFirst();
  }
  VReason:any='';
  UnVerifyList:any
  @ViewChild('CancelReasone') CancelReasone!: TemplateRef<any>;
  OnUnverifyResultEntry() {
    if (this.VReason == '' || this.VReason == null || this.VReason == undefined) {
      this.toastr.warning('Please Enter a Reason', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const SubmitDate = {
      "RadReportId": this.UnVerifyList?.radReportId || 0,
      "UnVerifyId": this.accountService.currentUserValue.userId,
      "UnVerifyComment": this.VReason,
      "UnVerifyDateTime": this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '1900-01-01',
      "TestType":true
    }
    console.log("Json:", SubmitDate)
    this._RadioloyOrderlistService.UnVerifyLabReport(SubmitDate).subscribe(response => {
      this.UnVerifyList = '';
        this.VReason = '';
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
    this._matDialog.closeAll()
    });
  }

  UnVerifyresultEntry(element) { 
    this.UnVerifyList=element;
    this._matDialog.open(this.CancelReasone, {
      width: '50%',
      height: '45%' 
    })
  }
  onSave(row: any = null) {
    const that = this;
    const dialogRef = this._matDialog.open(NewRadResultTemplateComponent,
      {
        // maxHeight: '99vh',
        maxWidth: "95vw",
        height: '95%',
        width: '95%',
        data: {
          data: row,
          verifyCheck: false
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();

    });
  }

   onView(row: any = null) {
    const that = this;
    const dialogRef = this._matDialog.open(NewRadResultTemplateComponent,
      {
        maxWidth: "95vw",
        height: '95%',
        width: '95%',
        data: {
          data: row,
          verifyCheck: true
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }

  getPrint(contact) {

    console.log(contact)

    Swal.fire({
      title: 'Select Report Format',
      text: "Choose how you want to view the report:",
      icon: "warning",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#6c757d",
      cancelButtonColor: "#d33",
      confirmButtonText: "With Header",
      denyButtonText: "Without Header",
    }).then((result) => {

      if (result.isConfirmed) {
        this.viewgetRadioloyTemplateReportPdf(contact);
      } else if (result.isDenied) {
        this.viewgetRadioloyTemplateReportPdf1(contact);
      }
    });
  }

  viewgetRadioloyTemplateReportPdf(contact) {
    this.OnPrintReportLogSave('RadiolologyPrint', contact) // log save
    setTimeout(() => {
      const param = {
        "searchFields": [
          {
            "fieldName": "RadReportId",
            "fieldValue": String(contact.radReportId),
            "opType": "Equals"
          },
          {
            "fieldName": "OP_IP_Type",
            "fieldValue": String(contact.opdipdtype),
            "opType": "Equals"
          }
        ],
        "mode": "RadiologyTemplateReportWithHeader"
      }

      this._RadioloyOrderlistService.getReportView(param).subscribe(res => {

        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Radiology Template Report" + " " + "Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
        });
      });
    }, 100);
  }

  viewgetRadioloyTemplateReportPdf1(contact) {
    this.OnPrintReportLogSave('RadiolologyPrint', contact) // log save
    setTimeout(() => {
      const param = {
        "searchFields": [
          {
            "fieldName": "RadReportId",
            "fieldValue": String(contact.radReportId),
            "opType": "Equals"
          },
          {
            "fieldName": "OP_IP_Type",
            "fieldValue": String(contact.opdipdtype),
            "opType": "Equals"
          }
        ],
        "mode": "RadiologyTemplateReportWithoutHeader"
      }

      this._RadioloyOrderlistService.getReportView(param).subscribe(res => {

        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Radiology Template Report" + " " + "Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
        });
      });
    }, 100);
  }

  resetFormPatient() {
    this.regNo = 0
    this.onChangeFirst();
  }


  Editoutsoucedata(row) {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur(); // Remove focus from the button

    const dialogRef1 = this._matDialog.open(RadioLabOutsourceComponent,
      {
        maxWidth: "60vw",
        height: '50vh',
        width: '100%',
        data: row

      });

    dialogRef1.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }

  onVerify(row) {
    Swal.fire({
      title: 'Confirm Verify Report ',
      text: 'Are you sure you want to Verify Report?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3bd96dff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Verify!'

    }).then((flag) => {
      // debugger
      if (flag.isConfirmed) {

        const submitData = {

          "radReportId": row.radReportId,
          "isVerifyId": this.accountService.currentUserValue.userId,
          "isVerifySign": true,
          "isVerifyedDate": new Date().toISOString()

        };
        console.log(submitData);
        this._RadioloyOrderlistService.RadioReportverifyMaster(submitData).subscribe(response => {
          this.grid.bindGridData();
        });
      }
    });
    this.grid.bindGridData();
  }

  onClear() {
    this.myformSearch.get('RegNoSearch').setValue("0");
    this.myformSearch.get('StatusSearch').setValue("0");
    this.myformSearch.get('PatientTypeSearch').setValue("3");
  }

  getVerifyTooltip(contact: any): string {
    if (contact.isVerified && contact.isVerifyedDate) {
      // const formattedDate = this.datePipe.transform(
      //     contact.isVerifyedDate,
      //     'yyyy-MM-dd'
      // );
      return `Verified On : ${contact.isVerifyedDate}\nVerified By : ${contact.verifiedUserName}`;
    }
    return contact.isCompleted
      ? 'Verify Report'
      : 'Test is Pending';
  }

  //whatsapp

  private overlayRef: OverlayRef | null = null;
  private EmailOverlayRef: OverlayRef | null = null;
  private whatsappOverlayRef: OverlayRef | null = null;
  private hoverTimeout: any = null;
  private patientCloseTimeout: any = null;
  private doctorCloseTimeout: any = null;

  openEmailDetailsPopover(event: MouseEvent, patientData: any) {
    event.stopPropagation();

    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Add small delay to prevent flickering
    this.hoverTimeout = setTimeout(() => {
      // Close any existing patient popover
      if (this.EmailOverlayRef) {
        this.EmailOverlayRef.dispose();
        this.EmailOverlayRef = null;
      }

      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          }
        ]);

      this.EmailOverlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(SMSDetailsPopupOverComponent);
      const componentRef: ComponentRef<SMSDetailsPopupOverComponent> = this.EmailOverlayRef.attach(portal);
      componentRef.instance.patientData = patientData;

      // Handle mouse events on the overlay element
      const overlayElement = this.EmailOverlayRef.overlayElement;
      overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
      overlayElement.addEventListener('mouseleave', () => this.closeEmailDetailsPopover());
    }, 300); // 300ms delay before showing popover
  }

  closeEmailDetailsPopover() {
    // Clear timeout if popover hasn't opened yet
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Clear any existing close timeout
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
    }

    // Add delay before closing to allow moving mouse to popover
    this.patientCloseTimeout = setTimeout(() => {
      if (this.EmailOverlayRef) {
        this.EmailOverlayRef.dispose();
        this.EmailOverlayRef = null;
      }
    }, 200);
  }

  openWhatsappDetailsPopover(event: MouseEvent, patientData: any) {
    event.stopPropagation();

    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Add small delay to prevent flickering
    this.hoverTimeout = setTimeout(() => {
      // Close any existing patient popover
      if (this.whatsappOverlayRef) {
        this.whatsappOverlayRef.dispose();
        this.whatsappOverlayRef = null;
      }

      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          }
        ]);

      this.whatsappOverlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(WhatsappDetPopUpOverComponent);
      const componentRef: ComponentRef<WhatsappDetPopUpOverComponent> = this.whatsappOverlayRef.attach(portal);
      console.log(patientData)
      componentRef.instance.patientData = patientData;

      // Handle mouse events on the overlay element
      const overlayElement = this.whatsappOverlayRef.overlayElement;
      overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
      overlayElement.addEventListener('mouseleave', () => this.closeWhatsappDetailsPopover());
    }, 300); // 300ms delay before showing popover
  }

  closeWhatsappDetailsPopover() {
    // Clear timeout if popover hasn't opened yet
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Clear any existing close timeout
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
    }

    // Add delay before closing to allow moving mouse to popover
    this.patientCloseTimeout = setTimeout(() => {
      if (this.whatsappOverlayRef) {
        this.whatsappOverlayRef.dispose();
        this.whatsappOverlayRef = null;
      }
    }, 200);
  }
  keepPatientPopoverOpen() {
    // Clear close timeout when hovering over popover
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
      this.patientCloseTimeout = null;
    }
  }

  Onmessage(data) { }

  getWhatsappshareRadioReport(el) {
    console.log(el);
    // debugger
    this._whatsppService.OnWhatsAppMsgSent({
      mobileNo: el.mobileNo,
      patientName: el.patientName,
      billNo: el.radReportId,
      smsType: "RadiologyReport",
      patientId: el.regNo
    })
  }

  Onemail(contact) {
    const dialogRef = this._matDialog.open(EmailSendComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '55%',
        data: {
          Obj: contact,
          emailType: 'RadiologyReport'
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }

  OnPrintReportLogSave(type: any, data: any) {
    // debugger
    const src = Array.isArray(data) ? data[0] : data;
    const opipid = src?.opdipdId ?? src?.opdIpdId ?? src?.opdipdId ?? src?.opdipdid;
    if (type == 'RadiolologyPrint') {
      this.reportlogFormGroup.get('logTypeId').setValue(1);
      this.reportlogFormGroup.get('logTypeName').setValue('RadiolologyPrint');
    }
    if (type == 'Lab View') {
      this.reportlogFormGroup.get('logTypeId').setValue(2);
      this.reportlogFormGroup.get('logTypeName').setValue('Lab View');
    }
    this.reportlogFormGroup.get('opipid').setValue(opipid);

    if (!this.reportlogFormGroup.invalid) {
      console.log(this.reportlogFormGroup.value);

      this._RadioloyOrderlistService.getReportLog(this.reportlogFormGroup.value).subscribe(() => {
        // this.GetSampleCollectiondetail();
      });
    } else {
      const invalidFields = [];
      if (this.reportlogFormGroup.invalid) {
        for (const controlName in this.reportlogFormGroup.controls) {
          const control = this.reportlogFormGroup.get(controlName);

          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`Report Data : ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`Report Data: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
          );
        });
        return
      }
    }
  }
}
