import {
    Component,
    Input,
    OnInit,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, ReplaySubject, Subject, Subscription } from "rxjs";
import { RegistrationService } from "../registration/registration.service";
import { DatePipe, Time } from "@angular/common";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AppointmentSreviceService } from "./appointment-srevice.service";

// import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { NewAppointmentComponent } from "./new-appointment/new-appointment.component";
import { fuseAnimations } from "@fuse/animations";
import { NewRegistrationComponent } from "../registration/new-registration/new-registration.component";
import { EditConsultantDoctorComponent } from "./edit-consultant-doctor/edit-consultant-doctor.component";
import { EditRefraneDoctorComponent } from "./edit-refrane-doctor/edit-refrane-doctor.component";
import { EditRegistrationComponent } from "../registration/edit-registration/edit-registration.component";
import { CasepaperVisitDetails } from "../op-search-list/op-casepaper/op-casepaper.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { PatientAppointmentComponent } from "./patient-appointment/patient-appointment.component";
import { ImageViewComponent } from "./image-view/image-view.component";
import { CameraComponent } from "./camera/camera.component";
import { map, startWith } from "rxjs/operators";

export class DocData {
    doc: any;
    type: string = '';
  };
  

@Component({
    selector: "app-appointment",
    templateUrl: "./appointment.component.html",
    styleUrls: ["./appointment.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AppointmentComponent implements OnInit {
    msg: any;
    sIsLoading: string = "";
    // isLoading = true;
    isRateLimitReached = false;
    hasSelectedContacts: boolean;
    currentDate = new Date();
    subscriptions: Subscription[] = [];
    reportPrintObj: CasepaperVisitDetails;
    printTemplate: any;
    reportPrintObjList: CasepaperVisitDetails[] = [];
    subscriptionArr: Subscription[] = [];
    isLoadingStr: string = '';
    isLoading: String = '';

    VisitID: any;


    // upload document
    doclist: any = [];
    Filename:any;
    PatientName:any;
    noOptionFound: boolean = false;
    RegId: any = 0;
    registerObj = new RegInsert({});
    RegNo:any=0;
  // Document Upload
  personalFormGroup:FormGroup;
  title = 'file-upload';
  images: any[] = [];
  docsArray: DocData[] = [];
  filteredOptions: any;
  showOptions: boolean = false;

  doctorNameCmbList:any=[];

  optionsDoctor: any[] = [];

  filteredOptionsDoctor: Observable<string[]>;
  isDoctorSelected:boolean = false;


  @ViewChild('attachments') attachment: any;

  imageForm = new FormGroup({
    imageFile: new FormControl('', [Validators.required]),
    imgFileSource: new FormControl('', [Validators.required])
  });

  docsForm = new FormGroup({
    docFile: new FormControl('', [Validators.required]),
    docFileSource: new FormControl('', [Validators.required])
  });

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() dataArray: any;

    displayedColumns = [
        "PatientOldNew",
        "MPbillNo",
        "RegNoWithPrefix",
        "PatientName",
        "DVisitDate",
        "VisitTime",
        "OPDNo",
        "Doctorname",
        "RefDocName",
        "PatientType",
        // 'HospitalName',
        "buttons",
    ];
    dataSource = new MatTableDataSource<VisitMaster>();
    menuActions: Array<string> = [];
    //datePipe: any;

    displayedColumns1 = [

        'DocumentName',
        'DocumentPath',
        'buttons'
    ];
    
    dataSource1 = new MatTableDataSource<DocumentUpload>();

    constructor(
        public _AppointmentSreviceService: AppointmentSreviceService,
        private _ActRoute: Router,
        private _fuseSidebarService: FuseSidebarService,
        public _registrationService: RegistrationService,
        public _matDialog: MatDialog,
        public matDialog: MatDialog,
        private formBuilder: FormBuilder,
        public datePipe: DatePipe // private advanceDataStored: AdvanceDataStored
    ) {
        // this.getVisitList();
    }

    ngOnInit(): void {

        this.personalFormGroup = this.createPesonalForm();

        if (this._ActRoute.url == "/opd/appointment") {
            // this.menuActions.push('One');
            // this.menuActions.push("CasePaper Print");
            this.menuActions.push("Update Registration");
            this.menuActions.push("Update Consultant Doctor");
            this.menuActions.push("Update Referred Doctor");
            this.menuActions.push("Upload Documents");
            this.menuActions.push("Capture Photo");
            this.menuActions.push("Generate Patient Barcode");
        }

        this.getVisitList();
        this.getDoctorNameCombobox();
        
    }


    createPesonalForm() {
        return this.formBuilder.group({
          RegId: '',
        });
    }

    // VisitList

    getVisitList() {
        this.sIsLoading = "loading-data";
        var D_data = {
            F_Name:this._AppointmentSreviceService.myFilterform.get("FirstName").value.trim() + "%" || "%",
            L_Name:this._AppointmentSreviceService.myFilterform.get("LastName").value.trim() + "%" || "%",
            Reg_No:this._AppointmentSreviceService.myFilterform.get("RegNo").value || 0,
            Doctor_Id:this._AppointmentSreviceService.myFilterform.get("DoctorId").value.DoctorID || 0,
            From_Dt: this.datePipe.transform( this._AppointmentSreviceService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000" ) || "01/01/1900",
            To_Dt:this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || "01/01/1900",
            IsMark:this._AppointmentSreviceService.myFilterform.get("IsMark").value || 0,
        };
        setTimeout(() => {
            this.isLoadingStr = 'loading';
            this._AppointmentSreviceService.getAppointmentList(D_data).subscribe(
                    (Visit) => {
                        this.dataSource.data = Visit as VisitMaster[];
                        this.dataSource.sort = this.sort;
                        this.dataSource.paginator = this.paginator;
                        this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
                    },
                    (error) => {
                        this.isLoading = 'list-loaded';
                    }
                );
        }, 1000);
    }

    // toggle sidebar
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    onClear() {
        this._AppointmentSreviceService.myFilterform.reset({
            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
        });
    }

    
  private _filterDoctor(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
       return this.optionsDoctor.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }


  getDoctorNameCombobox() {
    this._AppointmentSreviceService.getDoctorMasterComboA().subscribe(data => {
      this.doctorNameCmbList = data;
      this.optionsDoctor = this.doctorNameCmbList.slice();
      this.filteredOptionsDoctor = this._AppointmentSreviceService.myFilterform.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctor(value) : this.doctorNameCmbList.slice()),
      );
      
    });
  }

  
  getOptionTextDoctor(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
    getSearchList() {
        debugger
      
        var m_data={
          "Keyword":`${this.personalFormGroup.get('RegId').value}%`
        }
        if (this.personalFormGroup.get('RegId').value.length >= 1) {
          this._AppointmentSreviceService.getRegistrationList(m_data).subscribe(resData => {
            this.filteredOptions = resData;
            // console.log(resData)
            if (this.filteredOptions.length == 0) {
              this.noOptionFound = true;
            } else {
              this.noOptionFound = false;
            }
    
          });
        }
    
      }


    getOptionText(option) {
        if (!option) return '';
        return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
      }
    

    getSelectedObj(obj) {
        ;
        // console.log('obj==', obj);
        let a, b, c;
    
        a = obj.AgeDay.trim();;
        b = obj.AgeMonth.trim();
        c = obj.AgeYear.trim();
        console.log(a, b, c);
        obj.AgeDay = a;
        obj.AgeMonth = b;
        obj.AgeYear = c;
        this.registerObj = obj;
        this.PatientName=obj.FirstName +" "+ obj.MiddleName +" "+ obj.LastName;
        this.RegId=obj.RegId;
        // console.log( this.registerObj )
        
      }

   
    getRecord(contact, m): void {
        debugger;
        // this.VisitID = contact.VisitId;
        if (m == "CasePaper Print") {
            this.getPrint(contact);
        }
        if (m == "Update Registration") {
            console.log(contact);
            var D_data = {
                RegId: contact.RegId//8//TESTING APPointment edit contact.RegId,
            };
            console.log(D_data)
            this._AppointmentSreviceService
                .getregisterListByRegId(D_data)
                .subscribe(
                    (reg) => {
                        this.dataArray = reg;
                        console.log(this.dataArray);
                        var m_data = {
                            RegNo: this.dataArray[0].RegNo,
                            RegId: this.dataArray[0].RegId,
                            PrefixID: this.dataArray[0].PrefixId,
                            PrefixName: this.dataArray[0].PrefixName,
                            FirstName: this.dataArray[0].FirstName,
                            MiddleName: this.dataArray[0].MiddleName,
                            LastName: this.dataArray[0].LastName,
                            PatientName: this.dataArray[0].PatientName,
                            DateofBirth: this.dataArray[0].DateofBirth,
                            MaritalStatusId: this.dataArray[0].MaritalStatusId,
                            AadharCardNo: this.dataArray[0].AadharCardNo || 0,
                            Age: this.dataArray[0].Age.trim(),
                            AgeDay: this.dataArray[0].AgeDay,
                            AgeMonth: this.dataArray[0].AgeMonth,
                            AgeYear: this.dataArray[0].AgeYear,
                            Address: this.dataArray[0].Address,
                            AreaId: this.dataArray[0].AreaId,
                            City: this.dataArray[0].City,
                            CityId: this.dataArray[0].CityId,
                            StateId: this.dataArray[0].StateId,
                            CountryId: this.dataArray[0].CountryId,
                            PhoneNo: this.dataArray[0].PhoneNo,
                            MobileNo: this.dataArray[0].MobileNo,
                            GenderId: this.dataArray[0].GenderId,
                            GenderName: this.dataArray[0].GenderName,
                            ReligionId: this.dataArray[0].ReligionId,
                            IsCharity: 0,
                            PinNo: this.dataArray[0].PinNo,
                            RegDate: this.dataArray[0].RegDate,
                            RegNoWithPrefix: this.dataArray[0].RegNoWithPrefix,
                            RegTime: this.dataArray[0].RegTime,
                        };
                        this._registrationService.populateFormpersonal(m_data);
                        const dialogRef = this._matDialog.open(NewAppointmentComponent,
                            {
                                maxWidth: "85vw",
                                height: "550px",
                                width: "100%",
                                data: {
                                    registerObj: m_data,
                                },
                            }
                        );
                        dialogRef.afterClosed().subscribe((result) => {
                            console.log(
                                "The dialog was closed - Insert Action",
                                result
                            );
                            this.getVisitList();
                        });
                    },
                    (error) => {
                        this.sIsLoading = "";
                    }
                );
        } else if (m == "Update Consultant Doctor") {
            var m_data2 = {
                RegId: contact.RegId,
                PatientName: contact.PatientName,
                VisitId: contact.VisitId,
                OPD_IPD_Id: contact.OPD_IPD_Id,
                DoctorId: contact.DoctorId,
                DoctorName: contact.Doctorname,
            };
            this._registrationService.populateFormpersonal(m_data2);
            const dialogRef = this._matDialog.open(
                EditConsultantDoctorComponent,
                {
                    maxWidth: "70vw",
                    height: "410px",
                    width: "70%",
                    data: {
                        registerObj: m_data2,
                    },
                }
            );
            dialogRef.afterClosed().subscribe((result) => {
                console.log("The dialog was closed - Insert Action", result);
            });
        } else if (m == "Update Referred Doctor") {
            var m_data3 = {
                RegId: contact.RegId,
                PatientName: contact.PatientName,
                VisitId: contact.VisitId,
                OPD_IPD_Id: contact.OPD_IPD_Id,
                RefDoctorId: contact.RefDocId,
                RefDocName: contact.RefDocName,
            };
            this._registrationService.populateFormpersonal(m_data3);
            const dialogRef = this._matDialog.open(EditRefraneDoctorComponent, {
                maxWidth: "70vw",
                height: "410px",
                width: "70%",
                data: {
                    registerObj: m_data3,
                },
            });
            dialogRef.afterClosed().subscribe((result) => {
                console.log("The dialog was closed - Insert Action", result);
            });
        }
        //   else if (m == "Refund of Bill") {
        //     console.log(" This is for refund of Bill pop : " + m);
        //   }
        //   else if (m == "Case Paper") {
        //     console.log("Case Paper : " + m);
        //   }
        //   //   const act?ionType: string = response[0];
        //   //   this.selectedID =  contact.VisitId
        //   //   this._ActRoute.navigate(['opd/appointment/op_bill'])
        //   //   this._ActRoute.navigate(['opd/appointment/op_bill'], {queryParams:{id:this.selectedID}})
    }

    newappointment() {
        const dialogRef = this._matDialog.open(NewAppointmentComponent, {
            maxWidth: "110vw",
            height: "850px",
            width: "100%",
            
        });
        dialogRef.afterClosed().subscribe((result) => {
            
            this.getVisitList();
        });
    }
    feedback() {
        const dialogRef = this._matDialog.open(FeedbackComponent, {
            maxWidth: "80vw",
            height: "90%",
            width: "100%",
            
        });
    }

    PatientAppointment() {
        const dialogRef = this._matDialog.open(PatientAppointmentComponent,
            {
                maxWidth: "95vw",
                maxHeight: "95vh", width: '100%', height: "100%"
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            
        });
    }

    // field validation
    get f() {
        return this._AppointmentSreviceService.myFilterform.controls;
    }
    selectRow(row) {
        this.selectRow = row;
    }

    getTemplate() {
        let query =
            "select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=12";
        this._AppointmentSreviceService
            .getTemplate(query)
            .subscribe((resData: any) => {
                console.log(resData);
                this.printTemplate = resData[0].TempDesign;
                console.log(this.printTemplate);
                let keysArray = [
                    'HospitalName','HospitalAddress','Phone','EmailId',
                    "RegNo",
                    "PrecriptionId",
                    "PatientName",
                    "OPDNo",
                    "Diagnosis",
                    "PatientName",
                    "Weight",
                    "Pluse",
                    "BP",
                    "BSL",
                    "DoseName",
                    "Days",
                    "GenderName",
                    "AgeYear",
                    "DrugName",
                    "ConsultantDocName",
                    "SecondRefDoctorName",
                    "MobileNo",
                    "Address",
                    "VisitDate",
                    "PreviousVisitDate"
                ]; // resData[0].TempKeys;

                for (let i = 0; i < keysArray.length; i++) {
                    let reString = "{{" + keysArray[i] + "}}";
                    let re = new RegExp(reString, "g");
                    this.printTemplate = this.printTemplate.replace(
                        re,
                        this.reportPrintObj[keysArray[i]]
                    );
                }

                this.printTemplate = this.printTemplate.replace(
                    "StrPrintDate",
                    this.transform2(this.currentDate.toString())
                );
                this.printTemplate = this.printTemplate.replace('StrVisitDate', this.transform2(this.reportPrintObj.VisitDate));
                this.printTemplate = this.printTemplate.replace('StrPreviousVisitDate', this.transform2(this.reportPrintObj.PreviousVisitDate));
              
                this.printTemplate = this.printTemplate.replace(/{{.*}}/g, "");
                setTimeout(() => {
                    this.print();
                }, 1000);
            });
    }

    transform1(value: string) {
        var datePipe = new DatePipe("en-US");
        value = datePipe.transform(value, "dd/MM/yyyy hh:mm a");
        return value;
    }

    transform2(value: string) {
        var datePipe = new DatePipe("en-US");
        value = datePipe.transform(new Date(), "dd/MM/yyyy h:mm a");
        return value;
    }

    getPrint(contact) {
        debugger;
        var D_data = {
            VisitId: contact.VisitId || 0,
            
        };
     
        let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
        this.subscriptionArr.push(
            this._AppointmentSreviceService
                .getOPDPrecriptionPrint(D_data)
                .subscribe((res) => {
                    this.reportPrintObjList = res as CasepaperVisitDetails[];
                    console.log(this.reportPrintObjList )
                    this.reportPrintObj = res[0] as CasepaperVisitDetails;
                    this.getTemplate();
                })
        );
    }

    // PRINT
    print() {
        // HospitalName, HospitalAddress, AdvanceNo, PatientName
        let popupWin, printContents;
        // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;

        popupWin = window.open(
            "",
            "_blank",
            "top=0,left=0,height=800px !important,width=auto,width=2200px !important"
        );
        // popupWin.document.open();
        popupWin.document.write(` <html>
    <head><style type="text/css">`);
        popupWin.document.write(`
      </style>
          <title></title>
      </head>
    `);
        popupWin.document
            .write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
    </html>`);
        popupWin.document.close();
    }


// Image Upload

b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    const Url = URL.createObjectURL(blob);
    // return this.safe.transform(Url);
  }

  public getSnapshot(): void {
    // this.trigger.next(void 0);
  }
  // public captureImg(webcamImage: WebcamImage): void {
  //   this.webcamImage = webcamImage;
  //   this.sysImage = webcamImage!.imageAsDataUrl;
  //   console.info('got webcam image', this.sysImage);
  // }
  // public get invokeObservable(): Observable<any> {
  //   return this.trigger.asObservable();
  // }
  // public get nextWebcamObservable(): Observable<any> {
  //   return this.nextWebcam.asObservable();
  // }
  // public handleInitError(error: WebcamInitError): void {
  //   this.errors.push(error);
  // }

  onUpload() {
    // this.dialogRef.close({url: this.sysImage});
  }


  //Image Upload
  imgArr: string[] = [];
  onImageFileChange(events: any) {
    if (events.target.files && events.target.files[0]) {
      let filesAmount = events.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        this.imgArr.push(events.target.files[i].name);
        reader['fileName'] = events.target.files[i].name;
        reader.onload = (event: any) => {
          this.images.push({url: event.target.result, name: reader['fileName']});
          this.imageForm.patchValue({
            imgFileSource: this.images
          });
        }
        reader.readAsDataURL(events.target.files[i]);
      }
      this.attachment.nativeElement.value = '';
    }
  }

  onDocFileChange(event: any) {
    debugger
    let files = event.target.files;
    let type: string;
    if (files && files[0]) {
      let filesAmount = files.length;
      for (let i = 0; i < filesAmount; i++) {
        let file = files[i];
        console.log(file)
        if (file) {
          let pdf = (/\.(pdf)$/i);
          type = file.name.toLowerCase();
          if (pdf.exec(type)) {
            type = "pdf";
          }
          this.Filename=file.name.toLowerCase();
          type=file.type
          this.onAddDocument(this.Filename,type);
        }
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.docsArray.push({ doc: event.target.result, type: type });
          this.docsForm.patchValue({
            docFileSource: this.docsArray
          });
        }
        reader.readAsDataURL(event.target.files[i]);
      }
      // this.attachment.nativeElement.value = '';

      this.Filename=this.docsForm.get('docFileSource')?.value
      console.log(this.Filename)
    }

   
  }

  removeImage(url: string) {
    let index = this.images.indexOf(url);
    this.images.splice(index, 1);
  }

  removeDoc(ele: DocData) {
    let index = this.docsArray.indexOf(ele);
    this.docsArray.splice(index, 1);
  }

  onViewImage(ele: any, type: string) {
    debugger
    let fileType;
    if (ele) {
        console.log(ele);
      const dialogRef = this.matDialog.open(ImageViewComponent,
        {
          width: '900px',
          height: '900px',
          data: {
            docData: type == 'img' ? ele : ele.doc,
            type: type == 'img' ? "image" : ele.type
          }
        }
      );
      dialogRef.afterClosed().subscribe(result => {

      });
    }
  }

  onSubmitImgFiles() {
    let imgFiles = this.imageForm.get('imgFileSource')?.value;
    if(imgFiles && imgFiles.length > 0) {
      imgFiles.forEach((element, index) => {
        element.name = this.imgArr[index];
      });
    }
    console.log(this.imageForm.get('imgFileSource')?.value);
  }

  onSubmitDocFiles() {
    console.log(this.docsForm.get('docFileSource')?.value);
  
   
      var m_data = {
          feedbackInsert: {
              PatientName: this.PatientName,
              RegNo:this.RegId,
              DocumentName: this.docsForm.get('docFileSource')?.value,
              // ReceptionEnquiry:
              //     this.feedbackFormGroup.get("recpRadio").value,
              // SignBoards: this.feedbackFormGroup.get("signRadio").value,
              // StaffBehaviour:
              //     this.feedbackFormGroup.get("staffBehvRadio").value,
              // ClinicalStaff:
              //     this.feedbackFormGroup.get("clinicalStaffRadio").value,
              // DoctorsTreatment:
              //     this.feedbackFormGroup.get("docTreatRadio").value,
              // Cleanliness: this.feedbackFormGroup.get("cleanRadio").value,
              // Radiology:
              //     this.feedbackFormGroup.get("radiologyRadio").value,
              // Pathology:
              //     this.feedbackFormGroup.get("pathologyRadio").value,
              // Security: this.feedbackFormGroup.get("securityRadio").value,
              // Parking: this.feedbackFormGroup.get("parkRadio").value,
              // Pharmacy: this.feedbackFormGroup.get("pharmaRadio").value,
              // Physiotherapy:
              //     this.feedbackFormGroup.get("physioRadio").value,
              // Canteen: this.feedbackFormGroup.get("canteenRadio").value,
              // SpeechTherapy:
              //     this.feedbackFormGroup.get("speechRadio").value,
              // Dietation: this.feedbackFormGroup.get("dietRadio").value,
              // comment: this.feedbackFormGroup
              //     .get("commentText")
              //     .value.trim(),
          },
      };
      console.log(m_data);
      this._AppointmentSreviceService.documentuploadInsert(m_data).subscribe((data) => {
          if(data){
            Swal.fire("Document uploaded Successfully  ! ");
          }
        
      });

  }

//   CameraComponent

  openCamera(type: string) {
    let fileType;
    const dialogRef = this.matDialog.open(ImageViewComponent,
      {
        width: '800px',
        height: '550px',
        data: {
          docData: type == 'camera' ? 'camera' : '',
          type: type == 'camera' ? 'camera' : ''
        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.imgArr.push(result.name);
        this.images.push(result);
      }
    });
  }



  onAddDocument(name,type) {
debugger

    this.isLoading = 'save';
    // if (this.SrvcName && (parseInt(this.b_price) != 0) && this.b_qty) {
    
      this.dataSource1.data = [];
      this.doclist.push(
        {
          DocumentName:name,// this.imageForm.get('imgFileSource')?.value,
          DocumentPath:type// this.imageForm.get('imgFileSource')?.value,
         
        });
      this.isLoading = '';
      this.dataSource1.data = this.doclist;
      
    }
   
  // }


  deleteTableRow(element) {
    let index = this.doclist.indexOf(element);
    if (index >= 0) {
      this.doclist.splice(index, 1);
      this.dataSource1.data = [];
      this.dataSource1.data = this.doclist;
    }
    Swal.fire('Success !', 'Document Row Deleted Successfully', 'success');
  }

}

export class DocumentUpload {
  DocumentName: any;
  DocumentPath: string;
 
  constructor(DocumentUpload) {
    {
      this.DocumentName = DocumentUpload.DocumentName || '';
      this.DocumentPath = DocumentUpload.DocumentPath || '';
     
    }
  }
}

export class VisitMaster {
    VisitId: Number;
    PrefixId: number;
    RegNoWithPrefix: number;
    PatientName: string;
    VisitDate: Date;
    VisitTime: Time;
    HospitalID: number;
    HospitalName: string;
    PatientTypeID: number;
    PatientTypeId: number;
    PatientType: string;
    CompanyId: number;
    OPDNo: string;
    TariffId: number;
    TariffName: string;
    ConsultantDocId: number;
    RefDocId: number;
    Doctorname: string;
    RefDocName: string;
    DepartmentId: number;
    appPurposeId: number;
    patientOldNew: Boolean;
    isMark: boolean;
    isXray: boolean;
    AddedBy: number;
    MPbillNo: number;
    RegNo: any;
    /**
     * Constructor
     *
     * @param VisitMaster
     */
    constructor(VisitMaster) {
        {
            this.VisitId = VisitMaster.VisitId || "";
            (this.PrefixId = VisitMaster.PrefixId || ""),
                (this.RegNoWithPrefix = VisitMaster.RegNoWithPrefix || "");
            this.PatientName = VisitMaster.PatientName || "";
            this.VisitDate = VisitMaster.VisitDate || "";
            this.VisitTime = VisitMaster.VisitTime || "";
            this.HospitalID = VisitMaster.HospitalID || "";
            this.HospitalName = VisitMaster.HospitalName || "";
            this.PatientTypeID = VisitMaster.PatientTypeID || "";
            this.PatientTypeId = VisitMaster.PatientTypeId || "";
            this.PatientType = VisitMaster.PatientType || "";
            this.CompanyId = VisitMaster.CompanyId || "";
            this.TariffId = VisitMaster.TariffId || "";
            this.OPDNo = VisitMaster.OPDNo || "";
            this.ConsultantDocId = VisitMaster.ConsultantDocId || "";
            this.Doctorname = VisitMaster.Doctorname || "";
            this.RefDocId = VisitMaster.VisitTime || "";
            this.RefDocName = VisitMaster.RefDocName || "";
            this.DepartmentId = VisitMaster.DepartmentId || "";
            this.patientOldNew = VisitMaster.patientOldNew || "";
            this.isXray = VisitMaster.isXray || "";
            this.AddedBy = VisitMaster.AddedBy || "";
            this.MPbillNo = VisitMaster.MPbillNo || "";
            this.RegNo = VisitMaster.RegNo || "";
        }
    }
}

export class RegInsert {
    RegId: Number;
    RegDate: Date;
    RegTime: Time;
    PrefixId: number;
    PrefixID: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Address: string;
    City: string;
    PinNo: string;
    RegNo: string;
    DateofBirth: Date;
    Age: any;
    GenderId: Number;
    PhoneNo: string;
    MobileNo: string;
    AddedBy: number;
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    CountryId: number;
    StateId: number;
    CityId: number;
    MaritalStatusId: number;
    IsCharity: Boolean;
    ReligionId: number;
    AreaId: number;
    VillageId: number;
    TalukaId: number;
    PatientWeight: number;
    AreaName: string;
    AadharCardNo: string;
    PanCardNo: string;
    currentDate = new Date();
    /**
     * Constructor
     *
     * @param RegInsert
     */

    constructor(RegInsert) {
        {
            this.RegId = RegInsert.RegId || "";
            this.RegDate = RegInsert.RegDate || "";
            this.RegTime = RegInsert.RegTime || "";
            this.PrefixId = RegInsert.PrefixId || "";
            this.PrefixID = RegInsert.PrefixID || "";
            this.FirstName = RegInsert.FirstName || "";
            this.MiddleName = RegInsert.MiddleName || "";
            this.LastName = RegInsert.LastName || "";
            this.Address = RegInsert.Address || "";
            this.City = RegInsert.City || "";
            this.PinNo = RegInsert.PinNo || "";
            this.DateofBirth = RegInsert.DateofBirth || this.currentDate;
            this.Age = RegInsert.Age || "";
            this.GenderId = RegInsert.GenderId || "";
            this.PhoneNo = RegInsert.PhoneNo || "";
            this.MobileNo = RegInsert.MobileNo || "";
            this.AddedBy = RegInsert.AddedBy || "";
            this.AgeYear = RegInsert.AgeYear || "";
            this.AgeMonth = RegInsert.AgeMonth || "";
            this.AgeDay = RegInsert.AgeDay || "";
            this.CountryId = RegInsert.CountryId || "";
            this.StateId = RegInsert.StateId || "";
            this.CityId = RegInsert.CityId || "";
            this.MaritalStatusId = RegInsert.MaritalStatusId || "";
            this.IsCharity = RegInsert.IsCharity || "";
            this.ReligionId = RegInsert.ReligionId || "";
            this.AreaId = RegInsert.AreaId || "";
            this.VillageId = RegInsert.VillageId || "";
            this.TalukaId = RegInsert.TalukaId || "";
            this.PatientWeight = RegInsert.PatientWeight || "";
            this.AreaName = RegInsert.AreaName || "";
            this.AadharCardNo = RegInsert.AadharCardNo || "";
            this.PanCardNo = RegInsert.PanCardNo || "";
        }
    }
}

export class AdvanceDetailObj {
    RegNo: Number;
    RegId: number;
    AdmissionID: Number;
    PatientName: string;
    Doctorname: string;
    DoctorName: string;
    AdmDateTime: string;
    AgeYear: number;
    ClassId: number;
    TariffName: String;
    TariffId: number;
    opD_IPD_Type: number;
    VisitId: number;
    storage: any;
    IPDNo: any;
    RefDoctorId: any;
    DoctorId: any;
    OPD_IPD_ID: any;
    RefDocName: any;
    WardName: any;
    BedName: any;
    /**
     * Constructor
     *
     * @param AdvanceDetailObj
     */
    constructor(AdvanceDetailObj) {
        {
            this.RegNo = AdvanceDetailObj.RegNo || "";
            this.RegId = AdvanceDetailObj.RegId || "";
            this.VisitId = AdvanceDetailObj.VisitId || "";
            this.AdmissionID = AdvanceDetailObj.AdmissionID || "";
            this.PatientName = AdvanceDetailObj.PatientName || "";
            this.Doctorname = AdvanceDetailObj.Doctorname || "";
            this.DoctorName = AdvanceDetailObj.DoctorName || "";
            this.AdmDateTime = AdvanceDetailObj.AdmDateTime || "";
            this.AgeYear = AdvanceDetailObj.AgeYear || "";
            this.ClassId = AdvanceDetailObj.ClassId || "";
            this.TariffName = AdvanceDetailObj.TariffName || "";
            this.TariffId = AdvanceDetailObj.TariffId || "";
            this.opD_IPD_Type = AdvanceDetailObj.opD_IPD_Type || 0;
            this.IPDNo = AdvanceDetailObj.IPDNo || "";
            this.RefDoctorId = AdvanceDetailObj.RefDoctorId || 0;
            this.DoctorId = AdvanceDetailObj.DoctorId || 0;
            this.OPD_IPD_ID = AdvanceDetailObj.OPD_IPD_ID || 0;
            this.RefDocName = AdvanceDetailObj.RefDocName || "";
            this.WardName = AdvanceDetailObj.WardName || "";
            this.BedName = AdvanceDetailObj.BedName || "";
        }
    }
}
