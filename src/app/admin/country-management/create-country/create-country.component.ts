import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Progress } from '../../../model/progress';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { CountryService } from '../../../service/country.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-country',
  templateUrl: './create-country.component.html',
  styleUrls: ['./create-country.component.scss']
})
export class CreateCountryComponent implements OnInit, OnDestroy {
  constructor(private countryService: CountryService, private fb: FormBuilder, private ngbActiveModal: NgbActiveModal) {}

  submitted = false;
  isImageFileChosen = false;
  imageFileName = '';
  countryCreateForm: FormGroup;
  formData = new FormData();
  file: any;
  subscription: Subscription = new Subscription();
  progress: Progress = { value: 0 };
  loading: boolean;

  ngOnInit() {
    this.countryCreateForm = this.fb.group({
      name: ['', [Validators.required, Validators.min(4)]]
    });
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.isImageFileChosen = true;
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
        console.log('Country successfully created!', event.body);
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
    if (this.countryCreateForm.valid) {
      this.formData.append('flag', this.file);
      this.loading = true;
      this.subscription.add(
        this.countryService
          .createCountry(this.formData)
          .pipe(
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe(
            (event: HttpEvent<any>) => {
              if (this.displayProgress(event, this.progress)) {
                this.ngbActiveModal.close();
              }
            },
            error => {
              console.log(error.message);
            }
          )
      );
    }
  }

  navigate() {
    location.replace('/admin/country-management');
  }

  close() {
    this.ngbActiveModal.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
