import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder , FormGroup, Validators } from '@angular/forms';

import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
import { delay } from 'rxjs/operators';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host:{
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations:[
    flyInOut(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup; // this will host my reactive form
  feedback: Feedback;
  feedbackcopy: Feedback;
  errFeedback:string;
  sending:boolean = false;
  showConfirmMsg:boolean = false;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname': '',
    'lastname':'',
    'telnum':'',
    'email':''
  };

  validationsMessages = {
    'firstname': {
      'required': 'first name is required',
      'minlength': 'first name must be at least 2 characters long',
      'maxlength': 'first name cannot be more than 25 characters long'
    },
    'lastname': {
      'required': 'last name is required',
      'minlength': 'last name must be at least 2 characters long',
      'maxlength': 'last name cannot be more than 25 characters long'
    },
    'telnum':{
      'required':'Tel. number is required',
      'pattern': 'Tel. number must contain only numbers'
    },
    'email':{
      'required': 'email is required',
      'email': 'email not in valid format'
    }
  };

  constructor( private fb:FormBuilder, private feedbackService: FeedbackService) {
    this.createForm();
   }

  ngOnInit() {
  }

  createForm(){
    this.feedbackForm = this.fb.group({
      firstname: [ '', [Validators.required, Validators.minLength(2),Validators.maxLength(25)]],
      lastname: [ '',  [Validators.required, Validators.minLength(2),Validators.maxLength(25)]],
      telnum: [ 0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
  
    });

    this.feedbackForm.valueChanges
    .subscribe( data => this.onValueChanged(data) );
    this.onValueChanged(); // (re)set form validations messages
  }

  onValueChanged(data?: any){
    if(!this.feedbackForm){ return;}
    const form = this.feedbackForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        // clear previous error message (if any)
        this.formErrors[field] = ''
        const control = form.get(field);
        if (control && control.dirty && !control.valid){
          const messages = this.validationsMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  onSubmit(){
    this.feedback = this.feedbackForm.value;
    this.feedbackcopy = this.feedbackForm.value;
    this.sending = true;
    this.feedbackService.submitFeedback(this.feedbackcopy).subscribe(
      (data) => {
        this.feedbackcopy = data;
        this.showConfirmMsg= true;
        setTimeout( () => {this.sending = false; this.showConfirmMsg= false;}, 5000);
      },
      (error) => {
        this.errFeedback = error;
        this.showConfirmMsg= true;
        setTimeout( () => {this.sending = false; this.showConfirmMsg= false;}, 5000);
        // console.log('there was an error:' + error);
      }
    );
    // console.log(this.feedback);
    this.feedbackFormDirective.resetForm(); // this ensures that reset to pristine values
      this.feedbackForm.reset({
        firstname:'',
        lastname:'',
        telnum:0,
        email:'',
        agree:false,
        contacttype:'None',
        message:''
      });
  }
}
