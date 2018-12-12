import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private http: HttpClient,private route:ActivatedRoute,private router: Router) { }

	public localEmojis = [];// $localStorage.emojis || [];
    public sections =  [ {'id':'fav','name':'Любимые'},
						{'id':'all','name':'Все'},
						{'id':'del','name':'Удаленные'}];
  
	private found = [];
	
	searchFilter:string = '';
	
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
  
	ngOnInit() {
	//console.log(this.route.snapshot.paramMap.get('page'));

		this.route.params.subscribe((value) => {
			//this.id = value[0]["id"]; // get param
			this.page = value.page; // get data value
			console.log(value);
			var s = this.get_section(this.page);
			if (s!=null){
				this.section = s.name;
			}
		});

		console.log("menu.component");
		this.http.get("https://api.github.com/emojis").subscribe(data => {
			//console.log(data);
			//this.localEmojis = data;
			this.update_emojis(data);
			console.log(this.localEmojis);
		});  
		
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
		//$localStorage.emojis = $scope.localEmojis;
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
	do_search(){
		console.log("this.searchFilter = " + this.searchFilter);
		var found=[];
		for(var i in this.localEmojis){
			var em = this.localEmojis[i];
			if (em.cat == this.page && em.id.indexOf(this.searchFilter)>=0) found.push(em);
		}
		this.found = found;
		console.log(this.found);
		//var filterd =  $filter('category')($scope.localEmojis, $scope);
		//$scope.found = $filter('searchById')(filterd, $scope.search.id);
		this.split_found();
		
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
		console.log(this.pages);
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
	check_visible(button){
		if (button=="fav" && this.page=="all") return "img-visible";
		if (button=="restore" && this.page=="del") return "img-visible";
		if (button=="del" && this.page!="del") return "img-visible";
		return "img-hidden";
	}
	img_move(event) {
		//console.log(event);
		this.img_div_style = 'left:'+(event.clientX+3)+'px;top:'+(event.clientY+3)+'px';
		//angular.element("#popapimg").css('left',event.clientX+3);
	}
	img_over(event) {
		//console.log(img);
		this.img_div_class='img-visible';
		this.fullimg=event.srcElement.src;
	}
	img_out () {
		this.img_div_class='img-hidden';
	}	
}
