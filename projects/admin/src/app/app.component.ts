import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { take, shareReplay } from 'rxjs/operators';
import { NbAuthResult, NbAuthService, NbAuthToken } from '@nebular/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'admin';
  userToken$: Observable<NbAuthToken>;
  isAuthenticated$: Observable<boolean>;

  constructor(private authService: NbAuthService) {
    this.userToken$ = this.authService.onTokenChange();
    this.isAuthenticated$ = this.authService
      .onAuthenticationChange()
      .pipe(shareReplay(1));
  }

  loginWithGoogle() {
    this.authService
      .authenticate('google')
      .pipe(take(1))
      .subscribe((authResult: NbAuthResult) => {});
  }

  logout() {
    this.authService
      .logout('google')
      .pipe(take(1))
      .subscribe((authResult: NbAuthResult) => {});
  }
}
