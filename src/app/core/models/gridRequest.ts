export class gridRequest {
    First: number = 0;
    Rows: number = 10;
    SortField: string = "";
    SortOrder: number = 0;
    Filters: gridFilter[]=[];
    ExportType: gridResponseType=gridResponseType.JSON;
    Columns: gridColumn[]=[];
}
export class gridFilter{
    FieldName: string = "";
    FieldValue: string = "";
    OpType: string = "";
}
export enum gridResponseType{
    JSON=1,Excel=2,Pdf=3
}
export class gridColumn{
    Data:string="";
    Name:string="";
    Def:string="";
}