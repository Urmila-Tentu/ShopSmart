import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, Observable, Subject, map, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { getAuth, signOut } from 'firebase/auth';
import { Router } from '@angular/router';
import { initializeApp } from "firebase/app";
// import { jwtDecode } from "jwt-decode";
import * as authActions from '../store/auth.actions';

// export interface AuthResponseData  {
//   name?: string;
//   kind?: string;
//   idToken: string;
//   email: string;
//   refreshToken: string;
//   expiresIn: string;
//   localId: string;
//   registered?: boolean;
//   uid?: string;
// }
export interface AuthResponseData  {
  uid: string;
  name: string;
  email: string;
  token: string;
  expiresIn: number;
  role: string;
}
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCql3Npno578hxnzN5mjD4SHjyLcdkWe4U",
  authDomain: "e-commerce-86f86.firebaseapp.com",
  databaseURL: "https://e-commerce-86f86-default-rtdb.firebaseio.com",
  projectId: "e-commerce-86f86",
  storageBucket: "e-commerce-86f86.appspot.com",
  messagingSenderId: "919866914313",
  appId: "1:919866914313:web:e1ca6e0d2d57436551ead8",
  measurementId: "G-B84QYC3H4G"
};
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;
  public isSignedIn: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public User = new BehaviorSubject<any>(null);

  constructor(private router: Router, private http: HttpClient) {}
  expirationTime: any;
  private tokenExpirationTimer:any ;
  setLogoutTimer(expirationDuration: number) {
    console.log("Start");
    this.tokenExpirationTimer = setTimeout(() =>
    {
      localStorage.removeItem("token")
      console.log("End");

    }, expirationDuration)
  }
  signUp(email: string, password: string) {
    // APi SignIN
    return this.http
    .post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCql3Npno578hxnzN5mjD4SHjyLcdkWe4U', {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      tap(res => {
        this.expirationTime = +res.expiresIn * 1000;
        // let uid = jwtDecode(res.idToken);
        // res.uid = uid.sub;
        this.User.next(res);
        window.localStorage.setItem("expiresIn", this.expirationTime);
        window.localStorage.setItem("isSignedIn", "true");
        window.localStorage.setItem("idToken", res.token);
        // this.setLogoutTimer()
        this.router.navigate(["/home"]);
        window.location.reload()
        }
      )
    )
  }
  signIn(email: string, password: string) {
    // APi SignIN
    return this.http
    .post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCql3Npno578hxnzN5mjD4SHjyLcdkWe4U', {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      tap(res => {
        this.expirationTime = +res.expiresIn * 1000;
        // let uid = jwtDecode(res.idToken);
        // res.uid = uid.sub;
        this.User.next(res);
        window.localStorage.setItem("expiresIn", this.expirationTime);
        window.localStorage.setItem("isSignedIn", "true");
        window.localStorage.setItem("idToken", res.token);
        // this.setLogoutTimer()
        this.router.navigate(["/home"]);
        window.location.reload()
        }
      )
    )
  }
}
