import { Component, OnInit } from '@angular/core';
import { Country } from '../../../model/country';
import { CountryService } from '../../../service/country.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { VgLoaderService, VgToastService } from 'ngx-vengeance-lib';
import { PagingInfo } from '../../../model/paging-info';
import { DataUtil } from '../../../util/data-util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent implements OnInit {
  countryCreateForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]]
  });
  countryUpdateForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', [Validators.required]]
  });
  countryPage: PagingInfo<Country> = DataUtil.initPagingInfo();
  currentEditing: Country;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private translate: TranslateService,
    private loadingService: VgLoaderService,
    private ngbModal: NgbModal,
    private toastService: VgToastService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getCountryList();
  }

  async getCountryList(page = 0): Promise<void> {
    this.countryPage = await this.countryService.getCountryList(page).toPromise();
  }

  toggleEdit(country: Country, val?: boolean): void {
    if (this.currentEditing) {
      this.currentEditing.editing = false;
    }
    this.currentEditing = country;
    this.currentEditing.editing = val;
    this.countryUpdateForm.patchValue(this.currentEditing);
  }

  createCountry(): void {
    this.countryCreateForm.markAllAsTouched();
    if (this.countryCreateForm.invalid) {
      return;
    }
    this.countryService.createCountry(this.countryCreateForm.getRawValue()).subscribe(async next => {
      console.log(next);
      this.toastService.success({ text: this.translate.instant('feature.country.create_success') });
      this.countryCreateForm.reset();
      await this.getCountryList(this.countryPage.pageable?.pageNumber);
    });
  }

  updateCountry(i: number): void {
    this.countryUpdateForm.markAllAsTouched();
    if (this.countryUpdateForm.invalid) {
      return;
    }
    const updatedCountry = this.countryUpdateForm.getRawValue();
    this.countryService.updateCountry(updatedCountry, this.currentEditing?.id).subscribe(next => {
      this.countryPage.content[i] = next;
      this.toastService.success({ text: this.translate.instant('feature.country.update_success') });
    });
  }

  async openDeleteDialog(event: Event, country: Country): Promise<void> {
    event.stopPropagation();
    const ref = this.ngbModal.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    ref.componentInstance.subject = this.translate.instant('common.entity.country');
    ref.componentInstance.name = country.name;
    ref.componentInstance.data = true;
    try {
      const result = await ref.result;
      if (result) {
        this.loadingService.loading(true);
        await this.countryService.deleteCountry(country.id).toPromise();
        this.toastService.success({ text: 'feature.country.delete_success' });
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loadingService.loading(false);
    }
  }
}
