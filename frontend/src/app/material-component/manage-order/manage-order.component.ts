import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as saveAs from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstant } from 'src/app/shared/gobal-constant';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss'],
})
export class ManageOrderComponent implements OnInit {
  displayColumn: string[] = [
    'name',
    'category',
    'price',
    'quantity',
    'total',
    'edit',
  ];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  category: any = [];
  product: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategory();
    this.manageOrderForm = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],
      email: [
        '',
        [Validators.required, Validators.pattern(GlobalConstant.emailRegex)],
      ],
      contactNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(GlobalConstant.contactNumberRegex),
        ],
      ],
      paymentMethod: ['', [Validators.required]],
      product: ['', [Validators.required]],
      category: ['', [Validators.required]],
      quantity: [
        '',
        [Validators.required, Validators.pattern(GlobalConstant.quantityRegex)],
      ],
      price: ['', [Validators.required]],
      total: ['', [Validators.required]],
    });
  }

  getCategory() {
    this.categoryService.getCategory().subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.category = res;
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

  getProductByCategory(value: any) {
    this.productService.getProductByCategory(value.id).subscribe(
      (res) => {
        this.product = res;
        this.manageOrderForm.controls['price'].setValue('');
        this.manageOrderForm.controls['quantity'].setValue('');
        this.manageOrderForm.controls['total'].setValue(0);
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

  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe(
      (res: any) => {
        this.price = res.price;
        this.manageOrderForm.controls['price'].setValue(res.price);
        this.manageOrderForm.controls['quantity'].setValue('1');
        this.manageOrderForm.controls['total'].setValue(this.price * 1);
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

  setQuantity(value: any) {
    var temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value *
          this.manageOrderForm.controls['price'].value
      );
    } else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value *
          this.manageOrderForm.controls['price'].value
      );
    }
  }

  validateProductAdd(): boolean {
    if (
      this.manageOrderForm.controls['total'].value === 0 ||
      this.manageOrderForm.controls['total'].value === null ||
      this.manageOrderForm.controls['quantity'].value <= 0
    ) {
      return true;
    }
    return false;
  }

  validateSubmit(): boolean {
    if (
      this.totalAmount === 0 ||
      this.manageOrderForm.controls['name'].value === null ||
      this.manageOrderForm.controls['email'].value === null ||
      this.manageOrderForm.controls['contactNumber'].value === null ||
      this.manageOrderForm.controls['paymentMethod'].value === null ||
      !(
        this.manageOrderForm.controls['contactNumber'].valid ||
        this.manageOrderForm.controls['email'].valid
      )
    ) {
      return true;
    }
    return false;
  }

  add() {
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find(
      (e: { id: number }) => e.id == formData.product.id
    );
    if (productName === undefined) {
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({
        id: formData.product.id,
        name: formData.product.name,
        category: formData.category.name,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total,
      });
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackbar(GlobalConstant.productAdded, 'Success');
    } else {
      this.snackbarService.openSnackbar(
        GlobalConstant.productExistError,
        GlobalConstant.error
      );
    }
  }

  handelDeleteAction(value: any, element: any) {
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }

  submitAction() {
    this.ngxService.start();
    var formData = this.manageOrderForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource),
    };
    this.billService.generateReport(data).subscribe(
      (res: any) => {
        this.downloadFile(res?.uuid);
        this.ngxService.stop();
        this.manageOrderForm.reset();
        this.dataSource = [];
        this.totalAmount = 0;
      },
      (err) => {
        this.ngxService.stop();
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

  downloadFile(fileName: any) {
    var data = {
      uuid: fileName,
    };
    this.billService.getPDF(data).subscribe((response: any) => {
      saveAs(response, fileName + '.pdf');
      this.ngxService.stop();
    });
  }
}
