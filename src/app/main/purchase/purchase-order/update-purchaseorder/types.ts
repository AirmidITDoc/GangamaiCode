export interface GRNItemResponseType {
  itemId: number;
  itemName: string;
  balanceQty: number;
  hsNcode: string;
  cgstPer: number;
  sgstPer: number;
  igstPer: number;
  converFactor: string;
  storeId: number;
  umoId: number;
  itemCompanyName: string;
  formattedText: string;
}

export interface PurchaseFormModel {
  // Purchase Details
  PurchaseId: string;
  poBalQty: number;

  // Item Details
  ItemName: GRNItemResponseType | null;
  UOMId: string;
  HSNCode: string;
  BatchNo: string;
  ConversionFactor: number;

  // Quantity Details
  Qty: number;
  // FreeQty: number;
  // FinalTotalQty: number;
  Specification: string;

  // Date Details
  ExpDate: Date | string;
  DateOfInvoice: Date;
  PaymentDate: Date;

  // Price Details
  MRP: number;
  Rate: number;
  TotalAmount: number;
  DefRate: number;

  // Discount Details

  DiscAmount: number;
  Disc: number;
  DiscPer: number;
  // GST Details
  GST: [''],
  GSTPer: [''],
  GSTAmount: [''],
  CGSTPer: [''],
  CGSTAmount: [''],
  SGSTPer: [''],
  SGSTAmount: [''],
  IGSTPer: [''],
  IGSTAmount: [''],

  CGST: [''],
  SGST: [''],
  IGST: [''],
  // Final Amount
  NetAmount: number;

  // Supplier Details
  SupplierId: string;
  Contact: string;
  Mobile: string;
  Email: string;
  // Document Details
  InvoiceNo: string;
  GateEntryNo: string;

  // Type Details
  GRNType: string;
  GSTType: GSTType;
  PaymentType: string;
 UnitRate:number;

 
}

// Enum for GST Type Text
export enum GSTType {
  GST_BEFORE_DISC = 'GST Before Disc',
  GST_AFTER_DISC = 'GST After Disc',
  GST_ON_MRP = 'GST On MRP',
  GST_ON_PUR_PLUS_FREE_QTY = 'GST on Pur Plus FreeQty',
  GST_ON_MRP_PLUS_FREE_QTY = 'GST on MRP Plus FreeQty',
  GST_AFTER_TWO_TIME_DISC = 'GST After TwoTime Disc'
}
export interface GSTCalculation {
  baseAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalGSTAmount: number;
  netAmount: number;
}
export interface GSTValidation {
  readonly VALID_GST_RATES: number[];
  readonly GST_ERROR_MESSAGE: string;
}

export interface GSTCalculationResult {
  totalAmount: number;
  discAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  gst: number;
  finalTotalQty: number;
  conversionFactor: number;
  mrp: number;
  rate: number;
}
export interface FinalFormModel {
  Status3: string;

  ReceivedBy: string;
  DebitAmount: number;
  CreditAmount: number;
  DiscAmount: string;
  TotalAmt: string;
  VatAmount: string;
  NetPayamt: string;
  OtherCharge: number;
  RoundingAmt: number;
  EwayBillNo: string;
  EwalBillDate: Date;
  DiscAmount2: number;

  
  TransportCharges: number;
  HandlingCharges: number;
  Freight: number;
  OctriAmount: number;
  Worrenty: [''],
  roundVal: number;
  Remark: string;
  PaymentMode: number;
  PaymentTerm:number;



}
export enum ToastType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}
