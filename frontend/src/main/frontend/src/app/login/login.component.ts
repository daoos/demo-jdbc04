import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TdLoadingService } from '@covalent/core';

import * as GlobalConfig from '../global.config';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';

import { AgensRequestConnect } from '../../models/agens-request-connect';


@Component({
  selector: 'ag-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {

  request: AgensRequestConnect;

  isChecked:boolean = false;
  returnUrl: string;
  databaseValue: string;

  data = [
    {viewValue: 'BIT'},
    {viewValue: 'NINE'},
    {viewValue: 'MANAGER'}
  ];
    
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private alertService: AlertService,

    private _loadingService: TdLoadingService
  ) { 
    this.request = new AgensRequestConnect();
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.isChecked = false;

    // for TEST
    this.request.host = '127.0.0.1';
    this.request.port = '6179';
    if( GlobalConfig.DEV_MODE ){
      this.request.host = '27.117.163.21';
      this.request.port = '15602';
    }

    this.request.db = 'imdb';
    this.request.user_id = 'agraph';
    this.request.user_pw = '';
  }

  ngAfterViewInit(){
    // reset login status
    this.auth.logout();

    // remember me
    let rememberMe = this.auth.getStorage("rememberMe");
    console.log( "rememberMe="+rememberMe );
    if( rememberMe && rememberMe == "true" ){
      this.isChecked = true;
      let host = this.auth.getStorage("rememberMe_host");
      if( host && host !== "" ) this.request.host = host;
      let port = this.auth.getStorage("rememberMe_port");
      if( port && port !== "" ) this.request.port = port;
      let db = this.auth.getStorage("rememberMe_db");
      if( db && db !== "" ) this.request.db = db;
      let user_id = this.auth.getStorage("rememberMe_user_id");
      if( user_id && user_id !== "" ) this.request.user_id = user_id;
      let user_pw = this.auth.getStorage("rememberMe_user_pw");
      if( user_pw && user_pw !== "" ) this.request.user_pw = user_pw;
    }
  }

  login() {
    this.auth.login(this.request)
        .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.alertService.error(error);
            });
  }

  onChangeCheckbox(event){
    // if rememberMe is checked
    if( event.checked ){
      this.auth.setStorage("rememberMe", "true", (24*60*60));
      this.auth.setStorage("rememberMe_host", this.request.host, (24*60*60));
      this.auth.setStorage("rememberMe_port", this.request.port, (24*60*60));
      this.auth.setStorage("rememberMe_db", this.request.db, (24*60*60));
      this.auth.setStorage("rememberMe_user_id", this.request.user_id, (24*60*60));
      this.auth.setStorage("rememberMe_user_pw", this.request.user_pw, (24*60*60));
    }
    else{
      this.auth.removeStorage("rememberMe");
      this.auth.removeStorage("rememberMe_host");
      this.auth.removeStorage("rememberMe_port");
      this.auth.removeStorage("rememberMe_db");
      this.auth.removeStorage("rememberMe_user_id");
      this.auth.removeStorage("rememberMe_user_pw");
    }
  }

}