//Tarayendo las Librerias
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { isNull } = require('util');
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
    res.redirect('/ver_usuarios_sistema.html');
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

app.post('/crear-usuario',async (req,res,next)=>{
    const nombre_user = req.body.txt_Nombre_Usuario;
    const rol = req.body.cb_rol;
    const matr = req.body.txt_ID;
    const fecha_nacimiento = req.body.txt_Fecha;
    const id_est = req.body.cb_estado;
    const email = req.body.txt_Email;
    const carrera_asignatura = req.body.cb_carrera;
    const password = req.body.txt_Password;
    const indice_academico = 4;
    const password_encriptada = crypto.createHash('sha256').update(password).digest('hex');
    if(matr.length === 7 && isNaN(matr) === false){
        console.log('entre al if de la matricula');
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(regex.test(email) === true){
            try{
                const usuario = await prisma.usuario.findFirst({where:{matricula:parseInt(matr)}});
                if(isNull(usuario)){
                const new_ususario = await prisma.usuario.create({
                    data:
                    {                    
                        nombre_usuario: nombre_user,
                        id_rol: parseInt(rol),
                        matricula: parseInt(matr),
                        fecha_nac: new Date(fecha_nacimiento),
                        id_estado: parseInt(id_est),
                        email: email,
                        id_carrera_est: parseInt(carrera_asignatura),
                        indice_acad_est: parseFloat(indice_academico)
                    }
                });
                console.log('garde usuario');
                const new_credenciales = await prisma.Credenciales_Usuario.create({
                    data:
                    {
                        id_usuario: new_ususario.id_usuario,
                        hash_contrasena: password_encriptada
                    }
                });
                console.log('guarde credenciales');
                const usuarioss = await prisma.usuario.findMany();
                console.log(usuarioss);
                console.log(new_credenciales);
                res.send('Uusario creado exitosamente');
            }else{
                res.status(400).send('0');
            }
            }catch(error){
                console.log(error);
                res.status(400).send('1');
            }
        }else{
            console.log('entre al else del email');
            res.status(400).send('3');
        }
    }else{
        res.status(400).send('2');
    }
});

app.get('/cargar_crear_usuario',async (req,res)=>{
    try{
        console.log('cargando')
        const carreras = await prisma.carreras.findMany();
        console.log(carreras);
        const rol = await prisma.rol.findMany();
        console.log(rol);
        const estados = await prisma.estado.findMany();
        console.log(estados);
        res.send(`
        <script>
        localStorage.setItem('carreras', JSON.stringify(${JSON.stringify(carreras)}));
        localStorage.setItem('roles', JSON.stringify(${JSON.stringify(rol)}));
        localStorage.setItem('estados', JSON.stringify(${JSON.stringify(estados)}));
        window.location.href = '/crear_usuario.html';
        </script>
        `);
    }catch(error){
    }
});