import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { flatMap, shareReplay } from 'rxjs/operators';
import { NbAuthService, NbAuthToken } from '@nebular/auth';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart$: Observable<any>;
  items$: Observable<any[]>;

  constructor(
    private firestore: AngularFirestore,
    private authService: NbAuthService
  ) {}

  ngOnInit(): void {
    this.authService.getToken().subscribe((token: NbAuthToken) => {
      const userID = token.getPayload().user_id;
      this.cart$ = this.firestore
        .collection('carts', (ref) =>
          ref.where('userID', '==', userID).limit(1)
        )
        .valueChanges()
        .pipe(flatMap((x) => x))
        .pipe(shareReplay(1));
    });
  }
}
