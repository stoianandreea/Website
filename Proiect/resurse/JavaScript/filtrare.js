orase = ["Berlin", "Lisabona", "Roma", "Paris", "Viena"];
transport = ["toate", "tren", "autocar", "avion"];
conditii = ["da", "nu"];

window.onload = function(){
	var d = document.getElementById("container_input");
	var c = document.getElementsByTagName("article");
	// var c = document.getElementsByClassName(".template_excursie");
	var i;
	
///////////////////////////////////////////////////// setInterval //////////////////////////////////////////////////////
// Cerinta:
// La fiecare 7 secunde, apare un div in care e prezentata o promotie. In div va exista si un buton cu "accepta promotia". 
// Daca utilizatorul face click pe buton, primeste un alert cu textul "ai acceptat promotia" si divul dispare. 
// Daca utilizatorul nu face click pe buton, divul dispare dupa 3 secunde de la aparitia sa. 
// (astfel un div apare la fiecare 7 secunde; daca utilizatorul nu interactioneaza cu el, sta 3 secunde vizibil si apoi mai trec 4 secunde 
// pana sa apara urmatorul)

	setInterval(promotie, 7000);
	var div_html = document.getElementById("promotie_interval");
	function promotie(){
		promo = document.createElement("div");
		btn = document.createElement("button");
		btn.innerHTML = "Accepta promotia";
		promo.appendChild(btn);
		div_html.appendChild(promo);
		
		var time = setTimeout(function sterge_promotie() { promo.parentNode.removeChild(promo); } , 3000);
		
		btn.onclick = function(){
			alert("Ai acceptat promotia!");
			clearTimeout(time);
			promo.parentNode.removeChild(promo);
		}	
	}


/////////////////////////////////////////////////////// creare dinamica input ////////////////////////////////////////////////////////

	// input text
	d.innerHTML += '<p>Scrieti numele excursiei: </p>';
	var i_text = document.createElement("input");
	i_text.type = "text";
	i_text.id = "name_text";
	d.appendChild(i_text);
	d.innerHTML += '<br/><br/>';
	
	// input range
	d.innerHTML += '<p>Pretul minim al excursiei: </p>';
	var i_range = document.createElement("input");
	i_range.type = "range";
	i_range.id = "value_range";
	i_range.min = 0;
	i_range.max = 3000;
	i_range.step = 20;
	i_range.defaultValue = "0";
	var text_min = document.createTextNode("0 ");
	var text_max = document.createTextNode(" 3000");
	d.appendChild(text_min);
	d.appendChild(i_range);
	d.appendChild(text_max);
	var par_curr_value = document.createElement("p");
	par_curr_value.id = "par_curr_value";
	par_curr_value.innerHTML = "Valoare curenta: " + document.getElementById("value_range").value;
	d.appendChild(par_curr_value);
	d.innerHTML += '<br/>';

	// input checkbox
	d.innerHTML += "<p>Alegeti orasele pentru excursie: </p>";
	for(var i = 0; i < 5; i++){
		var i_checkbox = document.createElement("input");
		i_checkbox.type = "checkbox";
		i_checkbox.id = orase[i];
		let newlabel = document.createElement("label");
		newlabel.setAttribute("for", orase[i]);
		newlabel.innerHTML = orase[i];
		d.appendChild(i_checkbox);
		d.appendChild(newlabel);
		d.innerHTML += '<br/>';
	}
	d.innerHTML += '<br/>';
	
	// select simplu
	d.innerHTML += "<p>Alegeti tipul de transport: </p>";
	var sel = document.createElement("select");
	sel.id = "select_filter";
	d.appendChild(sel);
	for(el of transport){
		var opt = document.createElement("option");
		opt.text = el;
		opt.value = el;
		sel.appendChild(opt);
	}
	d.innerHTML += '<br/><br/>';
	
	// textarea
	d.innerHTML += "<p>Folositi '+' pentru cuvintele ce vreti sa apara in desciere si '-' pentru cele ce nu vreti sa apara: </p>";
	var newTextArea = document.createElement("textarea");
	newTextArea.name = "new_text_area";
	newTextArea.length = "5000";
	newTextArea.id = "filter_text_area";
	newTextArea.cols = "30";
	newTextArea.rows = "5";
	d.appendChild(newTextArea);
	d.innerHTML += '</br></br>';
	

	//input radio
	d.innerHTML += "<p>Doriti masa inclusa? </p>";
	for(var i = 0; i < 2; i++){
		var i_radio = document.createElement("input");
		i_radio.type = "radio";
		i_radio.name = "conditii";
		i_radio.id = conditii[i];
		let newlabel = document.createElement("label");
		newlabel.setAttribute("for", conditii[i]);
		newlabel.innerHTML = conditii[i];
		d.appendChild(i_radio);
		d.appendChild(newlabel);
		d.innerHTML += '<br/>';
	}
	d.innerHTML += '<br/>';

//////////////////////////////////////////// creare butoane filtrare & resetare ///////////////////////////////////////////////////

	var filter = document.createElement("button");
	filter.id = "filtreaza";
	filter.innerHTML = "Filtreaza";
	d.appendChild(filter);
	
	var reset_filter = document.createElement("button");
	reset_filter.id = "reseteaza";
	reset_filter.innerHTML = "Reseteaza filtrele";
	d.appendChild(reset_filter);
	

/////////////////////////////////////////////////////// butonul de filtrare ////////////////////////////////////////////////////////

	document.getElementById("filtreaza").onclick = function(){
		// input text
		var text_name = document.getElementById("name_text").value;
		if(text_name.length > 1){
			for(i = 0; i < c.length; i++){
				var name = c[i].querySelector("#nume");
				for(var j = 0; j < text_name.length; j++){
					if(text_name.toLowerCase()[j] != name.innerHTML.toLowerCase()[j])
						c[i].classList.add("deselectat");
				}
			}
		}

		// input range
		var sld = document.getElementById("value_range").value;
		if(sld != 0){
			for(i = 0; i < c.length; i++){
				var price = c[i].querySelector("#pret");
				if(parseInt(price.innerHTML) <= sld){
					c[i].classList.add("deselectat");
				}
			}
		}

		// input checkbox
		if(document.getElementById(orase[0]).checked == true ||
			document.getElementById(orase[1]).checked == true ||
			document.getElementById(orase[2]).checked == true ||
			document.getElementById(orase[3]).checked == true ||
			document.getElementById(orase[4]).checked == true){
			for(i = 0; i < c.length; i++){
				var toate_loc = c[i].querySelector("#locatii");
				for(var j = 0; j < 5; j++){
					if(document.getElementById(orase[j]).checked == false){
						location_value = document.getElementById(orase[j]).nextSibling.textContent;
						if(toate_loc.innerHTML.includes(location_value) == true)
							c[i].classList.add("deselectat");
					}
				}
			}
		}
		
		// select
		var sel_list = document.getElementById("select_filter");
		var chosen_value = sel_list.options[sel_list.selectedIndex].text;
		if(chosen_value != "toate"){
			for(i = 0; i < c.length; i++){
				var transp = c[i].querySelector("#transport");
				if(transp.innerHTML != chosen_value)
					c[i].classList.add("deselectat");
			}
		}
		
		// textarea
		var text_area = document.getElementById("filter_text_area").value;
		if(text_area.length > 1){
			var str = text_area.split(" ");
			for(i = 0; i < c.length; i++){
				var desc = c[i].querySelector("#descriere");
				for(var j = 0; j < str.length; j++){
					if(str[j][0] == "+"){
						if(desc.innerHTML.toLowerCase().includes(str[j].substr(1)) == false) // substr(1) elimina primul caracter din string
							c[i].classList.add("deselectat");
					}
					else if(str[j][0] == "-")
						if(desc.innerHTML.toLowerCase().includes(str[j].substr(1)) == true)
							c[i].classList.add("deselectat");
				}
			}
		}
	
		// input radio
		var rate_value;
		if(document.getElementById(conditii[0]).checked){
			rate_value = conditii[0];
		}
		else if(document.getElementById(conditii[1]).checked){
			rate_value = conditii[1];
		}
		else 
			rate_value = 0;
		if(rate_value != 0){
			for(i = 0; i < c.length; i++){
				var food = c[i].querySelector("#masa");
				if(food.innerHTML.toLowerCase() != rate_value)
					c[i].classList.add("deselectat");
			}
		}
	
	}
	
/////////////////////////////////////////////////////// butonul de resetare ////////////////////////////////////////////////////////

	document.getElementById("reseteaza").onclick = function(){
		// scoate clasa deselectat din fiecare template
		for(i = 0; i < c.length; i++) {
			c[i].classList.remove("deselectat");
		}
		// resetare input text
		document.getElementById("name_text").value = ""; 
		// resetare input range
		document.getElementById("value_range").value = "0"; 
		var p_c_v = document.getElementById("par_curr_value");
		p_c_v.innerHTML = "Valoarea minima: 0";
		// resetare checkbox
		for(var j = 0; j < 5; j++){
			document.getElementById(orase[j]).checked = false;
		}
		// resetare select
		var sel_list = document.getElementById("select_filter");
		sel_list.selectedIndex = "toate";
		// resetare textarea
		document.getElementById("filter_text_area").value = ""; 
		// resetare radio
		document.getElementById(conditii[0]).checked = false;
		document.getElementById(conditii[1]).checked = false;
	}
	
/////////////////////////////////////////////////////// inversare (ctrl i) ////////////////////////////////////////////////////////

	document.addEventListener('keydown', function(e) {
		var cont = document.getElementById("container_input");
		if(e.ctrlKey && e.keyCode == 73) {
			var rev = document.querySelectorAll(".template_excursie");
			for(let i = rev.length - 1; i >= 0; i--)
				cont.appendChild(rev[i]);
			this.remove();
		 }
	});	
	
	// valoarea curenta din range
	var slider = document.getElementById("value_range");
	slider.onchange = function(){
		var p_c_v = document.getElementById("par_curr_value");
		p_c_v.innerHTML = "Valoarea minima: " + this.value;
	}

///////////////////////////////////////////////////// Eveniment mouse //////////////////////////////////////////////////////
// Cerinta:
// Undeva in pagina exista un patratel de culoare rosie
// La apasarea mouse-ului (fara release) pe patratel, acesta isi schimba culoarea in verde si urmareste cursorul in miscare

	patratel = document.getElementById("patrat");
	ok = false;
	patratel.onmousedown = function(){
		ok = true;
	}
	window.onmouseup = function(){
		ok = false;
	}
	window.onmousemove = function(e){
		if(ok){
			patratel.style.width = e.offsetX + 30 + "px";
			patratel.style.height = e.offsetY + 30 + "px";
			patratel.style.backgroundColor = "green";
		}
		else {
			patratel.style.width = 30 + "px"
			patratel.style.height = 30 + "px";
			patratel.style.backgroundColor = "red";
		}
	}	

}