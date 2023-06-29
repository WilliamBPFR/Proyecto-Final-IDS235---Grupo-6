//Tarayendo las Librerias
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
dotenv.config();

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

app.post('/iniciar-sesion',(req,res,next)=>{
    const password_introducida = req.body.password;
    const password_encriptada = crypto.createHash('sha256').update(password_introducida).digest('hex');    

    const {correo,contrasena} = req.body;
    prisma.credenciales_Usuario.findUnique({
        where:{
            :
        }
    }).then((usuario)=>{
        if(usuario){
            if(usuario.contrasena == contrasena){
                res.redirect('/inicio.html');
            }else{
                res.redirect('/iniciar_sesion.html');
            }
        }else{
            res.redirect('/iniciar_sesion.html');
        }
    }).catch((error)=>{
        console.log(error);
        res.redirect('/iniciar_sesion.html');
    });
});