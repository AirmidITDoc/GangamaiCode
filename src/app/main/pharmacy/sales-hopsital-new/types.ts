export enum PatientType {
  EXTERNAL = 'External',
  OP = 'OP',
  IP = 'IP',
}
export class Printsal {
  PatientName: any;
  RegNo: any;
  ItemShortName: any;
  SalesId: any;
  StoreName: any;
  IP_OP_Number: any;
  DoctorName: any;
  SalesNo: any;
  Date: Date;
  Time: Date;
  ItemName: any;
  OP_IP_Type: any;
  GenderName: any;
  AgeYear: any;
  BatchNo: any;
  BatchExpDate: any;
  UnitMRP: any;
  Qty: any;
  TotalAmount: any;
  GrossAmount: any;
  NetAmount: any;
  RoundNetAmt: any;
  VatPer: any;
  VatAmount: any;
  DiscAmount: any;
  ConcessionReason: any;
  PaidAmount: any;
  BalanceAmount: any;
  UserName: any;
  HSNcode: any;
  CashPayAmount: any;
  CardPayAmount: any;
  ChequePayAmount: any;
  PayTMAmount: any;
  NEFTPayAmount: any;

  CardNo: any;
  ChequeNo: any;
  PayTMTranNo: any;
  NEFTNo: any;

  GSTPer: any;
  GSTAmount: any;
  CGSTAmt: any;
  CGSTPer: any;
  SGSTPer: any;
  SGSTAmt: any;
  IGSTPer: any;
  IGSTAmt: any;
  ManufShortName: any;
  StoreNo: any;
  DL_NO: any;
  GSTIN: any;
  CreditReason: any;
  CompanyName: any;
  HTotalAmount: any;
  ExtMobileNo: any;
  StoreAddress: any;
  PayMode: any;
  MRNO: any;
  AdvanceUsedAmount: any;
  Label: any;
  ConversionFactor: any;
  TotalBillAmount: any;
  BalAmount: any;
  CashPay: any;
  ChequePay: any;
  CardPay: any;
  NEFTPay: any;
  OnlinePay: any;
  PrintStoreName: any;
  PatientType: any;
  BillVatAmount: any;
  BillDiscAmount: any;
  BillTotalAmount: any;
  HospitalMobileNo: any;
  HospitalEmailId: any;
  SalesReturnNo: any;
  RoundOff: any;

  Consructur(Printsal) {
    this.PatientName = Printsal.PatientName || '';
    this.RegNo = Printsal.RegNo || 0;
    this.IP_OP_Number = Printsal.OP_IP_Number || '';
    this.DoctorName = Printsal.DoctorName || '';
    this.Date = Printsal.Date || 0;
    this.Time = Printsal.Time || '';
    this.OP_IP_Type = Printsal.OP_IP_Type || '';
    this.GenderName = Printsal.GenderName || '';

    this.AgeYear = Printsal.AgeYear || '';
    this.BatchNo = Printsal.BatchNo || 0;
    this.BatchExpDate = Printsal.BatchExpDate || '';
    this.UnitMRP = Printsal.UnitMRP || '';
    this.Qty = Printsal.Qty || 0;
    this.TotalAmount = Printsal.TotalAmount || '';
    this.GrossAmount = Printsal.GrossAmount || '';
    this.NetAmount = Printsal.NetAmount || '';
    this.RoundNetAmt = Printsal.RoundNetAmt || '';
    this.VatPer = Printsal.VatPer || '';
    this.VatAmount = Printsal.VatAmount || 0;
    this.DiscAmount = Printsal.DiscAmount || '';
    this.ConcessionReason = Printsal.ConcessionReason || '';
    this.PaidAmount = Printsal.PaidAmount || 0;
    this.BalanceAmount = Printsal.BalanceAmount || '';
    this.UserName = Printsal.UserName || '';
    this.HSNcode = Printsal.HSNcode || '';

    this.CashPayAmount = Printsal.CashPayAmount || '';
    this.CardPayAmount = Printsal.CardPayAmount || 0;
    this.NEFTPayAmount = Printsal.NEFTPayAmount || '';
    this.PayTMAmount = Printsal.PayTMAmount || '';
    this.ChequePayAmount = Printsal.ChequePayAmount || 0;
    this.GSTPer = Printsal.GSTPer || '';
    this.GSTAmount = Printsal.GSTAmount || '';
    this.SGSTPer = Printsal.SGSTPer || '';
    this.SGSTAmt = Printsal.SGSTAmt || 0;
    this.CGSTPer = Printsal.CGSTPer || '';
    this.CGSTAmt = Printsal.CGSTAmt || '';
    this.IGSTPer = Printsal.IGSTPer || '';
    this.IGSTAmt = Printsal.IGSTAmt || '';
    this.StoreName = Printsal.StoreName || '';
    this.StoreNo = Printsal.StoreNo || '';
    this.DL_NO = Printsal.DL_NO || '';
    this.GSTIN = Printsal.GSTIN || '';
    this.CreditReason = Printsal.CreditReason || '';
    this.CompanyName = Printsal.CompanyName || '';
    this.ItemShortName = Printsal.ItemShortName || '';
    this.HTotalAmount = Printsal.HTotalAmount || '';
    this.ExtMobileNo = Printsal.ExtMobileNo || '';
    this.StoreAddress = Printsal.StoreAddress || '';
    this.PayMode = Printsal.PayMode || '';

    this.ItemShortName = Printsal.ItemShortName || '';
    this.HTotalAmount = Printsal.HTotalAmount || '';
    this.ExtMobileNo = Printsal.ExtMobileNo || '';
    this.StoreAddress = Printsal.StoreAddress || '';
    this.PayMode = Printsal.PayMode || '';
    this.MRNO = Printsal.MRNO || '';
    this.AdvanceUsedAmount = Printsal.PayMode || '';
    this.Label = Printsal.Label || ';';
    this.TotalBillAmount = Printsal.PayMode || '';
    this.CashPay = Printsal.CashPay || '';
    this.ChequePay = Printsal.ChequePay || '';
    this.CardPay = Printsal.CardPay || '';
    this.NEFTPay = Printsal.NEFTPay || '';
    this.OnlinePay = Printsal.OnlinePay || '';
    this.PrintStoreName = Printsal.PrintStoreName || '';
    this.PatientType = Printsal.PatientType || '';

    this.BillVatAmount = Printsal.BillVatAmount || '';
    this.BillDiscAmount = Printsal.BillDiscAmount || '';
    this.BillTotalAmount = Printsal.BillTotalAmount || '';
    this.HospitalMobileNo = Printsal.HospitalMobileNo || '';
    this.HospitalEmailId = Printsal.HospitalEmailId || '';
    this.ConversionFactor = Printsal.ConversionFactor || '';
    this.SalesReturnNo = Printsal.SalesReturnNo || 0;
    this.RoundOff = Printsal.RoundOff || 0;
  }
}
export class DraftSale {
  DSalesId: any;
  PatientName: any;
  RegID: any;
  Time: any;
  NetAmount: any;
  OP_IP_ID: any;
  OP_IP_Type: any;
  WardId: any;
  BedId: any;
  IsPrescription: any;
  ExtMobileNo: any;
  extAddress: any;

  /**
   * Constructor
   *
   * @param DraftSale
   */
  constructor(DraftSale) {
    {
      this.DSalesId = DraftSale.DSalesId || 0;
      this.PatientName = DraftSale.PatientName || 0;
      this.RegID = DraftSale.RegID || '';
      this.Time = DraftSale.Time || '';
      this.NetAmount = DraftSale.NetAmount || 0;
      this.OP_IP_ID = DraftSale.OP_IP_ID || '';
      this.OP_IP_Type = DraftSale.OP_IP_Type || '';
      this.WardId = DraftSale.WardId || '';
      this.BedId = DraftSale.BedId || '';
      this.IsPrescription = DraftSale.IsPrescription || '';
      this.ExtMobileNo = DraftSale.ExtMobileNo || '';
      this.extAddress = DraftSale.extAddress || '';
    }
  }
}
export class IndentList {
  SalesNo: any;
  ItemId: any;
  ItemName: string;
  ItemShortName: any;
  BatchNo: string;
  BatchExpDate: any;
  BalanceQty: any;
  QtyPerDay: any;
  UnitMRP: any;
  Qty: number;
  IssueQty: number;
  Bal: number;
  StoreId: any;
  StoreName: any;
  GSTPer: any;
  GSTAmount: any;
  TotalMRP: any;
  DiscPer: any;
  DiscAmt: any;
  NetAmt: any;
  StockId: any;
  ReturnQty: any;
  TotalAmount: any;
  Total: any;
  VatPer: any;
  VatAmount: any;
  LandedRate: any;
  CgstPer: any;
  CGSTAmt: any;
  SgstPer: any;
  SGSTAmt: any;
  IgstPer: any;
  IGSTAmt: any;
  LandedRateandedTotal: any;
  PurchaseRate: any;
  PurTotAmt;
  any;
  BalanceAmount: any;
  PatientName: any;
  SalesReturnId: any;
  DiscAmount: any;
  NetAmount: any;
  MarginAmt: any;
  /**
   * Constructor
   *
   * @param IndentList
   */
  constructor(IndentList) {
    {
      this.SalesNo = IndentList.SalesNo || 0;
      this.ItemId = IndentList.ItemId || 0;
      this.ItemName = IndentList.ItemName || '';
      this.ItemShortName = IndentList.ItemShortName || '';
      this.BatchNo = IndentList.BatchNo || '';
      this.BatchExpDate = IndentList.BatchExpDate || '';
      this.UnitMRP = IndentList.UnitMRP || '';
      this.ItemName = IndentList.ItemName || '';
      this.Qty = IndentList.Qty || 0;
      this.IssueQty = IndentList.IssueQty || 0;
      this.QtyPerDay = IndentList.QtyPerDay || 0;
      this.Bal = IndentList.Bal || 0;
      this.StoreId = IndentList.StoreId || 0;
      this.StoreName = IndentList.StoreName || '';
      this.GSTPer = IndentList.GSTPer || '';
      this.TotalMRP = IndentList.TotalMRP || 0;
      this.DiscAmt = IndentList.DiscAmt || 0;
      this.NetAmt = IndentList.NetAmt || 0;
      this.StockId = IndentList.StockId || 0;
      this.NetAmt = IndentList.NetAmt || 0;
      this.ReturnQty = IndentList.ReturnQty || 0;
      this.TotalAmount = IndentList.TotalAmount || 0;
      this.Total = IndentList.Total || '';
      this.VatPer = IndentList.VatPer || 0;
      this.VatAmount = IndentList.VatAmount || 0;
      this.LandedRate = IndentList.LandedRate || 0;
      this.CgstPer = IndentList.CgstPer || 0;
      this.CGSTAmt = IndentList.CGSTAmt || 0;
      this.SgstPer = IndentList.SgstPer || 0;
      this.SGSTAmt = IndentList.SGSTAmt || 0;
      this.IgstPer = IndentList.IgstPer || 0;
      this.IGSTAmt = IndentList.IGSTAmt || 0;
      this.BalanceAmount = IndentList.BalanceAmount || 0;
      this.PatientName = IndentList.PatientName || '';
      this.SalesReturnId = IndentList.SalesReturnId || 0;
      this.NetAmount = IndentList.NetAmount || 0;
      this.DiscAmount = IndentList.DiscAmount || 0;
      this.MarginAmt = IndentList.MarginAmt || 0;
    }
  }
}
export class IndentID {
  IndentNo: Number;
  IndentDate: number;
  FromStoreName: string;
  ToStoreName: string;
  Addedby: number;
  IsInchargeVerify: string;
  IndentId: any;
  FromStoreId: boolean;

  /**
   * Constructor
   *
   * @param IndentID
   */
  constructor(IndentID) {
    {
      this.IndentNo = IndentID.IndentNo || 0;
      this.IndentDate = IndentID.IndentDate || 0;
      this.FromStoreName = IndentID.FromStoreName || '';
      this.ToStoreName = IndentID.ToStoreName || '';
      this.Addedby = IndentID.Addedby || 0;
      this.IsInchargeVerify = IndentID.IsInchargeVerify || '';
      this.IndentId = IndentID.IndentId || '';
      this.FromStoreId = IndentID.FromStoreId || '';
    }
  }
}

export class BalAvaListStore {
  StoreName: any;
  BalQty: any;

  /**
   * Constructor
   *
   * @param BalAvaListStore
   */
  constructor(BalAvaListStore) {
    {
      this.StoreName = BalAvaListStore.StoreName || '';
      this.BalQty = BalAvaListStore.BalQty || 0;
    }
  }
}
