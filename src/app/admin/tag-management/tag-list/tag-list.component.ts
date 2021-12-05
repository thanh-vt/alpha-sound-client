import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagingInfo } from '../../../model/paging-info';
import { DataUtil } from '../../../util/data-util';
import { TranslateService } from '@ngx-translate/core';
import { VgLoaderService, VgToastService } from 'ngx-vengeance-lib';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { Tag } from '../../../model/tag';
import { TagService } from '../../../service/tag.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {
  tagCreateForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]]
  });
  tagUpdateForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', [Validators.required]]
  });
  tagPage: PagingInfo<Tag> = DataUtil.initPagingInfo();
  currentEditing: Tag;

  constructor(
    private fb: FormBuilder,
    private tagService: TagService,
    private translate: TranslateService,
    private toastService: VgToastService,
    private loaderService: VgLoaderService,
    private modalService: NgbModal
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getTagList(0);
  }

  async getTagList(page: number): Promise<void> {
    this.tagPage = await firstValueFrom(this.tagService.getTagList(page));
  }

  toggleEdit(tag: Tag, val?: boolean): void {
    if (this.currentEditing) {
      this.currentEditing.editing = false;
    }
    this.currentEditing = tag;
    this.currentEditing.editing = val;
    this.tagUpdateForm.patchValue(this.currentEditing);
  }

  createTag(): void {
    this.tagCreateForm.markAllAsTouched();
    if (this.tagCreateForm.invalid) {
      return;
    }
    this.tagService.createTag(this.tagCreateForm.getRawValue()).subscribe(async next => {
      console.log(next);
      this.toastService.success({ text: this.translate.instant('feature.tag.create_success') });
      this.tagCreateForm.reset();
      await this.getTagList(this.tagPage.pageable?.pageNumber);
    });
  }

  updateTag(i: number): void {
    this.tagUpdateForm.markAllAsTouched();
    if (this.tagUpdateForm.invalid) {
      return;
    }
    const updatedTag = this.tagUpdateForm.getRawValue();
    this.tagService.updateTag(updatedTag, this.currentEditing?.id).subscribe(next => {
      this.tagPage.content[i] = next;
      this.toastService.success({ text: this.translate.instant('feature.tag.update_success') });
    });
  }

  async openDeleteDialog(event: Event, tag: Tag): Promise<void> {
    event.stopPropagation();
    const ref = this.modalService.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    ref.componentInstance.subject = this.translate.instant('common.entity.tag');
    ref.componentInstance.name = tag.name;
    ref.componentInstance.data = true;
    try {
      const result = await ref.result;
      if (result) {
        this.loaderService.loading(true);
        await firstValueFrom(this.tagService.deleteTag(tag.id));
        this.toastService.success({ text: this.translate.instant('feature.tag.delete_success') });
        await this.getTagList(this.tagPage?.pageable?.pageNumber);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }
}
