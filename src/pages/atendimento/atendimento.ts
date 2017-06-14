import 'rxjs/Rx';
import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NavController} from 'ionic-angular';
import { AtendimentoDetalhePage } from '../../pages/atendimentoDetalhe/atendimentoDetalhe';

@Component({
  selector: 'page-atendimento',
  templateUrl: 'atendimento.html'
})

export class AtendimentoPage{

	atendimentos: Array<{title:string}>;
	
	constructor( public toastCtrl: ToastController, public http : Http, public navCtrl: NavController, public alertCtrl: AlertController ){

		this.http.get('http://192.168.0.24:3000/atendimentos.json').map(res => res.json()).subscribe(data => {
			this.atendimentos = [];
        	for (var i = 0; i < data.length; i++) {
        		this.atendimentos.push({title: data[i].titulo});
        	}
       	});
   }

   atendimentoTapped(event, atendimento){
   	
   	this.navCtrl.push(AtendimentoDetalhePage, {
      item: atendimento
    });  
   }

   pedirAtendimento(event){


   	let prompt = this.alertCtrl.create({
      title: 'Atendimento',
      message: "Qual a Emergência?",
      inputs: [
        {
          name: 'title'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
          	var headers = new Headers();
           headers.append("Accept", 'application/json');
           headers.append('Content-Type', 'application/json' );
           let options = new RequestOptions({ headers: headers });

           let postParams = {
             
               titulo:data.title
           }
           
       	
           this.http.post("http://192.168.0.24:3000/atendimentos.json", postParams , options)
             .map(res => res.json())
             .subscribe(data => {
               this.atendimentos.push({title: data.titulo});
             }, error => {
             	const toast = this.toastCtrl.create({
       	      message: error,
       	      showCloseButton: true,
       	      closeButtonText: 'Ok'
       	    });
       	    toast.present();
             });
          }
        }
      ]
    });
    prompt.present();
   	
   }
} 