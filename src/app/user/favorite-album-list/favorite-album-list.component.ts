import {Component, OnInit} from '@angular/core';
import {Album} from '../../model/album';
import {AlbumService} from '../../service/album.service';

@Component({
  selector: 'app-favorite-album-list',
  templateUrl: './favorite-album-list.component.html',
  styleUrls: ['./favorite-album-list.component.scss']
})
export class FavoriteAlbumListComponent implements OnInit {

  private pageNumber: number;
  private pageSize: number;
  private totalItems: number;
  private message;
  private albumList: [Album[]];


  constructor(private albumService: AlbumService) {
  }

  ngOnInit() {
    this.albumService.getAlbumList().subscribe(
      result => {
        if (result != null) {
          this.albumList = result.content;
          this.albumList.forEach((value, index) => {
            this.albumList[index][0].isDisabled = false;
          });
          this.pageNumber = result.pageable.pageNumber;
          this.pageSize = result.pageable.pageSize;
        }
      }, error => {
        this.message = 'Cannot retrieve album list. Cause: ' + error.songsMessage;
      });
  }

}
