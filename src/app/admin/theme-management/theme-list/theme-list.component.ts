import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from '../../../service/theme.service';
import { PagingInfo } from '../../../model/paging-info';
import { Theme } from '../../../model/theme';
import { DataUtil } from '../../../util/data-util';
import { VgLoaderService, VgToastService } from 'ngx-vengeance-lib';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationModalComponent } from '../../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss']
})
export class ThemeListComponent implements OnInit {
  themeCreateForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]]
  });
  themeUpdateForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', [Validators.required]]
  });
  themePage: PagingInfo<Theme> = DataUtil.initPagingInfo();
  currentEditing: Theme;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private translate: TranslateService,
    private toastService: VgToastService,
    private loaderService: VgLoaderService,
    private modalService: NgbModal
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getThemeList(0);
  }

  async getThemeList(page: number): Promise<void> {
    this.themePage = await firstValueFrom(this.themeService.getThemeList(page));
  }

  toggleEdit(theme: Theme, val?: boolean): void {
    if (this.currentEditing) {
      this.currentEditing.editing = false;
    }
    this.currentEditing = theme;
    this.currentEditing.editing = val;
    this.themeUpdateForm.patchValue(this.currentEditing);
  }

  createTheme(): void {
    this.themeCreateForm.markAllAsTouched();
    if (this.themeCreateForm.invalid) {
      return;
    }
    this.themeService.createTheme(this.themeCreateForm.getRawValue()).subscribe(async next => {
      console.log(next);
      this.toastService.success({ text: this.translate.instant('feature.theme.create_success') });
      this.themeCreateForm.reset();
      await this.getThemeList(this.themePage.pageable?.pageNumber);
    });
  }

  updateTheme(i: number): void {
    this.themeUpdateForm.markAllAsTouched();
    if (this.themeUpdateForm.invalid) {
      return;
    }
    const updatedTheme = this.themeUpdateForm.getRawValue();
    this.themeService.updateTheme(updatedTheme, this.currentEditing?.id).subscribe(next => {
      this.themePage.content[i] = next;
      this.toastService.success({ text: this.translate.instant('feature.theme.update_success') });
    });
  }

  async openDeleteDialog(event: Event, theme: Theme): Promise<void> {
    event.stopPropagation();
    const ref = this.modalService.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    ref.componentInstance.subject = this.translate.instant('common.entity.theme');
    ref.componentInstance.name = theme.name;
    ref.componentInstance.data = true;
    try {
      const result = await ref.result;
      if (result) {
        this.loaderService.loading(true);
        await firstValueFrom(this.themeService.deleteTheme(theme.id));
        this.toastService.success({ text: this.translate.instant('feature.theme.delete_success') });
        await this.getThemeList(this.themePage?.pageable?.pageNumber);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }
}
