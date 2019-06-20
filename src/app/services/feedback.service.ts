import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';

import { Feedback } from '../shared/feedback';
import { baseURL } from '../shared/baseurl';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http:HttpClient, private processHTTPMsgService:ProcessHTTPMsgService) { }

  submitFeedback( fb:Feedback ): Observable<Feedback>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<Feedback>(baseURL + 'feedback', fb, httpOptions )
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
