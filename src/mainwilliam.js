//Tarayendo las Librerias
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
dotenv.config();

//variables globales
var USUARIO_LOGUEADO = null;
//Creando el Servidor
const app = express();

//Configurando el APP
app.set('views',path.join(__dirname,'Interfaces/pages'));
app.set('view engine','html'); 
app.use(express.static(path.join(__dirname,'./../Interfaces')));
app.use(express.static(path.join(__dirname,'./../Interfaces/pages')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(req.method + ' : ' + req.url)
    next()
});

//Abriendo la Pantalla por Defecto
app.listen(process.env.PORT,()=>{
    console.log(`Servidor Iniciado en el Puerto ${process.env.PORT}`);
});

app.get('/',(req,res)=>{
    res.redirect('/iniciar_sesion.html');
});

app.post('/iniciar-sesion', async (req,res,next)=>{
    const password_introducida = req.body.password;
    const password_encriptada = crypto.createHash('sha256').update(password_introducida).digest('hex');
    //const password_encriptada = crypto.createHash('sha256').update(password_introducida).digest('hex');
    var text = req.body.matricula;
    if(text.length === 7 && isNaN(text) === false){
        try{
            const usuario = await prisma.usuario.findFirst({
            where:{matricula:parseInt(req.body.matricula)},
            include:{Credenciales_Usuario:true}
        });
        // console.log(usuario.Credenciales_Usuario);
        // console.log(usuario.Credenciales_Usuario.hash_contrasena);
        if(usuario){
            if(usuario.Credenciales_Usuario[0].hash_contrasena === password_encriptada){
                USUARIO_LOGUEADO = usuario;
                res.redirect('/home_admin.html');
            }else{
                res.redirect('/iniciar_sesion.html?error=0'); // Redirige con el parámetro de error
            }
        }else{
            res.redirect('/iniciar_sesion.html?error=1'); // Redirige con el parámetro de error
        }
        }catch(error){
        }
    }else{
        res.redirect('/iniciar_sesion.html?error=2'); // Redirige con el parámetro de error

    }
});

app.get('/prueba',(req,res)=>{
    console.log(USUARIO_LOGUEADO);
});