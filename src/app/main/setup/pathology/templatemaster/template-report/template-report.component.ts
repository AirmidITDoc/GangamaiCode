import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { TemplatemasterService } from "../templatemaster.service";
import { PrintServiceService } from "app/core/services/print-service.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HtmlEditorService, ImageService, LinkService, TableService, ToolbarService } from "@syncfusion/ej2-angular-richtexteditor";
// import { HtmlEditorService, ImageService, LinkService, TableService, ToolbarService } from "@syncfusion/ej2-angular-richtexteditor";
// import { Editor } from 'ngx-editor';
@Component({
    selector: "app-template-report",
    templateUrl: "./template-report.component.html",
    styleUrls: ["./template-report.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    // template:`<ejs-richtexteditor id='iframeRTE' [(value)]='value' [toolbarSettings]='tools'></ejs-richtexteditor>`,
    // providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class TemplateReportComponent implements OnInit {
  // editor: Editor;
  // html = '';


    title = 'angular11RTE-app';
    public tools: object = {
        type: 'MultiRow',
        items: ['Undo', 'Redo', '|',
          'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
          'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
          'SubScript', 'SuperScript', '|',
          'LowerCase', 'UpperCase', '|',
          'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
          'CreateTable', '|',
          'CreateLink', 'Image', '|',
          'Indent', 'Outdent', '|',
          'ClearFormat', '|', 'FullScreen',
          // 'SourceCode',
        ]
      };
    public iframe: object = { enable: true };
TemplateDesc:any;
otherForm:FormGroup;
    public value: string = `
    <p>The RichTextEditor triggers events based on its actions. </p>
      <p> The events can be used as an extension point to perform custom operations.</p>`
      
    msg: any;
    reportdata: any = [];
    constructor(
        public _templateService: TemplatemasterService ,
        private formBuilder: FormBuilder,//public _printService: PrintServiceService
    ) {}
    ngOnInit(): void {

      // this.editor = new Editor();
        //  this.getPrintQuery();

        this.otherForm = this.formBuilder.group({
            // TemplateName:['',Validators.required],
            TemplateDesc:['',Validators.required],
            TemplateId:[0],
            DoctorId :['',Validators.required],
            SuggestionNotes:['']
          
          });
    }



    // ngOnDestroy(): void {
    //   this.editor.destroy();
    // }








    // getPrintQuery() {
    //     // var D_data = {
    //     //     PTemplateId: this._templateService.myform.get("PTemplateId").value,
    //     // };
    //     // this._templateService.Print(D_data).subscribe((report) => {
    //     //     this.reportdata = report;
    //     //     console.log(this.reportdata);
    //     // });
    // }
    // print(cmpName) {
    //     // let printContents = document.getElementById(cmpName).innerHTML;
    //     // let originalContents = document.body.innerHTML;
    //     // document.body.innerHTML = printContents;
    //     // window.print();
    //     // // document.body.innerHTML = originalContents;
    //     // window.close();
    // }
    // onprint(): void {
    //     //     let printContents, popupWin;
    //     //     printContents = document.getElementById("invoice").innerHTML;
    //     //     popupWin = window.open("", "_blank");
    //     //     popupWin.document.open();
    //     //     popupWin.document.write(`
    //     //    <html>
    //     //      <head>
    //     //        <title></title>
    //     //        <style>
    //     //        </style>
    //     //      </head>
    //     //  <body onload="window.print();window.close()">
    //     //      <div [innerHTML]="printContents"></div>
    //     //  </body>
    //     //    </html>`);
    //     //     popupWin.document.close();
    // }
}


// npm install @syncfusion/ej2-angular-richtexteditor@ngcc --save
// @syncfusion/ej2-angular-richtexteditor:"20.2.38-ngcc"
// npm i @syncfusion/ej2-angular-popups@20.2.38