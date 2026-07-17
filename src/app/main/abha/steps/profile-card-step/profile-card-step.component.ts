import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbhaProfile, AUTH_METHOD_LABELS, GENDER_LABELS } from '../../abha-model';
import { AbhaService } from '../../abha.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { AppointmentlistService } from 'app/main/opd/appointment-list/appointmentlist.service';
import { ToastrService } from 'ngx-toastr';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { MatDrawer } from '@angular/material/sidenav';
import { NewRegistrationComponent } from 'app/main/opd/registration/new-registration/new-registration.component';
import { MatDialog } from '@angular/material/dialog';
import { profile } from 'console';


@Component({
    selector: 'app-profile-card-step',
    templateUrl: './profile-card-step.component.html',
    styleUrls: ['./profile-card-step.component.scss']
})
export class ProfileCardStepComponent implements OnInit {
    @Output() reset = new EventEmitter<void>();
    @Input() token = "";
    @Input() isAddress = false;
    profile?: AbhaProfile;

    searchFormGroup: FormGroup;
    personalFormGroup: FormGroup;
    registerObj = new RegInsert({});
    @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
    autocompleteModeprefix: string = "Prefix";
    autocompleteModegender: string = "Gender";
    debounceTimers: { [key: string]: any } = {};
    filteredOptions: any[] = [];
    prevResults: any[] = [];
    minDate = new Date();
    ageYear = 0
    ageMonth = 0
    ageDay = 0
    value = new Date()
    day: any;
    month: any;
    year: any;

    displayedColumns = [
        'regNo',
        'patientName',
        'Gender',
        'mobileNo',
        'DOB'
        // 'action'
    ];

    // Fields that are locked (non-editable in HIMS)
    lockedFields = new Set(['name', 'ABHANumber', 'preferredAbhaAddress', 'dob', 'gender']);
    // Card-side toggle (front/back)
    cardSide: 'front' | 'back' = 'front';

    authMethodMeta = AUTH_METHOD_LABELS;
    genderLabels = GENDER_LABELS;
    qrUrl: string = '';
    @ViewChild('serviceDrawer') serviceDrawer!: MatDrawer;
    genderList: any[] = [];
    fullname = ""
    genderN = ""
    cityN = ""
    stateN = ""
    dob: any;
    showCard = false;
    dobSeparate = {
        day: '',
        month: '',
        year: 0
    };
    selectedRow: any;
    abhaAddress: any;
    abhaNumber: any;

    constructor(private abhaService: AbhaService, private formBuilder: FormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService,
        public _AppointmentlistService: AppointmentlistService, public toastr: ToastrService,
        public _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.searchFormGroup = this.createSearchForm();

        this.personalFormGroup = this.createPesonalForm();

        // this.abhaService.getProfile(this.token, this.isAddress).subscribe((r: AbhaProfile) => {
        //     this.profile = r;
        //     this.loadQr();

        //     this.personalFormGroup.get('abhaNumber').setValue(this.profile.abhaNumber)
        //     this.personalFormGroup.get('abhaAddress').setValue(this.profile.preferredAbhaAddress)
        // });

        this.abhaService.getProfile(this.token, this.isAddress).subscribe((r: AbhaProfile) => {
            this.profile = r;
            this.loadQr();

            // this.fetchGenderlist();

            this.fetchGenderlist(() => {

                const keyword = this.profile.firstName || this.profile.mobile;

                this._AppointmentlistService
                    .getSuggestions("OutPatient/auto-complete?Keyword=", keyword)
                    .subscribe(results => {

                        this.prevResults = (results || []).map(item => {

                            const gender = this.genderList.find(
                                g => g.genderId === item.genderId   // <-- use your actual property names
                            );

                            return {
                                ...item,
                                gender: gender ? gender.genderName : ''
                            };
                        });

                        this.filteredOptions = this.prevResults.filter(item => {

                            const patientName = (item.patientName || '').trim().toUpperCase();

                            const firstName = (this.profile.firstName || '').trim().toUpperCase();
                            const middleName = (this.profile.middleName || '').trim().toUpperCase();
                            const lastName = (this.profile.lastName || '').trim().toUpperCase();
                            const mobile = String(this.profile.mobile || '').trim();

                            return (
                                (firstName && patientName.includes(firstName)) ||
                                (middleName && patientName.includes(middleName)) ||
                                (lastName && patientName.includes(lastName)) ||
                                (mobile && String(item.mobileNo).trim() === mobile)
                            );
                        });

                        console.log(this.filteredOptions);
                    });

            });

        });
    }

    createSearchForm() {
        return this.formBuilder.group({
            RegId: [''],
        });
    }

    createPesonalForm() {
        return this.formBuilder.group({
            RegId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            // PrefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            FirstName: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100),
                Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.noWhitespaceValidator()
            ]],
            MiddleName: ['', [
                Validators.maxLength(100),
                Validators.pattern("^[A-Za-z/() ]*$"),
                this._FormvalidationserviceService.allowEmptyStringValidator()
            ]],
            LastName: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100),
                Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.noWhitespaceValidator()
            ]],
            GenderId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            Address: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(200)]],
            DateOfBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            aadharCardNo: [''],
            MobileNo: [''],

            abhaNumber: [],
            abhaAddress: []
        });
    }

    fetchGenderlist(callback?: () => void) {
        const m_data =
        {
            "first": 0,
            "rows": 9999,
            "sortField": "genderId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "GenderName",
                    "fieldValue": "",
                    "opType": "StartsWith"
                },
                {
                    "fieldName": "isActive",
                    "fieldValue": "",
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }

        this._AppointmentlistService.getGenderId(m_data).subscribe(list => {
            this.genderList = list.data;
            console.log('uuuuuuuu:', this.genderList)
            if (callback) {
                callback();
            }
        });

    }

    loadQr() {
        this.abhaService.getQr(this.token, this.isAddress).subscribe((byteArray: string) => {
            this.qrUrl = `data:image/png;base64,${byteArray}`;
        });
    }

    arrayBufferToBase64(buffer: ArrayBuffer): string {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        bytes.forEach(b => binary += String.fromCharCode(b));
        return window.btoa(binary);
    }
    isLocked(key: string): boolean {
        return this.lockedFields.has(key);
    }
    /** DOB in dd-MM-yyyy format (as shown on the official ABHA card). */
    get formattedDob(): string {
        if (!this.profile) return '';
        return `${this.profile.dayOfBirth}-${this.profile.monthOfBirth}-${this.profile.yearOfBirth}`;
    }

    get genderLabel(): string {
        if (!this.profile) return '';
        return this.genderLabels[this.profile.gender] || this.profile.gender;
    }

    /** Localized gender (e.g. पुरुष / स्त्री) — falls back to "" if not provided */
    get localizedGender(): string {
        return this.profile?.localizedDetails?.gender || '';
    }

    /** Profile photo data URL */
    get profilePhotoSrc(): string | null {
        if (!this.profile || !this.profile.profilePhoto) return null;
        return `data:image/jpeg;base64,${this.profile.profilePhoto}`;
    }

    get kycPhotoSrc(): string | null {
        if (!this.profile || !this.profile.kycPhoto) return null;
        return `data:image/jpeg;base64,${this.profile.kycPhoto}`;
    }

    /** Status badge color */
    statusColor(status: string): string {
        switch (status) {
            case 'ACTIVE':
                return 'green';
            case 'INACTIVE':
            case 'DEACTIVATED':
                return 'red';
            case 'SUSPENDED':
                return 'orange';
            default:
                return 'gray';
        }
    }

    setCardSide(side: 'front' | 'back'): void {
        this.cardSide = side;
    }

    flipCard(): void {
        this.cardSide = this.cardSide === 'front' ? 'back' : 'front';
    }


    onDownload(): void {
        if (!this.profile) return;
        this.abhaService.downloadCard(this.token).subscribe((r) => {
        });
    }

    onReset(): void {
        this.reset.emit();
    }
    copyToClipboard(text: string): void {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }
    }

    getSelectedObj(obj) {
        if ((obj.regId ?? 0) > 0) {
            if (!obj || !obj.regId) {
                this.showCard = false;
                // this.registerObj = null;
                return;
            }

            console.log("Selected Patient:", obj);
            this.showCard = true
            this.fullname = obj.patientName

            this._AppointmentlistService.getAbhaById(obj.abhaTranId).subscribe((response) => {
                this.abhaNumber=response.abhaNumber
                this.abhaAddress=response.abhaAddress
            });

            setTimeout(() => {
                this._AppointmentlistService.getRegistraionById(obj.regId).subscribe((response) => {
                    this.registerObj = response;
                    console.log("Registration Data:", this.registerObj)
                    this.dob = this.registerObj.dateofBirth
                    const dob = new Date(this.registerObj.dateofBirth);

                    this.dobSeparate = {
                        day: String(dob.getDate()).padStart(2, '0'),
                        month: String(dob.getMonth() + 1).padStart(2, '0'),
                        year: dob.getFullYear()
                    };

                    this._AppointmentlistService.getGenderbyId(this.registerObj.genderId).subscribe((response) => {
                        this.genderN = response.genderName;
                    });

                    this._AppointmentlistService.getCityId(this.registerObj.cityId).subscribe((response) => {
                        this.cityN = response.cityName;
                    });

                    this._AppointmentlistService.getstateId(this.registerObj.stateId).subscribe((response) => {
                        this.stateN = response.stateName;
                    });

                });
            }, 100);
        }
    }

    onNewregistration(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        const that = this;
        const dialogRef = this._matDialog.open(NewRegistrationComponent,
            {
                maxWidth: "95vw",
                maxHeight: '95%',
                width: '90%',
                data: {
                    profile: this.profile
                }
            });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    OnEditRegistration() {
        const dialogRef = this._matDialog.open(
            NewRegistrationComponent,
            {
                maxWidth: "95vw",
                maxHeight: '95%',
                width: '94%',
                data: {
                    patient: this.registerObj,
                    profile: this.profile
                }
            }
        );
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    onChangeDateofBirth(DateOfBirth: Date) {

        if (DateOfBirth > this.minDate) {
            this.toastr.warning('Enter Proper Birth Date..', 'warning !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
            return;
        }
        if (DateOfBirth) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth);
            const timeDiff = Math.abs(Date.now() - dob.getTime());

            this.ageYear = todayDate.getFullYear() - dob.getFullYear();
            this.ageMonth = (todayDate.getMonth() - dob.getMonth());
            this.ageDay = (todayDate.getDate() - dob.getDate());

            if (this.ageDay < 0) {
                this.ageMonth--;
                const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
                this.ageDay += previousMonth.getDate(); // Days in previous month
                // this.ageDay =this.ageDay +1;
            }

            if (this.ageMonth < 0) {
                this.ageYear--;
                this.ageMonth += 12;
            }

            this.value = DateOfBirth;
            this.personalFormGroup.get('DateOfBirth').setValue(DateOfBirth);
            if (this.ageYear > 110)
                this.toastr.warning('Please Enter Valid BirthDate..', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
        }
    }

    onChangePrefix(e) {
        this.ddlGender.SetSelection(e.sexId);
    }

    onSelectPatient(row: any) {
        this.getSelectedObj(row);
        this.selectedRow = row;
    }
    resetFilteredOptions() {
        this.filteredOptions = [];
        this.prevResults = [];
    }

}
