/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../product';
import { AddProductToPantryComponent } from '../add-product-to-pantry/add-product-to-pantry.component';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product: Product;

  popup = false;

  constructor(){ }

  ngOnInit(): void {
  }
}
