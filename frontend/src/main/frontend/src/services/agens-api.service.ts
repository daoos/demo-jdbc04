import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import * as GlobalConfig from '../app/global.config';
import { AuthenticationService } from './authentication.service';

import { AgensRequestLabel } from '../models/agens-request-label';
import { AgensRequestQuery } from '../models/agens-request-query';
import { AgensResponseResult } from '../models/agens-response-result';

@Injectable()
export class AgensApiService {
  
  private apiUrl = `${window.location.protocol}//${window.location.host}/${GlobalConfig.AGENS_DEMO_API}`;
  private adminUrl = `${window.location.protocol}//${window.location.host}/${GlobalConfig.AGENS_AUTH_API}`;
  private fnRefresh: Function = null;

  constructor (
    private http: Http,
    private auth: AuthenticationService
  ) {
    if( GlobalConfig.DEV_MODE ){
      this.apiUrl = GlobalConfig.DEV_DEMO_API;
      this.adminUrl = GlobalConfig.DEV_AUTH_API;
    }
  }

  setFunction( fn:Function ){
    this.fnRefresh = fn;
  }
  getFunction():Function {
    return this.fnRefresh;
  }

  dbUser() {
    return this.auth.getUserInfo();
  }

  dbMeta() {
    const url = `${this.apiUrl}/db`;
    var headers = this.auth.createAuthorizationHeader(this.auth.getToken());
    console.log( `try dbMeta ==> ${url}`);

    return this.http
      .get(url,{headers: headers})
      .toPromise()
      .then(res => {
        return res.json();
      })
      .catch(this.handleError);
  }

  dbLabel( request:AgensRequestLabel ) {
    const url = `${this.apiUrl}/label`;
    var headers = this.auth.createAuthorizationHeader(this.auth.getToken());
    console.log( `try dbLabel ==> ${url}`);

    return this.http
      .post(url, JSON.stringify(request), {headers: headers})
      .toPromise()
      .then(res => {
        return res.json();
      })
      .catch(this.handleError);
  }

  dbLabelCount( request:AgensRequestLabel ) {
    const url = `${this.apiUrl}/label_count`;
    var headers = this.auth.createAuthorizationHeader(this.auth.getToken());
    console.log( `try dbLabelCount ==> ${url}`);

    return this.http
      .post(url, JSON.stringify(request), {headers: headers})
      .toPromise()
      .then(res => {
        return res.json();
      })
      .catch(this.handleError);
  }

  // request = { 
  //   "sql" : "match path=(a:production {'title': 'Haunted House'})-[]-(b:company {'name': 'Ludo Studio'}) return path limit 10" 
  // };
  dbQuery( request:AgensRequestQuery ){
    const url = `${this.apiUrl}/query`;
    var headers = this.auth.createAuthorizationHeader(this.auth.getToken());
    console.log( `try dbQuery ==> ${url}`);

    return this.http
      .post(url, JSON.stringify(request), {headers: headers})
      .toPromise()
      .then(res => {
        //console.log(JSON.stringify( res.json() ));
        return res.json();
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  ////////////////////////////////////////////////

  // request = { 
  //   "sql" : "match path=(a:production {'title': 'Haunted House'})-[]-(b:company {'name': 'Ludo Studio'}) return path limit 10" 
  // };
  dbProjects(){
    const url = `${this.apiUrl}/projects`;
    let headers = this.auth.createAuthorizationHeader(this.auth.getToken());
    console.log( `try dbProjects ==> ${url}`);

    let user = this.auth.getUserInfo();
    if( user === null ) return this.handleError( "ERROR: user not found" );

    let request = { "username": user.user_id };
    return this.http
      .post(url, JSON.stringify(request), {headers: headers})
      .toPromise()
      .then(res => {
        //console.log(JSON.stringify( res.json() ));
        return res.json();
      })
      .catch(this.handleError);
  }

  dbProjectGraph(projId:number){
    const url = `${this.apiUrl}/project/data`;
    let headers = this.auth.createAuthorizationHeader(this.auth.getToken());
    console.log( `try dbProjectGraph ==> ${url}`);

    let request = { "id": projId };
    return this.http
      .get(url, {headers: headers, params: request })
      .toPromise()
      .then(res => {
        let result:any = {};
        try {
          result = JSON.parse( res.text() );
        } catch (error) {
          console.error("JSON parse error :\n"+res.text());
        }
        return result;
      })
      .catch(this.handleError);
  }
  
  dbSaveProject(request:any){
    const url = `${this.apiUrl}/project/save`;
    let headers = this.auth.createAuthorizationHeader(this.auth.getToken());
    console.log( `try dbSaveProject ==> ${url}`, request);

    return this.http
      .post(url, JSON.stringify(request), {headers: headers})
      .toPromise()
      .then(res => {
        //console.log(JSON.stringify( res.json() ));
        return res.json();
      })
      .catch(this.handleError);
  }

  dbRemoveProject(projId:number){
    const url = `${this.apiUrl}/project/remove`;
    let headers = this.auth.createAuthorizationHeader(this.auth.getToken());
    console.log( `try dbRemoveProject ==> ${url}`);

    let request = { "id": projId };
    return this.http
      .get(url, {headers: headers, params: request })
      .toPromise()
      .then(res => {
        return res.json();
      })
      .catch(this.handleError);
  }

  ////////////////////////////////////////////////

  dbAdminUsers(){
    const url = `${this.adminUrl}/users`;
    let headers = this.auth.createAuthorizationHeader(this.auth.getToken());
    console.log( `try dbAdminUsers ==> ${url}`);

    return this.http
      .get(url, {headers: headers})
      .toPromise()
      .then(res => {
        return res.json();
      })
      .catch(this.handleError);
  }

  dbAdminRegisterUser(request:any){
    const url = `${this.adminUrl}/user/register`;
    let headers = this.auth.createAuthorizationHeader(this.auth.getToken());
    console.log( `try dbAdminRegisterUser ==> ${url}`, request);

    return this.http
      .post(url, JSON.stringify(request), {headers: headers})
      .toPromise()
      .then(res => {
        //console.log(JSON.stringify( res.json() ));
        return res.json();
      })
      .catch(this.handleError);
  }

  dbAdminUnregisterUser(request:any){
    const url = `${this.adminUrl}/user/unregister`;
    let headers = this.auth.createAuthorizationHeader(this.auth.getToken());
    console.log( `try dbAdminUnregisterUser ==> ${url}`, request);

    return this.http
      .post(url, JSON.stringify(request), {headers: headers})
      .toPromise()
      .then(res => {
        //console.log(JSON.stringify( res.json() ));
        return res.json();
      })
      .catch(this.handleError);
  }
  
  dbAdminSessions(){
    const url = `${this.adminUrl}/sessions`;
    let headers = this.auth.createAuthorizationHeader(this.auth.getToken());
    console.log( `try dbAdminSessions ==> ${url}`);

    return this.http
      .get(url, {headers: headers})
      .toPromise()
      .then(res => {
        return res.json();
      })
      .catch(this.handleError);
  }

  dbAdminLocks(){
    const url = `${this.adminUrl}/locks`;
    let headers = this.auth.createAuthorizationHeader(this.auth.getToken());
    console.log( `try dbAdminLocks ==> ${url}`);

    return this.http
      .get(url, {headers: headers})
      .toPromise()
      .then(res => {
        return res.json();
      })
      .catch(this.handleError);
  }

}