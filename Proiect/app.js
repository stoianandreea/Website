// modulele trebuie instalate in Powershell
const express = require('express');
const app = express();
const session = require('express-session')
const formidable = require('formidable');
const fs = require('fs');

app.set('view engine', 'ejs');   // pentru a folosi ejs-ul (view engine = motorul care interpreteaza template-urile)
app.use(express.static(__dirname));
app.use('/resurse', express.static('resurse'));   // pentru a folosi folderul de resurse (css, imagini, js)

//setez o sesiune
app.use(session({
  secret: 'abcdefg', // folosit de express session pentru criptarea id-ului de sesiune
  resave: true,
  saveUninitialized: false
}));

app.get('/', function(req, res){
	res.render('Pagini/index',{user: req.session.username});
});

// inregistrare user nou
app.get('/inregistrare', function(req,res) {
    res.render('Pagini/inregistrare',{user: req.session.username});
});

app.post('/inregistrare', (req, res) => {
	var form = new formidable.IncomingForm(); // obiect de tip form cu care parsez datele venite de la utilizator
	form.parse(req, function(err, fields, files) {
		let rawdata = fs.readFileSync('useri.json'); // citesc fisierul si pun tot textul in rawdata
		let jsfis = JSON.parse(rawdata); // parsez textul si obtin obiectul asocit JSON-ului
		let user = jsfis.useri.find(function(x){ //caut un user cu acelasi nume dat in formular
			return (x.username==fields.username);
		});
		if(user) {
			console.log("Username deja existent!");
			res.render('Pagini/inregistrare', {error_message: true});
		}
		else {
			jsfis.useri.push({id:jsfis.lastId, username:fields.username, parola:fields.parola}); // adaug elementul nou
			jsfis.lastId++;//incrementez id-ul ca sa nu am doi utilizatori cu acelasi id
			let data = JSON.stringify(jsfis);
			fs.writeFileSync('useri.json', data);
			res.redirect('/login');
		}
    });
});

app.get('/login', function(req, res) {
  res.render("Pagini/login",{user: req.session.username});
})

// login user existent
app.post('/login', function(req, res) {
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		let rawdata = fs.readFileSync('useri.json');
		let jsfis = JSON.parse(rawdata);
		let user=jsfis.useri.find(function(x){ // caut un user cu acelasi nume dat in formular si cu aceeasi parola
			return (x.username == fields.username && x.parola == fields.parola);
		});
		if(user){
			req.session.username = user;
			console.log(req.session.username);
			res.render('Pagini/index', {user: req.session.username});
		}
		else {
			res.render('Pagini/login', {error_message: true});
		}
	});
});
app.get('/logout', function(req, res){
	req.session.destroy();
	res.render('Pagini/logout');
});

// pt template
app.get('/excursii', function(req, res) {
	let rawdata = fs.readFileSync('excursii.json');
	let jsfis = JSON.parse(rawdata); // transforma json in obiect js
	res.render('Pagini/excursii', {excursii:jsfis.excursii, user: req.session.username}); // transmite datele js din json
});

//pentru celelalte pagini (daca nu gaseste pagina => eroare 404)
app.get("/*",function (req, res, next) {
	res.render("Pagini" + req.path, {user: req.session.username}, function(err, html) { // render are un parametru optional cu o functie callback
		//err e setat cand avem o eroare
		//html e setat cand a fost gasit view-ul cu succes
		if (err) { //daca avem eroare
			if (err.message.indexOf('Failed to lookup view') !== -1) { //verificam daca eroarea contine mesajul de view negasit
				return res.status(404).render('Pagini/404'); //caz in care afisam pagina de 404
			}
			throw err; //altfel aruncam mai departe eroarea (generata de alte cauze)
		}
		res.send(html);  //daca nu a fost nicio eroare trimitem html-ul rezultat in urma compilarii cu render
	});
});

app.listen(1234);
console.log("Listening on port 1234");