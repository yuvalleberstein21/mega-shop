// import { ProductService } from 'src/app/services/product.service';
// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { OrderService } from './order.service';
// import { CartModelPublic, CartModelServer } from '../models/cart.model';
// import { BehaviorSubject } from 'rxjs';
// import { NavigationExtras, Router } from '@angular/router';
// import { ProductModelServer } from '../models/product.model';

// interface OrderResponse {
//   order_id: number;
//   success: boolean;
//   message: string;
//   products: [
//     {
//       id: string;
//       numInCart: string;
//     }
//   ];
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class CartService {
//   private SERVER_URL = 'http://localhost:8001/api';

//   // Data variable to store the cart information on the clients local storage
//   private cartDataClient: CartModelPublic = {
//     total: 0,
//     prodData: [
//       {
//         inCart: 0,
//         id: 0,
//       },
//     ],
//   };

//   //Data variable to store cart information on the server
//   private cartDataServer: CartModelServer = {
//     total: 0,
//     data: [
//       {
//         numInCart: 0,
//         product: undefined,
//       },
//     ],
//   };

//   //Observabls for the components to subscribe//
//   cartTotal$ = new BehaviorSubject<number>(0);
//   cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

//   constructor(
//     private http: HttpClient,
//     private productService: ProductService,
//     private orderService: OrderService,
//     private router: Router
//   ) {
//     this.cartTotal$.next(this.cartDataServer.total);
//     this.cartData$.next(this.cartDataServer);

//     //get information from local storage
//     let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

//     //Check if to info variable is null or has some data in it

//     if (info !== null && info !== undefined && info.prodData[0].inCart !== 0) {
//       // local storage is not empty and has some information
//       this.cartDataClient = info;

//       // Loop through each entry and put it in the cartDataServer object
//       this.cartDataClient.prodData.forEach((p) => {
//         this.productService
//           .getSingleProduct(p.id)
//           .subscribe((actualProductInfo: ProductModelServer) => {
//             if (this.cartDataServer.data[0].numInCart == 0) {
//               this.cartDataServer.data[0].numInCart = p.inCart;
//               this.cartDataServer.data[0].product = actualProductInfo;
//               //Todo create calculateTotal function and replact it here
//               this.cartDataClient.total = this.cartDataServer.total;
//               localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
//             } else {
//               // cartDataServer already has some entry in it
//               this.cartDataServer.data.push({
//                 numInCart: p.inCart,
//                 product: actualProductInfo,
//               });
//               //Todo create calculateTotal function and replact it here
//               this.cartDataClient.total = this.cartDataServer.total;
//               localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
//             }
//             this.cartData$.next({ ...this.cartDataServer });
//           });
//       });
//     }
//   }

//   AddProductToCart(id: number, qunatity?: number) {
//     this.productService.getSingleProduct(id).subscribe((prod) => {
//       // 1. if the cart is empty
//       if (this.cartDataServer.data[0].product === undefined) {
//         this.cartDataServer.data[0].product = prod;
//         this.cartDataServer.data[0].numInCart =
//           qunatity !== undefined ? qunatity : 1;
//         //Todo calculate total amount
//         this.cartDataClient.prodData[0].inCart =
//           this.cartDataServer.data[0].numInCart;
//         this.cartDataClient.prodData[0].id = prod.id;
//         this.cartDataClient.total = this.cartDataServer.total;
//         localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
//         this.cartData$.next({ ...this.cartDataServer });

//         //Todo display a toast notification
//       }

//       //2. if the cart has some items
//       else {
//         let index = this.cartDataServer.data.findIndex(
//           (p) => p.product.id === prod.id
//         ); // -1 or a postive value

//         // a. if that item is already in the cart => index is positive value
//         if (index !== -1) {
//           if (qunatity !== undefined && qunatity < prod.quantity) {
//             this.cartDataServer.data[index].numInCart =
//               this.cartDataServer.data[index].numInCart < prod.quantity
//                 ? qunatity
//                 : prod.quantity;
//           } else {
//             this.cartDataServer.data[index].numInCart =
//               this.cartDataServer.data[index].numInCart < prod.quantity
//                 ? this.cartDataServer.data[index].numInCart++
//                 : prod.quantity;
//           }
//           this.cartDataClient.prodData[index].inCart =
//             this.cartDataServer.data[index].numInCart;

//           //Todo display a toast notification
//         }
//         // b. if the item is not in the cart
//         else {
//           this.cartDataServer.data.push({
//             numInCart: 1,
//             product: prod,
//           });
//           this.cartDataClient.prodData.push({
//             inCart: 1,
//             id: prod.id,
//           });
//           //Todo display a toast notification

//           //Todo calculate total amount
//           this.cartDataClient.total = this.cartDataServer.total;
//           localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
//           this.cartData$.next({ ...this.cartDataServer });
//         }
//       }
//     });
//   }

//   UpdateCartItems(index: number, increase: boolean) {
//     let data = this.cartDataServer.data[index];
//     if (increase) {
//       data.numInCart < data.product.quantity
//         ? data.numInCart++
//         : data.product.quantity;
//       this.cartDataClient.prodData[index].inCart = data.numInCart;
//       //Todo calculate total amount
//       this.cartDataClient.total = this.cartDataServer.total;
//       localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
//       this.cartData$.next({ ...this.cartDataServer });
//     } else {
//       data.numInCart = data.numInCart - 1;
//       if (data.numInCart < 1) {
//         // TODO the product from CART
//         this.cartData$.next({ ...this.cartDataServer });
//       } else {
//         this.cartData$.next({ ...this.cartDataServer });
//         this.cartDataClient.prodData[index].inCart = data.numInCart;
//         //Todo calculate total amount
//         this.cartDataClient.total = this.cartDataServer.total;
//         localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
//       }
//     }
//   }

//   DeleteProductFromCart(index: number) {
//     if (window.confirm(`Are you sure you want to remove the item?`)) {
//       this.cartDataServer.data.splice(index, 1);
//       this.cartDataClient.prodData.slice(index, 1);
//       //Todo calculate total amount
//       this.cartDataClient.total = this.cartDataServer.total;
//       if (this.cartDataClient.total === 0) {
//         this.cartDataClient = { total: 0, prodData: [{ inCart: 0, id: 0 }] };
//         localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
//       } else {
//         localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
//       }
//       if (this.cartDataServer.total === 0) {
//         this.cartDataServer = {
//           total: 0,
//           data: [{ numInCart: 0, product: undefined }],
//         };
//         this.cartData$.next({ ...this.cartDataServer });
//       } else {
//         this.cartData$.next({ ...this.cartDataServer });
//       }
//     } else {
//       // if the user clickes the cancel button
//       return;
//     }
//   }

//   private calculateTotal() {
//     let Total = 0;
//     this.cartDataServer.data.forEach((p) => {
//       const { numInCart } = p;
//       const { price } = p.product;

//       Total += numInCart + price;
//     });
//     this.cartDataServer.total = Total;
//     this.cartTotal$.next(this.cartDataServer.total);
//   }

//   CheckoutFromCart(userId: number) {
//     this.http
//       .post(`${this.SERVER_URL}/orders/payment`, null)
//       .subscribe((res: { success: boolean }) => {
//         if (res.success) {
//           this.resetServerData();
//           this.http
//             .post(`${this.SERVER_URL}/orders/new`, {
//               userId: userId,
//               products: this.cartDataClient.prodData,
//             })
//             .subscribe((data: OrderResponse) => {
//               this.orderService.getSingleOrder(data.order_id).then((prods) => {
//                 if (data.success) {
//                   const navigationExtras: NavigationExtras = {
//                     state: {
//                       message: data.message,
//                       products: prods,
//                       orderId: data.order_id,
//                       total: this.cartDataClient.total,
//                     },
//                   };
//                   // TODO hide spinner
//                   this.router
//                     .navigate(['/thankyou'], navigationExtras)
//                     .then((p) => {
//                       this.cartDataClient = {
//                         total: 0,
//                         prodData: [
//                           {
//                             inCart: 0,
//                             id: 0,
//                           },
//                         ],
//                       };
//                       this.cartTotal$.next(0);
//                       localStorage.setItem(
//                         'cart',
//                         JSON.stringify(this.cartDataClient)
//                       );
//                     });
//                 }
//               });
//             });
//         }
//       });
//   }

//   private resetServerData() {
//     this.cartDataServer = {
//       total: 0,
//       data: [
//         {
//           numInCart: 0,
//           product: undefined,
//         },
//       ],
//     };
//     this.cartData$.next({ ...this.cartDataServer });
//   }
// }
