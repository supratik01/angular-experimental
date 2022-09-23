import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { text } from 'body-parser';
import { NONE_TYPE } from '@angular/compiler';
declare var require: any;
const htmlToPdfmake = require("html-to-pdfmake");
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface UrlArry {
  url: string;
  width: number;
}

@Component({
  selector: 'app-html-to-pdf',
  templateUrl: './html-to-pdf.component.html',
  styleUrls: ['./html-to-pdf.component.scss']
})
export class HtmlToPdfComponent implements OnInit {
  title = 'htmltopdf';
  imgUrls: string[] = [];
  showUnwantedDiv = true;
  // imgUrls: UrlArry[] = [];

  @ViewChild('containerWrp') pdfTable: ElementRef | undefined;


  constructor() { }

  ngOnInit(): void {
    this.imgUrls = [
      'https://i.imgur.com/rwhrUo0.png',
    ]
    // this.imgUrls = [
    //   {
    //     url: 'https://franklintempletonprod.widen.net/content/bisy3uvlqy/original/article_graph.jpg',
    //     width: 500
    //   },
    //   {
    //     url: 'https://franklintempletonprod.widen.net/content/ju3hp6gdhd/original/Articledetail_author.jpg',
    //     width: 500
    //   }
    // ]
  }

  generatePDF() {
    html2canvas(document.body, {
      // html2canvas(this.pdfTable!.nativeElement, {
      ignoreElements: (element): boolean => {

        /* Remove element with id="MyElementIdHere" */
        if ('MyElementIdHere' == element.id) {
          return true;
        }

        /* Remove all elements with class="MyClassNameHere" */
        if (element.classList.contains('other-section')) {
          return true;
        }

        return false;

      }
    }).then(canvas => {
      // Few necessary setting options
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('l', 'mm', 'a4'); // A4 size page of PDF

      var width = pdf.internal.pageSize.getWidth();
      var height = canvas.height * width / canvas.width;
      pdf.addImage(contentDataURL, 'PNG', 10, 10, width - 10, height)
      // console.log(pdf.getNumberOfPages());
      pdf.save('output.pdf'); // Generated PDF
    });
  }

  createPDF() {
    // var element = document.getElementsByClassName('main-container');
    // var opt = {
    //   margin:       1,
    //   filename:     'myfile.pdf',
    //   image:        { type: 'jpeg', quality: 0.98 },
    //   html2canvas:  { scale: 2 },
    //   jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    // };

    // // New Promise-based usage:
    // html2pdf().set(opt).from(element).save();

    // // Old monolithic-style usage:
    // html2pdf(element, opt);

    // html2canvas(document.body, {
    html2canvas(this.pdfTable!.nativeElement, {
      ignoreElements: (element): boolean => {

        /* Remove element with id="MyElementIdHere" */
        if ('MyElementIdHere' == element.id) {
          return true;
        }

        /* Remove all elements with class="MyClassNameHere" */
        if (element.classList.contains('other-section')) {
          return true;
        }

        return false;

      }
    }).then(canvas => {
      // Few necessary setting options
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('l', 'mm', 'a4'); // A4 size page of PDF

      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      pdf.addImage(contentDataURL, 'PNG', 10, 10, imgWidth, imgHeight)

      let position = 0;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position + 10, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('output.pdf'); // Generated PDF
    });
  }

  async downloadPDF() {
    this.showUnwantedDiv = false;

    const pdfTable = this.pdfTable!.nativeElement;
    console.log(JSON.stringify(pdfTable));

    this.showUnwantedDiv = true;
    //console.log(pdfTable.innerHTML);

    const htmlToPdfOptions = {
      imagesByReference: true,
      defaultStyles: { // change the default styles
        h1: {
          marginBottom: 20,
          alignment: 'center'
        },
        h4: {
          marginBottom: 10,
        },
        // a: { // for <A>
        //   color: 'purple', // all links should be 'purple'
        //   decoration: '', // remove underline
        // },
        p: {
          marginBottom: 20,
        },
        img: {
          width: 300,
          marginBottom: 20,
          alignment: 'center'
        },
        ol: {
          margin: [20, 30, 20, 20]
        },
        li: {
          marginBottom: 10,
          marginLeft: 20
        }
      },
      styles: {
        'disclaimer': {
          fontSize: 10,
          margin: [0, 0, 0, 20]
        }
      }
    };

    var html = htmlToPdfmake(pdfTable.innerHTML, htmlToPdfOptions);

    try {
      for (let k in html.images) {
        const response = await this.getImageDataUrl(html.images[k]);
        if(!response) {
          pdfTable.innerHTML.replace(html.images[k], '');
          console.log(pdfTable.innerHTML);
          delete(html.images[k]);
        }
      }
      var html = htmlToPdfmake(pdfTable.innerHTML, htmlToPdfOptions);

      const documentDefinition: any = {
        watermark: { text: 'Fiduciary Trust', color: 'gray', opacity: 0.1, bold: true, italics: false, angle: 40 },
        info: {
          title: 'Test Document'
        },
        content: html.content,
        images: html.images,
        pageSize: "A4",
        pageOrientation: "potrait",
        pageMargins: [40, 60, 40, 60]
      };

      pdfMake.createPdf(documentDefinition).open();
    }
    catch(e) {
      alert("PDF not exists!");
    }
    // pdfMake.createPdf((await this.getDocumentDefinition(html)) as any).open();

  }

  private async getDocumentDefinition(html: any) {
    this.updateStatus('Downloading images...');
    const imageDataUrls = await Promise.all(this.imgUrls.map((data) => { this.getImageDataUrl(data) }));
    this.updateStatus('Generating report from those images...');

    const imageDefinitions = imageDataUrls.map((data) => ({
      image: data,
      //  width: 500,
    })
    );
    return {
      content: [
        html.content,
        ...imageDefinitions,
      ]
    }
  }

  private async getImageDataUrl(imgUrl: string) {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }
    catch (err) {
      return null;
    }
  }

  private updateStatus(text: string) {
    console.log(`${new Date()} ${text}`);
  }

  async makePDF() {

    let docDefinition: any = {
      watermark: { text: 'Fiduciary Trust', color: 'gray', opacity: 0.1, bold: true, italics: false, angle: 40 },
      info: {
        title: 'Test2 Document',
        author: 'john doe',
        subject: 'subject of document',
        keywords: 'keywords for document',
      },
      content: [
        { text: 'Climate Change and Investment Risk in the Utilities Sector', style: 'header1' },
        { text: 'The utilities sector has generally been viewed as a “safe haven” by investors during periods of market volatility and slowing growth. This is due to the sector’s traditional defensive nature and stable revenues during all phases of the business cycle. However, as the financial risks from climate change grow, some utilities may be challenged to generate a steady rate of return for shareholders. Competitors with fewer risks related to fossil fuels may outperform peers by taking advantage of greater opportunities for renewable energy and technology development.', style: 'paraStyle' },
        { text: 'We believe a comprehensive understanding of the risks and rewards associated with climate change is critical for investors to assess and manage portfolio risk. In the coming decades, businesses will face increasing pressure to reduce their emissions as countries around the world pledge to become carbon neutral by 2050. There will likely be a policy response that will put some companies at risk if they are unwilling or unable to align with the goal of “net-zero.”', style: 'paraStyle' },

        { text: 'A Multitude of Risks', style: 'header4' },
        { text: 'Organizations that fail to adapt to climate change face a host of potential risks.  The public, for example, generally associates climate change with physical risks, which is true, but incomplete. Customers and investors are also pressuring publicly traded companies to explain how they plan to transition to a clean energy future. International and regional regulatory authorities are demanding specific disclosures regarding how utilities plan to meet net-zero goals. Meanwhile, power demand continues to rise in concert with the buildout of electric cars.', style: 'paraStyle' },
        {
          text: [
            { text: 'Physical risk. ', style: ['initialWord'] },
            'Climate change is associated with rising temperatures and an increase in the severity of natural disasters. This has resulted in economic loss for some businesses due to damaged infrastructure and disruptions to supply chains and operations. In the last two years alone, the US experienced more than 40 weather-related incidences that resulted in at least $1 billion in damage per occurrence.'
          ], style: 'paraStyle'
        },
        { text: 'The utilities sector has the highest exposure to physical risk, leading other capital-intensive sectors, such as industrial manufacturing, oil and gas and real estate.  More extreme hurricanes, wildfires and heatwaves continue to impact every aspect of the grid, from generation, transmission, and distribution, to demand for electricity. For many utilities, this has meant reduced efficiency, higher operating expenses and more frequent power outages. Capital expenditures to maximize infrastructure resiliency in the face of climate change is becoming a critical component of sustainable business models.', style: 'paraStyle' },
        {
          text: [
            { text: 'Transition risk. ', style: ['initialWord'] },
            'The financial risk associated with an uncertain path to a decarbonized economy is called transition risk. The electric utility and transportation sectors, which make up at least half of all US carbon emissions, are the most exposed to transition risks, which range from reduced access to financial capital to new federal and state regulations.  Insurance-related risks include higher operating costs and insurance premiums associated with compliance, increased carbon emission pricing, climate-related reporting requirements and restrictions on existing products and services. An increasing number of banks and insurers say they will no longer back companies with shares of coal generation above 30%.'
          ], style: 'paraStyle'
        },
        {
          text: [
            { text: 'Regulatory risk. ', style: ['initialWord'] },
            'The SEC proposed new climate-related disclosures in March 2022 in recognition that climate risks can pose significant financial risks to companies, and investors need reliable information about climate risks to make informed investment decisions. The proposed rules would require disclosures on Form 10-K about a company’s governance, risk management, and strategy regarding climate-related risks. Moreover, the proposal would require disclosure of any targets or commitments made by a company, as well as its plan to achieve those targets and its transition plan, if it has them.'
          ], style: 'paraStyle'
        },
        {
          columns: [
            {
              image: await this.getImageDataUrl('https://franklintempletonprod.widen.net/content/bisy3uvlqy/original/article_graph.jpg'),
              width: 250,
            },
            [
              { text: 'Key takeaways', style: ['header4', 'keyTakeaways'] },
              {
                ol: [
                  { text: 'The utilities sector faces extensive financial risks from climate change, based on the sector’s overreliance on carbon-intensive power generation. In addition, its aging plant and equipment are highly sensitive to weather-related disruptions.', style: 'listStyle' },
                  { text: 'Investors and other stakeholders are pressuring electric utilities to demonstrate they can adapt to and thrive in a low carbon economy.', style: 'listStyle' },
                  { text: 'Utilities that decrease fossil fuel dependence and invest in clean energy solutions are realizing higher margins and earnings per share growth. Adaptability has boosted their competitive advantage and improved return on equity.', style: 'listStyle' }
                ], style: 'keyTakeaways'
              }
            ]
          ],
          columnGap: 10
        },
        {
          // for numbered lists set the ol key
          ol: [
            { text: 'Net Zero Asset Managers Initiative, www.netzeroassetmanagers.org.', style: 'listStyle' },
            { text: 'Executive summary – World Energy Investment 2021 – Analysis - IEA; 2021.', style: 'listStyle' },
            { text: 'Net Zero by 2050 – Analysis - IEA; 2021.', style: 'listStyle' }
          ], style: 'orderedList'
        },
        {
          text: `This communication is intended solely to provide general information. The information and opinions stated may change without notice. The information and opinions do not represent a complete analysis of every material fact regarding any market, industry, sector or security. Statements of fact have been obtained from sources deemed reliable, but no representation is made as to their completeness or accuracy. The opinions expressed are not intended as individual investment, tax or estate planning advice or as a recommendation of any particular security, strategy or investment product. Please consult your personal advisor to determine whether this information may be appropriate for you. This information is provided solely for insight into our general management philosophy and process. Historical performance does not guarantee future results and results may differ over future time periods.
          IRS Circular 230 Notice: Pursuant to relevant U.S. Treasury regulations, we inform you that any tax advice contained in this communication is not intended or written to be used, and cannot be used, for the purpose of (i) avoiding penalties under the Internal Revenue Code or (ii) promoting, marketing or recommending to another party any transaction or matter addressed herein. You should seek advice based on your particular circumstances from your tax advisor.`, style: 'disclaimer'
        },
        // { text: 'Multiple styles applied', style: [ 'header', 'anotherStyle' ] },
        // { image: 'strawberries', style: 'imgStyle' }
      ],

      styles: {
        header1: {
          fontSize: 20,
          bold: true,
          marginBottom: 20,
          alignment: 'center'
        },
        header4: {
          fontSize: 14,
          bold: true,
          marginBottom: 10,
        },
        paraStyle: {
          fontSize: 12,
          marginBottom: 20,
        },
        initialWord: {
          bold: true,
        },
        anotherStyle: {
          italics: true,
          alignment: 'right'
        },
        imgStyle: {
          innerWidth: '200px'
        },
        orderedList: {
          margin: [20, 30, 20, 20]
        },
        keyTakeaways: {
          // background: '#577489',
          // color: '#FFFFFF',
          border: [false, false, false, false],
        },
        listStyle: {
          fontSize: 10,
          marginBottom: 10,
          marginLeft: 20
        },
        disclaimer: {
          fontSize: 10,
          margin: [0, 0, 0, 20]
        }
      },
      images: {
        mySuperImage: 'data:image/jpeg;base64,...content...',
        snow: 'https://picsum.photos/seed/picsum/200',
        strawberries: 'https://franklintempletonprod.widen.net/content/bisy3uvlqy/original/article_graph.jpg',
        // strawberries: {
        //   url: this.imageUrlToBase64("https://franklintempletonprod.widen.net/content/bisy3uvlqy/original/article_graph.jpg"),
        //   headers: {
        //     myheader: '123',
        //     myotherheader: 'abc',
        //   },
        // }
      }
    };
    pdfMake.createPdf(docDefinition).open();

  }

  manifestPDF() {
    var html = htmlToPdfmake(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
          .btn-block {
            display: flex;
            justify-content: flex-end;
            padding: 10px 80px;
            padding-bottom: 50px;
          }
          .btn-block .btn {
            border: none;
            cursor: pointer;
            padding: 10px;
            color: #fff;
            margin-left: 15px;
          }
          .details-block {
            padding: 80px 0;
          }
          .container-wrp {
            padding: 0 160px;
          }
          .container-wrp .article__block {
            margin-bottom: 79px;
          }
          .container-wrp .article__pullquotemain p {
            font-size: 20px;
            line-height: 28px;
            margin-bottom: 24px;
            font-weight: 400;
            font-family: "TTCommonsProRegular";
            margin: 0 0 12px;
          }
          .container-wrp .article__pullquotemain h4 {
            font-size: 24px;
            line-height: 32px;
            margin-bottom: 24px;
            color: #1a1a1a;
            font-family: "TTCommonsProMedium";
            padding-top: 14px;
            font-weight: 500;
          }
          .container-wrp .article__description__row {
            margin: 0 -24px;
            display: flex;
          }
          .container-wrp .article__description__row .article__description__col1 {
            flex: 0 0 63.5%;
            padding: 0 24px;
          }
          .container-wrp .article__description__row .article__description__col1 .article__custom {
            padding-bottom: 32px;
          }
          .container-wrp .article__description__row .article__description__col1 ol {
            padding: 32px;
          }
          .container-wrp .article__description__row .article__description__col1 ol li {
            font-size: 15px;
            line-height: 20px;
            color: #000;
            font-family: "TTCommonsProRegular";
            font-weight: 400;
          }
          .container-wrp .article__description__row .article__description__col1 .article__disclaimer p {
            font-family: "TTCommonsProRegular";
            font-size: 15px !important;
            line-height: 20px !important;
            color: #000 !important;
            margin-bottom: 24px !important;
            font-weight: 400 !important;
            margin: 0 0 12px;
          }
          .container-wrp .article__description__row .article__description__col2 {
            flex: 0 0 36.5%;
            padding: 0 24px;
          }
          .container-wrp .article__description__row .article__description__col2 .article__author__image {
            margin-bottom: 48px;
            padding-left: 0px;
            padding-right: 0px;
            background: #f0f2f4;
          }
          .container-wrp .article__description__row .article__description__col2 .article__author__image .article__author__img {
            height: 299px;
            width: 100%;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
          }
          .container-wrp .article__description__row .article__description__col2 .article__author__image .article__author__cnt {
            padding: 24px 40px;
            padding-right: 15px;
            padding-left: 40px;
            min-height: 107px;
          }
          .container-wrp .article__description__row .article__description__col2 .article__keytakeaways {
            padding: 36px;
            background: #577489;
            margin-bottom: 24px;
            position: relative;
          }
          .container-wrp .article__description__row .article__description__col2 .article__keytakeaways .scroll-position {
            position: absolute;
            top: -100px;
          }
          .container-wrp .article__description__row .article__description__col2 .article__keytakeaways h4 {
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 0;
            font-size: 24px !important;
            line-height: 32px !important;
            margin-bottom: 24px;
          }
          .container-wrp .article__description__row .article__description__col2 .article__keytakeaways p {
            font-size: 20px !important;
            line-height: 28px !important;
            font-weight: 400 !important;
            color: #fff;
          }
          .showDiv {
            display: none;
          }

      </style>
    </head>
    <body>
        <div class="details-block">
            <div class="container-wrp">
                <div class="article__block">
                    <h1>Climate Change and Investment Risk in the Utilities Sector</h1>
                </div>
                <div class="article__description article__pullquotemain">
                    <div class="article__description__row takeaways__row">
                        <div class="article__description__col1">
                            <div>
                                <p>The utilities sector has generally been viewed as a “safe haven” by investors during periods of market volatility and slowing growth. This is due to the sector’s traditional defensive nature and stable revenues during all phases
                                    of the business cycle. However, as the financial risks from climate change grow, some utilities may be challenged to generate a steady rate of return for shareholders. Competitors with fewer risks related to fossil fuels may
                                    outperform peers by taking advantage of greater opportunities for renewable energy and technology development.</p>

                                <p>We believe a comprehensive understanding of the risks and rewards associated with climate change is critical for investors to assess and manage portfolio risk. In the coming decades, businesses will face increasing pressure to
                                    reduce their emissions as countries around the world pledge to become carbon neutral by 2050. There will likely be a policy response that will put some companies at risk if they are unwilling or unable to align with the goal
                                    of “net-zero.”</p>

                                <h4><strong>A Multitude of Risks</strong></h4>

                                <p>Organizations that fail to adapt to climate change face a host of potential risks. &nbsp;The public, for example, generally associates climate change with physical risks, which is true, but incomplete. Customers and investors are
                                    also pressuring publicly traded companies to explain how they plan to transition to a clean energy future. International and regional regulatory authorities are demanding specific disclosures regarding how utilities plan to
                                    meet net-zero goals. Meanwhile, power demand continues to rise in concert with the buildout of electric cars.</p>

                                <p>Physical risk. Climate change is associated with rising temperatures and an increase in the severity of natural disasters. This has resulted in economic loss for some businesses due to damaged infrastructure and disruptions to
                                    supply chains and operations. In the last two years alone, the US experienced more than 40 weather-related incidences that resulted in at least $1 billion in damage per occurrence.</p>

                                <p>The utilities sector has the highest exposure to physical risk, leading other capital-intensive sectors, such as industrial manufacturing, oil and gas and real estate. &nbsp;More extreme hurricanes, wildfires and heatwaves continue
                                    to impact every aspect of the grid, from generation, transmission, and distribution, to demand for electricity. For many utilities, this has meant reduced efficiency, higher operating expenses and more frequent power outages.
                                    Capital expenditures to maximize infrastructure resiliency in the face of climate change is becoming a critical component of sustainable business models.</p>
                            </div>
                            <div class="article__custom">
                                <img alt="Chart" src="https://franklintempletonprod.widen.net/content/bisy3uvlqy/original/article_graph.jpg">
                                <!-- <img alt="author" src="https://franklintempletonprod.widen.net/content/ju3hp6gdhd/original/Articledetail_author.jpg"> -->
                            </div>
                            <div>
                                <div>
                                    <div>
                                        <p><strong>Transition risk</strong>. The financial risk associated with an uncertain path to a decarbonized economy is called transition risk. The electric utility and transportation sectors, which make up at least half of
                                            all US carbon emissions, are the most exposed to transition risks, which range from reduced access to financial capital to new federal and state regulations. &nbsp;Insurance-related risks include higher operating costs
                                            and insurance premiums associated with compliance, increased carbon emission pricing, climate-related reporting requirements and restrictions on existing products and services. An increasing number of banks and insurers
                                            say they will no longer back companies with shares of coal generation above 30%.</p>

                                        <p><strong>Regulatory risk.</strong> The SEC proposed new climate-related disclosures in March 2022 in recognition that climate risks can pose significant financial risks to companies, and investors need reliable information
                                            about climate risks to make informed investment decisions. The proposed rules would require disclosures on Form 10-K about a company’s governance, risk management, and strategy regarding climate-related risks. Moreover,
                                            the proposal would require disclosure of any targets or commitments made by a company, as well as its plan to achieve those targets and its transition plan, if it has them.</p>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <h4>Managing Climate Risk &amp; Opportunity</h4>

                                        <p>At Fiduciary Trust International, we believe climate change is an important factor to consider when assessing risk and opportunity in a portfolio. Our goals is to weigh the investment implications of government responses
                                            to climate change in the form of new federal and state regulations, public investment and carbon taxes, as well as shifts in consumer and investment sentiment and rising costs from natural disasters.</p>

                                        <p>Companies at the forefront of change are already setting ambitious climate goals and investing in more sustainable solutions and incorporating stakeholder considerations in their business models. &nbsp;Progress is evident
                                            in capital investments to ensure more durable infrastructure and a greater willingness from companies to incorporate climate factors in company disclosures. This includes emissions (both direct and in its supply chain),
                                            exposure to physical risks such as flooding and wildfires, and climate mitigation and adaption measures to address these risks.</p>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <h4>Applying a Climate Change Lens to Utility Investment Decisions</h4>

                                        <p>When assessing the utilities sector, we start by looking at publicly available information. Company disclosures are used to determine the percentage and growth potential of renewables in the business model and whether there
                                            are capital investments planned in low emissions products, services and energy efficiency management.&nbsp;</p>

                                        <p>We also monitor the carbon intensity of operations, both absolute and relative to peers, and the amount of revenues derived from providing clean energy solutions, such as wind and solar power. Companies may have a high
                                            carbon intensity but either reflect high transition potential or play a significant role in reducing real world emissions by developing low carbon solutions, highlighting the challenges posed to investors when assessing
                                            climate risk in a portfolio.</p>

                                        <p>We believe proactive utility companies will enhance their return potential over time as they work to manage the downside risks inherent in climate change, access new growth opportunities and customer segments and improve
                                            their economic and physical resilience.</p>
                                    </div>
                                </div>
                                <div class="ng-star-inserted">
                                    <div class="article__disclaimer ng-star-inserted">
                                        <div>
                                            <ol>
                                                <li>Net Zero Asset Managers Initiative, www.netzeroassetmanagers.org.</li>
                                                <li>Executive summary – World Energy Investment 2021 – Analysis - IEA; 2021.</li>
                                                <li>Net Zero by 2050 – Analysis - IEA; 2021.</li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div class="article__disclaimer ng-star-inserted">
                                        <div>
                                            <p>This communication is intended solely to provide general information. The information and opinions stated may change without notice. The information and opinions do not represent a complete analysis of every material
                                                fact regarding any market, industry, sector or security. Statements of fact have been obtained from sources deemed reliable, but no representation is made as to their completeness or accuracy. The opinions expressed
                                                are not intended as individual investment, tax or estate planning advice or as a recommendation of any particular security, strategy or investment product. Please consult your personal advisor to determine whether
                                                this information may be appropriate for you. This information is provided solely for insight into our general management philosophy and process. Historical performance does not guarantee future results and results
                                                may differ over future time periods.<br> IRS Circular 230 Notice: Pursuant to relevant U.S. Treasury regulations, we inform you that any tax advice contained in this communication is not intended or written to be
                                                used, and cannot be used, for the purpose of (i) avoiding penalties under the Internal Revenue Code or (ii) promoting, marketing or recommending to another party any transaction or matter addressed herein. You should
                                                seek advice based on your particular circumstances from your tax advisor.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="article__description__col2">
                            <!-- <hr data-pdfmake="{&quot;left&quot;:120, &quot;width&quot;:300, &quot;color&quot;:&quot;red&quot;, &quot;margin&quot;:[0,20,0,20], &quot;thickness&quot;:2}"> -->
                            <div class="article__author__image ng-star-inserted other-section" [ngClass]="{'showDiv': !showUnwantedDiv}" data-pdfmake-ignore="true">
                                <div class="article__author__img" style="background-image: url(&quot;https://franklintempletonprod.widen.net/content/ju3hp6gdhd/original/Articledetail_author.jpg&quot;);"></div>
                                <div class="article__author__cnt ng-star-inserted">
                                    <h6>AUTHOR</h6>
                                    <p>Jenny Cunningham</p>
                                </div>
                            </div>
                            <div class="article__keytakeaways ng-star-inserted">
                                <div class="scroll-position"></div>
                                <h4 class="active ng-star-inserted"> Key takeaways </h4>
                                <div class="ng-star-inserted">
                                    <div>
                                        <p>1.&nbsp;The utilities sector faces extensive financial risks from climate change, based on the sector’s overreliance on carbon-intensive power generation. In addition, its aging plant and equipment are highly sensitive
                                            to weather-related disruptions.</p>

                                        <p>2.&nbsp;Investors and other stakeholders are pressuring electric utilities to demonstrate they can adapt to and thrive in a low carbon economy.</p>

                                        <p>3.&nbsp;Utilities that decrease fossil fuel dependence and invest in clean energy solutions are realizing higher margins and earnings per share growth. Adaptability has boosted their competitive advantage and improved return
                                            on equity.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="article__pullquote article__pullquote__fordesktop ng-star-inserted other-section" *ngIf="showUnwantedDiv">
                                <div class="img">
                                    <div class="article__pullquote__img" style="background-image: url(&quot;https://franklintempletonprod.widen.net/content/ju3hp6gdhd/original/Articledetail_author.jpg&quot;);"></div>
                                </div>
                                <div>
                                    <h4>This represents a pull quote that will fascinate and engage the reader due to its engaging content and tone. The text can eve wrap around the image of the speaker like this&nbsp;</h4>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `, {
      imagesByReference: true,
      defaultStyles: { // change the default styles
        h4: { // for <A>
          color: 'purple', // all links should be 'purple'
          decoration: '' // remove underline
        },
        p: {
          marginBottom: 5
        },
        li: '' // remove all default styles for <LI>
      }
    });

    const documentDefinition: any = {
      content: html.content,
      images: html.images,
      // styles: {
      //   'html-p': {
      //     marginBottom: 5
      //   }
      // }
    };
    try {
      pdfMake.createPdf(documentDefinition).open();
    } catch (e) {
      //console.log(e);
    }

    // html2canvas(this.pdfTable!.nativeElement).then(function (canvas) {
    //   const imgObj = {
    //     image: canvas.toDataURL(),
    //     width: 600,
    //     style: {
    //       alignment: "center"
    //     }
    //   };
    //   const documentDefinition: any = {
    //     content: [imgObj],
    //     defaultStyle: {
    //       font: "NimbusSans"
    //     },
    //     pageSize: "A4",
    //     pageOrientation: "landscape",
    //     pageMargins: [40, 60, 40, 60]
    //   };
    //   const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    //   pdfDocGenerator.download();
    // });

  }

  toDataURL(src: string) {
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = src;
    console.log(image);

    image.onload = () => {
      var canvas = document.createElement('canvas');
      var context: CanvasRenderingContext2D | null = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      context!.drawImage(image, 0, 0);
      var dataURL = canvas.toDataURL('image/jpeg');
      return dataURL;
    };
  }

  async imageUrlToBase64(url: string) {
    const data = await fetch(url)
    const blob = await data.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const base64data = reader.result;

      console.log(base64data);
      return base64data
    }
  }

  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");


        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

}
