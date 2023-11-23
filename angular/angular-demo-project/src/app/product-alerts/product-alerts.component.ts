import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../products';

@Component({
  selector: 'app-product-alerts',
  //standalone: true,
  //imports: [CommonModule],
  templateUrl: './product-alerts.component.html',
  styleUrl: './product-alerts.component.css',
})
export class ProductAlertsComponent {
  @Input()
  public product: Product | undefined;

  @Output()
  public notify = new EventEmitter();
}
