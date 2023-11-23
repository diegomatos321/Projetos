import { Injectable } from '@angular/core';
import { Product } from './products';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  protected items: Product[] = [];

  constructor(private http: HttpClient) {}

  public addCart(product: Product): void {
    this.items.push(product);
  }

  public getItems(): Product[] {
    return this.items;
  }

  public clearCart(): Product[] {
    this.items = [];

    return this.items;
  }

  public getShippingPrices() {
    return this.http.get<{ type: string; price: number }[]>(
      '/assets/shipping.json'
    );
  }
}
