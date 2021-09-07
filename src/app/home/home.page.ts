import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { ToastController, Platform } from '@ionic/angular';
import { SpeechRecognition, SpeechRecognitionListeningOptions } from '@ionic-native/speech-recognition/ngx';
import { ServicesTraslator } from '../api/services.traslator';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  public idiomaTraduccion = [
  {
    idioma: "Inglés",
    codigoIdioma: "en-US"
  },
  {
    idioma: "Español",
    codigoIdioma: "es-EC"
  },
  {
    codigoIdioma: "de-DE",
    idioma: "Alemán"
  },
  {
    idioma: "Japonés",
    codigoIdioma: "ja-JP"
  },
  {
    idioma: "Ruso",
    codigoIdioma: "ru-RU"
  },
  {
    idioma: "Italiano",
    codigoIdioma: "it-IT"
  },
  {
    idioma: "Portugués",
    codigoIdioma: "pt-BR"
  },
  {
    idioma: "Francés",
    codigoIdioma: "fr-FR"
  }];
  
  public idiomaOrigen = [
    {
      codigoIdioma: "en-US",
      idioma: "Inglés"
    },
    {
      idioma: "Japonés",
      codigoIdioma: "ja-JP"
    },
    {
      codigoIdioma: "de-DE",
      idioma: "Alemán"
    },
    {
      codigoIdioma: "es-EC",
      idioma: "Español"
    },
    {
      idioma: "Portugués",
      codigoIdioma: "pt-BR"
    },
    {
      idioma: "Francés",
      codigoIdioma: "fr-FR"
    }
  ]

  public traducido = false;
  public message:string;
  matches: String[];
  isRecording = false;
  public speechRecognized: string = "";
  public opIdiomaOrig = "";
  public opIdiomaTrad = "";
  public esperaTraduccion = false;
  public traduccion = "";

  constructor(private _servTraductor: ServicesTraslator, private plt: Platform,private cd: ChangeDetectorRef,  private speechRecognition: SpeechRecognition, private tts: TextToSpeech,public toastController: ToastController) {
    
  }

  ngOnInit(): void {
    this.hasPermission();
    this.speakSomething('Hola, bienvenido', "es-EC")
  }

  hasPermission(): void {
    this.speechRecognition
        .hasPermission()
        .then((hasPermission: boolean) => {
            if (!hasPermission) {
                this.speechRecognition
                    .requestPermission()
                    .then(
                        onfulfilled => this.presentToast('Acceso concedido!'),
                        onerror => console.error('Acceso denegado al micrófono vuelva a abrir la aplicación')
                    );
            }
        });
  }

startListening(): void {

  if (this.opIdiomaOrig === "" && this.opIdiomaTrad ===""){
    this.presentToast('Seleccione los idiomas de una manera correcta para poder realizar la traducción!')
  }  else {
    const options: SpeechRecognitionListeningOptions = {
        language: this.opIdiomaOrig,
        showPartial: true
    };
    this.esperaTraduccion = true;
    this.speechRecognition.startListening(options).subscribe(
        (matches: Array<string>) => {
            if (matches && matches.length > 0) {
              this.speechRecognized = matches[0];
              this._servTraductor.traducirTexto(this.opIdiomaOrig.split("-")[0], this.opIdiomaTrad.split("-")[0], this.speechRecognized).subscribe(
                (result) =>{
                  this.traduccion = result[0].translations[0].text;
                  this.traducido = true;
                  this.speakSomething(this.traduccion, this.opIdiomaTrad);
                },
                error  => {
                  this.presentToast('Ha ocurrido un error inesperado, vuelva a intentarlo.');
                  this.traducido = true;
                  this.esperaTraduccion = false;
                }
              );
          }
        },
        onerror => {
            if (onerror.indexOf('Code=203') !== -1) {
              this.presentToast('Idioma no reconocido!')
            } else {
              this.presentToast('Ha ocurrido un error inesperado, vuelva a intentarlo.');
            }
        }
    );
      }
}

  speakSomething(texto, idiomaTraduccion){
    this.tts.speak({
      'text': texto,
      'locale': idiomaTraduccion,
      'rate': 0.75})
    .then(() => {
      this.esperaTraduccion = false;
      this.presentToast('Traducción realizada de manera correcta')
      
    })
    .catch((reason: any) => this.presentToast("Ha ocurrido un error!"));
  }

  async presentToast(mensage) {
    const toast = await this.toastController.create({
      message: mensage,
      duration: 3000
    });
    toast.present();
  }

  volvTraducir(){
    this.traducido = false;
  }

  prueba(){
    this._servTraductor.traducirTexto('es-EC', 'en', 'Hola Mundo').subscribe(
      (result) =>{
        this.traduccion = result[0].translations[0].text;
        this.speakSomething(this.traduccion,this.idiomaTraduccion);
        console.log(result)
        this.presentToast(this.traduccion);
        this.traducido = true;
        
      },
      error  => {
        console.log(error)
        this.traducido = true;
        this.esperaTraduccion = false;
      })
  }

}
