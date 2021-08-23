import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Progress } from '../../../model/progress';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { CountryService } from '../../../service/country.service';
import { Country } from '../../../model/country';
import { TOAST_TYPE, VgToastService } from 'ngx-vengeance-lib';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-country',
  templateUrl: './edit-country.component.html',
  styleUrls: ['./edit-country.component.scss']
})
export class EditCountryComponent implements OnInit {
  @Input() country: Country;
  countryUpdateForm: FormGroup;
  isImageFileChoosen = false;
  imageFileName = '';
  formData = new FormData();
  file: any;
  subscription: Subscription = new Subscription();
  submitted: boolean;
  progress: Progress = { value: 0 };

  constructor(
    private countryService: CountryService,
    private fb: FormBuilder,
    private ngbActiveModal: NgbActiveModal,
    private toastService: VgToastService
  ) {}

  ngOnInit() {
    this.countryUpdateForm = this.fb.group({
      name: [this.country.name, Validators.required]
    });
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.isImageFileChoosen = true;
      this.imageFileName = event.target.files[0].name;
    }
  }

  displayProgress(event, progress: Progress): boolean {
    switch (event.type) {
      case HttpEventType.Sent:
        console.log('Request has been made!');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Response header has been received!');
        break;
      case HttpEventType.UploadProgress:
        progress.value = Math.round((event.loaded / event.total) * 100);
        console.log(`Uploaded! ${progress.value}%`);
        break;
      case HttpEventType.Response: {
        console.log('Song successfully created!', event.body);
        const complete = setTimeout(() => {
          progress.value = 0;
          const navigation = setInterval(() => {
            this.navigate();
            clearTimeout(navigation);
            clearTimeout(complete);
          }, 2000);
        }, 500);
        return true;
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    this.formData.append('country', this.file);
    this.countryService.updateCountry(this.formData, this.country.id).subscribe((event: HttpEvent<any>) => {
      if (this.displayProgress(event, this.progress)) {
        this.toastService.show({ text: 'Update country successfully' }, { type: TOAST_TYPE.SUCCESS });
        this.ngbActiveModal.close(this.country);
      }
    });
  }

  close() {
    this.ngbActiveModal.close();
  }

  navigate() {
    location.replace('/admin/country-management');
  }
}
