import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OAuthService } from 'angular-oauth2-oidc';
import { HomePage } from '../../pages/home/home';

declare const OktaAuth: any;


@Injectable()
export class BeerService {
    
constructor(private http: Http, private oauthService: OAuthService) {
    
    }

    getAll(): Observable<any> {
        const headers: Headers = new Headers();
  		headers.append('Authorization', this.oauthService.authorizationHeader());
	  
  		let options = new RequestOptions({ headers: headers });
      
        return this.http.get('http://localhost:8100', options)
          .map((response: Response) => response.json());
    }    
}


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage {
    @ViewChild('email') email: any;
    private username: string;
    private password: string;
    private error: string;
    
    constructor(private navCtrl: NavController, private oauthService: OAuthService) {
        oauthService.redirectUri = window.location.origin;
        oauthService.clientId = '0oahy92lt2XGr9Z1I0h7';
        oauthService.scope = 'openid profile email';
        oauthService.oidc = true;
        oauthService.issuer = 'https://dev-602633-admin.oktapreview.com';
    }
    
  ionViewDidLoad(): void {
      setTimeout(() => {
      this.email.setFocus();
          }, 500);
      }
  
  login(): void {
      this.oauthService.createAndSaveNonce().then(nonce => {
      const authClient = new OktaAuth({
          clientId: this.oauthService.clientId,
          redirectUri: this.oauthService.redirectUri,
          url: this.oauthService.issuer
      });
      authClient.signIn({
          username: this.username,
          password: this.password
          }).then((response) => {
          if (response.status == 'SUCCESS') {
              authClient.token.getWithoutPrompt({
                  nonce: nonce,
                  responseType: ['id_token', 'token'],
                  sessionToken: response.sessionToken,
                  scopes: this.oauthService.scope.split('')
          })
              .then((tokens) => {
                  //oauthService.processIdToken doesn't set an access token
                  //set it manually so oauthService.authorizationHeader() works
                  localStorage.setItem('access_token', tokens[1].accessToken);
                  this.oauthService.processIdToken(tokens[0].idToken, tokens[1].accessToken);
                  this.navCtrl.push(HomePage);
              })
                  .catch(error => console.error(error));
              } else {
                  throw new Error('We cannot handle ' + response.status + ' status');
              }
          }).fail((error) => {
              console.error(error);
              this.error = error.message;
          });
      });
  }
  
}