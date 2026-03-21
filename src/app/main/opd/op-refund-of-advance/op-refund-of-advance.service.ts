import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class OpRefundOfAdvanceService {

    myFilterform: FormGroup;
    myRefundAdvanceForm: FormGroup;

    constructor(
        public _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _loaderService: LoaderService,
    ) {
        this.myFilterform = this.filterForm();
        this.myRefundAdvanceForm = this.refundAdvanceForm();
    }

    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: '',
            OPDNo: '',
            FirstName: ['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
            MiddleName: ['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
            LastName: ['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
            MobileNo: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10),]],
            searchDoctorId: '0',
            DoctorName: '',
            IsDischarge: [0],
            WardId: '0',
            RoomName: '',
            fromDate: [],
            enddate: [],
            DischargeId: [''],
        });
    }

    refundAdvanceForm(): FormGroup {
        return this._formBuilder.group({
            AdmissionId: '',
            RegNo: '',
            PatientName: '',
            DOA: '',
            DOT: '',
            BedNo: '',
            DoctorId: '0',
            DoctorName: '',
            WardId: '0',
            RoomName: '',
            DischargeSummaryId: '',
            DischargeId: '',
            History: '',
            Diagnosis: '',
            Investigation: '',
            ClinicalFinding: '',
            OpertiveNotes: '',
            TreatmentGiven: '',
            TreatmentAdvisedAfterDischarge: '',
            Followupdate: '',
            Remark: '',
            DischargeSummaryDate: '',
            OPDate: '',
            OPTime: '',
            DischargeDoctor1: '',
            DischargeDoctor2: '',
            DischargeDoctor3: '',
            DischargeSummaryTime: '',
            DoctorAssistantName: '',
            ClaimNumber: '',
            PreOthNumber: '',
            AddedBy: '',
            AddedByDate: '',
            SurgeryProcDone: '',
            ICD10CODE: '',
            ClinicalConditionOnAdmisssion: '',
            OtherConDrOpinions: '',
            ConditionAtTheTimeOfDischarge: '',
            PainManagementTechnique: '',
            LifeStyle: '',
            WarningSymptoms: '',
            Radiology: '',
            IsNormalOrDeath: '',
            DoctorName1: '',
            DoctorIdOne: '',
            DoctorIdTwo: ''
        });
    }

    public getRefundofAdvanceList(Id) {
        return this._httpClient.PostData("Advance/PatientRefundOfAdvancesList", Id);
    }

    public getRegistraionById(Id) {
        return this._httpClient.GetData("OutPatient/" + Id);
    }
}
