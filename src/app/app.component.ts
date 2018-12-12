import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute,Router, NavigationEnd } from '@angular/router';
import { Observable, from} from 'rxjs';
import { RouterOutlet } from '@angular/router';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
//import { toArray } from 'rxjs/add/operator';
//import { from } from 'rxjs';
  
  class mt{
	id: string;
	name: string;
	css:{};
  }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./bootstrap.min.css','./my.css']
})
export class AppComponent {
	
  constructor(	private http: HttpClient,
				private router: Router, 
				private route:ActivatedRoute,
				private localSt:LocalStorageService) { 
	
  
  
  }
	public m;
    public sections =  [ {'id':'fav','name':'Любимые','css':{'data':''}},
						{'id':'all','name':'Все','css':{'data':''}},
						{'id':'del','name':'Удаленные','css':{'data':''}}];
  
	ngOnInit(){

		this.push_CSS_to_object(this.sections, "btn-info");
		this.localSt.observe('page')
				.subscribe((value) => {
					this.page=value;
					this.change_category();
				});
		
	}
  
	private page:string='';
		navi(s){
		//[routerLink]="['/page',s.id]"
		this.page=s.id;
		this.change_category();
		this.router.navigate(['/page/',s.id]);

	}
	push_CSS_to_object(arr,data){
		for(var i in arr){
			var item = arr[i];
			//if (item.css==undefined) 
				item.css = {'data':data} 
		}
	}
	
	change_category(){
		console.log("change_category");
		console.log(this.sections);

		
		for(var i in this.sections){
			if(this.sections[i].id==this.page){
				this.sections[i].css.data='btn-warning';
			}else{
				this.sections[i].css.data='btn-info';
			}
		}
		
	}
 
}
