import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
const jsPDF = require('jspdf');
require('jspdf-autotable');
import * as $ from 'jquery';
// PDF package 
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import * as jspdf from 'jspdf';  
import html2canvas from 'html2canvas'; 
@Injectable({
  providedIn: 'root'
})
export class PrintServiceService {
 isPritning  = false;
  constructor(private router: Router) { }

  printDocument(documentName: String, documentData: string[]){
    this.isPritning = true;
    this.router.navigate(['/',
    {
      outlets:{
        'print' : ['print',documentName,documentData.join()]
      }
    }]);
  }
  exportPdf(canvas_div_pdf,fileName){
    var HTML_Width = canvas_div_pdf.width();
    var HTML_Height = canvas_div_pdf.height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width+(top_left_margin*2);
    var PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height+5;

    var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;  
    html2canvas(canvas_div_pdf[0],{allowTaint:true,
                scale: 5
        //         ,onclone: function (clonedDoc) {
        // clonedDoc.getElementById('canvas_div_pdf').style.display = 'inline-block';}
  }).then(function(canvas) {
      canvas.getContext('2d');
      console.log(canvas.height+"  "+canvas.width);
      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      var pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
      pdf.internal.scaleFactor = 35;
      pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);

      for (var i = 1; i <= totalPDFPages; i++) { 
        pdf.addPage(PDF_Width, PDF_Height);
        pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
      }        
        pdf.save(fileName+".pdf");
        });

  }
}

