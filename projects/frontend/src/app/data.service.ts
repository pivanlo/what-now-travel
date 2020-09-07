import { Injectable } from '@angular/core';
const firebase = require('firebase');
require('firebase/firestore');
import { environment } from '../environments/environment';

firebase.initializeApp(environment.firebaseConfig);

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}
}
