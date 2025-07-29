export class ConfigSettingParams {
    ConfigId: number;
    PrintRegAfterReg: number;
    IPDPrefix: String;
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
    OPReceiptCounter: String;
    OPRefundOfBillCounter: String;
    IPAdvanceCounter: String;
    IPBillCounter: String
    IPReceiptCounter: any;
    IPRefundBillCounter: any;
    IPRefofAdvCounter: any
    RegPrefix: String;
    RegNo: String;
    IPPrefix: String;
    IPNo: String
    OPPrefix: String;
    OPNo: String
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
    chkPharmacyDue:any;
    G_IsPharmacyPaperSetting: any;
    PharmacyPrintName: String;
    G_PharmacyPaperName: String;
    G_IsOPPaperSetting: String;
    G_PharmacyPrintName: String
    G_OPPaperName: String
    TariffId: number;
    DepartmentId: number;
    DoctorId: number;
    G_IsIPPaperSetting: any;
    G_IPPrintName: String;
    G_IPPaperName: String;
    G_OPPrintName: String;
    IsOPSaleDisPer: any;
    OPSaleDisPer: number;
    IsIPSaleDisPer: any;
    IPSaleDisPer: number;
    SalesCounterId:number;
    SalesReturnCounterId:number;
    SalesReceiptCounterID:number;
    IsDischargeInitiateflow:any;
    IsDischargeTemplate:any;

    
OPDNo:any;
IsOPBillPrint:any;
PrintAfterRegistration:any;
AfterOPDAppointmentPopaddChargesForm:any
FirstNameMandatory:any;
MiddleNameMandatory:any;
LastNameMandatory:any;
AddressMandatory:any;
AgeMandatory:any;
PhoneNoMandatory:any;
PrintIPDAdmission:any;
AfterChargesPopPaymentForm:any;
OPSalesdisc:any;
GeneratedBillCash:any;
IPSalesdisc:any;
IsPathDoctorId:any;
IsPathDepartment:any;
AnesthetishId:any;
NeuroSurgeonId:any;
GeneralSurgeonId:any;
DateInterval:any;
DateIntervalDays:any;
MemberNoG:any;
BarCodeSeqNo:any;
PharStrId:any;
CompBillNo:any;
PharServiceIdToTranfer:any;
FilePathLocation:any;
IPNoEmg:any;
IPdayCareNo:any;
OPDDefaultDoctor:any;
OPDDefaultDepartment:any;
 /**
     * Constructor
     *
     * @param ConfigSettingParams
     */
     
    constructor(ConfigSettingParams) {
        this.ConfigId = ConfigSettingParams.ConfigId;
        this.PrintRegAfterReg =ConfigSettingParams.PrintRegAfterReg;
        this.IPDPrefix =ConfigSettingParams.IPDPrefix;
        this.OTCharges =ConfigSettingParams.OTCharges;
        this.PrintOPDCaseAfterVisit =ConfigSettingParams.PrintOPDCaseAfterVisit;
        this.PrintIPDAfterAdm =ConfigSettingParams.PrintIPDAfterAdm;
        this.PopOPBillAfterVisit =ConfigSettingParams.PopOPBillAfterVisit;
        this.PopPayAfterOPBill =ConfigSettingParams.PopPayAfterOPBill;
        this.GenerateOPBillInCashOption =ConfigSettingParams.GenerateOPBillInCashOption;
        this.MandatoryFirstName =ConfigSettingParams.MandatoryFirstName;
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
        this.SalesCounterId= ConfigSettingParams.SalesCounterId;
        this.SalesReturnCounterId = ConfigSettingParams.SalesReturnCounterId;
        this.SalesReceiptCounterID =ConfigSettingParams.SalesReceiptCounterID;
        this.IsDischargeInitiateflow =ConfigSettingParams.IsDischargeInitiateflow;
        this.IsDischargeTemplate=ConfigSettingParams.IsDischargeTemplate;


            
this.OPDNo=ConfigSettingParams.OPDNo;
this.IsOPBillPrint=ConfigSettingParams.IsOPBillPrint;
this.PrintAfterRegistration=ConfigSettingParams.PrintAfterRegistration;
this.AfterOPDAppointmentPopaddChargesForm=ConfigSettingParams.AfterOPDAppointmentPopaddChargesForm;
this.FirstNameMandatory=ConfigSettingParams.FirstNameMandatory;
this.MiddleNameMandatory=ConfigSettingParams.MiddleNameMandatory;
this.LastNameMandatory=ConfigSettingParams.LastNameMandatory;
this.AddressMandatory=ConfigSettingParams.AddressMandatory;
this.AgeMandatory=ConfigSettingParams.AgeMandatory;
this.PhoneNoMandatory=ConfigSettingParams.PhoneNoMandatory;
this.PrintIPDAdmission=ConfigSettingParams.PrintIPDAdmission;
this.AfterChargesPopPaymentForm=ConfigSettingParams.AfterChargesPopPaymentForm;
this.OPSalesdisc=ConfigSettingParams.OPSalesdisc;
this.GeneratedBillCash=ConfigSettingParams.GeneratedBillCash;
this.IsPathDoctorId=ConfigSettingParams.IsPathDoctorId;
this.IsPathDoctorId=ConfigSettingParams.IsPathDoctorId;
this.IsPathDepartment=ConfigSettingParams.IsPathDepartment;
this.AnesthetishId=ConfigSettingParams.AnesthetishId;
this.NeuroSurgeonId=ConfigSettingParams.NeuroSurgeonId;
this.GeneralSurgeonId=ConfigSettingParams.GeneralSurgeonId;
this.DateInterval=ConfigSettingParams.DateInterval;
this.DateIntervalDays=ConfigSettingParams.DateIntervalDays;
this.BarCodeSeqNo=ConfigSettingParams.BarCodeSeqNo;
this.PharStrId=ConfigSettingParams.PharStrId;
this.CompBillNo=ConfigSettingParams.CompBillNo;
this.PharServiceIdToTranfer=ConfigSettingParams.PharServiceIdToTranfer;
this.FilePathLocation=ConfigSettingParams.FilePathLocation;
this.IPNoEmg=ConfigSettingParams.IPNoEmg;
this.IPdayCareNo=ConfigSettingParams.IPdayCareNo;
this.OPDDefaultDoctor=ConfigSettingParams.OPDDefaultDoctor;
this.OPDDefaultDepartment=ConfigSettingParams.OPDDefaultDepartment;
    }

}