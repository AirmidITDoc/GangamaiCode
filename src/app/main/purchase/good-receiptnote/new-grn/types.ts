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

export interface GRNFormModel {
  // Purchase Details
  PurchaseId: string;
  poBalQty: number;

  // Item Details
  ItemName: GRNItemResponseType | null;
  UOM: string;
  HSNCode: string;
  BatchNo: string;
  ConversionFactor: number;

  // Quantity Details
  Qty: number;
  FreeQty: number;
  FinalTotalQty: number;


  // Date Details
  ExpDate: Date | string;
  DateOfInvoice: Date;
  PaymentDate: Date;

  // Price Details
  MRP: number;
  Rate: number;
  TotalAmount: number;

  // Discount Details
  Disc: number;
  Disc2: number;
  DisAmount: number;
  DisAmount2: number;

  // GST Details
  GST: number;
  GSTAmount: number;
  CGST: number;
  CGSTAmount: number;
  SGST: number;
  SGSTAmount: number;
  IGST: number;
  IGSTAmount: number;

  // Final Amount
  NetAmount: number;

  // Supplier Details
  SupplierId: string;
  Contact: string;
  Mobile: string;

  // Document Details
  InvoiceNo: string;
  GateEntryNo: string;

  // Type Details
  GRNType: string; 
  GSTType: string;
  PaymentType: string; 
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
