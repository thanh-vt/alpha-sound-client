import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { artistModelToImgSrcMapper, artistModelToTextMapper } from '../../../util/mapper.util';
import { ArtistService } from '../../../service/artist.service';
import { SongUploadData } from '../../../model/song-upload-data';
import { AlbumUploadData } from '../../../model/album-upload-data';

@Component({
  selector: 'app-artist-add-suggestion',
  templateUrl: './artist-add-suggestion.component.html',
  styleUrls: ['./artist-add-suggestion.component.scss']
})
export class ArtistAddSuggestionComponent implements OnInit {
  @Input() uploadData!: SongUploadData | AlbumUploadData;
  artistFormArr!: FormArray;
  modelToTextMapper = artistModelToTextMapper;
  modelToImgSrcMapper = artistModelToImgSrcMapper;

  constructor(private fb: FormBuilder, private artistService: ArtistService) {}

  ngOnInit(): void {
    this.artistFormArr = this.uploadData.formGroup.get('artists') as FormArray;
  }

  addArtist(): void {
    if (this.artistFormArr.length < 5) {
      this.artistFormArr.push(SongUploadData.createArtist(this.fb));
    }
  }

  removeArtist(index: number): void {
    this.artistFormArr.removeAt(index);
  }

  suggestArtist(value: string): void {
    this.artistService.searchArtistByName(value).subscribe(artists => (this.uploadData.filteredArtists = artists));
  }
}
