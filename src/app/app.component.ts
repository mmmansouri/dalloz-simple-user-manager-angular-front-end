import { Component, OnInit, Input } from '@angular/core';
import { User } from './user';
import { UserService } from './user-service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Dalloz simple user manager application';
  userDialog: boolean;

  creationMode = true;

  users: User[];

  user: User;

  selectedUsers: User[];

  submitted: boolean;

  constructor(private userService: UserService, private messageService: MessageService, private confirmationService: ConfirmationService,
              private router: Router) { }

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
    this.creationMode = true;
  }

  editUser(user: User) {
    this.user = {...user};
    this.creationMode = false;
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
        this.userService.deleteUser(user.id).subscribe(data => {
          //do nothing
        });
      }
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;

    if(this.creationMode) {
      this.userService.createUser(this.user).subscribe(data => {
          this.user = data;
          this.users.push(this.user);
          this.users = [...this.users];
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Created', life: 4000});
          this.router.navigate(['/'])
        },
        error => {
          this.messageService.add({severity:'failure', summary: 'Failure', detail: 'User creation failed : ' + error, life: 4000});
        }
      );
    } else {
      this.userService.updateUser(this.user)
        .subscribe(data => {
            this.user = data;
            this.users[this.findIndexById(this.user.id)] = this.user;
            this.users = [...this.users];
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Updated', life: 4000});
            this.router.navigate(['/'])
          },
          error => {
            this.messageService.add({severity:'failure', summary: 'Failure', detail: 'User Update failed : '+error, life: 4000});
          }
        );
    }

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
}
