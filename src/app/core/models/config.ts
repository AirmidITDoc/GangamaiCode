export class ConfigSettingParams {
    ConfigId: number;
    PrintRegAfterReg: number;
    IPDPrefix: string;
    OTCharges: number;
    PrintOPDCaseAfterVisit: number;
    PrintIPDAfterAdm: number;
    PopOPBillAfterVisit: number;
    PopPayAfterOPBill: number;
    GenerateOPBillInCashOption: number;
    MandatoryFirstName: any;
    MandatoryMiddleName: any;
    MandatoryLastName: any;
    MandatoryAddress: any;
    MandatoryCity: any;
    MandatoryAge: number;
    MandatoryPhoneNo: any;
    OPBillCounter: any;
    OPReceiptCounter: string;
    OPRefundOfBillCounter: string;
    IPAdvanceCounter: string;
    IPBillCounter: string
    IPReceiptCounter: any;
    IPRefundBillCounter: any;
    IPRefofAdvCounter: any
    RegPrefix: string;
    RegNo: string;
    IPPrefix: string;
    IPNo: string
    OPPrefix: string;
    OPNo: string
    PathDepartment: number;
    IsPathologistDr: number;
    OPD_Billing_CounterId: number;
    OPD_Receipt_CounterId: number;
    OPD_Refund_Bill_CounterId: number;
    OPD_Advance_CounterId: number;
    OPD_Refund_Advance_CounterId: number;
    IPD_Advance_CounterId: number;
    IPD_Billing_CounterId: number;
    IPD_Receipt_CounterId: number;
    IPD_Refund_of_Bill_CounterId: number;
    IPD_Refund_of_Advance_CounterId: number;
    PatientTypeSelf: number;
    ClassForEdit: any;
    PharmacySales_CounterId: number;
    PharmacySalesReturn_CounterId: number;
    PharmacyReceipt_CounterId: number;
    ChkPharmacyDue: any;
    chkPharmacyDue: any;
    G_IsPharmacyPaperSetting: any;
    PharmacyPrintName: string;
    G_PharmacyPaperName: string;
    G_IsOPPaperSetting: string;
    G_PharmacyPrintName: string
    G_OPPaperName: string
    TariffId: number;
    DepartmentId: number;
    DoctorId: number;
    G_IsIPPaperSetting: any;
    G_IPPrintName: string;
    G_IPPaperName: string;
    G_OPPrintName: string;
    IsOPSaleDisPer: any;
    OPSaleDisPer: number;
    IsIPSaleDisPer: any;
    IPSaleDisPer: number;
    SalesCounterId: number;
    SalesReturnCounterId: number;
    SalesReceiptCounterID: number;
    IsDischargeInitiateflow: any;
    IsDischargeTemplate: any;
    SystemLogOutTime: any;
    IPDraftPrintA4toA5: any;
    IsDischargeSummaryTemplate: any;
    Is9_Digit_NationalId: any;
    CurrencyValue: any;
    OpBillSetCash: any;
    IsAddAutoCharges: any;
    OPDNo: any;
    IsOPBillPrint: any;
    PrintAfterRegistration: any;
    AfterOPDAppointmentPopaddChargesForm: any
    FirstNameMandatory: any;
    MiddleNameMandatory: any;
    LastNameMandatory: any;
    AddressMandatory: any;
    AgeMandatory: any;
    PhoneNoMandatory: any;
    PrintIPDAdmission: any;
    AfterChargesPopPaymentForm: any;
    OPSalesdisc: any;
    GeneratedBillCash: any;
    IPSalesdisc: any;
    IsPathDoctorId: any;
    IsPathDepartment: any;
    AnesthetishId: any;
    NeuroSurgeonId: any;
    GeneralSurgeonId: any;
    DateInterval: any;
    DateIntervalDays: any;
    MemberNoG: any;
    BarCodeSeqNo: any;
    PharStrId: any;
    CompBillNo: any;
    PharServiceIdToTranfer: any;
    FilePathLocation: any;
    IPNoEmg: any;
    IPdayCareNo: any;
    OPDDefaultDoctor: any;
    OPDDefaultDepartment: any;
    ThermalPrint: any;
    InterimBillA5Print: any;
    OPEmrPrescriptionA5: any;
    IsIndentVerify: any
    IsMaterialAcceptDirect: any
    IsMaterialAcceptAgainstIndent: any
    IsMaterialAccept: any;
    IsOPBillProceed: any;
  

    /**
        * Constructor
        *
        * @param ConfigSettingParams
        */

    constructor(ConfigSettingParams) {
        this.ConfigId = ConfigSettingParams.ConfigId;
        this.PrintRegAfterReg = ConfigSettingParams.PrintRegAfterReg;
        this.IPDPrefix = ConfigSettingParams.IPDPrefix;
        this.OTCharges = ConfigSettingParams.OTCharges;
        this.PrintOPDCaseAfterVisit = ConfigSettingParams.PrintOPDCaseAfterVisit;
        this.PrintIPDAfterAdm = ConfigSettingParams.PrintIPDAfterAdm;
        this.PopOPBillAfterVisit = ConfigSettingParams.PopOPBillAfterVisit;
        this.PopPayAfterOPBill = ConfigSettingParams.PopPayAfterOPBill;
        this.GenerateOPBillInCashOption = ConfigSettingParams.GenerateOPBillInCashOption;
        this.MandatoryFirstName = ConfigSettingParams.MandatoryFirstName;
        this.MandatoryMiddleName = ConfigSettingParams.MandatoryMiddleName;
        this.MandatoryLastName = ConfigSettingParams.MandatoryLastName;
        this.MandatoryAddress = ConfigSettingParams.MandatoryAddress;
        this.MandatoryCity = ConfigSettingParams.MandatoryCity;
        this.MandatoryAge = ConfigSettingParams.MandatoryAge;
        this.MandatoryPhoneNo = ConfigSettingParams.MandatoryPhoneNo;
        this.OPBillCounter = ConfigSettingParams.OPBillCounter;
        this.OPReceiptCounter = ConfigSettingParams.OPReceiptCounter;
        this.OPRefundOfBillCounter = ConfigSettingParams.OPRefundOfBillCounter;
        this.IPAdvanceCounter = ConfigSettingParams.IPAdvanceCounter;
        this.IPBillCounter = ConfigSettingParams.IPBillCounter;
        this.IPReceiptCounter = ConfigSettingParams.IPReceiptCounter;
        this.IPRefundBillCounter = ConfigSettingParams.IPRefundBillCounter;
        this.IPRefofAdvCounter = ConfigSettingParams.IPRefofAdvCounter;
        this.RegNo = ConfigSettingParams.RegNo;
        this.RegPrefix = ConfigSettingParams.RegPrefix;
        this.IPPrefix = ConfigSettingParams.IPPrefix;
        this.IPNo = ConfigSettingParams.IPNo;
        this.OPPrefix = ConfigSettingParams.OPPrefix;
        this.OPNo = ConfigSettingParams.OPNo;
        this.PathDepartment = ConfigSettingParams.PathDepartment;
        this.IsPathologistDr = ConfigSettingParams.IsPathologistDr;
        this.OPD_Billing_CounterId = ConfigSettingParams.OPD_Billing_CounterId;
        this.OPD_Receipt_CounterId = ConfigSettingParams.OPD_Receipt_CounterId;
        this.OPD_Refund_Bill_CounterId = ConfigSettingParams.OPD_Refund_Bill_CounterId;
        this.OPD_Advance_CounterId = ConfigSettingParams.OPD_Advance_CounterId;
        this.OPD_Refund_Advance_CounterId = ConfigSettingParams.OPD_Refund_Advance_CounterId;
        this.IPD_Advance_CounterId = ConfigSettingParams.IPD_Advance_CounterId;
        this.IPD_Billing_CounterId = ConfigSettingParams.IPD_Billing_CounterId;
        this.IPD_Receipt_CounterId = ConfigSettingParams.IPD_Receipt_CounterId;
        this.IPD_Refund_of_Bill_CounterId = ConfigSettingParams.IPD_Refund_of_Bill_CounterId;
        this.IPD_Refund_of_Advance_CounterId = ConfigSettingParams.IPD_Refund_of_Advance_CounterId;
        this.PatientTypeSelf = ConfigSettingParams.PatientTypeSelf;
        this.ClassForEdit = ConfigSettingParams.ClassForEdit;
        this.PharmacySales_CounterId = ConfigSettingParams.PharmacySales_CounterId;
        this.PharmacySalesReturn_CounterId = ConfigSettingParams.PharmacySalesReturn_CounterId;
        this.PharmacyReceipt_CounterId = ConfigSettingParams.PharmacyReceipt_CounterId;
        this.ChkPharmacyDue = ConfigSettingParams.ChkPharmacyDue;
        this.chkPharmacyDue = ConfigSettingParams.chkPharmacyDue;
        this.G_IsPharmacyPaperSetting = ConfigSettingParams.G_IsPharmacyPaperSetting;
        this.PharmacyPrintName = ConfigSettingParams.PharmacyPrintName;
        this.G_PharmacyPaperName = ConfigSettingParams.G_PharmacyPaperName;
        this.G_IsOPPaperSetting = ConfigSettingParams.G_IsOPPaperSetting;
        this.G_PharmacyPrintName = ConfigSettingParams.G_PharmacyPrintName;
        this.G_OPPaperName = ConfigSettingParams.G_OPPaperName;
        this.TariffId = ConfigSettingParams.TariffId;
        this.DepartmentId = ConfigSettingParams.DepartmentId;
        this.DoctorId = ConfigSettingParams.DoctorId;
        this.G_IsIPPaperSetting = ConfigSettingParams.G_IsIPPaperSetting;
        this.G_IPPrintName = ConfigSettingParams.G_IPPrintName;
        this.G_IPPaperName = ConfigSettingParams.G_IPPaperName;
        this.G_OPPrintName = ConfigSettingParams.G_OPPrintName;
        this.IsOPSaleDisPer = ConfigSettingParams.IsOPSaleDisPer;
        this.OPSaleDisPer = ConfigSettingParams.OPSaleDisPer;
        this.IsIPSaleDisPer = ConfigSettingParams.IsIPSaleDisPer;
        this.IPSaleDisPer = ConfigSettingParams.IPSaleDisPer;
        this.SalesCounterId = ConfigSettingParams.SalesCounterId;
        this.SalesReturnCounterId = ConfigSettingParams.SalesReturnCounterId;
        this.SalesReceiptCounterID = ConfigSettingParams.SalesReceiptCounterID;
        this.IsDischargeInitiateflow = ConfigSettingParams.IsDischargeInitiateflow;
        this.IsDischargeTemplate = ConfigSettingParams.IsDischargeTemplate;
        this.SystemLogOutTime = ConfigSettingParams.SystemLogOutTime;
        this.IPDraftPrintA4toA5 = ConfigSettingParams.IPDraftPrintA4toA5;
        this.ThermalPrint = ConfigSettingParams.ThermalPrint;
        this.InterimBillA5Print = ConfigSettingParams.InterimBillA5Print;
        this.Is9_Digit_NationalId = ConfigSettingParams.Is9_Digit_NationalId;
        this.CurrencyValue = ConfigSettingParams.CurrencyValue;
        this.OpBillSetCash = ConfigSettingParams.OpBillSetCash;

        this.OPDNo = ConfigSettingParams.OPDNo;
        this.IsOPBillPrint = ConfigSettingParams.IsOPBillPrint;
        this.PrintAfterRegistration = ConfigSettingParams.PrintAfterRegistration;
        this.AfterOPDAppointmentPopaddChargesForm = ConfigSettingParams.AfterOPDAppointmentPopaddChargesForm;
        this.FirstNameMandatory = ConfigSettingParams.FirstNameMandatory;
        this.MiddleNameMandatory = ConfigSettingParams.MiddleNameMandatory;
        this.LastNameMandatory = ConfigSettingParams.LastNameMandatory;
        this.AddressMandatory = ConfigSettingParams.AddressMandatory;
        this.AgeMandatory = ConfigSettingParams.AgeMandatory;
        this.PhoneNoMandatory = ConfigSettingParams.PhoneNoMandatory;
        this.PrintIPDAdmission = ConfigSettingParams.PrintIPDAdmission;
        this.AfterChargesPopPaymentForm = ConfigSettingParams.AfterChargesPopPaymentForm;
        this.OPSalesdisc = ConfigSettingParams.OPSalesdisc;
        this.GeneratedBillCash = ConfigSettingParams.GeneratedBillCash;
        this.IsPathDoctorId = ConfigSettingParams.IsPathDoctorId;
        this.IsPathDoctorId = ConfigSettingParams.IsPathDoctorId;
        this.IsPathDepartment = ConfigSettingParams.IsPathDepartment;
        this.AnesthetishId = ConfigSettingParams.AnesthetishId;
        this.NeuroSurgeonId = ConfigSettingParams.NeuroSurgeonId;
        this.GeneralSurgeonId = ConfigSettingParams.GeneralSurgeonId;
        this.DateInterval = ConfigSettingParams.DateInterval;
        this.DateIntervalDays = ConfigSettingParams.DateIntervalDays;
        this.BarCodeSeqNo = ConfigSettingParams.BarCodeSeqNo;
        this.PharStrId = ConfigSettingParams.PharStrId;
        this.CompBillNo = ConfigSettingParams.CompBillNo;
        this.PharServiceIdToTranfer = ConfigSettingParams.PharServiceIdToTranfer;
        this.FilePathLocation = ConfigSettingParams.FilePathLocation;
        this.IPNoEmg = ConfigSettingParams.IPNoEmg;
        this.IPdayCareNo = ConfigSettingParams.IPdayCareNo;
        this.OPDDefaultDoctor = ConfigSettingParams.OPDDefaultDoctor;
        this.OPDDefaultDepartment = ConfigSettingParams.OPDDefaultDepartment;
        this.OPEmrPrescriptionA5 = ConfigSettingParams.OPEmrPrescriptionA5;
        this.IsDischargeSummaryTemplate = ConfigSettingParams.IsDischargeSummaryTemplate;
        this.IsIndentVerify = ConfigSettingParams.IsIndentVerify;
        this.IsMaterialAcceptDirect = ConfigSettingParams.IsMaterialAcceptDirect;
        this.IsMaterialAcceptAgainstIndent = ConfigSettingParams.IsMaterialAcceptAgainstIndent;
        this.IsMaterialAccept = ConfigSettingParams.IsMaterialAccept;
        this.IsOPBillProceed = ConfigSettingParams.IsOPBillProceed;

           }

}

export class DashConfigSettingParams {
      IsDailyDashboard: any;
    IsBedAccupancyDashboard: any;
    IsCashlessDashboard: any;
    IsPharmacy: any;
    IsFinancialDashboard: any;
    IsInvestigation: any;
    IsLabFinancialDashboard: any;

      /**
        * Constructor
        *
        * @param DashConfigSettingParams
        */

    constructor(DashConfigSettingParams) {

        this.IsDailyDashboard = DashConfigSettingParams.IsDailyDashboard;
        this.IsBedAccupancyDashboard = DashConfigSettingParams.IsBedAccupancyDashboard;
        this.IsInvestigation = DashConfigSettingParams.IsInvestigation;
        this.IsCashlessDashboard = DashConfigSettingParams.IsCashlessDashboard;
        this.IsPharmacy = DashConfigSettingParams.IsPharmacy;
        this.IsFinancialDashboard = DashConfigSettingParams.IsFinancialDashboard;
        this.IsLabFinancialDashboard = DashConfigSettingParams.IsLabFinancialDashboard;


    }

}


export class HospitalConfigSettingParams {
    HospitalId: number;
    HospitalHeaderLine: string;
    HospitalName: string;
    HospitalAddress: string;
    City: string;
    Pin: string;
    Phone: string;
    EmailID: string;
    WebSiteInfo: string;
    Header: string;
    IsActive: any;
    OPD_Billing_CounterId: number;
    OPD_Receipt_CounterId: number;
    OPD_Refund_Bill_CounterId: number;
    OPD_Refund_Bill_Receipt_CounterId: number;
    OPD_Advance_CounterId: number;
    OPD_Refund_Advance_CounterId: number;
    IPD_Advance_CounterId: number
    IPD_Advance_Receipt_CounterId: number;
    IPD_Billing_CounterId: number;
    IPD_Receipt_CounterId: number
    IPD_Refund_of_Bill_CounterId: number;
    IPD_Refund_of_Bill_Receipt_CounterId: number;
    IPD_Refund_of_Advance_Receipt_CounterId: number;
    CreatedBy: number
    CreatedDate: number;
    ModifiedBy: number
    ModifiedDate: number;
    CityId: number;
    /**
        * Constructor
        *
        * @param HospitalConfigSettingParams
        */

    constructor(HospitalConfigSettingParams) {
        this.HospitalId = HospitalConfigSettingParams.HospitalId;
        this.HospitalHeaderLine = HospitalConfigSettingParams.HospitalHeaderLine;
        this.HospitalName = HospitalConfigSettingParams.HospitalName;
        this.HospitalAddress = HospitalConfigSettingParams.HospitalAddress;
        this.City = HospitalConfigSettingParams.City;
        this.Pin = HospitalConfigSettingParams.Pin;
        this.Phone = HospitalConfigSettingParams.Phone;
        this.EmailID = HospitalConfigSettingParams.EmailID;
        this.WebSiteInfo = HospitalConfigSettingParams.WebSiteInfo;
        this.Header = HospitalConfigSettingParams.Header;
        this.IsActive = HospitalConfigSettingParams.IsActive;
        this.CityId = HospitalConfigSettingParams.CityId;
        this.ModifiedDate = HospitalConfigSettingParams.ModifiedDate;
        this.ModifiedBy = HospitalConfigSettingParams.ModifiedBy;
        this.CreatedDate = HospitalConfigSettingParams.CreatedDate;
        this.CreatedBy = HospitalConfigSettingParams.CreatedBy;
        this.OPD_Billing_CounterId = HospitalConfigSettingParams.OPD_Billing_CounterId;
        this.OPD_Receipt_CounterId = HospitalConfigSettingParams.OPD_Receipt_CounterId;
        this.OPD_Refund_Bill_CounterId = HospitalConfigSettingParams.OPD_Refund_Bill_CounterId;
        this.OPD_Refund_Bill_Receipt_CounterId = HospitalConfigSettingParams.OPD_Refund_Bill_Receipt_CounterId;
        this.OPD_Advance_CounterId = HospitalConfigSettingParams.OPD_Advance_CounterId;
        this.OPD_Refund_Advance_CounterId = HospitalConfigSettingParams.OPD_Refund_Advance_CounterId;
        this.IPD_Advance_CounterId = HospitalConfigSettingParams.IPD_Advance_CounterId;
        this.IPD_Advance_Receipt_CounterId = HospitalConfigSettingParams.IPD_Advance_Receipt_CounterId;
        this.IPD_Billing_CounterId = HospitalConfigSettingParams.IPD_Billing_CounterId;
        this.IPD_Receipt_CounterId = HospitalConfigSettingParams.IPD_Receipt_CounterId;
        this.IPD_Refund_of_Bill_CounterId = HospitalConfigSettingParams.IPD_Refund_of_Bill_CounterId;
        this.IPD_Refund_of_Bill_Receipt_CounterId = HospitalConfigSettingParams.IPD_Refund_of_Bill_Receipt_CounterId;
        this.IPD_Refund_of_Advance_Receipt_CounterId = HospitalConfigSettingParams.IPD_Refund_of_Advance_Receipt_CounterId;
    }

}

export class ConfigSettingUserAccessParams {
    LoginAccessId: any;
    LoginId: any;
    AccessValueId: any;
    AccessValue: any;
    AccessInputValue: any;
    AccessValueName: any;
    /**
        * Constructor
        *
        * @param ConfigSettingUserAccessParams
        */

    constructor(ConfigSettingUserAccessParams) {
        this.LoginAccessId = ConfigSettingUserAccessParams.LoginAccessId;
        this.LoginId = ConfigSettingUserAccessParams.LoginId;
        this.AccessValueId = ConfigSettingUserAccessParams.AccessValueId;
        this.AccessValue = ConfigSettingUserAccessParams.AccessValue;
        this.AccessInputValue = ConfigSettingUserAccessParams.AccessInputValue;
        this.AccessValueName = ConfigSettingUserAccessParams.AccessValueName
    }

}
