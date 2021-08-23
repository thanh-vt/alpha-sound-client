import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArtistService } from '../../../service/artist.service';
import { Artist } from '../../../model/artist';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { ArtistEditComponent } from '../artist-edit/artist-edit.component';
import { CreateArtistComponent } from '../create-artist/create-artist.component';
import { VgLoaderService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent implements OnInit, OnDestroy {
  artistList: Artist[];
  message: string;
  subscription: Subscription = new Subscription();
  loading: boolean;

  constructor(
    private artistService: ArtistService,
    public translate: TranslateService,
    private ngbModal: NgbModal,
    private loaderService: VgLoaderService
  ) {}

  ngOnInit() {
    this.getArtistList().finally();
  }

  async getArtistList(): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.artistList = (await this.artistService.artistList().toPromise()).content;
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
      scrollable: true,
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
      scrollable: true,
      size: 'md'
    });
    ref.componentInstance.artist = artist;
    await ref.result;
    await this.getArtistList();
  }

  async openDeleteDialog(artist: Artist, event: Event): Promise<void> {
    event.stopPropagation();
    const ref = this.ngbModal.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: true,
      size: 'md'
    });
    ref.componentInstance.subject = this.translate.instant('common.entity.artist');
    ref.componentInstance.name = artist.name;
    try {
      const result = await ref.result;
      if (result) {
        this.loaderService.loading(true);
        await this.artistService.deleteArtist(artist.id).toPromise();
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
