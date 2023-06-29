const fs = require('fs');
const Connection = require('tedious').Connection;
const path = require('path');
const Request = require('tedious').Request;

const config = {
    server: 'LAPTOP-JC0100HH',
    authentication: {
        type: 'default',
        options: {
            userName: "IDS325",
            password: "123456789"
        }
    },
    options: {
        port: 1433,
        database: "BD_App_Mi_Indice_Academico",
        trustsServerCertificate: true,
        encrypt: false
    }
};

const connection = new Connection(config);

function executeStatement() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'Script BD.sql');
    const script = fs.readFileSync(scriptPath, 'utf8');
    const rows = [];

    const request = new Request("SELECT * FROM Estado", (err, rowCount) => {
      if (err) {
        reject(err);
      } else {
        console.log('Script SQL ejecutado con éxito. Filas afectadas:', rowCount);
        resolve(rows);
      }
      connection.close();
    });

    request.on('row', (columns) => {
      const row = {};
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value;
      });
      rows.push(row);
    });

    connection.execSql(request);
  });
}

connection.connect((err) => {
  if (err) {
    console.log('Connection Failed');
    console.log(err);
  } else {
    executeStatement()
      .then((result) => {
        // Utilizar los valores de la consulta aquí
        console.log(result);
      })
      .catch((error) => {
        console.error('Error al ejecutar el script SQL:', error);
      });
  }
});
