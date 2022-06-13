const port = 3000
const { request } = require("express");
const { response } = require("express");
var express = require("express");
const req = require("express/lib/request");
const jwt = require("jsonwebtoken");
var sql = require("mssql");
var cors = require('cors');
var app = express();
app.use(express.json());
app.use(cors());


var config = require("./SqlConfig");
var db = config.database;

var config = {
    user: db.user,
    password: db.password,
    server: db.server,
    database: db.database,
    port: db.port,
    trustServerCertificate: true,
};


app.listen(port, () => console.log('Running'))

app.get('/api/GetActiveEmployeeData', verifyToken, (request, response) => {
    try {
        jwt.verify(request.token, 'secretkey', (err, authData) => {
            if (err) {
                response.status(400).send(err);
            }
            else {
                const loc_center = request.body.location[0].name;

                var sqlquery = "select * from <TABLE or DB View Name> where LocationName in('" + loc_center + "') and EmpStatus <> 'TER'";
                sql.connect(config, (err) => {
                    if (err) console.log("err" + err);
                    var request1 = new sql.Request()
                    request1.query(sqlquery, (error, dataset) => {
                        if (error) console.log(error);
                        response.send({ dataset })
                        sql.close()
                    })

                })
            }
        })
    }
    catch (ee) {
        response.send(ee);
    }
})

app.post('/api/login', (request, response) => {
  debugger;
 
    try {
        debugger;
        if (request.body.user[0].email == 'Keyur@test.com' && request.body.user[0].password == 'Keyur123@') {

            const user = {

                username: request.body.user[0].email,
                password: request.body.user[0].password
            };
            jwt.sign({ user }, 'secretkey', { expiresIn: '1800s' }, (err, token) => {
                 
                response.send(token);  
             
            });
        }
        else {
            response.status(400).send('wrong username or password');
        }
    }
    catch (ee) {
        response.send(ee);
    }
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else {
        res.sendStatus(403);
    }
}
app.get('/VerifyYourToken', verifyToken, (request, response) => {
    //  response.send(request.body.Location[0].name)
    jwt.verify(request.token, 'secretkey', (err, authData) => {
        if (err) {
            response.status(400).send(err);
        }
        else {
            response.json({
                message: 'token verified...',
                authData
            });
        }
    })

})