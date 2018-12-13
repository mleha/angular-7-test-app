import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, from} from 'rxjs';
import { RouterOutlet } from '@angular/router';
import {LocalStorageService} from 'ngx-webstorage';
  
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
	
  constructor(
				private router: Router, 
				private storage:LocalStorageService) { }
	private page:string='';
    public sections =  [ {'id':'fav','name':'Любимые','css':{'data':''}},
						{'id':'all','name':'Все','css':{'data':''}},
						{'id':'del','name':'Удаленные','css':{'data':''}}];
  
	ngOnInit(){
		this.push_CSS_to_object(this.sections, "btn-info");
		this.storage.observe('do_navigate')
				.subscribe((value) => {
					setTimeout(() => { 
						this.navi(value);
					});
				});
			
		
		this.storage.observe('page')
				.subscribe((value) => {
					setTimeout(() => { 
					// settimeout sync code (https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4)
						this.page=value;
						this.change_category();
						
						var pg = this.get_section(this.page);
						if (pg!=null) this.storage.store('page_title', pg.name);
						
					});
				});
				
	}

	get_section(id){
		for(var i in this.sections){
			if(this.sections[i].id==id) return this.sections[i];
		}
		return null;
	}	
	
	navi(s){
		this.page=s;
		this.change_category();
		this.router.navigate(['/page/',s]);

	}
	push_CSS_to_object(arr,data){
		for(var i in arr){
			var item = arr[i];
			item.css = {'data':data} 
		}
	}
	
	change_category(){
		for(var i in this.sections){
			if(this.sections[i].id==this.page){
				this.sections[i].css.data='btn-warning';
			}else{
				this.sections[i].css.data='btn-info';
			}
		}
		
	}
 
}
