import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-single-product-page',
  templateUrl: './single-product-page.component.html',
  styleUrls: ['./single-product-page.component.scss']
})
export class SingleProductPageComponent implements OnInit, OnDestroy {

  product: Product;
  changeProductForm: FormGroup;
  formExists: boolean;
  id: string;
  getProductSub: Subscription;

  constructor( private route: ActivatedRoute, private productService: ProductService, private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.formExists = false;
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      //this.dontCreateForms();
      if (this.getProductSub) {
        this.getProductSub.unsubscribe();
      }
      this.getProductSub = this.productService.getProductById(this.id).subscribe(product => {
        this.product = product;
        this.createForms();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.getProductSub) {
      this.getProductSub.unsubscribe();
    }
  }

  createForms() {
    this.changeProductForm = this.fb.group({
      _id: new FormControl(this.product._id),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      product_name: new FormControl(this.product.product_name, Validators.compose([
        Validators.minLength(0),
        // In the real world you'd want to be very careful about having
        // an upper limit like this because people can sometimes have
        // very long names. This demonstrates that it's possible, though,
        // to have maximum length limits.
        Validators.maxLength(50),
        (fc) => {
          if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
            return ({ existingName: true });
          } else {
            return null;
          }
        },
      ])),
      brand: new FormControl(this.product.brand),
      store: new FormControl(this.product.store),
      lifespan: new FormControl(this.product.lifespan),
      description: new FormControl(this.product.description),
      category: new FormControl(this.product.category),
      location: new FormControl(this.product.location),
      notes: new FormControl(this.product.notes),
      threshold: new FormControl(this.product.threshold, Validators.compose([
        Validators.min(0),
        Validators.pattern('^[0-9]+$')
      ]))
    });
    this.formExists = true;
  }

}
