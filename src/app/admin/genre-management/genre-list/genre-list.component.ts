import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagingInfo } from '../../../model/paging-info';
import { DataUtil } from '../../../util/data-util';
import { TranslateService } from '@ngx-translate/core';
import { VgLoaderService, VgToastService } from 'ngx-vengeance-lib';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { GenreService } from '../../../service/genre.service';
import { Genre } from '../../../model/genre';

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.scss']
})
export class GenreListComponent implements OnInit {
  genreCreateForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]]
  });
  genreUpdateForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', [Validators.required]]
  });
  genrePage: PagingInfo<Genre> = DataUtil.initPagingInfo();
  currentEditing: Genre;

  constructor(
    private fb: FormBuilder,
    private genreService: GenreService,
    private translate: TranslateService,
    private toastService: VgToastService,
    private loaderService: VgLoaderService,
    private modalService: NgbModal
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getGenreList(0);
  }

  async getGenreList(page: number): Promise<void> {
    this.genrePage = await this.genreService.getGenreList(page).toPromise();
  }

  toggleEdit(genre: Genre, val?: boolean): void {
    if (this.currentEditing) {
      this.currentEditing.editing = false;
    }
    this.currentEditing = genre;
    this.currentEditing.editing = val;
    this.genreUpdateForm.patchValue(this.currentEditing);
  }

  createGenre(): void {
    this.genreCreateForm.markAllAsTouched();
    if (this.genreCreateForm.invalid) {
      return;
    }
    this.genreService.createGenre(this.genreCreateForm.getRawValue()).subscribe(async next => {
      console.log(next);
      this.toastService.success({ text: this.translate.instant('feature.genre.create_success') });
      this.genreCreateForm.reset();
      await this.getGenreList(this.genrePage.pageable?.pageNumber);
    });
  }

  updateGenre(i: number): void {
    this.genreUpdateForm.markAllAsTouched();
    if (this.genreUpdateForm.invalid) {
      return;
    }
    const updatedGenre = this.genreUpdateForm.getRawValue();
    this.genreService.updateGenre(updatedGenre, this.currentEditing?.id).subscribe(next => {
      this.genrePage.content[i] = next;
      this.toastService.success({ text: this.translate.instant('feature.genre.update_success') });
    });
  }

  async openDeleteDialog(event: Event, genre: Genre): Promise<void> {
    event.stopPropagation();
    const ref = this.modalService.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    ref.componentInstance.subject = this.translate.instant('common.entity.genre');
    ref.componentInstance.name = genre.name;
    ref.componentInstance.data = true;
    try {
      const result = await ref.result;
      if (result) {
        this.loaderService.loading(true);
        await this.genreService.deleteGenre(genre.id).toPromise();
        this.toastService.success({ text: this.translate.instant('feature.genre.delete_success') });
        await this.getGenreList(this.genrePage?.pageable?.pageNumber);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }
}
