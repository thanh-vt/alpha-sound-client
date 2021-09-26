import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../modal/confirmation-modal/confirmation-modal.component';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserProfile } from '../../../model/token-response';
import { AuthService } from '../../../service/auth.service';
import { CommentService } from '../../../service/comment.service';
import { CommentType } from '../../../constant/comment-type';
import { Comment } from '../../../model/comment';
import { PagingInfo } from '../../../model/paging-info';
import { DataUtil } from '../../../util/data-util';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss']
})
export class CommentBoxComponent implements OnChanges {
  currentUser$: Observable<UserProfile>;
  commentPage: PagingInfo<Comment> = DataUtil.initPagingInfo();
  commentUpdateForm: FormGroup = this.fb.group({
    id: [null],
    content: ['']
  });
  commentCreateForm: FormGroup = this.fb.group({
    content: ['']
  });
  editingComment: Comment;
  @Input() id: number;
  @Input() type: CommentType;

  constructor(
    private authService: AuthService,
    private commentService: CommentService,
    private fb: FormBuilder,
    public translate: TranslateService,
    private modalService: NgbModal
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.id) {
      await this.getCommentList(0);
    }
  }

  trackByFn(index: number, comment: Comment): number {
    return comment.id;
  }

  async onCreateComment(event?: KeyboardEvent): Promise<void> {
    event.preventDefault();
    if (!this.checkValid(this.commentCreateForm)) {
      return;
    }
    try {
      const comment: Comment = {
        ...this.commentCreateForm.value,
        commentType: this.type,
        entityId: this.id
      };
      const newComment = await this.commentService.createComment(comment).toPromise();
      this.commentCreateForm.reset();
      if (this.commentPage.content.length === this.commentPage.pageable.pageSize) {
        await this.getCommentList(this.commentPage.pageable.pageNumber);
      } else {
        this.commentPage.content.unshift(newComment);
        ++this.commentPage.totalElements;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async onUpdateComment(comment: Comment, event?: KeyboardEvent): Promise<void> {
    event.preventDefault();
    if (!this.checkValid(this.commentUpdateForm)) {
      return;
    }
    try {
      const updatedComment: Comment = {
        ...this.commentUpdateForm.value,
        commentType: this.type,
        entityId: this.id
      };
      comment.content = (await this.commentService.updateComment(updatedComment).toPromise()).content;
      this.commentUpdateForm.reset();
      if (this.editingComment) {
        this.editingComment.isEditing = false;
      }
      this.editingComment = null;
    } catch (e) {
      console.error(e);
    }
  }

  openDeleteCommentDialog(commentId: number): void {
    const dialogRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    const comp: ConfirmationModalComponent = dialogRef.componentInstance;
    comp.subject = this.translate.instant('common.entity.comment');
    comp.name = '';
    comp.data = commentId;
    const sub: Subscription = dialogRef.closed.subscribe(result => {
      if (result) {
        this.commentService
          .deleteComment(commentId, this.type)
          .pipe(
            finalize(() => {
              sub.unsubscribe();
            })
          )
          .subscribe(async () => {
            await this.getCommentList(this.commentPage.pageable.pageNumber);
          });
      }
    });
  }

  toggleEdit(comment: Comment): void {
    if (this.editingComment) {
      this.editingComment.isEditing = false;
      this.commentUpdateForm.reset();
    }
    this.commentUpdateForm.patchValue(comment);
    this.editingComment = comment;
    this.editingComment.isEditing = true;
  }

  checkValid(formGroup: FormGroup): boolean {
    const val = formGroup.get('content').value;
    return val.length > 0 && val.length <= 500;
  }

  async getCommentList(page: number): Promise<void> {
    this.commentPage = await this.commentService.commentList(this.id, this.type, page).toPromise();
  }
}
