import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { SingleProductPageComponent } from './products/single-product-page/single-product-page.component';
import { PantryProductsListComponent } from './pantry/pantry-products-list/pantry-products-list.component';
import { AddPantryItemComponent } from './pantry/add-pantry-item/add-pantry-item.component';

// Note that the 'users/new' route needs to come before 'users/:id'.
// If 'users/:id' came first, it would accidentally catch requests to
// 'users/new'; the router would just think that the string 'new' is a user ID.
const routes: Routes = [
  {path: '', component: PantryProductsListComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'products/new', component: AddProductComponent},
  {path: 'products/:id', component: SingleProductPageComponent},
  {path: 'pantry/new', component: AddPantryItemComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
