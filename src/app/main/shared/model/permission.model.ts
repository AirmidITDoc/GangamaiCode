export enum permissionType {
    Add = 1, Edit = 2, Delete = 3, View = 4, Export = 5
}
export enum permissionCodes {
    Prefix = 'Prefix',
    Gender = 'Gender',
    RelationshipMaster = 'RelationshipMaster',
    CityMaster = 'CityMaster',
    StateMaster = 'StateMaster',
    CountryMaster = 'CountryMaster',
    ReligionMaster = 'ReligionMaster',
    MaritalStatusMaster = 'MaritalStatusMaster',
    AreaMaster = 'AreaMaster',
    PatientType = 'PatientType',
    Hospital = 'HospitalMaster',
    TalukaMaster = 'TalukaMaster',
    VillageMaster = 'VillageMaster',
    HospitalMaster = 'HospitalMaster',
    CampMaster = 'CampMaster',
    QuestionMaster = 'QuestionMaster',
    AdmissionType='AdmissionType',


    //  BillingMaster
    BankMaster = 'BankMaster',
    ClassMaster = 'ClassMaster',
    CashCounter = 'CashCounter',
    CompanyMaster = 'CompanyMaster',
    CompanyTypeMaster = 'CompanyTypeMaster',
    ConcessionReasonMaster = 'ConcessionReasonMaster',
    CreditReasonMaster = 'CreditReasonMaster',
    GroupMaster = 'GroupMaster',
    BillingServiceMaster = 'BillingServiceMaster',
    SubGroupMaster = 'SubGroupMaster',
    SubTpacompanyMaster = 'SubTpacompanyMaster',
    TariffMaster = 'TariffMaster',
    CompanyRepresentative = 'CompanyRepresentative',

    //Department 

    BedMaster = 'BedMaster',
    DepartmentMaster = 'DepartmentMaster',
    DischargeMaster = 'DischargeMaster',
    LocationMaster = 'LocationMaster',
    WardMaster = 'WardMaster',

    //    DoctorMaster
    DoctorMaster = 'DoctorMaster',
    DoctorTypeMaster = 'DoctorTypeMaster',

    // Inventory

    CurrencyMaster = 'CurrencyMaster',
    ItemCategoryMaster = 'ItemCategoryMaster',
    ItemClassMaster = 'ItemClassMaster',
    ItemCompanyMaster = 'ItemCompanyMaster',
    GenericMaster = 'GenericMaster',
    ItemMaster = 'ItemMaster',
    ItemTypeMaster = 'ItemTypeMaster',
    ItemManufactureMaster = 'ItemManufactureMaster',
    ModeOfPayment = 'ModeOfPayment',
    StoreMaster = 'StoreMaster',
    SupplierMaster = 'SupplierMaster',
    TaxMaster = 'TaxMaster',
    TermsofPayment = 'TermsofPayment',
    UnitOfMeasurement = 'UnitOfMeasurement',
    // TaxMaster = 'TaxMaster',

    // Prescription Master
    Prescription = 'Prescription',
    NursingPrescription= 'NursingPrescription',
    PGenericMaster = 'GenericMaster',
    DrugMaster = 'DrugMaster',
    DoseMaster = 'DoseMaster',
    CertificateTemplateMaster = 'CertificateTemplateMaster',
    InstructionMaster = 'InstructionMaster',
    PrescriptionTemplate = 'PrescriptionTemplate',

    // Radiology Master
    RadiologyCategoryMaster = 'RadiologyCategoryMaster',
    RadiologyTemplateMaster = 'RadiologyTemplateMaster',
    RadiologyTestMaster = 'RadiologyTestMaster',

    // Ambulance Master
    VehicleMaster = 'VehicleMaster',

    // Nursing master
    Nursing = 'Nursing',

    // Ot Master
    SetupOtManagment = 'SetupOtManagment',

    //Pathology

    PathCategoryMaster = 'SetupOtManagment',
    TemplateMaster = 'TemplateMaster',
    TestMaster = 'TestMaster',
    PathUnitMaster = 'PathUnitMaster',
    MOutSourcelabMaster = 'MOutSourcelabMaster',
    SpecimenMaster = 'SpecimenMaster',

    // OPD
    Appointment = 'Appointment',
    Registration = 'Registration',
    Refund = 'Refund',
    Advance = 'Advance',
    Bill = 'Bill',
    MedicalRecords='MedicalRecords',
    GastrologyCasePaper='GastrologyCasePaper',
    CheckIn='CheckIn',
    CheckOut='CheckOut',

    // IPD?
    Admission = 'Admission',

    // OT?
    OTReservation = 'OTReservation',
    ConsentMaster = 'ConsentMaster',

    //Nursing Station
    NursingConsent = 'NursingConsent',
    NursingNote='NursingNote',
    DoctorNote='DoctorNote',

    //Pathology
    SamplecollectionList = 'SamplecollectionList',
    PathologyResultlist = 'PathologyResultlist',
    Pathology = 'Pathology',
    ReportDispatch = 'ReportDispatch',

    //Radiology
    RadiologyList = 'RadiologyList',

    // External lab
    LabPatientRegistration = 'LabPatientRegistration',
    ExternalInvestigation = 'ExternalInvestigation',

    // Purchase
    PurchaseOrder = 'PurchaseOrder',
    OpeningBalance = 'OpeningBalance',
    GRN = 'GRN',
    GRNReturn = 'GRNReturn',
    WorkOrder = 'WorkOrder',

    // Inventory
    IssueToDepartment = 'IssueToDepartment',
    MaterialConsumption = 'MaterialConsumption',
    // WorkOrder = 'WorkOrder',
    Indent = 'Indent',
    TallyInterface='TallyInterface',

    // Pharmacy?
    Sales='Sales'
}