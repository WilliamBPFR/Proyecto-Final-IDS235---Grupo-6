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
    res.redirect('/crear_asignatura.html');
});

app.post('/crear-asignatura',async (req,res,next)=>{
    const codigo_asignatura = req.body.txt_Cod_Asignatura;
    const creditos_asignatura = req.body.txt_Creditos_Asignatura;
    const carrera_asignatura = req.body.sel_Carrera_Pertenece;
    const nombre_asignatura = req.body.txt_Nombre_Asignatura;
    const tipo_asignatura = req.body.sel_Asignatura_Tipo;
    const asignatura_visible = req.body.sel_Asignatura_Visible;

    try{
        const new_state = await prisma.asignatura.create({
            data:
            {                    
                codigo_asignatura:cod_asignatura,                    
                creditos_asignatura:creditos,
                carrera_asignatura:carrera,
                nombre_asignatura:nombre_asignacion,
                tipo_asignatura:id_tipo_asignatura,
                asignatura_visible:visible
            }
        });
        const estados = await prisma.estado.findMany();
        console.log(estados);
        res.send('Asignatura creada exitosamente');
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrió un error al crear la asignatura');
    }
});