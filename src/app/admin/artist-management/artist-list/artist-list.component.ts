import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArtistService } from '../../../service/artist.service';
import { Artist } from '../../../model/artist';
import { firstValueFrom, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { ArtistEditComponent } from '../artist-edit/artist-edit.component';
import { CreateArtistComponent } from '../create-artist/create-artist.component';
import { VgLoaderService } from 'ngx-vengeance-lib';
import { SongService } from '../../../service/song.service';
import { PagingInfo } from '../../../model/paging-info';
import { DataUtil } from '../../../util/data-util';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent implements OnInit, OnDestroy {
  artistPage: PagingInfo<Artist> = DataUtil.initPagingInfo();
  loading: boolean;
  subscription: Subscription = new Subscription();

  constructor(
    private artistService: ArtistService,
    private songService: SongService,
    public translate: TranslateService,
    private ngbModal: NgbModal,
    private loaderService: VgLoaderService
  ) {}

  ngOnInit(): void {
    this.getArtistList().finally();
  }

  async getArtistList(page?: number): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.artistPage = await firstValueFrom(this.artistService.artistList(page ?? this.artistPage.pageable.pageNumber));
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }

  async openCreateDialog(event: Event): Promise<void> {
    event.stopPropagation();
    const ref = this.ngbModal.open(CreateArtistComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    await ref.result;
    await this.getArtistList();
  }

  async openEditDialog(artist: Artist, event: Event): Promise<void> {
    event.stopPropagation();
    const ref = this.ngbModal.open(ArtistEditComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    ref.componentInstance.artistId = artist.id;
    const editedArtist = (await ref.result) as Artist;
    if (editedArtist) {
      const index = this.artistPage.content.indexOf(artist);
      this.artistPage.content.splice(index, 1, editedArtist);
    }

    // await this.getArtistList();
  }

  async openDeleteDialog(artist: Artist, event: Event): Promise<void> {
    event.stopPropagation();
    const ref = this.ngbModal.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    ref.componentInstance.subject = this.translate.instant('common.entity.artist');
    ref.componentInstance.name = artist.name;
    try {
      const result = await ref.result;
      if (result) {
        this.loaderService.loading(true);
        await firstValueFrom(this.artistService.deleteArtist(artist.id));
        await this.getArtistList();
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
