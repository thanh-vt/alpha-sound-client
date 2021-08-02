import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Artist } from '../../../model/artist';
import { Progress } from '../../../model/progress';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { CountryService } from '../../../service/country.service';
import { Country } from '../../../model/country';

@Component({
  selector: 'app-edit-country',
  templateUrl: './edit-country.component.html',
  styleUrls: ['./edit-country.component.scss']
})
export class EditCountryComponent implements OnInit {
  countryUpdateForm: FormGroup;
  isImageFileChoosen = false;
  imageFileName = '';
  formData = new FormData();
  file: any;
  subscription: Subscription = new Subscription();
  message: string;
  @Input() country: Country;
  error = false;
  submitted: boolean;
  progress: Progress = { value: 0 };

  constructor(private countryService: CountryService, private fb: FormBuilder) {}

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
      case HttpEventType.Response:
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

  onSubmit() {
    this.submitted = true;
    this.formData.append('country', this.file);
    this.countryService.updateCountry(this.formData, this.country.id).subscribe(
      (event: HttpEvent<any>) => {
        if (this.displayProgress(event, this.progress)) {
          this.error = false;
          this.message = 'Update artist successfully.';
        }
      },
      error => {
        this.error = true;
        this.message = 'Failed to update artist';
        console.log(error.message);
      }
    );
  }

  navigate() {
    location.replace('/admin/country-management');
  }
}
