import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { delay, firstValueFrom, of, retry, timeout } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  products = signal<any[]>([]);
  message = signal('No products available.');

  isLoading = signal(false);

  private http = inject(HttpClient);

  ngOnInit() {
    this.fetchData();
  }

  // async fetchData() {
  //   console.log('fetching data...');
  //   this.message.set('No products available.');

  //   const controller = new AbortController();
  //   const timeout = setTimeout(() => controller.abort(), 3000);

  //   try {
  //     this.isLoading.set(true);

  //     const res = await fetch('http://localhost:3000/api/products', {
  //       signal: controller.signal
  //     });
  //     console.log('response received', res);

  //     if (!res.ok) {
  //       console.log('Something went wrong!!!!!!!!!');
  //       this.message.set('Failed to fetch data. Please try again later.');
  //       this.isLoading.set(false);
  //       return;
  //     }

  //     const data = await res.json();
  //     console.log(data);

  //     this.products.set(data);
  //   } catch (e: any) {
  //     console.error('Error fetching data!!!!!!!!!', e);
  //     if(e.name === 'AbortError') {
  //       this.message.set('Request timed out. Please try again later.');
  //     } else {
  //       this.message.set('Something went wrong. Please try again later.');
  //     }
  //   } finally {
  //     clearTimeout(timeout);
  //     this.isLoading.set(false);
  //   }
  // }

  async fetchData() {
    console.log('fetching data...');
    this.message.set('No products available.');

    try {
      this.isLoading.set(true);

      let retryCount = 0;

      const res: any = await firstValueFrom(
        this.http.get<any>('http://localhost:3000/api/products')
        .pipe(
          timeout(3000), // ⏳ 3s timeout
          // retry(2), // retry a failed request up to 2 times
          retry({
            count: 2,
            delay: () => {
              retryCount++;
              console.log(`Retry attempt #${retryCount}`);
              return of(null).pipe(delay(1000)); // 1s delay between retries
            }
          })
        )
      );
      console.log('response received', res);

      this.products.set(res);
    } catch (e: any) {
      console.error('Error fetching data!!!!!!!!!', e);
      if (e.name === 'TimeoutError') {
        this.message.set('Request timed out. Please try again later.');
      } else {
        this.message.set('Something went wrong. Please try again later.');
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
