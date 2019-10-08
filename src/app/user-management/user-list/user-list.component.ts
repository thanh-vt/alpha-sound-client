import { Component, OnInit } from '@angular/core';
import {User} from '../../model/user';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  private pageNumber: number;
  private pageSize: number;
  private totalItems: number;
  private message;
  private userList: User[];
  constructor(private userService: UserService) { }

  ngOnInit() {
    console.log('done');
    this.userService.getUserList().subscribe(
      result => {
        if (result != null) {
          this.userList = result.content;
          this.userList.forEach((value, index) => {
            this.userList[index].isDisabled = false;
          });
          this.pageNumber = result.pageable.pageNumber;
          this.pageSize = result.pageable.pageSize;
        }
      }, error => {
      }
    );
  }
}
