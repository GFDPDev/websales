import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { CacheService } from './cache.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Res } from '../interfaces/Response';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly MENU_CACHE_KEY = 'menu';
  private readonly CACHE_DURATION = 120 * 60 * 1000; // 120 minutos

  constructor(
    private mainService: MainService,
    private cacheService: CacheService
  ) {}

  getMenu(): Observable<Res> {
    const cached = this.cacheService.get(this.MENU_CACHE_KEY);
    if (cached) {
      return cached;
    }

    const request = this.mainService.getRequest({}, '/menu')
      .pipe(
        tap(() => {
          // Programar la siguiente invalidación
          setTimeout(() => this.invalidateMenuCache(), this.CACHE_DURATION);
        })
      );

    this.cacheService.set(this.MENU_CACHE_KEY, request, this.CACHE_DURATION);
    return request;
  }


  invalidateMenuCache(): void {
    this.cacheService.invalidate(this.MENU_CACHE_KEY);
  }

}