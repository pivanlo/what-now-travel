import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { flatMap, shareReplay, take } from 'rxjs/operators';
import { NbAuthService, NbAuthToken } from '@nebular/auth';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  item$: Observable<any>;
  cart$: Observable<any>;
  isAuthenticated$: Observable<boolean>;
  isAddedToCart: Boolean;

  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private authService: NbAuthService
  ) {
    this.isAuthenticated$ = this.authService
      .onAuthenticationChange()
      .pipe(shareReplay(1));
  }

  ngOnInit() {
    const sku = this.route.snapshot.paramMap.get('sku');
    this.item$ = this.firestore
      .collection('items', (ref) => ref.where('sku', '==', sku).limit(1))
      .valueChanges()
      .pipe(flatMap((x) => x))
      .pipe(shareReplay(1));

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

    combineLatest(this.cart$, this.item$).subscribe(([cart, item]) => {
      const skus = cart.items.map((item) => item.sku);
      this.isAddedToCart = skus.includes(item.sku);
    });
  }

  addToCart() {
    this.item$.subscribe((item) => {
      this.authService.getToken().subscribe((token: NbAuthToken) => {
        const userID = token.getPayload().user_id;
        let doc = this.firestore.collection('carts', (ref) =>
          ref.where('userID', '==', userID).limit(1)
        );
        doc
          .snapshotChanges()
          .pipe(take(1))
          .subscribe((res: any) => {
            const doc = res[0].payload.doc;
            const items = doc.data().items;
            items.push({ name: item.name, price: item.price, sku: item.sku });
            const total = items.reduce(
              (total, item) => total + parseFloat(item.price),
              0
            );
            this.firestore
              .collection('carts')
              .doc(doc.id)
              .update({ items, total });
          });
      });
    });
  }
}
