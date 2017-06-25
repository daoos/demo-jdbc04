import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, NgModel } from '@angular/forms';

import { TdMediaService, TdDialogService } from '@covalent/core';
import { Router } from '@angular/router';

import { WindowRefService } from '../../../services/window-ref.service';
import { AgensApiService } from '../../../services/agens-api.service';
import { DialogsService } from '../../../services/dialogs.service';

// ** NOTE : 포함하면 AOT 컴파일 오류 떨어짐 (row detail 기능 때문에 사용)
import { DatatableComponent } from '@swimlane/ngx-datatable/src/components/datatable.component';

@Component({
  selector: 'ag-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {

  loading_users:boolean = false;
  tableRows: any[] = [];

  toggle_add_user:boolean = false;
  newUser:any = { 
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    roles: "ROLE_USER"
  };

  sessionRows: any[] = [];
  lockRows: any[] = [];

  // ** NOTE : 포함하면 AOT 컴파일 오류 떨어짐 (offset 지정 기능 때문에 사용)
  @ViewChild('adminUsersTable') adminUsersTable: any;
  @ViewChild('adminSessionsTable') adminSessionsTable: any;
  @ViewChild('adminLocksTable') adminLocksTable: any;

  constructor(
    public media: TdMediaService,
    private el: ElementRef,
    private _dialogService: TdDialogService,    
    private winRef: WindowRefService,
    private apiSerivce: AgensApiService,
  ) { }

  ngOnInit() {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
  }

  ngAfterViewInit(){
    this.loadSessions();
    this.loadUsers();
    this.loadLocks();
  }

  loadUsers(){
    this.loading_users = true;
    this.apiSerivce.dbAdminUsers()
        .then(res => {
          this.tableRows = res;          
          /*this.tableRows = */this.tableRows.map(function(row){ 
            row.enabled_id = row.enabled == 'true' ? true : false;
            let total = row.authorities.reduce(function(total, item){
              total.authority.push(item.authority);
              return total;
            }, {authority:[]}); 
            row.authorities_text = total.authority.join(', ');
          });
          this.adminUsersTable.offset = 0;
          this.loading_users = false;
        });
  }

  loadSessions(){
    this.apiSerivce.dbAdminSessions()
        .then(res => {
          this.sessionRows = res;
          this.adminSessionsTable.offset = 0;
        });
  }

  loadLocks(){
    this.apiSerivce.dbAdminLocks()
        .then(res => {
          this.lockRows = res;          
          this.adminLocksTable.offset = 0;
        });
  }

  // Table page event
  onTablePage(pageNumber:number) {
    console.log(`ngx_datatable: pageNumber=${pageNumber}`);
  }

  toggleAddUser(){
    this.toggle_add_user = !this.toggle_add_user;
    if( !this.toggle_add_user ){
      this.newUser = { 
        username: "",
        password: "",
        firstname: "",
        lastname: "",
        email: "",
        roles: "ROLE_USER"
      };
    }
  }

  registerUser(){
    this.apiSerivce.dbAdminRegisterUser( this.newUser )
        .then(res => {
          this.toggleAddUser();
          this.loadUsers();
        });        
  }

  unregisterUser(username:string){
    let request = { "username": username };
    this.apiSerivce.dbAdminUnregisterUser( request )
        .then(res => {
          this.loadUsers();
        });
  }

  toggleUserEnabled(username:string, enabled:string){
    this._dialogService.openAlert({ message: "Not yet implemented", title: "SORRY!!"});
  }

}
/*
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export class FormlayoutComponent {
    private emailFormControl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);
}
*/