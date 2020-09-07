import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NbThemeModule } from '@nebular/theme';
import { NbAuthModule } from '@nebular/auth';
import {
  NbFirebaseAuthModule,
  NbFirebaseGoogleStrategy,
} from '@nebular/firebase-auth';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireAuthModule,
    NbFirebaseAuthModule,
    NbThemeModule.forRoot(),
    NbAuthModule.forRoot({
      forms: {
        login: {
          strategy: 'password',
          rememberMe: true,
          socialLinks: [],
        },
        register: {
          strategy: 'password',
          terms: true,
          socialLinks: [],
        },
        logout: {
          strategy: 'password',
        },
        requestPassword: {
          strategy: 'password',
          socialLinks: [],
        },
        resetPassword: {
          strategy: 'password',
          socialLinks: [],
        },
        validation: {
          password: {
            required: true,
            minLength: 6,
            maxLength: 50,
          },
          email: {
            required: true,
          },
          fullName: {
            required: false,
            minLength: 4,
            maxLength: 50,
          },
        },
      },
      strategies: [
        NbFirebaseGoogleStrategy.setup({
          name: 'google',
        }),
      ],
    }),
  ],
})
export class AuthModule {}
