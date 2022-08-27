import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: [
    './product-view.component.scss',
    '../../../../assets/styles/css/bootstrap.css',
    '../../../../assets/styles/css/responsive.css',
    '../../../../assets/styles/css/ui.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ProductViewComponent implements OnInit {
  constructor(private productService: ProductService) {}

  public screenWidth: any;
  public screenHeight: any;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.loading = true;
    setTimeout(() => {
      this.productService.getAllProducts(9, this.productPageCounter).subscribe(
        (res: any) => {
          console.log(res);
          prepareProductPic(res);

          this.products = res;
          console.log(this.products);

          this.loading = false;
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
    }, 500);
  }

  ////////////view product
  categories: any[] = [
    {
      name: 'Laptops',
    },
    {
      name: 'Accessories',
    },
    {
      name: 'Cameras',
    },
  ];
  loading = false;

  products: any[] = [];

  productPageCounter = 1;
  additionalLoading = false;
  showMoreProducts(): void {
    this.additionalLoading = true;
    this.productPageCounter = this.productPageCounter + 1;
    setTimeout(() => {
      this.productService.getAllProducts(9, this.productPageCounter).subscribe(
        (res: any) => {
          console.log(res);
          prepareProductPic(res);
          this.products = [...this.products, ...res];
          this.additionalLoading = false;
        },
        (err) => {
          console.log(err);
          this.additionalLoading = false;
        }
      );
    }, 500);
  }
}

function prepareProductPic(res: any) {
  // throw new Error('Function not implemented.');
  for (let j = 0; j < res.length; j++) {
    // debugger;
    let ia = res[j];
    console.log(ia);
    let pica = '';
    // console.log(ia.pic);
    if (ia.pic != null) {
      const asc = ia.pic.data;
      console.log(asc);

      // this.pica = this.pica + String.fromCharCode(asc);
      console.log(asc.length);

      for (let i = 0; i < asc.length; i++) {
        pica = pica + String.fromCharCode(asc[i]);
        // console.log(pic);
      }

      // this.pic.push(this.pica);
      // this.pica = '';
      ia.pic = pica;
    }
  }
}
