import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstant } from 'src/app/shared/gobal-constant';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ProductComponent } from '../dialog/product/product.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss'],
})
export class ManageProductComponent implements OnInit {
  displayedColumn: string[] = [
    'name',
    'categoryName',
    'description',
    'price',
    'pic',
    'edit',
  ];
  dataSource: any;
  responseMessage: any;

  constructor(
    private productService: ProductService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
    // this.view();
  }

  tableData() {
    this.productService.getProducts().subscribe(
      (res: any) => {
        this.ngxService.stop();
        prepareProductPic(res);
        this.dataSource = new MatTableDataSource(res);
      },
      (err) => {
        this.ngxService.stop();
        console.log(err);
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarService.openSnackbar(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddProduct() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
    };
    dialogConfig.width = '550px';
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddProduct.subscribe((res) => {
      this.tableData();
    });
  }

  handelEditProduct(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values,
    };
    dialogConfig.width = '550px';
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditProduct.subscribe((res) => {
      this.tableData();
    });
  }

  handleDeleteProduct(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + values.name + ' product',
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (res) => {
        this.ngxService.start();
        this.deleteProduct(values.id);
        dialogRef.close();
      }
    );
  }

  deleteProduct(id: any) {
    this.productService.delete(id).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.tableData();
        this.responseMessage = res.message;
        this.snackbarService.openSnackbar(
          this.responseMessage,
          'Product Deleted'
        );
      },
      (err) => {
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarService.openSnackbar(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }

  onChange(status: any, id: any) {
    var data = {
      status: status.toString(),
      id: id,
    };
    this.productService.updateStatus(data).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.responseMessage = res.message;
        this.snackbarService.openSnackbar(
          this.responseMessage,
          'Product Status Changed Successfully'
        );
      },
      (err) => {
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarService.openSnackbar(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }

  //////////////batabase view
  retriveResponse: any;
  base64Data: any;
  // public safeImage: SafeUrl;
  private image: any;
  private readonly imageType: string = 'data:image/PNG;base64,';
  pic: any[] = [];
  pica: any = '';
  public imgURL: any;

  view() {
    console.log('ami');

    this.productService.getProducts().subscribe((blob: any) => {
      console.log(blob);
      let ia;
      console.log(blob.length);

      for (let j = 0; j < blob.length; j++) {
        ia = blob[j];
        console.log(ia);

        console.log(ia.pic);
        if (ia.pic != null) {
          const asc = ia.pic.data;
          console.log(asc);

          // this.pica = this.pica + String.fromCharCode(asc);
          console.log(asc.length);

          for (let i = 0; i < asc.length; i++) {
            this.pica = this.pica + String.fromCharCode(asc[i]);
            // console.log(pic);
          }

          this.pic.push(this.pica);
          this.pica = '';
        }
      }

      console.log(this.pic);
    });
    this.imgURL = this.pic;
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
