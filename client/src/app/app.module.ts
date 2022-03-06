import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

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
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
//import { MatAutocompleteModule } from '@angular/material/autocomplete';
//import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
//import { MatBadgeModule } from '@angular/material/badge';
//import { MatButtonToggleModule}  from '@angular/material/button-toggle';
//import { MatDialogModule } from '@angular/material/dialog';
//import { MatChipsModule } from '@angular/material/chips';
//import { MatProgressBarModule } from '@angular/material/progress-bar';
//import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
//import { MatRippleModule } from '@angular/material/core';
//import { MatSlideToggleModule } from '@angular/material/slide-toggle';
//import { MatSliderModule } from '@angular/material/slider';
//import { MatTabsModule } from '@angular/material/tabs';
//import { MatTreeModule } from '@angular/material/tree';

import { UserListComponent } from './users/user-list.component';
import { HomeComponent } from './home/home.component';
import { UserService } from './users/user.service';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { UserCardComponent } from './users/user-card.component';
import { UserProfileComponent } from './users/user-profile.component';
import { AddUserComponent } from './users/add-user.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductService } from './products/product.service';
import { SingleProductPageComponent } from './products/single-product-page/single-product-page.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ProductCardComponent } from './products/product-card/product-card.component';

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
  //MatAutocompleteModule,
  //MatBottomSheetModule,
  //MatBadgeModule,
  //MatButtonToggleModule,
  //MatDialogModule,
  //MatChipsModule,
  //MatProgressBarModule,
  //MatProgressSpinnerModule,
  //MatRippleModule,
  //MatSlideToggleModule,
  //MatSliderModule,
  //MatTabsModule,
  //MatTreeModule
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserListComponent,
    UserCardComponent,
    UserProfileComponent,
    AddUserComponent,
    ProductListComponent,
    SingleProductPageComponent,
    AddProductComponent,
    ProductCardComponent,
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
  ],
  providers: [
    UserService,
    ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
