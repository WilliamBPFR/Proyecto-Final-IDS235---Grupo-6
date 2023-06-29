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
    res.redirect('/ver_asignaturas.html');
});

app.post('/crear-asignatura',async (req,res,next)=>{
    const codigo_asignatura = req.body.txt_Cod_Asignatura;
    const creditos_asignatura = req.body.txt_Creditos_Asignatura;
    const carrera_asignatura = req.body.sel_Carrera_Pertenence;
    const nombre_asignatura = req.body.txt_Nombre_Asignatura;
    const tipo_asignatura = req.body.sel_Asignatura_Tipo;
    const asignatura_visible = req.body.sel_Asignatura_Visible==='1' ? true : false;

    try{
        const asignatura = await prisma.asignatura.findFirst({where:{cod_asignatura:codigo_asignatura}});
        if(asignatura.lenght === 0){
        const new_asignatura = await prisma.asignatura.create({
            data:
            {                    
                cod_asignatura: codigo_asignatura,
                creditos: parseInt(creditos_asignatura),
                id_carrera: parseInt(carrera_asignatura),
                nombre_asignacion: nombre_asignatura,
                id_tipo_asignatura: parseInt(tipo_asignatura),
                visible: asignatura_visible
            }
        });
        const asignaturas = await prisma.asignatura.findMany();
        console.log(asignaturas);
        res.send('Asignatura creada exitosamente');
    }else{
        res.send('Asignatura Con Código Ya Existente');
    }
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrió un error al crear la asignatura');
    }
});

app.get('/cargar_crear_asignatura',async (req,res)=>{
    const carreras = await prisma.carreras.findMany();
    const tipos_asignatura = await prisma.tipos_Asignatura.findMany();
    res.send(`
    <script>
      localStorage.setItem('carreras', JSON.stringify(${JSON.stringify(carreras)}));
      localStorage.setItem('tipoasignatura', JSON.stringify(${JSON.stringify(tipos_asignatura)}));
      window.location.href = '/crear_asignatura.html';
    </script>
    `);
});