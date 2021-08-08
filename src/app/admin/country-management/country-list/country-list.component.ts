import { Component, OnInit } from '@angular/core';
import { Country } from '../../../model/country';
import { CountryService } from '../../../service/country.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../shared/service/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCountryComponent } from '../create-country/create-country.component';
import { ConfirmationModalComponent } from '../../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { ArtistEditComponent } from '../../artist-management/artist-edit/artist-edit.component';
import { TOAST_TYPE, VgToastService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent implements OnInit {
  countryList: Country[];
  message: string;
  pageNumber: number;
  subscription: Subscription = new Subscription();

  constructor(
    private countryService: CountryService,
    private translate: TranslateService,
    private loadingService: LoadingService,
    private ngbModal: NgbModal,
    private toastService: VgToastService
  ) {}

  ngOnInit(): void {
    this.countryList = [];
    this.pageNumber = 0;
    this.onScroll(this.pageNumber).finally();
  }

  async onScroll(page: number): Promise<void> {
    try {
      this.loadingService.show();
      this.countryList = (await this.countryService.getCountryList(page).toPromise()).content;
    } catch (e) {
      console.error(e);
    } finally {
      this.loadingService.hide();
    }
  }

  async openCreateDialog(event: Event): Promise<void> {
    event.stopPropagation();
    const ref = this.ngbModal.open(CreateCountryComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: true,
      size: 'md'
    });
    await ref.result;
    await this.onScroll(this.pageNumber);
  }

  async openEditDialog(country: Country, event: Event): Promise<void> {
    event.stopPropagation();
    const ref = this.ngbModal.open(ArtistEditComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: true,
      size: 'md'
    });
    ref.componentInstance.country = country;
    await ref.result;
    await this.onScroll(this.pageNumber);
  }

  async openDeleteDialog(country: Country, event: Event): Promise<void> {
    event.stopPropagation();
    const ref = this.ngbModal.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: true,
      size: 'md'
    });
    ref.componentInstance.subject = this.translate.instant('common.entity.country');
    ref.componentInstance.name = country.name;
    try {
      const result = await ref.result;
      if (result) {
        this.loadingService.show();
        await this.countryService.deleteCountry(country.id).toPromise();
        this.toastService.show({ text: 'Country deleted successfully' }, { type: TOAST_TYPE.SUCCESS });
        await this.onScroll(this.pageNumber).finally();
      }
    } catch (e) {
      this.toastService.show({ text: 'Failed to delete country. An error has occurred' }, { type: TOAST_TYPE.ERROR });
      console.error(e);
    } finally {
      this.loadingService.hide();
    }
  }
}
