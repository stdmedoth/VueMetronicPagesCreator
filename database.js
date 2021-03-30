const mysql = require('mysql');


var con = mysql.createConnection({
  host: "localhost",
  user: "calistu",
  password: "bash9835",
  database : 'euquero_festa'
});

con.connect(function(err) {
  if (err) throw err;
  console.log('Banco ' + con.config.database + ' Conectado!');
});

module.exports = con;