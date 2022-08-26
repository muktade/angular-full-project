import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeUrl } from '@angular/platform-browser';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstant } from 'src/app/shared/gobal-constant';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;
  category: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductComponent>,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService
  ) {
  }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],
      categoryId: ['', [Validators.required]],
      price: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      (this.action = 'Update'),
        this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategory();
  }

  getCategory() {
    this.categoryService.getCategory().subscribe(
      (res) => {
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

  handelSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    var formData = this.productForm.value;
    var data = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
      pic: this.imgURL,
    };
    this.productService.add(data).subscribe(
      (res: any) => {
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.responseMessage = res.message;
        this.snackbarService.openSnackbar(
          this.responseMessage,
          'Product Add Success'
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

  edit() {
    var formData = this.productForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      description: formData.description,
      price: formData.price,
    };
    this.productService.update(data).subscribe(
      (res: any) => {
        this.dialogRef.close();
        this.onEditProduct.emit();
        this.responseMessage = res.message;
        this.snackbarService.openSnackbar(
          this.responseMessage,
          'Product Updated'
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

  ////////pic

  selectedFile: any;
  selectedFileNames: string = '';
  previews: string = '';
  imgURL: any;
  rURL: any;

  viewImag(picFile: any) {
    console.log(picFile);

    let reader = new FileReader();
    this.rURL = reader.readAsDataURL(picFile);
    console.log(this.rURL);

    reader.onload = (e) => {
      this.imgURL = reader.result;
      console.log(this.imgURL);
    };
  }
  selectFiles(event: any): void {
    console.log(event);
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
    if (this.selectedFile) {
      this.viewImag(this.selectedFile);
    }
  }

  
}
