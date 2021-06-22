const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();

const http = require('http');
const server = http.Server(app);

app.use(express.static('client'));

app.get('/', function (req, res, next) {
    res.json({
        'status': 'Sukces'
    });
});

server.listen(PORT, function() {
    console.log('server running');
});


// connection to Heroku postgresql
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

sequelize.authenticate()
.then(()=>{
  console.log('Nawiazano polaczenie z baza danych');
})
.catch(err => {
  console.error('Nie udalo sie nawiazac po?aczenia z baza danych');
})

const BlackCard = sequelize.define('black_cards', { text: DataTypes.TEXT });

sequelize.sync({force: true})
.then(() => {
  console.log('Utworzono tabele w bazie danych');
  BlackCard.bulkCreate([
    { text: 'Ala ma kota' },
    { text: 'Ala ma psa' },
    { text: 'czerwona kartka dla Krychowiaka xdd' }
  ]).then(function(){
    return BlackCard.findAll();
  }).then(function(cards){
    console.log(cards);
  });
});



module.express = app;