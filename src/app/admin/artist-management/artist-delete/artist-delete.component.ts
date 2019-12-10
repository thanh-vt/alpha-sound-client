import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ArtistService} from '../../../services/artist.service';
import {Subscription} from 'rxjs';
import {Artist} from '../../../models/artist';

@Component({
  selector: 'app-artist-delete',
  templateUrl: './artist-delete.component.html',
  styleUrls: ['./artist-delete.component.scss']
})
export class ArtistDeleteComponent implements OnInit, OnDestroy {
  deleted: boolean;
  @Input() artist: Artist;
  loading = false;
  message: string;
  error = false;
  private subscription: Subscription = new Subscription();
  @Output() deleteArtist = new EventEmitter();

  constructor(private artistService: ArtistService) {
  }

  ngOnInit() {
    this.deleted = false;
  }

  onSubmit() {
    this.subscription.add(
      this.artistService.deleteArtist(this.artist.id).subscribe(
        () => {
          this.deleteArtist.emit();
          this.error = false;
          this.deleted = true;
          this.message = 'Artist deleted successfully!';
        },
        error => {
          this.error = true;
          this.message = 'Failed to delete artist. An error has occurred.';
          console.log(error.message);
        }
      ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
