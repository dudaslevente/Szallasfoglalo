import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MessageService } from '../../services/message.service';
import CryptoJS from 'crypto-js';
import uuid from 'uuid';

@Component({
  selector: 'app-restorepass',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './restorepass.component.html',
  styleUrl: './restorepass.component.scss'
})
export class RestorepassComponent implements OnInit{
  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private message: MessageService,
    private router: Router
  ){}

  userID:string = "";
  secret:string = "";
  newpass:string = "";
  newpassconfirm:string = "";
  passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  oldpassHash:string = "";

  changeable:boolean = false;

  ngOnInit(): void {
    this.userID = this.activatedRoute.snapshot.params['userID'];
    this.secret = this.activatedRoute.snapshot.params['secret'];

    this.api.read('users', 'id', 'eq', this.userID).subscribe((res:any) => {
      if(res){
        if(res[0].secret != this.secret){
          this.changeable = false;
          return;
        }
        this.changeable = true;
        this.oldpassHash = res[0].passwd;
      }
    });
  }

  save(){
    if(!this.newpass || this.newpassconfirm){
      this.message.showMessage('HIBA', 'Nem adtál meg minden adatot!', 'danger');
      return;
    }

    if(this.newpass != this.newpassconfirm){
      this.message.showMessage('HIBA', 'A megadott jelszavak nem egyeznek!', 'danger');
      return;
    }

    if(!this.newpass.match(this.passwdRegExp)){
      this.message.showMessage('HIBA', 'A megadott jelszavak nem elég biztonságosak!', 'danger');
      return;
    }

    this.newpass = CryptoJS.SHA1(this.newpass).toString();
    if(this.newpass == this.oldpassHash){
      this.message.showMessage('HIBA', 'A megadott jelszó megegyezik a jelenlegivel!', 'danger');
      return;
    }

    let data = {
      passwd: this.newpass,
      secret: uuid.v4()
    }

    this.api.updatePasswd(this.userID, data).subscribe(res => {
      this.message.showMessage('OK', 'Jelszó módosítva', 'success');
      this.router.navigate(['/login']);
      return;
    });
  }
}
