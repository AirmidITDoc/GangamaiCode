import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { profile } from 'console';
import { NewAbhaIntegrationService } from '../new-abha-integration.service';
import { fuseAnimations } from '@fuse/animations';


@Component({
  selector: 'app-abha-patient-card',
  templateUrl: './abha-patient-card.component.html',
  styleUrls: ['./abha-patient-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AbhaPatientCardComponent {

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
    'abhaLinked',
    'regNo',
    'patientName',
    'Gender',
    'mobileNo',
    'DOB'
    // 'action'
  ];

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
  showRegBtn = true;
  showLinkAbha = false;
  showUpdateAbha = false;
  profile?: AbhaProfile;
  @Output() reset = new EventEmitter<void>();
  authMethodMeta = AUTH_METHOD_LABELS;
  genderLabels = GENDER_LABELS;
  qrUrl: string = '';
  lockedFields = new Set(['name', 'ABHANumber', 'preferredAbhaAddress', 'dob', 'gender']);
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  tableHeight = 0;

  constructor(private abhaService: NewAbhaIntegrationService, private formBuilder: FormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _AppointmentlistService: AppointmentlistService, public toastr: ToastrService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.updateTableHeight();
  }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();

    this.personalFormGroup = this.createPesonalForm();

    if (this.data) {
      this.loadPatientTable(this.data);
      console.log(this.data)

      const jsonData = JSON.parse(this.data.json);

      console.log("JSOn Data:", jsonData);
      this.profile = jsonData
    }

  }

  updateTableHeight(): void {
    // Wait a tick so the table has finished rendering rows
    setTimeout(() => {
      if (this.tableContainer) {
        this.tableHeight = this.tableContainer.nativeElement.offsetHeight;
        this.cdr.detectChanges();
      }
    });
  }

  loadPatientTable(data: any = null) {
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

          // First filter by your existing conditions
          const searchName = (this.profile.firstName || '').trim().toUpperCase();

          const matchedRecords = this.prevResults.filter(item => {
            const patientName = (item.patientName || '').trim().toUpperCase();
            return searchName ? patientName.includes(searchName) : false;
          });

          // Check whether any record has ABHA linked
          const abhaRecords = matchedRecords.filter(x => x.abhaTranId > 0);

          // If ABHA records exist, show only them; otherwise show all matched records
          this.filteredOptions = abhaRecords.length > 0 ? abhaRecords : matchedRecords;

          const abhaRow = this.filteredOptions.find(x => x.abhaTranId > 0);
          const defaultRow = abhaRow || this.filteredOptions[0];

          if (defaultRow) {
            this.selectedRow = defaultRow;
            this.onSelectPatient(defaultRow);
          }
          // if (abhaRow) {
          //   this.selectedRow = abhaRow;
          //   this.onSelectPatient(abhaRow);
          // }
          console.log(this.filteredOptions);
        });

    });
  }

  getSelectedObj(obj) {
    // debugger

    if ((obj.regId ?? 0) > 0) {
      if (!obj || !obj.regId) {
        this.showCard = false;
        return;
      }

      console.log("Selected Patient:", obj);
      this.showCard = true
      this.showUpdateAbha = false;
      this.showLinkAbha = true;
      this.showRegBtn = true;
      this.fullname = obj.patientName

      // this.abhaService.getAbhaTransactionIdList(this.data?.transactionId).subscribe({
      //   next: (response: any) => {
      //     console.log('GET RESPONSE:', response);
      //     // this.abhaNumber = response.abhaNumber
      //     // this.abhaAddress = response.sbxId

      //     if (this.data.abhaNumber === this.abhaNumber) {
      //       // Same ABHA -> Show Update button only
      //       this.showUpdateAbha = true;
      //       this.showLinkAbha = false;
      //       this.showRegBtn = false
      //     } else {
      //       // Different ABHA -> Show Link ABHA
      //       this.showUpdateAbha = false;
      //       this.showLinkAbha = true;
      //       this.showRegBtn = true;
      //     }
      //   },
      //   error: (error) => {
      //     console.error('Get API Error:', error);
      //   }
      // })

      this._AppointmentlistService.getAbhaById(obj.abhaTranId).subscribe((response) => {
        this.abhaNumber = response.abhaNumber
        this.abhaAddress = response.abhaAddress

        if (this.profile.abhaNumber === this.abhaNumber) {
          // Same ABHA -> Show Update button only
          this.showUpdateAbha = true;
          this.showLinkAbha = false;
          this.showRegBtn = false
        } else {
          // Different ABHA -> Show Link ABHA
          this.showUpdateAbha = false;
          this.showLinkAbha = true;
          this.showRegBtn = true;
        }
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

  get dobSeparate1(): { day: string; month: string; year: string } {
    if (!this.profile?.dob) {
      return { day: '', month: '', year: '' };
    }
    const [year, month, day] = this.profile.dob.split('-');
    return { day, month, year };
  }

  get genderLabel(): string {
    if (!this.profile) return '';
    return this.genderLabels[this.profile.gender] || this.profile.gender;
  }

  get abhaPhotoSrc(): string | null {
    const photo = this.profile?.photo;
    if (!photo) return null;

    // If the API already returns a full data URL, use it as is
    return photo.startsWith('data:')
      ? photo
      : `data:image/jpeg;base64,${photo}`;
  }

  onPhotoError() {
    // Optional: hide or replace the broken image
    if (this.profile) this.profile.photo = null;
  }

  createSearchForm() {
    return this.formBuilder.group({
      RegId: [''],
    });
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
          profile: this.data
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.loadPatientTable();
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
      this.loadPatientTable();
    });
  }

  OnContinueAbha() {
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
      this.loadPatientTable();
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

  onReset(): void {
    this.reset.emit();
  }

  copyToClipboard(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
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

}
