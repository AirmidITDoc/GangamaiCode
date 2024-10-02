export class gridRequest {
    first: number = 0;
    rows: number = 10;
    sortField: string = "";
    sortOrder: number = 0;
    filters: gridFilter[]=[];
    columns: []=[];
    exportType: gridResponseType=gridResponseType.JSON;
}
export class gridFilter{
    fieldName: string = "";
    fieldValue: string = "";
    opType: string = "";
}
export enum gridResponseType{
    JSON=1,Excel=2,Pdf=3
}
export class gridModel{
    headers: string[]=[];
    columnsList: any[]=[];
    apiUrl:string="";
    sortField:string="";
    sortOrder:number=0;
    filters:gridFilter[]=[];
    row:number=10;
}