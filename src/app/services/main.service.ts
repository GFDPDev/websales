import { Injectable, NgZone } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Res } from '../interfaces/Response';
import { SseService } from './sse.service';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  public api = environment.apiURL;
  private httpHeaders: HttpHeaders;
  private httpFileHeaders: HttpHeaders;
  private token: string;
  private eventSource!: EventSource;

  constructor(private http: HttpClient,private zone: NgZone, private sseService: SseService) {
    this.token = sessionStorage.getItem('token') ?? 'No token available';

    this.httpHeaders = new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      })
    this.httpFileHeaders = new HttpHeaders({
        'accept': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      })
  }

  getRequest(params: any, route: String): Observable<Res> {
    return this.http.get<Res>(this.api + route, { params: params, headers: this.httpHeaders });
  }
  postRequest(params: any, route: String): Observable<Res> {
    return this.http.post<Res>(this.api + route, params, { headers: this.httpHeaders });
  }
  putRequest(params: any, route: String): Observable<Res> {
    return this.http.put<Res>(this.api + route, params, { headers: this.httpHeaders });
  }
  deleteRequest(params: any, route: String): Observable<Res> {
    return this.http.delete<Res>(this.api + route, { params: params, headers: this.httpHeaders });
  }
  uploadFile(params: any, route: String): Observable<Res> {
    return this.http.post<Res>(this.api + route, params, { headers: this.httpFileHeaders });
  }
  getFile(route: String): Observable<Blob> {
    return this.http.get<Blob>(this.api + route,  { responseType: 'blob' as 'json', headers: this.httpFileHeaders },);
  }
  getServerEvent(route: string){
    return new Observable((observer)=>{
       this.eventSource = this.sseService.getEventSource(route);
      this.eventSource.onmessage = (event) => {
        this.zone.run(()=>{
          observer.next(event);
        })
      };
      this.eventSource.onerror = (error) => {
        observer.error();
        this.eventSource.close();
      };
    })
  }

  disconnectEventSource(): void {
    this.eventSource.close();
  }
}


