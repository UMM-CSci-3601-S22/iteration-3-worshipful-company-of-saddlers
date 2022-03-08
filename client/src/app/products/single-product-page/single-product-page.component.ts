import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-single-product-page',
  templateUrl: './single-product-page.component.html',
  styleUrls: ['./single-product-page.component.scss']
})
export class SingleProductPageComponent implements OnInit, OnDestroy {

  product: Product;
  id: string;
  getProductSub: Subscription;

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      if (this.getProductSub) {
        this.getProductSub.unsubscribe();
      }
      this.getProductSub = this.productService.getProductById(this.id).subscribe(product => this.product = product);
    });
  }

  ngOnDestroy(): void {
    if (this.getProductSub) {
      this.getProductSub.unsubscribe();
    }
  }

}
