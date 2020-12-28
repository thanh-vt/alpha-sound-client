import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {AdminService} from '../../../service/admin.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit {
  deleted: boolean;
  @Input() username: string;
  @Input() id: number;
  loading = false;
  message: string;
  error = false;
  subscription: Subscription = new Subscription();
  @Output() deleteUser = new EventEmitter();
  constructor(private adminService: AdminService, private modalService: NgbModal, private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.deleted = false;
  }
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
    }, (reason) => {
      this.message = '';
      console.log(this.getDismissReason(reason));
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  onSubmit() {
    this.subscription.add(
      this.adminService.deleteUser(this.id).subscribe(
        result => {
          this.deleteUser.emit();
          console.log(this.id);
          this.error = false;
          this.deleted = true;
          this.message = 'User deleted successfully!';
        },
        error => {
          this.error = true;
          this.message = 'Failed to delete user. Cause: ' + error.message;
        }
      ));
  }

}
