// Ustawienia związane z serwerem i portem
const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
app.use(express.static('client'));


// Zmienne pomocnicze
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var validator = require("email-validator"); // Do sprawdzania poprawności emaila
const bcrypt = require('bcrypt'); // Do szyfrowania hasła

var logMessage = "";
var regMessage = "";
var startMessage = "";


// Do obsułgi sieżki do obrazków i css
app.use(express.static(__dirname + '/img'));
app.use(express.static(__dirname + '/css'));


// Do używania zmiennych w HTML, używamy ejs do rendera
app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));


// Do pozyskania danych z formsa
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Połączenie do lokalnej bazy mysql z XAMPPa
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "phpmyadmin"


});


// Funkcje pomocnicze


async function CompareHashPassword(password, password2) // Porównanie czy hasła są takie same
{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const isSame = await bcrypt.compare(password2, hash); // updated
    return isSame;
}






// Strona startowa
app.get('/', function(request, response) {
	//response.sendFile(path.join(__dirname + '/html/Start.html'));
    var name = "";
    if (request.session.loggedin)
    {
        name = request.session.username;
    }


    var options =
    {
        logged: request.session.loggedin,
        name: name,
        message: startMessage
    }

    startMessage = "";
    response.render(path.join(__dirname + '/html/Start.html'), options);
});


// Strona logowania
app.get('/Logging', function (request, response) {
    var options =
    {
        message: logMessage
    };
    logMessage = "";
    response.render(path.join(__dirname + '/html/Logging.html'), options);
});


// Strona wylogowania
app.get('/Logout', function (request, response) {
    request.session.loggedin = false; // Wylogowanie użytkownika
    response.redirect('/')
});


// Strona rejestracji
app.get('/Register', function (request, response) {
    var options =
    {
        message: regMessage
    };
    regMessage = "";
    response.render(path.join(__dirname + '/html/Register.html'), options);
});


// Obsługa logowania 
app.get('/home', function (request, response)
{
    if (request.session.loggedin) // Jeśli użytkownik jest zalogowany
    {
        var options =
        {
            name: request.session.username

        }

        response.render(path.join(__dirname + '/logged.html'), options)
    }
    else response.redirect('/') // W przeciwnym wypadku
   
});


// Pozyskanie danych logowania i zalogowanie
app.post('/auth',
    function (request, response)
    {
        var username = request.body.username;
        var password = request.body.password;

        if (username && password)
        {
            
            con.query('SELECT password FROM User where username = ?', [username],
                async function (error, results, fields)
                {
                    if (results.length > 0)
                    {
                        hashPassword = results[0].password;
                        const isValid = await bcrypt.compare(password, hashPassword);
                        if (isValid) {
                            request.session.loggedin = true;
                            request.session.username = username;
                            response.redirect('/')
                        }
                        else
                        {
                            logMessage = "Niepoprawny login lub hasło";
                            response.redirect('/Logging');
                        }
                    }
                    else
                    {
                        logMessage = "Niepoprawny login lub hasło";
                        response.redirect('/Logging');
                    }
                }
            );

            
        }
        else
        {
            logMessage = "Podaj login i hasło";
            response.redirect('/Logging');
        }
    }
);


// Pozyskanie danych rejestracji i utworzenie konta
app.post('/CreateAccount',
    function (request, response) {
        var username = request.body.username;
        var email = request.body.email;
        var password = request.body.password;
        var password2 = request.body.password2;
        var wrong = 0;
        var message = "";

        if (username.length == 0)
        {
            message = "Podałeś za krótką nazwę użytkownika";
            wrong = 1;
        }
  
        else if (!validator.validate(email))
        {
            message = "Niepoprawny email";
            wrong = 1;   
        }
          
        else if (password.length < 8)
        {
            message = "Hasło jest za krótkie, powinno być długości przynajmniej 8";
            wrong = 1;   
        }

        else if (password != password2)
        {
            message = "Hasła nie są takie same";
            wrong = 1;
        }

        if (wrong == 1)
        {
            regMessage = message;
            response.redirect('/Register');
        }

        else if(wrong == 0)
        {
            bcrypt.hash(password, 10,
                function (err, hash)
                {
                if (err) console.log(err);
                password = hash;

                    con.query("Insert into User (username,password,email) values(?,?,?)", [username, password, email],
                        function (err, result)
                        {
                            if (err) {
                                regMessage = "Błąd przy rejestracji";
                                response.redirect('/Register');
                            }
                            else {
                                startMessage = "Utworzono konto";
                                response.redirect('/');
                            }
                        }
                    );
                }
            );    
        }      
    }
);







/*
// Wylogowanie
app.post('/logout',
    function (request, response)
    {
        request.session.loggedin = false; // Wylogowanie użytkownika
        response.redirect('/')
    }
);
*/

/*
app.get('/', function (req, res, next) {
    res.json({
		'ssdtus': 'Ssdes',
        'status': 'Sukces'
    });
});
*/

// Odpowiedź serwera na porcie
server.listen(PORT, function() {
    console.log('server running');
});


// connection to Heroku postgresql
/*
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect();
client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

*/
