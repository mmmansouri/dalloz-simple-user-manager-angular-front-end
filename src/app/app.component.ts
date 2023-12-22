import { Component, OnInit, Input } from '@angular/core';
import { User } from './user';
import { UserService } from './user-service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {response} from 'express';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Simple user manager application';
  userDialog: boolean;

  users: User[];

  user: User;

  selectedUsers: User[];

  submitted: boolean;

  constructor(private userService: UserService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe( response => {
      this.users = response.map( item => {
        return new User(
          item.id,
          item.firstname,
          item.lastname,
          item.email
        );
      });
    });
  }

  openNew() {
    this.user = {};
    this.submitted = false;
    this.userDialog = true;
  }

  editUser(user: User) {
    this.user = {...user};
    this.userDialog = true;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.firstname + ' '+ user.lastname + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter(val => val.id !== user.id);
        this.user = {};
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Deleted', life: 3000});
      }
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;
      if (this.user.id) {
        this.users[this.findIndexById(this.user.id)] = this.user;
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Updated', life: 3000});
      }
      else {
        this.user.id = this.createId();
        this.users.push(this.user);
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Created', life: 3000});
      }

      this.users = [...this.users];
      this.userDialog = false;
      this.user = {};

  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
