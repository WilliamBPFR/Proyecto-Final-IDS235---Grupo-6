//Tarayendo las Librerias
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { isNull } = require('util');
const { Console } = require('console');
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
    var text = req.body.matricula;
    
    if(text.length === 7 && isNaN(text) === false){
        try{
            const usuario = await prisma.usuario.findFirst({
            where:{matricula:parseInt(req.body.matricula)},
            include:{Credenciales_Usuario:true,Carreras:true}
        });
        // console.log(usuario.Credenciales_Usuario);
        // console.log(usuario.Credenciales_Usuario.hash_contrasena);
        if(usuario){
            if(usuario.Credenciales_Usuario[0].hash_contrasena === password_encriptada){
                USUARIO_LOGUEADO = usuario;
                switch(usuario.id_rol){ 
                    case 1://Administrador
                        res.redirect('/nav_admin?id=4');
                        break;
                    case 2://Profesor
                        break;
                    case 3://Estudiante
                        const user = usuario;
                        res.send(`
                        <script>
                        localStorage.setItem('usuario', JSON.stringify(${JSON.stringify(usuario)}));
                        window.location.href = '/inicio_est.html    ';
                        </script>
                    `);
                        res.redirect('/inicio_est.html');
                        break;
                    default:
                        break;
                }
            }else{
                res.redirect('/iniciar_sesion.html?error=0'); // Redirige con el parámetro de error
            }
        }else{
            res.redirect('/iniciar_sesion.html?error=1'); // Redirige con el parámetro de error
        }
        }catch(error){
            console.log(error);
            // res.redirect('/iniciar_sesion.html?error=1'); // Redirige con el parámetro de error
        }
    }else{
        res.redirect('/iniciar_sesion.html?error=2'); // Redirige con el parámetro de error

    }
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


app.post('/modificar-usuario',async (req,res,next)=>{
    const id_viejo = req.body.id_viejo
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

        const mensaje = {
            carrera: carreras,
            rol: rol,
            estado: estados
        };
        res.json(mensaje);
        // res.send(`
        // <script>
        // localStorage.setItem('carreras', JSON.stringify(${JSON.stringify(carreras)}));
        // localStorage.setItem('roles', JSON.stringify(${JSON.stringify(rol)}));
        // localStorage.setItem('estados', JSON.stringify(${JSON.stringify(estados)}));
        // window.location.href = '/crear_usuario.html';
        // </script>
        // `);
    }catch(error){
    }
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
        if(isNull(asignatura)){
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
        res.send('Asignatura Creada Exitosamente');
    }else{
        res.status(400).send('1');
    }
    }catch(error){
        console.log(error);
        res.status(500).send('2');
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

app.post('/crear_seccion', async (req,res, next)=>{
    const asignatura = req.body.cb_Asignatura;
    const hora_inicio = req.body.cb_Hora_Inicio;
    const hora_fin = req.body.cb_Hora_Fin;
    const doc = req.body.cb_Docente;
    const num_seccion = req.body.txt_Num_Seccion;
    const modalidad = req.body.cb_Modalidad;
    console.log(asignatura);
    if(parseInt(hora_inicio)<parseInt(hora_fin)){
        if(parseInt(num_seccion)>0 && parseInt(num_seccion)<1000){
            try{
                const trimestre_actual = await prisma.trimestres.findFirst({where:{activo: true}});
                const secciones_profesor = await prisma.seccion.findMany({where:{id_profesor:parseInt(doc), id_trimestre:trimestre_actual.id_trimestre}});
                var doc_no = false;
                secciones_profesor.forEach(seccion => {
                        if(parseInt(seccion.hora_inicio)<=parseInt(hora_inicio) && parseInt(hora_inicio)<parseInt(seccion.hora_fin)){
                            console.log('Hora Inicio: ' + seccion.hora_inicio);
                            console.log('Hora Fin: ' + seccion.hora_fin);
                            doc_no = true;
                        }
                });
                if(doc_no===false){
                    const seccion = await prisma.seccion.findFirst({where:{num_seccion:parseInt(num_seccion), id_asignatura: parseInt(asignatura)}});
                    if(isNull(seccion)){
                        const new_seccion = await prisma.seccion.create({
                            data:
                            {                    
                                id_asignatura: parseInt(asignatura),
                                id_profesor: parseInt(doc),
                                hora_inicio: hora_inicio,
                                hora_fin: hora_fin,
                                num_seccion: parseInt(num_seccion),
                                id_modalidad: parseInt(modalidad),
                                id_trimestre: trimestre_actual.id_trimestre
                            }
                        });
                        res.send('AY AHORA QUE');
                        console.log('guarde');
                    }else{
                        res.status(500).send('2');
                    }
                }else{
                    console.log('error al elseeeeeeee');
                    res.status(500).send('4');
                }
            }catch(error){
                console.log(error);
                res.status(500).send('Error al crear la seccion');
            }
        }else{
            console.log('error al elseeeeeeee');
            res.status(500).send('3');
        }
}else{  
    res.status(400).send('1');
}
});

app.get('/cargar_crear_seccion',async (req,res)=>{
    const asignaturas = await prisma.asignatura.findMany();
    const docente = await prisma.usuario.findMany({where:{id_rol:2}});
    const modalidades = await prisma.modalidad.findMany();
    const mensaje = {
        asignaturas: asignaturas,
        docente: docente,
        modalidades: modalidades
    };
    res.json(mensaje);
});

app.get('/nav_admin',async (req,res)=>{
    var id = parseInt(req.query.id);
   switch(id){
    case 1:
        const asignaturas = await prisma.asignatura.findMany({include:{Tipos_Asignatura:true}});
        res.send(`
     <script>
      localStorage.setItem('asignaturas', JSON.stringify(${JSON.stringify(asignaturas)}));
      window.location.href = '/ver_asignaturas.html';
      </script>
    `);
        // res.redirect('/ver_asignaturas.html');
        break;
    case 2:
        const usuarios = await prisma.usuario.findMany({include:{Rol:true, Estado:true}});  
        console.log(usuarios);
        res.send(`
        <script>
         localStorage.setItem('usuarios', JSON.stringify(${JSON.stringify(usuarios)}));
         window.location.href = '/ver_usuarios_sistema.html';
         </script>
       `);
        break
    case 3:
        console.log('Entre a la seccion');
        const secciones = await prisma.seccion.findMany({include:{Asignatura:true,Usuario:true,Modalidad:true}});  
        res.send(`
            <script>
            localStorage.setItem('secciones', JSON.stringify(${JSON.stringify(secciones)}));
            window.location.href = '/ver_secciones.html';
            </script>
        `);
        break;
    case 4:
        const cant_usuarios = await prisma.usuario.count();
        const cant_asignaturas = await prisma.asignatura.count();
        const trimestre_actual = await prisma.trimestres.findFirst({where:{activo:true},include:{Tipo_Trimestres:true}});
        const cant_secciones = await prisma.seccion.count({where:{id_trimestre:trimestre_actual.id_trimestre}});
        var obj = {
            cant_usuarios:cant_usuarios,
            cant_asignaturas:cant_asignaturas,
            cant_secciones:cant_secciones,
            trimestre_actual:trimestre_actual
            }
        console.log(obj);
        res.send(`
            <script>
            localStorage.setItem('info_home_admin', JSON.stringify(${JSON.stringify(obj)}));
            window.location.href = '/home_admin.html';
            </script>
        `);
        break;
    case 5:
        const trimestres = await prisma.tipo_Trimestres.findMany();  
        const triactual = await prisma.trimestres.findFirst({where:{activo:true}});
        const fecha_sel = await prisma.inicio_Fin_Seleccion.findFirst({where:{id_trimestre:triactual.id_trimestre}});
        console.log(fecha_sel);
        res.send(`
      <script>
      localStorage.setItem('trimestres', JSON.stringify(${JSON.stringify(trimestres)}));
      localStorage.setItem('trimestre', JSON.stringify(${JSON.stringify(triactual)}));
      localStorage.setItem('fecha_sel', JSON.stringify(${JSON.stringify(fecha_sel)}));
      window.location.href = '/configuracion.html';
      </script>
      `);
        break;
    case 6:
        res.redirect('/perfil.html');
    break;
    }
});

app.get('/modificar_trimestre',async (req,res)=>{
    const trimestre = req.query.trimestre;
    const ano = req.query.ano;
    console.log(trimestre + " "+ ano);
    try{
        const trimestre_existe = await prisma.trimestres.findFirst({where:{id_tipo_trimestre:parseInt(trimestre),ano_trimestre:ano}});
        const trimestre_actual = await prisma.trimestres.findFirst({where:{activo:true}});
        if(isNull(trimestre_existe)){
            const trimestre_modificar = await prisma.trimestres.update({where:{id_trimestre:trimestre_actual.id_trimestre},data:{activo:false}});
            const new_trimestre = await prisma.trimestres.create({
                data:
                {                    
                    id_tipo_trimestre: parseInt(trimestre),
                    ano_trimestre: ano,
                    activo: true
                }
            
            });
            res.send('Trimestre modificado exitosamente');
        }else{
            tri_modf = await prisma.trimestres.update({where:{id_trimestre:trimestre_existe.id_trimestre},data:{activo:true}});
            tri_modf = await prisma.trimestres.update({where:{id_trimestre:trimestre_actual.id_trimestre},data:{activo:false}});
            res.send('Trimestre ya existe');
        }
    }catch(error){
        console.log(error);
        res.status(400).send('Trimestre ya existe');
    }
    
});

app.get('/modificar_fecha_sel',async (req,res)=>{
    const fecha_inicio = req.query.fecha_inicio;
    const fecha_fin = req.query.fecha_fin;
    try{
        const trimestre_actual = await prisma.trimestres.findFirst({where:{activo:true}});
        const fecha_sel_act = await prisma.inicio_Fin_Seleccion.findFirst({where:{id_trimestre:trimestre_actual.id_trimestre}});
        if(isNull(fecha_sel_act)){
            console.log("entre a guardar fecha");
            const new_trimestre = await prisma.inicio_Fin_Seleccion.create({
                data:
                {                    
                    fecha_inicio: new Date(fecha_inicio),
                    fecha_fin: new Date(fecha_fin),
                    id_trimestre: trimestre_actual.id_trimestre
                }
            
            });
            res.send('Seleccion Guardada exitosamente');
        }else{
            try{
                console.log("entre a modificar fecha");
            fecha_sel_act2 = await prisma.inicio_Fin_Seleccion.update({where:{id_seleccion:fecha_sel_act.id_seleccion},data:{fecha_inicio:new Date(fecha_inicio),fecha_fin:new Date(fecha_fin)}});
            console.log(fecha_sel_act2);
            }catch(error){
            }
            res.send('Seleccion ya existe');
        }
    }catch(error){
        console.log(error);
        res.status(400).send('Seleccion ya existe');
    }
    
});

app.get('/cerrar_sesion',async (req,res)=>{
    USUARIO_LOGUEADO = null;
    res.send(`1`);
});

app.get('/usuario_logueado',async (req,res)=>{
    if(isNull(USUARIO_LOGUEADO)){
        res.status(400).send(`0`);
    }else{
        res.send(`1`);
    }
});