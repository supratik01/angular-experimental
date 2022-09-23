import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-home',
  templateUrl: './new-home.component.html',
  styleUrls: ['./new-home.component.scss']
})
export class NewHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('myCanvas')
  myCanvas!: ElementRef<HTMLCanvasElement>;
  public context!: CanvasRenderingContext2D | null;

  backgroundImg = {
    img: '../../assets/images/talk-to-us-box-mini30.jpg',
    renderingType: 'pixelated'
  };

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.backgroundImg = {
        img: '../../assets/images/talk-to-us-box-original.jpg',
        renderingType: 'auto'
      }
    }, 2000)
  }

  ngAfterViewInit(): void {
    // this.context = this.myCanvas.nativeElement.getContext('2d');
    this.loadingCanvasImg();
  }

  loadingCanvasImg() {
    const myCanvas = this.myCanvas.nativeElement;
    const ctx : CanvasRenderingContext2D | null = myCanvas.getContext('2d');
    const imgSrc = '../../assets/images/talk-to-us-box-original.jpg';
    // const imgSrc = 'https://www.legalkart.com/frontend/client_base_web/layout-optim/home-revamp/images/hero-banner1.jpg';
    let img1 = new Image();
    // img1.crossOrigin = "Anonymous";
    img1.src = imgSrc;

    img1.onload = () => {
      let w = img1.width;
      let h = img1.height;
      myCanvas.width = w;
      myCanvas.height = h;
      ctx?.drawImage(img1, 0, 0);

      // Getting Image pixels values in an array
      let pixelArr: Uint8ClampedArray | undefined = ctx?.getImageData(0,0,w,h).data;
      let sampleSize = 3;
      this.drawCanvasImg(ctx!, sampleSize, h, w, pixelArr);

      sampleSize = 2;
      setTimeout(() => {
        this.drawCanvasImg(ctx!, sampleSize, h, w, pixelArr);
      }, 1000)

      // // Loading the actual image after 2s
      setTimeout(() => {
        let img2 = new Image();
        img2.src = imgSrc;
        ctx?.drawImage(img2, 0, 0);
      }, 2000)
    }
  }

  drawCanvasImg(ctx: CanvasRenderingContext2D, sampleSize: number, h: number, w: number, pixelArr: Uint8ClampedArray | undefined) {
    for(let y=0; y<h; y+= sampleSize) {
        for(let x=0; x<w; x+= sampleSize) {
          let p = (x+(y*w))*4;
          ctx!.fillStyle = `rgba(${pixelArr![p]}, ${pixelArr![p+1]}, ${pixelArr![p+2]}, ${pixelArr![p+3]})`;
          ctx!.fillRect(x, y, sampleSize, sampleSize);
        }
      }
  }

}
