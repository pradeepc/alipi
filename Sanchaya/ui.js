var a11ypi = {
    auth : " ",
    loc:" ",
    elementTagName: " ",
    elementId: " ",
    flag : 0,
    testContext : function()
    {

 	    $(document).ready(function(){$('body *').contents().filter(function() 
								       {
									   //console.log(this.nodeName);
									   try{
									       if(this.nodeType == 3)
									       {
										   return (this.nodeType == 3) && this.nodeValue.match(/\S/);}}
									   catch(err)
									   {
//									       console.log(err.message);
//									       console.log(this);
									   }}).wrap('<span m4pageedittype=text/>')}); 


	vimg = document.getElementsByTagName('img');
	for(i=0; i<vimg.length; i++)
	{
	    vimg[i].setAttribute('m4pageedittype','image');
	}

    },

    createMenu: function(menu_list) {
	var xyz = document.getElementById("menu-button");
	for(var i=0;i<menu_list.length;i++)
	{
	    var newel = document.createElement("option");
	    newel.textContent = menu_list[i];
	    newel.setAttribute("value",menu_list[i]);
	    newel.setAttribute("onclick","a11ypi.getURL(event.target);");
	    xyz.appendChild(newel);
	}
    },
    clearMenu: function() {
	var xyz = document.getElementById("menu-button");
	while(null!= xyz.firstChild)
	{
	    xyz.removeChild(xyz.firstChild);
	}
    },
    ajax: function() {
	if(a11ypi.flag == '0')
	{
	    a11ypi.flag = 1;
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function()
	    {
		if(xhr.readyState == 4)
		{
		    if(xhr.responseText == "empty")
		    {
			a11ypi.clearMenu();
		    }
		    else
		    {
			a11ypi.createMenu(JSON.parse(xhr.responseText));
		    }
		}
	    }
	    xhr.open("POST","http://dev.a11y.in/menu",true);
	    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	    d = window.location.search.split('?')[1];
	    var a =[];
	    for (var i = 0;i<d.split('&').length;i++){ 
		a[d.split('&')[i].split('=')[0]] = d.split('&')[i].split('=')[1];
	    }
	    var url = a['foruri'];
	    xhr.send('url='+url);
	}
    },
    ajax1: function() {
	if(a11ypi.flag == '0')
	{
	    a11ypi.flag = 1;
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function()
	    {
		if(xhr.readyState == 4)
		{
		    if(xhr.responseText == "empty")
		    {
			a11ypi.clearMenu();
		    }
		    else
		    {
			a11ypi.createMenuFilter(JSON.parse(xhr.responseText));
		    }
		}
	    }
	    xhr.open("POST","http://dev.a11y.in/menu",true);
	    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	    d = window.location.search.split('?')[1];
	    var a =[];
	    for (var i = 0;i<d.split('&').length;i++){ 
		a[d.split('&')[i].split('=')[0]] = d.split('&')[i].split('=')[1];
	    }
	    var url = a['foruri'];
	    var option = a['blog'];
	    data = 'url='+url+'&option='+option;
	    xhr.send(data) ;
	}
    },

    getURL: function(e) {
	window.location = window.location.href + "&lang=" + e.value;
	window.reload();
    },
    ren: function()
    {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
	    if(xhr.readyState == 4)
	    {
		if(xhr.responseText =='empty')
		{
		    a11ypi.clearMenu();
		    alert("An internal server error occured, please try later.");
		}
		else
		{
		    
		    d ={};
		    var response=xhr.responseText.substring(3).split('###');
		    for (var j= 0; j< response.length ; j++){
			chunk = response[j].substring(1).split('&');
			
			for (var i= 0; i< chunk.length ; i++){
			    pair =chunk[i].split("::");
			    key = pair[0];
			    value = pair[1];
			    d[key] = value;
			}
			path = d['xpath'];
			newContent = d['data'];
			elementType = d['elementtype'];
			a11ypi.evaluate(path,newContent,elementType);
		    }
		}
	    }
	}
	d = window.location.search.split('?')[1];
	var a =[];
	for (var i = 0;i<d.split('&').length;i++){ 
	    a[d.split('&')[i].split('=')[0]] = d.split('&')[i].split('=')[1];
	}
	var url = a['foruri'];
	var lang= a['lang'];
	var data="url="+url+"&lang="+encodeURIComponent(lang);
	
	xhr.open("POST","http://dev.a11y.in/replace",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(data);//
    },
    evaluate: function()
    {
	try{
	var nodes = document.evaluate(path, document, null, XPathResult.ANY_TYPE,null);
	}
	catch(e)
	{
	    console.log(e);
	}
        try{
            var result = nodes.iterateNext();
            while (result)
            {
                if (elementType == 'image')
		{
                    result.setAttribute('src',newContent.split(',')[1]);  //A hack to display images properly, the size has been saved in the database.
		    width = newContent.split(',')[0].split('x')[0];
		    height = newContent.split(',')[0].split('x')[1];
		    result.setAttribute('width',width);
		    result.setAttribute('height', height);
                }
		else if(elementType =='audio/ogg')
		{
		    newContent = decodeURIComponent(newContent);
		    audio = '<audio controls="controls" src="'+newContent+'"></audio>';
		    $(result).before(audio);
		}
                else{
                    result.textContent = newContent;
                }
                result=nodes.iterateNext();
            }
        }
        catch (e)
        {
            dump( 'error: Document tree modified during iteration ' + e );
        }
    },
    close: function() {
	document.getElementById('ren_overlay').style.display = 'none';
    },
    filter: function()
    {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
	    if(xhr.readyState == 4)
	    {
		if(xhr.responseText =='empty')
		{
		    a11ypi.clearMenu();
		    alert("An internal server error occured, please try later.");
		}
		    else
		{
		        
		    d ={};
		    var response=xhr.responseText.substring(3).split('###');
		    for (var j= 0; j< response.length ; j++){
			chunk = response[j].substring(1).split('&');
			
			for (var i= 0; i< chunk.length ; i++){
			    pair =chunk[i].split("::");
			    key = pair[0];
			    value = pair[1];
			    d[key] = value;
			}
			path = d['xpath'];
			newContent = d['data'];
			a11ypi.evaluate(path,newContent);
		    }
		}
	    }
	}
	d = window.location.search.split('?')[1];
	var a =[];
	for (var i = 0;i<d.split('&').length;i++){ 
	    a[d.split('&')[i].split('=')[0]] = d.split('&')[i].split('=')[1];
	}
	var url = a['foruri'];
	var lang= a['lang'];
	var blog= a['blog'];
	var data="url="+encodeURIComponent(url)+"&lang="+encodeURIComponent(lang)+"&blog="+encodeURIComponent(blog);
	
	xhr.open("POST","http://dev.a11y.in/filter",true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(data);//
    },
    createMenuFilter: function(menu_list) {
	var xyz = document.getElementById("menu-button");
	for(var i in menu_list)
	{
	    var newel = document.createElement("option");
	    newel.textContent = menu_list[i];
	    newel.setAttribute("value",menu_list[i]);
	    newel.setAttribute("onclick","a11ypi.getURLFilter(event.target);");
	    xyz.appendChild(newel);
	}
    },
    clearMenuFilter: function() {
	var xyz = document.getElementById("menu-button");
	while(null!= xyz.firstChild)
	{
	    xyz.removeChild(xyz.firstChild);
	}
    },
    getURLFilter: function(e) {
	window.location = window.location.href + "&lang=" + e.value+"&interactive=1";
	window.reload();
     },
};
