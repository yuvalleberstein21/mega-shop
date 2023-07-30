import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ProductModelServer,
  ServerResponse,
} from 'src/app/models/product.model';
// import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: ProductModelServer[] = [];

  constructor(
    private productSvc: ProductService,
    // private cartService: CartService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.productSvc.getAllProducts().subscribe((prods: ServerResponse) => {
      this.products = prods.products;
      console.log(this.products);
    });
  }

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  // AddToCart(id: number) {
  //   this.cartService.AddProductToCart(id);
  // }
}
