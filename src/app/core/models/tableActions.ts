export enum gridActions{
    add=1,
    edit=2,
    delete=3,
    view=4,
    print=5,
    CossConsult=6,
    OPBill=7
}
export enum gridColumnTypes{
    default=1,
    customText=2,
    status=3,
    action=4,
    image=5,
    date=6,
    time=7,
    dateWithTime=8,
    dateByTime=9,
    wordBreak=10,
    Statusptype=11,
    StatusMlc=12,
    StatusPhoneApp=13,
    StatusCrosscons=14,
    StatusBillgenerate=15,
    StatusBillcancle=16,
    Statusoldnew=17,
    StatusOPTOIPConvert=18,
    StatusIsPathology=19,
    StatusIsRadiology=20,
    StatusCreditdr=21,
    StatusPatientType=22
}
export const DATE_TYPES = {
    SHORT_TIME: 'h:mm a',
    MEDIUM_DATE: 'MMM d, yyyy',
    FULL_DATE: 'EE, MMM d, yyyy',
    VALIDITY_TIME: 'MMM d, y - hh:mm:ss a',
    DATE_WITH_TIME: 'MMM d, y - hh:mm a',
    DATE__TIME: 'MMM d, y | hh:mm a',
    SIMPLE_DATE:  'yyyy-MM-dd'
  }