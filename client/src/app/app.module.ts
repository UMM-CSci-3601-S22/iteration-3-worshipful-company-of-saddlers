import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';

import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductService } from './products/product.service';
import { SingleProductPageComponent } from './products/single-product-page/single-product-page.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { PantryProductsListComponent } from './pantry/pantry-products-list/pantry-products-list.component';
import { ProductCardComponent } from './products/product-card/product-card.component';
import { PantryService } from './pantry/pantry.service';
import { AddPantryItemComponent } from './pantry/add-pantry-item/add-pantry-item.component';
import { AddProductToPantryComponent } from './products/add-product-to-pantry/add-product-to-pantry.component';
import { ShoppingListListComponent } from './shoppingList/shopping-list-list/shopping-list-list.component';
import { ShoppingListService } from './shoppingList/shopping-list-list/shoppingList.service';

// import { MY_DATE_FORMATS } from './my-date-fomats';
import { MatMomentDateModule} from '@angular/material-moment-adapter';

const MATERIAL_MODULES: any[] = [
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatCardModule,
  MatMenuModule,
  MatSidenavModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatSelectModule,
  MatOptionModule,
  MatFormFieldModule,
  MatDividerModule,
  MatRadioModule,
  MatSnackBarModule,
  MatPaginatorModule,
  MatDialogModule
];
const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11Label: 'LL',
    monthYearA11Label: 'MMMM YYYY'
  },
};

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    SingleProductPageComponent,
    AddProductComponent,
    PantryProductsListComponent,
    ShoppingListListComponent,
    ProductCardComponent,
    AddPantryItemComponent,
    AddProductToPantryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MATERIAL_MODULES,
    LayoutModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
  ],
  providers: [
    ProductService,
    PantryService,
    ShoppingListService,
    PantryProductsListComponent,
    MatDatepickerModule,
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ],
  exports: [
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
