import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  resultForm: FormGroup;
  buildForm: FormGroup;
  title = 'CodeSandbox';
  controlName = [];
  controlArr = [];
  checkBoxArr = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm = this.fb.group({
      label: ['', Validators.required],
      controlTitle: ['', Validators.required],
      type: ['', Validators.required],
      values: ['', Validators.required],
      status: ['', Validators.required],
    });
    this.resultForm = this.fb.group({});
    // this.createform();
  }

  createResultform() {
    for (let i = 0; i < this.controlArr.length; i++) {
      console.log('control created');
      if (this.controlArr[i].type != 'checkbox') {
        this.resultForm.addControl(
          this.controlArr[i].controlTitle,
          new FormControl('', [
            this.controlArr[i].status
              ? Validators.required
              : Validators.nullValidator,
            this.controlArr[i].type == 'email'
              ? Validators.email
              : Validators.nullValidator,
          ])
        );
      }
      if (this.controlArr[i].type == 'checkbox') {
        this.resultForm.addControl(
          this.controlArr[i].controlTitle,
          this.fb.array(
            [],
            this.controlArr[i].status
              ? Validators.required
              : Validators.nullValidator
          )
        );
      }
    }
  }

  submitResult() {
    console.log(this.resultForm.value);
  }

  submitBuilder() {
    console.log(this.buildForm.value);
    let check = true;
    // console.log('Control name: ',this.buildForm.get('controlTitle').value);
    this.controlArr.forEach((obj) => {
      if (obj.controlTitle == this.buildForm.get('controlTitle').value) {
        check = false;
      }
    });
    if (check) {
      this.controlArr.push(this.buildForm.value);
      this.createResultform();
    } else {
      alert('Form field with same control name already exist!');
    }
    // console.log('Result form: ', this.resultForm.value);
  }

  get type() {
    return this.buildForm.get('type');
  }

  errorMsg(i) {
    // let error = this.resultForm.get(this.controlArr[i].controlTitle).errors;
    // console.log(error);
    // return this.resultForm.get(this.controlArr[i].controlTitle).errors
    if (
      this.resultForm.get(this.controlArr[i].controlTitle).hasError('required')
    ) {
      return 'Input field can not be empty!';
    }
    if (
      this.resultForm.get(this.controlArr[i].controlTitle).hasError('email')
    ) {
      return 'Email invalid!';
    }
    return '';
  }

  controlOnChange(event, control){
    this.checkBoxArr[control] = this.resultForm.get(control) as FormArray;
    if (event.target.checked) {
      this.checkBoxArr[control].push(new FormControl(event.target.value));
    } else {
      const index = this.checkBoxArr[control].controls.findIndex(
        (control) => control.value === event.target.value
      );
      this.checkBoxArr[control].removeAt(index);
    }
  }
}
