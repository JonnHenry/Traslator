import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ServicesTraslator {

  public url = 'https://inventariosqr.azurewebsites.net';

  constructor(public _http: HttpClient) {
  }

  getIdiomas(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get('https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation', {headers: headers});
  }

  traducirTexto(idiomaEntrada,IdiomaSalida,envioTexto): Observable<any> {
    let objetoEnvio = JSON.stringify(
      [{"Text": envioTexto}]
    );
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': 'e7343ffe19094227a047b45d9eb81d6d',
      'Content-Type': 'application/json'});
      var url = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from='+idiomaEntrada+'&to='+ IdiomaSalida;
      return this._http.post(url, objetoEnvio,{headers: headers});
  }


  
}
