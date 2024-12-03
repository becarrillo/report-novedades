import { Component, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  animations: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hide = signal<boolean>(true);
  logBtnsClasses = signal<LoginBtnsClasses>({
    "authorization-visible-btn": false,
    "signout-visible-btn": false
  });

  private readonly token : string | null = window.localStorage.getItem('token');

  constructor() {
    this.token = window.localStorage.getItem('token');
    this.token!==null && this.token.length>0 ? (
      this.logBtnsClasses.set({
        "authorization-visible-btn": false,
        "signout-visible-btn": true
      })
    ) : (
      window.localStorage.setItem('data', ''),
      this.logBtnsClasses.set({
        "authorization-visible-btn": true,
        "signout-visible-btn": false
      })
    );
  }
  
  clickEvent(event: MouseEvent) : void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  getToken() : string | null {
    return this.token;
  }

  legendIsNecessary() : boolean {
    return (
      window.localStorage!.getItem('token')===null || 
      window.localStorage.getItem('token')!.length===0 ? 
        true : false
    )
  }
}

interface LoginBtnsClasses {
  'authorization-visible-btn': boolean;
  'signout-visible-btn': boolean;
}