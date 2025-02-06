import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { AppointmentlistService } from '../appointmentlist.service';
import { DatePipe } from '@angular/common';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { Router } from '@angular/router';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { RegInsert } from '../../registration/registration.component';
import { fuseAnimations } from '@fuse/animations';
import { ImageViewComponent } from '../image-view/image-view.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';

@Component({
    selector: 'app-new-appointment',
    templateUrl: './new-appointment.component.html',
    styleUrls: ['./new-appointment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewAppointmentComponent implements OnInit {
    OnChangeDobType(e) {
        this.dateStyle = e.value;
    }

    dateStyle?: string = 'Date';
    personalFormGroup: FormGroup;
    VisitFormGroup: FormGroup;
    searchFormGroup: FormGroup;

    currentDate = new Date();
    TempKeys: any[] = [];
    doclist: any = [];
    images: any[] = [];
    docs: any[] = [];
    dataArray = {};
    registerObj = new RegInsert({});
    isRegSearchDisabled: boolean = false;
    Regdisplay: boolean = false;
    Regflag: boolean = false;
    submitted = false;
    isLinear = true;
    showtable: boolean = false;
    isRateLimitReached = false;
    isLoadings = false;
    isOpen = false;
    savedValue: number = null;
    noOptionFound: boolean = false;
    noOptionFound1: boolean = false;
    AdList: boolean = false;
    chkprint: boolean = false;
    VisitFlagDisp: boolean = false;
    hasSelectedContacts: boolean;
    isCompanySelected: boolean = false;
    IsPhoneAppflag: boolean = true;

    loadID = 0;

    VisitTime: String;
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    capturedImage: any;
    VisitID: any;
    msg: any;
    registration: any;
    newRegSelected: any = 'registration';
    Patientnewold: any = 1;
    IsPathRad: any;
    PatientName: any = '';
    RegId: any = 0;
    OPIP: any = '';
    VisitId = 0;
    patienttype = 0
    UnitId = 1;

    screenFromString = 'admission-form';
    @ViewChild('attachments') attachment: any;

    imageForm = new FormGroup({
        imageFile: new FormControl('', [Validators.required]),
        imgFileSource: new FormControl('', [Validators.required])
    });

    docsForm = new FormGroup({
        docFile: new FormControl('', [Validators.required]),
        docFileSource: new FormControl('', [Validators.required])
    });



    menuActions: Array<string> = [];
    pdfDataSource = new MatTableDataSource<any>();
    imgDataSource = new MatTableDataSource<any>();

    public height: string;
    sanitizeImagePreview;
    displayedColumns1 = [
        'DocumentName',
        'DocumentPath',
        'buttons'
    ];
    // New Api
    autocompleteModeprefix: string = "Prefix";
    autocompleteModegender: string = "Gender";
    autocompleteModearea: string = "Area";
    autocompleteModecity: string = "City";
    autocompleteModestate: string = "State";
    autocompleteModecountry: string = "Country";
    autocompleteModemstatus: string = "MaritalStatus";
    autocompleteModereligion: string = "Religion";

    autocompleteModeunit: string = "Hospital";
    autocompleteModepatienttype: string = "PatientType";
    autocompleteModetariff: string = "Tariff";
    autocompleteModecompany: string = "Company";
    autocompleteModesubcompany: string = "SubCompany";
    autocompleteModedepartment: string = "Department";
    autocompleteModedeptdoc: string = "ConDoctor";
    autocompleteModerefdoc: string = "RefDoctor";
    autocompleteModepurpose: string = "Purpose";
    @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
    @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
    @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
    @ViewChild('ddldoctor') ddldoctor: AirmidDropDownComponent;



    constructor(
        public _AppointmentlistService: AppointmentlistService,

        public dialogRef: MatDialogRef<NewAppointmentComponent>,
        public _matDialog: MatDialog,
        private _ActRoute: Router,
        private _fuseSidebarService: FuseSidebarService,
        public _WhatsAppEmailService: WhatsAppEmailService,
        public datePipe: DatePipe,
        private formBuilder: UntypedFormBuilder,
        public matDialog: MatDialog,
        public toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any

    ) {

    }


    ngOnInit(): void {

        this.personalFormGroup = this._AppointmentlistService.createPesonalForm();
        this.VisitFormGroup = this._AppointmentlistService.createVisitdetailForm();
        this.searchFormGroup = this.createSearchForm();

        if (this.data)
            this.registerObj = this.data;


        console.log(this.registerObj)
    }





    onChangeReg(event) {
        //
        if (event.value == 'registration') {
            // this.registerObj = new RegInsert({});
            this.personalFormGroup.reset();
            this.personalFormGroup.get('RegId').reset();
            this.searchFormGroup.get('RegId').disable();
            this.isRegSearchDisabled = false;

            // this.personalFormGroup = this.createPesonalForm();

            // this.VisitFormGroup = this.createVisitdetailForm();
            // // this.Regdisplay = false;
            // this.showtable = false;
            this.Regflag = false;
            this.IsPhoneAppflag = true;

        } else if (event.value == 'registrered') {

            // this.personalFormGroup.get('RegId').enable();
            // this.searchFormGroup.get('RegId').enable();
            // this.searchFormGroup.get('RegId').reset();
            // this.personalFormGroup.reset();
            // this.Patientnewold = 2;

            // this.personalFormGroup = this.createPesonalForm();
            // this.VisitFormGroup = this.createVisitdetailForm();

            this.Regflag = true;
            this.IsPhoneAppflag = false;
            this.isRegSearchDisabled = true;



        }


    }

    createSearchForm() {
        return this.formBuilder.group({
            regRadio: ['registration'],
            regRadio1: ['registration1'],
            RegId: [''],
            PhoneRegId: [''],
            UnitId: [1]
        });
    }



    onChangePatient(value) {

        var mode = "Company"
        if (value.text == "Company") {
            this._AppointmentlistService.getMaster(mode, 1);
            this.VisitFormGroup.get('CompanyId').setValidators([Validators.required]);
            this.isCompanySelected = true;
            this.patienttype = 2;
        } else if (value.text != "Company") {
            this.isCompanySelected = false;
            this.VisitFormGroup.get('CompanyId').clearValidators();
            this.VisitFormGroup.get('SubCompanyId').clearValidators();
            this.VisitFormGroup.get('CompanyId').updateValueAndValidity();
            this.VisitFormGroup.get('SubCompanyId').updateValueAndValidity();
            this.patienttype = 1;
        }


    }


    getregdetails() {

        let RegId = this.searchFormGroup.get("RegId").value
        if (RegId > 0) {
            setTimeout(() => {
                this._AppointmentlistService.getRegistraionById(RegId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(this.registerObj)
                });
            }, 500);
        }
        else {
            this.searchFormGroup.reset();

        }
    }

    Vtotalcount = 0;
    VNewcount = 0;
    VFollowupcount = 0;
    VBillcount = 0;
    VCrossConscount = 0;
    Appointdetail(data) {
        this.Vtotalcount = 0;
        this.VNewcount = 0;
        this.VFollowupcount = 0;
        this.VBillcount = 0;
        this.VCrossConscount = 0;
        // console.log(data)
        this.Vtotalcount;

        for (var i = 0; i < data.length; i++) {
            if (data[i].PatientOldNew == 1) {
                this.VNewcount = this.VNewcount + 1;
            }
            else if (data[i].PatientOldNew == 2) {
                this.VFollowupcount = this.VFollowupcount + 1;
            }
            if (data[i].MPbillNo == 1 || data[i].MPbillNo == 2) {
                this.VBillcount = this.VBillcount + 1;
            }
            if (data[i].CrossConsulFlag == 1) {
                this.VCrossConscount = this.VCrossConscount + 1;
            }

            this.Vtotalcount = this.Vtotalcount + 1;
        }

    }

    displayFn(user: any): string {
        return user.text;
    }
    selectedOption(e: any) {
        let RegId = e.value;
        // from here you need to bind form.
    }
    WhatsAppAppointmentSend(el, vmono) {
        var m_data = {
            "insertWhatsappsmsInfo": {
                "mobileNumber": vmono || 0,
                "smsString": '',
                "isSent": 0,
                "smsType": 'Appointment',
                "smsFlag": 0,
                "smsDate": this.currentDate,
                "tranNo": el,
                "PatientType": 2,//el.PatientType,
                "templateId": 0,
                "smSurl": "info@gmail.com",
                "filePath": '',
                "smsOutGoingID": 0
            }
        }
        this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
            if (response) {
                this.toastr.success('Bill Sent on WhatsApp Successfully.', 'Save !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
            } else {
                this.toastr.error('API Error!', 'Error WhatsApp!', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
        });
        // this.IsLoading = false;
    }



    getOptionText(option) {
        if (!option) return '';
        return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
    }

    RegOrPhoneflag = '';
    vPhoneFlage = 0;
    vPhoneAppId: any;
    RegNo = 0;


    getSelectedObj(obj) {
        console.log(obj)
        this.RegOrPhoneflag = 'Entry from Registration';
        let todayDate = new Date();
        const d = new Date(obj.DateofBirth);

        this.PatientName = obj.PatientName;
        this.RegId = obj.value;
        this.VisitFlagDisp = true;

        if ((this.RegId ?? 0) > 0) {

            console.log(this.data)
            setTimeout(() => {
                this._AppointmentlistService.getRegistraionById(this.RegId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(this.registerObj)

                });

            }, 500);
        }

    }


    getSelectedObjphone(obj) {
        console.log(obj)
        this.RegOrPhoneflag = 'Entry from Phone Registration';
        let todayDate = new Date();
        const d = new Date(obj.DateofBirth);

        this.PatientName = obj.PatientName;
        this.RegId = obj.value;
        this.VisitFlagDisp = true;

        if ((this.RegId ?? 0) > 0) {

            console.log(this.data)
            setTimeout(() => {
                this._AppointmentlistService.getRegistraionById(this.RegId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(this.registerObj)

                });

            }, 500);
        }

    }


    getValidationMessages() {
        return {
            RegId: [],
            firstName: [
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            middleName: [
                // { name: "required", Message: "Middle Name is required" },
                // { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            lastName: [
                { name: "required", Message: "Last Name is required" },
                // { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            address: [
                { name: "required", Message: "Address is required" },

            ],
            prefixId: [
                { name: "required", Message: "Prefix Name is required" }
            ],
            genderId: [
                { name: "required", Message: "Gender is required" }
            ],
            areaId: [
                { name: "required", Message: "Area Name is required" }
            ],
            cityId: [
                { name: "required", Message: "City Name is required" }
            ],
            religionId: [
                { name: "required", Message: "Religion Name is required" }
            ],
            countryId: [
                { name: "required", Message: "Country Name is required" }
            ],
            maritalStatusId: [
                { name: "required", Message: "Mstatus Name is required" }
            ],
            stateId: [
                { name: "required", Message: "State Name is required" }
            ],
            mobileNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "Mobile No is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 10 digits not allowed." }

            ],
            phoneNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                // { name: "required", Message: "phoneNo No is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 10 digits not allowed." }

            ],
            aadharCardNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "AadharCard No is required" },
                { name: "minLength", Message: "12 digit required." },
                { name: "maxLength", Message: "More than 12 digits not allowed." }
            ],
            MaritalStatusId: [
                { name: "required", Message: "Mstatus Name is required" }
            ],
            patientTypeId: [
                { name: "required", Message: "Country Name is required" }
            ],
            tariffId: [
                { name: "required", Message: "Mstatus Name is required" }
            ],
            departmentId: [
                { name: "required", Message: "Department Name is required" }
            ],
            DoctorID: [
                { name: "required", Message: "Doctor Name is required" }
            ],
            refDocId: [
                { name: "required", Message: "Ref Doctor Name is required" }
            ],
            PurposeId: [
                { name: "required", Message: "Purpose Name is required" }
            ],
            CompanyId: [
                { name: "required", Message: "Company Name is required" }
            ],
            SubCompanyId: [
                { name: "required", Message: "SubCompany Name is required" }
            ],
            bedId: [
                { name: "required", Message: "bedId Name is required" }
            ],
            wardId: [
                { name: "required", Message: "wardId Name is required" }
            ],


        };
    }
    Saveflag: boolean = false;


    onSave() {
       console.log(this.personalFormGroup.value)
       console.log(this.VisitFormGroup.value)
       console.log("Personal", this.personalFormGroup.valid, "Visit", this.VisitFormGroup.valid)
        if (!this.personalFormGroup.invalid && !this.VisitFormGroup.invalid) {
            this.personalFormGroup.get('RegDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
            this.personalFormGroup.get('RegTime').setValue(this.dateTimeObj.time)
            this.VisitFormGroup.get('visitDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
            this.VisitFormGroup.get('visitTime').setValue(this.dateTimeObj.time)

            if (this.searchFormGroup.get('regRadio').value == "registration")
                this.OnsaveNewRegister();
            else if (this.searchFormGroup.get('regRadio').value == "registrered") {
                this.onSaveRegistered();
                this.onClose();
            }
        } else {
            Swal.fire("Form Invalid chk....")
        }
    }

    OnsaveNewRegister() {
        this.personalFormGroup.get("RegId").setValue(0)
        this.VisitFormGroup.get("regId").setValue(0)

        let submitData = {
            "registration": this.personalFormGroup.value,
            "visit": this.VisitFormGroup.value
        };
        console.log(submitData);
        debugger
        this._AppointmentlistService.NewappointmentSave(submitData).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
            this._matDialog.closeAll();
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
    // }
    onSaveRegistered() {
        this.VisitFormGroup.get("regId").setValue(this.registerObj.regId)
        this.VisitFormGroup.get("patientOldNew").setValue(2)


        let submitData = {

            "registration": this.personalFormGroup.value,
            "visit": this.VisitFormGroup.value
        };
        console.log(submitData);

        this._AppointmentlistService.RregisteredappointmentSave(submitData).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
            this._matDialog.closeAll();
        }, (error) => {
            this.toastr.error(error.message);
        });


    }


    objICard = {};
    QrCode = "";



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




    onImageFileChange(events: any) {


        if (events.target.files && events.target.files[0]) {
            let filesAmount = events.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
                this.imgArr.push(events.target.files[i].name);
                this.readFile(events.target.files[i], events.target.files[i].name);
            }
            this.attachment.nativeElement.value = '';
        }
    }
    readFile(f: File, name: string) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
            this.images.push({ url: event.target.result, name: name, Id: 0 });
            this.imgDataSource.data = this.images;
            this.imageForm.patchValue({
                imgFileSource: this.images[0]
            });
        }
        reader.readAsDataURL(f);
    }
    dataURItoBlob(dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], { type: mimeString });
    }


    onSubmitImgFiles() {
        // let data: PatientDocument[] = [];
        // for (let i = 0; i < this.imgDataSource.data.length; i++) {
        //     if (this.imgDataSource.data[i].name.endsWith('.pdf')) {
        //         let file = new File([this.dataURItoBlob(this.imgDataSource.data[i].url)], this.imgDataSource.data[i].name, {
        //             type: "'application/pdf'"
        //         });
        //         data.push({
        //             Id: "0", OPD_IPD_ID: this.VisitId, OPD_IPD_Type: 0, DocFile: file, FileName: this.imgDataSource.data[i].name
        //         });
        //     }
        //     else {
        //         let file = new File([this.dataURItoBlob(this.imgDataSource.data[i].url)], this.imgDataSource.data[i].name, {
        //             type: "'image/" + this.imgDataSource.data[i].name.split('.')[this.imgDataSource.data[i].name.split('.').length - 1] + "'"
        //         });
        //         data.push({
        //             Id: "0", OPD_IPD_ID: this.VisitId, OPD_IPD_Type: 0, DocFile: file, FileName: this.imgDataSource.data[i].name
        //         });
        //     }
        // }
        // const formData = new FormData();
        // let finalData = { Files: data };
        // this.CreateFormData(finalData, formData);
        // this._AppointmentlistService.documentuploadInsert(formData).subscribe((data) => {
        //     if (data) {
        //         Swal.fire("Images uploaded Successfully  ! ");
        //     }
        // });
    }


    //Image Upload
    imgArr: string[] = [];
    docArr: string[] = [];


    onClose() {
        this.dialogRef.close();
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }




    CreateFormData(obj: any, formData: FormData, subKeyStr = '') {
        for (const i in obj) {
            const value = obj[i]; let subKeyStrTrans = i;
            if (subKeyStr) {
                if (i.indexOf(' ') > -1 || !isNaN(parseInt(i)))
                    subKeyStrTrans = subKeyStr + '[' + i + ']';
                else
                    subKeyStrTrans = subKeyStr + '.' + i;
            }
            if (typeof (value) === 'object' && !(value instanceof Date) && !(value instanceof File)) {
                this.CreateFormData(value, formData, subKeyStrTrans);
            }
            else {
                formData.append(subKeyStrTrans, value ?? '');
            }
        }
    }


    //   CameraComponent

    openCamera(type: string, place: string) {
        let fileType;
        const dialogRef = this.matDialog.open(ImageViewComponent,
            {
                width: '750px',
                height: '550px',

                data: {
                    docData: type == 'camera' ? 'camera' : '',
                    type: type == 'camera' ? 'camera' : '',
                    place: place
                }
            }
        );
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (place == "photo") {
                    this.sanitizeImagePreview = result.url;
                }
                else {
                    this.imgArr.push(result.name);
                    this.images.push(result);
                    this.imgDataSource.data = this.images;
                }
            }
        });
    }



    onAddDocument(name, type) {


        // this.isLoading = 'save';

        this.pdfDataSource.data = [];
        this.doclist.push(
            {
                DocumentName: name,// this.imageForm.get('imgFileSource')?.value,
                DocumentPath: type// this.imageForm.get('imgFileSource')?.value,

            });
        // this.isLoading = '';
        this.pdfDataSource.data = this.doclist;

    }

    // }

    deleteImage(element) {
        let index = this.images.indexOf(element);
        if (index >= 0) {
            this.images.splice(index, 1);
            this.imgDataSource.data = this.images;
        }

        // this.FimeName = element.name;

        // let query = "delete FROM T_MRD_AdmFile WHERE OPD_IPD_ID= " + this.VisitId + " AND FileName=" + "'" + this.FimeName + "'" + " ";

        // this._AppointmentSreviceService.getdeleteddocument(query).subscribe((resData: any) => {
        //     if (resData) {
        //         Swal.fire('Success !', 'Document Row Deleted Successfully', 'success');
        //     }
        // });
    }

    deleteTableRow(element) {
        let index = this.doclist.indexOf(element);
        if (index >= 0) {
            this.doclist.splice(index, 1);
            this.pdfDataSource.data = [];
            this.pdfDataSource.data = this.doclist;
        }
        // this.FimeName = element.name;
        // let query = "delete FROM T_MRD_AdmFile WHERE OPD_IPD_ID= " + this.VisitId + " AND FileName=" + "'" + this.FimeName + "'" + " ";

        // this._AppointmentSreviceService.getdeleteddocument(query).subscribe((resData: any) => {
        //     if (resData) {
        //         Swal.fire('Success !', 'Document Row Deleted Successfully', 'success');
        //     }
        // });
    }




    VitalInfo(contact) {
        let xx = {
            RegId: contact.RegId,
            OPD_IPD_ID: contact.OPD_IPD_ID,
            RegNo: contact.RegNoWithPrefix,
            VisitId: contact.VisitId,
            PatientName: contact.PatientName,
            Doctorname: contact.Doctorname,
            AdmDateTime: contact.AdmDateTime,
            AgeYear: contact.AgeYear,
            AgeMonth: contact.AgeMonth,
            AgeDay: contact.AgeDay,
            DepartmentName: contact.DepartmentName,
            ClassId: contact.ClassId,
            OPDNo: contact.OPDNo,
            PatientType: contact.PatientType,
            ClassName: contact.ClassName,
            TariffName: contact.TariffName,
            TariffId: contact.TariffId,
            CompanyId: contact.CompanyId,
            CompanyName: contact.CompanyName,
            RefDocName: contact.RefDocName,
            MobileNo: contact.MobileNo,
            Lbl: "PatientVitalInfo"
        };
        console.log(xx)
        //console.log(contact)
        // this.advanceDataStored.storage = new SearchInforObj(xx);
        // const dialogRef = this._matDialog.open(PatientVitalInformationComponent,
        //     {
        //         maxWidth: '80%',
        //         height: '58%',
        //         data: {
        //             registerObj: xx,
        //         },
        //     });

        // dialogRef.afterClosed().subscribe(result => {
        //     this.getVisitList1();
        // });

    }
    vhealthCardNo: any;
    Healthcardflag: boolean = false;
    vDays: any = 0;
    HealthCardExpDate: any;
    followUpDate: string;
    chkHealthcard(event) {
        if (event.checked) {
            this.Healthcardflag = true;
            this.personalFormGroup.get('HealthCardNo').setValidators([Validators.required]);
        } else {
            this.Healthcardflag = false;
            this.personalFormGroup.get('HealthCardNo').reset();
            this.personalFormGroup.get('HealthCardNo').clearValidators();
            this.personalFormGroup.get('HealthCardNo').updateValueAndValidity();
        }
    }


    onChangePrefix(e) {
        this.ddlGender.SetSelection(e.sexId);
    }

    onChangestate(e) {
        this.ddlCountry.SetSelection(e.stateId);
    }

    onChangecity(e) {
        this.ddlState.SetSelection(e.cityId);
        this.ddlCountry.SetSelection(e.stateId);
    }



    departmentId: any;
    DosctorId: any;
    DoctorId: any;
    getVisitRecord(row) {
        this.departmentId = row.DepartmentId;
        this.DosctorId = row.DoctorId;
        Swal.fire(this.departmentId, this.DoctorId)
        this.VisitFlagDisp = false;
    }

    onClear(val: boolean) {
        this.personalFormGroup.reset();
        this.dialogRef.close(val);
    }


    // new Api?


    selectChangeprefix(obj: any) {
        console.log(obj);

    }



    selectChangecity(obj: any) {
        console.log(obj);
        // this.cityId = obj
        // this.cityName = obj.text
    }

    selectChangepatienttype(obj: any) {
        console.log(obj);
        // this.patientTypeId = obj

    }
    selectChangetariff(obj: any) {
        console.log(obj);
        // this.tariffId = obj
    }

    selectChangecompany(obj: any) {
        console.log(obj);
        // this.companyId = obj
    }


    selectChangesubcompany(obj: any) {
        console.log(obj);
        // this.subcompanyId = obj.value

    }
    selectChangedepartment(obj: any) {
        console.log(obj);
        this.departmentId = obj

        this.ddldoctor.SetSelection(obj.departmentId);
        // this._AppointmentlistService.doctordepartmentData( this.departmentId ).subscribe((response) => {
        //     this.toastr.success(response.message);
        //      this.onClear(true);
        //  }, (error) => {
        //      this.toastr.error(error.message);
        //  });
    }

    selectChangedeptdoc(obj: any) {

    }

    selectChangerefdoc(obj: any) {
        console.log(obj);
        // this.refDocId = obj
    }


}
