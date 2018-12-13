import { Component, OnInit , Output, EventEmitter} from '@angular/core';
import { ActivatedRoute,Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css','../bootstrap.min.css']
})
export class ViewComponent implements OnInit {


  constructor(private http: HttpClient,
			  private route:ActivatedRoute,
			  private router: Router,
			  private storage:LocalStorageService) { }

	public localEmojis = [];// $localStorage.emojis || [];
    public sections =  [ {'id':'fav','name':'Любимые'},
						{'id':'all','name':'Все'},
						{'id':'del','name':'Удаленные'}];
  
	private found = [];
	
	
	public searchFilter:string = '';
	
	public  page:string;
	public  section:string;
	
	public pagecount;
	public curpage;
	public curpagen = 1;
	public pages = [];
	public pagesn = [];
  
	public img_div_style:string='';
	public img_div_class:string='';
	public fullimg:string=''; 

	public i_left='0';
	public i_top='0';
	
	ngOnInit() {
		var emoji = this.storage.retrieve('emoji');
		this.localEmojis = emoji || [];
		this.route.params.subscribe((value) => {
			this.page = value.page; // get data value
			var s = this.get_section(this.page);
			if (s!=null){
				this.section = s.name;
				this.storage.store('page', this.page);
				this.do_search();
			}
		});

		this.http.get("https://api.github.com/emojis").subscribe(data => {
			this.update_emojis(data);
			this.store_emoji();
			this.do_search();
		});  
		
	}
	//=================================
	//        service functions
	store_emoji(){
		this.storage.store('emoji', this.localEmojis);
	}
	get_section(id){
		for(var i in this.sections){
			if(this.sections[i].id==id) return this.sections[i];
		}
		return null;
	}
  	update_emojis(emojis){
		for(var id in emojis){
			var found = this.filter_getById(this.localEmojis, id);
			
			if (found != undefined)
				found.url=emojis[id];
			else
				this.localEmojis.push({'id':id,'url':emojis[id], 'cat':'all'});
		}
		this.push_CSS_to_object(this.localEmojis, "img-transparent");
	}
	filter_getById(data,id){
		for(var i in data)
			if (data[i].id==id)
				return data[i];
		return undefined;
	}
	push_CSS_to_object(arr,data){
		for(var i in arr){
			var item = arr[i];
			if (item.css==undefined) item.css = {'data':data} 
		}
	}
	check_category(item){
		switch (this.page){
			case "all":
				if(item.cat=="all" || item.cat=="fav")return true;
			break;
			case "fav":
			case "del":
				if(item.cat==this.page)return true;
			break;
		}
		return false;
	}
	split_found(){
		var img_in_page=10;
		this.pagecount = Math.ceil(this.found.length/img_in_page);
		this.curpagen = 1;
		this.pages = [];
		this.pagesn = [];
		
		var onepage=[];
		var n=0;
		var pagen=0;
		for(var i in this.found){
			if(n==0){
				this.pagesn.push(pagen);
			}
			var item = this.found[i];
			n++;
			onepage.push(item);
			if(n==img_in_page){
				this.pages.push(onepage);
				n=0;
				onepage=[];
				pagen++;
			}
		}
		if (n>0){
			this.pages.push(onepage);
		}
		this.curpage = this.pages[0];
		this.set_page(0);
	}
	redraw_emoji_list(){
		var old_page = this.curpagen;
		this.do_search();
		if(old_page == this.pagecount) old_page = this.pagecount-1;
		this.set_page(old_page);			
	}		
	check_visible(button){
		if (button=="fav" && this.page=="all") return "img-visible";
		if (button=="restore" && this.page=="del") return "img-visible";
		if (button=="del" && this.page!="del") return "img-visible";
		return "img-hidden";
	}	
	//==============================
	//       UI event functions
	do_search(){
		var found=[];
		for(var i in this.localEmojis){
			var em = this.localEmojis[i];
			if (this.check_category(em) && em.id.indexOf(this.searchFilter)>=0) found.push(em);
		}
		this.found = found;
		this.split_found();
		
	}
	set_page(page){
		if (page < 0 || page > this.pagecount-1) return;
		this.curpagen = page;
		if(this.pagecount>10){
			var start = this.curpagen-5; 
			if (start < 0 ) start=0;
			var end = start + 10;
			
			if( end > this.pagecount ){
				end = this.pagecount;
				start = this.pagecount - 10;
			}
		}else{
			start=0;
			end = this.pagecount;
		}
		this.pagesn=[];
		for(var i = start;i<end;i++){
			this.pagesn.push(i);
		}
		this.curpage = this.pages[page];
	}

	//====================================
	//       image event listeners
	img_move(event) {
		this.i_left = (event.clientX+3)+'px';
		this.i_top=(event.clientY+3)+'px';
	}
	img_over(event) {
		this.img_div_class='img-visible';
		this.fullimg=event.srcElement.src;
	}
	img_out () {
		this.img_div_class='img-hidden';
	}
	make_favorive(emoji){
		emoji.cat="fav";
		emoji.css.data="img-no-transparent";
		this.store_emoji();
	}
	restore_emoji(emoji){
		emoji.cat="all";
		emoji.css.data="img-transparent";
		this.redraw_emoji_list();
		this.store_emoji();
	}
	del_emoji(emoji){
		if (emoji.cat=="all" || (emoji.cat=="fav" && this.page=="all")){
			emoji.cat="del";
			emoji.css.data="img-no-transparent";
		}else if (emoji.cat=="fav" && this.page=="fav"){
			emoji.cat="all";
			emoji.css.data="img-transparent";
		}
		this.redraw_emoji_list();
		this.store_emoji();
	}

}
