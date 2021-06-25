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
  console.error('Nie udalo sie nawiazac polaczenia z baza danych');
})

const CardSet = sequelize.define('sets', { name: DataTypes.TEXT });
const BlackCard = sequelize.define('black_cards', { text: DataTypes.TEXT });
CardSet.hasMany(BlackCard, { as: 'BlackCards'});
const WhiteCard = sequelize.define('cards_cards', { text: DataTypes.TEXT });
CardSet.hasMany(WhiteCard, { as: 'WhiteCards'});

sequelize.sync({force: true})
.then(() => {
  console.log('Utworzono tabele w bazie danych');
});
