
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearcResponse } from '../interfaces/gifs.interfaces';

// const GIPHY_API_KEY = '6yZoUUglY2PgR3XEkehdZO8Rhs4MOLAm'

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private api_key: string = '6yZoUUglY2PgR3XEkehdZO8Rhs4MOLAm'
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs'

  constructor( private http: HttpClient ) {

    this.loadLocalStorage();

   }

  get tagsHistoy() {
    return [...this._tagsHistory];
  }

private organizeHistory(tag: string) {

  tag = tag.toLowerCase();

  if (this._tagsHistory.includes(tag) ) {
    this._tagsHistory = this._tagsHistory.filter( (oldtag) => oldtag !==tag );
  }

  this._tagsHistory.unshift( tag );
  this._tagsHistory = this.tagsHistoy.splice(0, 10);

  this.saveLocalStroage();

}

  private saveLocalStroage(): void {

    localStorage.setItem('history', JSON.stringify( this._tagsHistory ))

  }

  private loadLocalStorage(): void {

    if ( !localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse( localStorage.getItem('history')! )

    if (this.tagsHistoy.length === 0) return;

    this.searchTags(this.tagsHistoy[0]) ;

    // const temporal = localStorage.getItem('history')
  }

  public searchTags( tag: string ): void {

    if ( tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.api_key )
      .set('limit', 20 )
      .set('q', tag )

    this.http.get<SearcResponse>(`${ this.serviceUrl }/search`, {params: params})
      .subscribe( resp => {

        this.gifList = resp.data;
        // console.log({ gifs: this.gifList});

      })

    // fetch('https://api.giphy.com/v1/gifs/search?api_key=6yZoUUglY2PgR3XEkehdZO8Rhs4MOLAm&q=valorant&limit=20').then( resp => resp.json ).then( data => console.log(data) );
    // const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=6yZoUUglY2PgR3XEkehdZO8Rhs4MOLAm&q=valorant&limit=20');
    // const data = resp.json();
    // console.log(data);

    // this._tagsHistory.unshift ( tag );
  }

}
