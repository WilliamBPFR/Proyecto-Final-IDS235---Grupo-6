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
    res.redirect('/crear_seccion.html');
});

app.post('/crear_seccion', async(req,res, next)=>{
    const asignatura = req.body.sel_cb_Asignatura;
    const hora_inicio = req.body.sel_cb_Hora_Inicio;
    const hora_fin = req.body.sel_cb_Hora_Fin;
    const rol = req.body.sel_cb_Docente;
    const num_seccion = req.body.txt_Num_Seccion;
    const modalidad = req.body.sel_cb_Modalidad;


    try{
        const seccion = await prisma.seccion.findFirst({where:{num_seccion:num_seccion}});
        if(seccion.lenght === 0){
        const new_seccion = await prisma.seccion.create({
            data:
            {                    
                asignatura: asignatura,
                docente: rol,
                hora_inicio: hora_inicio,
                hora_fin: hora_fin,
                num_seccion: parseInt(num_seccion),
                modalidad: modalidad
            }
        });
        const secciones = await prisma.seccion.findMany();
        console.log(secciones);
        res.send('Seccion creada exitosamente');
    }else{
        res.send('Seccion ya existe');
    }
    }catch(error){
        console.log(error);
        res.status(500).send('Error al crear la seccion');
    }
});

app.get('/cargar_crear_seccion',async (req,res)=>{
    const asignaturas = await prisma.asignatura.findMany();
    const roles = await prisma.rol.findMany();
    const modalidades = await prisma.modalidad.findMany();
    res.send(`
    <script>
      localStorage.setItem('asignaturas', JSON.stringify(${JSON.stringify(asignaturas)}));
      localStorage.setItem('roles', JSON.stringify(${JSON.stringify(roles)}));
      localStorage.setItem('modalidades', JSON.stringify(${JSON.stringify(modalidades)}));
      window.location.href = '/crear_asignatura.html';
    </script>
    `);
});

