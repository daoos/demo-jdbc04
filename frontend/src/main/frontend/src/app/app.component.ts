import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

@Component({
  selector: 'ag-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {

  constructor(private _iconRegistry: MdIconRegistry,
              private _domSanitizer: DomSanitizer) {
    this._iconRegistry.addSvgIconInNamespace('assets', 'teradata',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/teradata.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'github',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'covalent',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/covalent.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'covalent-mark',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/covalent-mark.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'teradata-ux',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/teradata-ux.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'appcenter',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/appcenter.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'listener',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/listener.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'querygrid',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/querygrid.svg'));

    //////////////////////////////////////////////////////////////////

    this._iconRegistry.addSvgIconInNamespace('assets', 'cancel',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_cancel_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'build',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_build_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'lock_open',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_lock_open_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'today',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_today_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'alarm_on',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_alarm_on_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'dehaze',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_dehaze_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'exit_to_app',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_exit_to_app_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'keyboard_arrow_up',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_keyboard_arrow_up_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'keyboard_arrow_left',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_keyboard_arrow_left_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'keyboard_arrow_right',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_keyboard_arrow_right_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'pie_chart',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_pie_chart_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'dashboard',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_dashboard_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'widgets',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_widgets_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'subdirectory_arrow_right',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_subdirectory_arrow_right_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'help',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_help_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'open_with',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_open_with_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'settings',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_settings_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'image',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_image_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'style',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_style_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'gradient',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_gradient_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'file_download',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_file_download_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'photo',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_photo_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'insert_link',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_insert_link_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'textsms',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_textsms_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'skip_next',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_skip_next_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'skip_previous',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_skip_previous_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'save',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_save_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'search',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_search_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'web',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_web_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'close',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'play_circle_outline',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_play_circle_outline_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'content_copy',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_content_copy_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'refresh',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_refresh_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'reply',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_reply_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'insert_drive_file',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_insert_drive_file_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'folder',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_folder_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'location_on',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_location_on_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'chevron_right',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_chevron_right_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'add',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'turned_in_not',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_turned_in_not_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'turned_in',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_turned_in_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'cloud',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_cloud_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'bubble_chart',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_bubble_chart_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'desktop_windows',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_desktop_windows_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'delete',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_delete_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'equalizer',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_equalizer_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'highlight',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_highlight_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'lock',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_lock_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'person',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_person_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'share',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_share_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'group_work',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_group_work_black_24px.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'flash_on',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_flash_on_black_24px.svg'));

  }

  ngOnInit(){
    // console.log("AppComponent.ngOnInit():");
  }

  ngAfterViewInit(){
    // console.log("AppComponent.ngAfterViewInit():");    
  }

}
