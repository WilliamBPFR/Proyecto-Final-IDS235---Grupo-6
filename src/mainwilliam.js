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
const { generateToken, verifyToken, blacklistToken } = require('./../jwt/jwtUtils'); // Ajusta la ruta según la ubicación real de tu archivo jwtUtils.js
const cookieParser = require('cookie-parser');
const e = require('express');
dotenv.config();

//variables globales
// var USUARIO_LOGUEADO = null;
//Creando el Servidor
const app = express();

// Middleware de verificación de acceso restringido
const restrictAccess = (req, res, next) => {
    console.log("restrictAccess");
    const username = req.cookies.token; // Supongamos que el parámetro de ruta contiene el nombre de usuario
    const decoded = verifyToken(username); // Decodifica el token y obtiene el nombre de usuario
    if(decoded){
        const id_rol = decoded.id_rol;
        const requestedPath = req.path; // Ruta a la que se intenta acceder
        console.log(requestedPath);
    
        // Verificar si el usuario tiene acceso a la carpeta correspondiente
        if (id_rol === 1 && requestedPath.startsWith('/administrador')) {
            console.log("administrador");
        next(); // Permitir acceso
        } else if (id_rol === 2 && requestedPath.startsWith('/profesores')) {
        next(); // Permitir acceso
        } else if (id_rol === 3 && requestedPath.startsWith('/estudiantes')) {
            console.log("estudiantes");
        next(); // Permitir acceso
        } else if (requestedPath.startsWith('/script')){
            
        }else {
        res.redirect('/iniciar_sesion.html'); // Denegar acceso
        }
    }else{
        res.redirect('/iniciar_sesion.html'); // Denegar acceso
    }
  };

//Configurando el APP
app.use(cookieParser());
app.set('views',path.join(__dirname,'Interfaces/pages'));
app.set('view engine','html'); 
app.use(express.static(path.join(__dirname,'./../Interfaces')));
app.use(express.static(path.join(__dirname,'./../Interfaces/pages')));
app.use(express.static(path.join(__dirname,'./../Interfaces/pages/estudiantes')));
app.use(express.static(path.join(__dirname,'./../Interfaces/pages/profesores')));
app.use(express.static(path.join(__dirname,'./../Interfaces/pages/administrador')));

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
                if(usuario.id_estado != 2){
                    // Genera el token JWT
                    const token = generateToken(usuario.id_usuario, usuario.matricula,usuario.id_rol);
                    // Guarda el token en una cookie
                    res.cookie('token', token, { maxAge: 3600000, httpOnly: true }); // Configura el tiempo de vida y otras opciones según tus necesidades

                    switch(usuario.id_rol){ 
                        case 1://Administrador
                            res.redirect('/nav_admin?id=4');
                            break;
                        case 2://Profesor
                            res.redirect('nav_profesores?id=1')
                            break;
                        case 3://Estudiante
                            const user = usuario;
                            res.send(`
                            <script>
                            localStorage.setItem('usuario', JSON.stringify(${JSON.stringify(usuario)}));
                            window.location.href = '/inicio_est.html';
                            </script>
                            `);
                            // res.redirect('/inicio_est.html');
                            break;
                        default:
                            break;
                     }
                }else{
                    res.send(`
                <script>
                localStorage.setItem('login_status', '5');
                window.location.href = '/iniciar_sesion.html';
                </script>
                `);
                }
            }else{
                res.send(`
                <script>
                localStorage.setItem('login_status', '0');
                window.location.href = '/iniciar_sesion.html';
                </script>
            `);
        }
        }else{
            res.send(`
            <script>
            localStorage.setItem('login_status', '1');
            window.location.href = '/iniciar_sesion.html';
            </script>
        `);
        }
        }catch(error){
            console.log(error);
            // res.redirect('/iniciar_sesion.html?error=1'); // Redirige con el parámetro de error
        }
    }else{
        res.send(`
        <script>
        localStorage.setItem('login_status', '2');
        window.location.href = '/iniciar_sesion.html';
        </script>
    `);
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
            if(password !== ''){
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
                    res.send('10');
                }else{
                    res.status(400).send('0');
                }
                }catch(error){
                    console.log(error);
                    res.status(400).send('1');
                }
            }else{
                res.status(400).send('4');
            }
        }else{
            console.log('entre al else del email');
            res.status(400).send('3');
        }
    }else{
        res.status(400).send('2');
    }
});
  
app.get('/cargar_modificar_usuario',async (req,res,next)=>{
    console.log(req.query.matricula);
    const matricula = req.query.matricula;
    try{
        const usuario = await prisma.usuario.findFirst({
            where:{matricula:parseInt(matricula)},
            include:{Rol:true,Estado:true,Credenciales_Usuario:true,Carreras:true}
        });
        console.log('modificar usuariio');
        res.json(usuario);
    }catch(error){
        console.log(error);
    }
});

// app.get('/cargar_modificar_asignatura',async (req,res,next)=>{
//     console.log(req.query.matricula);
//     const cod_asignatura = req.query.matricula;
//     try{
//         const usuario = await prisma.usuario.findFirst({
//             where:{cod_asignatura:cod_asignatura},
//             include:{Tipos_Asignatura:true,Carreras:true, asignatura_visible:true}
//         });
//         console.log(asignatura);
//         res.json(asignatura);
//     }catch(error){
//         console.log(error);
//     }
// });

app.get('/cargar_modificar_asignatura', async (req, res, next) => {
    console.log(req.query.cod_asig);
    const cod_asignatura = req.query.cod_asig;
    try {
      const Asignatura = await prisma.Asignatura.findFirst({
        where: { cod_asignatura: cod_asignatura },
        include: { Tipos_Asignatura: true, Carreras: true}
      });
      console.log(Asignatura);
  
      // Redirigir al usuario a una nueva URL con el código de la asignatura
      res.json(Asignatura);
    } catch (error) {
      console.log(error);
    }
});
  

app.post('/modificar-usuario',async (req,res,next)=>{
    const user = usuario_logueado(req.cookies.token);
    console.log(user);
    const mtr_viejo = req.body.mat_viejo;
    console.log("Matricula vieja:")
    console.log(mtr_viejo);
    const nombre_user = req.body.txt_Nombre_Usuario;
    const rol = req.body.cb_rol;
    const matr = req.body.txt_ID;
    const fecha_nacimiento = req.body.txt_Fecha;
    const id_est = req.body.cb_estado;
    const email = req.body.txt_Email;
    const carrera_asignatura = req.body.cb_carrera;
    const password = req.body.txt_Password;
    console.log("Contraseña:")
    console.log(password)
    var password_encriptada;
    if(isNull(password) === false && password !== ''){
        password_encriptada = crypto.createHash('sha256').update(password).digest('hex');
    }else{
        password_encriptada = null;
    }
    if(matr.length === 7 && isNaN(matr) === false){
        console.log('entre al if de la matricula');
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(regex.test(email) === true){
            try{
                console.log('entre al try');
                const usuario = await prisma.usuario.findFirst({where:{matricula:parseInt(matr)}});
                console.log(usuario.matricula);
                console.log(mtr_viejo);
                if(isNull(usuario) || usuario.matricula === parseInt(mtr_viejo)){
                // const user_viejo = await prisma.usuario.findFirst({where:{matricula:parseInt(mtr_viejo)}});
                const new_ususario = await prisma.usuario.update({
                    where:{matricula:parseInt(mtr_viejo)},
                    data:
                    {                    
                        nombre_usuario: nombre_user,
                        id_rol: parseInt(rol),
                        matricula: parseInt(matr),
                        fecha_nac: new Date(fecha_nacimiento),
                        id_estado: parseInt(id_est),
                        email: email,
                        id_carrera_est: parseInt(carrera_asignatura)
                    }
                });
                console.log('garde usuario');
                if(isNull(password_encriptada) === false){
                    console.log('guarde credenciales');
                const new_credenciales = await prisma.credenciales_Usuario.updateMany({
                    where:{id_usuario:new_ususario.id_usuario},
                    data:
                    {
                        id_usuario: new_ususario.id_usuario,
                        hash_contrasena: password_encriptada
                    }
                });
            }
                const usuarioss = await prisma.usuario.findMany();
                res.send('20');
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
        const rol = await prisma.rol.findMany();
        const estados = await prisma.estado.findMany();

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
        if(codigo_asignatura.length === 6 || codigo_asignatura.length === 7){
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
            res.send('10');
        }else{
            res.status(400).send('1');
        }
    }else{
        res.status(400).send('3');
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
    const horarios = req.body.horarios;
    const doc = req.body.cb_Docente;
    const num_seccion = req.body.txt_Num_Seccion;
    const modalidad = req.body.cb_Modalidad;
    console.log(horarios);
    var horario_valido = true;
    horarios.forEach(horario => {
        if(parseInt(horario.hora_inicio)>parseInt(horario.hora_fin) || parseInt(horario.hora_inicio)===parseInt(horario.hora_fin)){
            console.log('Hora Inicio: ' + horario.hora_inicio);
            console.log('Hora Fin: ' + horario.hora_fin);
            horario_valido = false;
        }
        });
    if(horario_valido===true){
        if(parseInt(num_seccion)>0 && parseInt(num_seccion)<1000){
            try{
                const trimestre_actual = await prisma.trimestres.findFirst({where:{activo: true}});
                const secciones_profesor = await prisma.seccion.findMany({where:{id_profesor:parseInt(doc), id_trimestre:trimestre_actual.id_trimestre}});
                var hor_profesor = [];
                for(var i=0;i<secciones_profesor.length;i++){
                    console.log(secciones_profesor[i].id_seccion);
                    const horarios_seccion = await prisma.seccion_dias.findMany({where:{id_seccion:secciones_profesor[i].id_seccion}});
                    hor_profesor.push(horarios_seccion);
                }
                console.log(hor_profesor);
                console.log(secciones_profesor);
                var doc_no;
                // Crear un array de promesas con las llamadas a verificar_horario_docente
                const promises = secciones_profesor.map(seccion => verificar_horario_docente([seccion], horarios, hor_profesor));
                
                // Esperar a que todas las promesas se resuelvan
                const resultados = await Promise.all(promises);
                
                // Comprobar si alguna de las promesas resolvió a true
                doc_no = resultados.some(result => result === true);
                
                console.log(doc_no);
                if(doc_no===false){
                    const seccion = await prisma.seccion.findFirst({where:{num_seccion:parseInt(num_seccion), id_asignatura: parseInt(asignatura),id_trimestre:trimestre_actual.id_trimestre}});
                    if(isNull(seccion)){
                        const new_seccion = await prisma.seccion.create({
                            data:
                            {                    
                                id_asignatura: parseInt(asignatura),
                                id_profesor: parseInt(doc),
                                num_seccion: parseInt(num_seccion),
                                id_modalidad: parseInt(modalidad),
                                id_trimestre: trimestre_actual.id_trimestre,
                                num_est: 40
                            }
                        });
                        horarios.forEach(async horario => {
                            const new_horario = await prisma.seccion_dias.create({
                                data:
                                {
                                    id_seccion: new_seccion.id_seccion,
                                    id_dia: parseInt(horario.id_dia),
                                    hora_inicio: horario.hora_inicio,
                                    hora_fin: horario.hora_fin
                                }
                            });
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

// app.post('/modificar-seccion', async (req, res, next) => {
//     const asignatura = req.body.cb_Asignatura;
//     const horarios = req.body.horarios;
//     const doc = req.body.cb_Docente;
//     const num_seccion = req.body.txt_Num_Seccion;
//     const modalidad = req.body.cb_Modalidad;
    
//     try {
//       const seccion = await prisma.seccion.update({
//         where: { id_seccion: parseInt(seccionId) },
//         data: {
//           id_asignatura: parseInt(asignatura),
//           id_modalidad: parseInt(modalidad),
//           id_profesor: parseInt(doc),
//           num_seccion: parseInt(num_seccion)
//         }
//       });
//       horarios.forEach(async horario => {
//         const horario = await prisma.seccion_dias.update({
//             data:
//             {
//                 id_seccion: seccion.id_seccion,
//                 id_dia: parseInt(horario.id_dia),
//                 hora_inicio: horario.hora_inicio,
//                 hora_fin: horario.hora_fin
//             }
//         });
//     });
//       res.send('20');
//     } catch (error) {
//       console.log(error);
//       res.status(400).send('1');
//     }
// });

app.get('/cargar_modificar_seccion', async (req, res, next) => {
    console.log(req.query.seccionId);
    const seccionId = req.query.seccionId;
    try {
      const seccion = await prisma.seccion.findFirst({
        where: { id_seccion: parseInt(seccionId) },
        include: {
          Asignaturas_Seleccionadas: true,
          Asignatura: true,
          Modalidad: true,
          Usuario: true,
          Inicio_Fin_Trimestres: true,
          seccion_dias: true
        }
      });
      console.log('modificar seccion');
      res.json(seccion);
    } catch (error) {
      console.log(error);
    }
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
        // const secciones = await prisma.seccion.findMany({include:{Asignatura:true,Usuario:true,Modalidad:true}});  
        // res.send(`
        //     <script>
        //     localStorage.setItem('secciones', JSON.stringify(${JSON.stringify(secciones)}));
        //     window.location.href = '/ver_secciones.html';
        //     </script>
        // `);
        res.redirect('/ver_secciones.html');
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
        // console.log(obj);
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
        res.redirect('/perfil_admin.html');
    break;
    }
});

app.get('/nav_estudiante',async (req,res)=>{
    var id = parseInt(req.query.id);
   switch(id){
    case 1:
        res.redirect('/inicio_est.html');
        break;
    case 2:
        res.redirect('/asignaturas-seleccionadas.html');
        break;    
    case 3:
        res.redirect('/seleccionar_asignatura.html');
        break;
    case 4:
        res.redirect ('/retirar-asignatura.html')
        break;
    case 5:
        res.redirect ('/perfil_est.html')
        break;
    }
});

app.get('/nav_profesores',async (req,res)=>{
    var id = parseInt(req.query.id);
   switch(id){
    case 1:
        res.redirect('home-profesores.html');
        break;

    case 2:
        res.redirect ('asignar-calificaciones.html')
        break;
    case 3:
        res.redirect ('/manejo_estudiantes.html')
        break;
    case 4:
        res.redirect ('/perfil_prof.html')
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
    blacklistToken(req.cookies.token);
    res.send(`1`);
});

app.get('/usuario_logueado',async (req,res)=>{
    const token = req.cookies.token;
    const tipo_user = parseInt(req.query.param1);
    const decoded = verifyToken(token);
    console.log(decoded);
    if(decoded){
        if(tipo_user == decoded.id_rol){
            res.send(`1`);
        // switch(tipo_user){
        //     case 1:
        //         if(decoded.id_rol == 1){
        //             res.send(`1`);
        //         }else{
        //             res.status(400).send(`2`);
        //         }
        //         break;
        //     case 2:
        //         if(decoded.id_rol == 2){
        //             res.send(`1`);
        //         }else{
        //             res.status(400).send(`2`);
        //         }
        //         break;
        //     case 3:
        //         if(decoded.id_rol == 3){
        //             res.send(`1`);
        //         }else{
        //             res.status(400).send(`2`);
        //         }
        //         break;
        //     default:
        //         break;
        // }
        }else{
            res.status(400).send(`2`);
        }
    }else{
        res.status(400).send(`0`);
    }
});

function usuario_logueado(token){
    const decoded = verifyToken(token);
    if(decoded){
        return decoded
    }else{
        return null
    }
}

app.get('/cargar_secciones_retiro',async (req,res)=>{
    try{
        var user = usuario_logueado(req.cookies.token);
        const trimestre_actual = await prisma.trimestres.findFirst({where:{activo:true}});
        const asig_actualizadas = await prisma.asignaturas_Seleccionadas.findMany({where:{id_trimestre:trimestre_actual.id_trimestre,id_estudiante:user.id},include:{Seccion:true,Asignatura:true}});
        const response = {
            asig_actualizadas:asig_actualizadas
        }
        res.json(response);
    }catch(error){
        console.log(error);
    }
});

app.get('/cargar_secciones',async (req,res)=>{
    try{
        var user = usuario_logueado(req.cookies.token);
        const trimestre_actual = await prisma.trimestres.findFirst({where:{activo:true}});
        const secciones = await prisma.seccion.findMany({where:{id_trimestre:trimestre_actual.id_trimestre},include:{Asignatura:true,Usuario:true,Modalidad:true,seccion_dias:true}});
        if(user.id_rol===1){
            res.json(secciones);
        }else{
            const asig_actualizadas = await prisma.asignaturas_Seleccionadas.findMany({where:{id_trimestre:trimestre_actual.id_trimestre,id_estudiante:user.id},include:{Seccion:true,Asignatura:true}});
            const asig_tomadas = await prisma.asignaturas_Seleccionadas.findMany({where:{id_estudiante:user.id,calificacion_num:{gt:0}},include:{Seccion:true,Asignatura:true}});

            const response = {
                secciones,
                asig_actualizadas,
                asig_tomadas
            }
            res.json(response);
        }
    }catch(error){
        console.log(error);
    }
});

app.get('/retirar_asignatura',async (req,res)=>{
    var user = usuario_logueado(req.cookies.token);
    var id_registro = parseInt(req.query.id_registro);
    var password_introducida = req.query.contrasena;
    const password_encriptada = crypto.createHash('sha256').update(password_introducida).digest('hex');
    try{
        const usuario = await prisma.Credenciales_Usuario.findFirst({where:{id_usuario:user.id}});
        if(usuario.hash_contrasena == password_encriptada){
            const trimestre_actual = await prisma.trimestres.findFirst({where:{activo:true}});
            const asig_actualizadas = await prisma.asignaturas_Seleccionadas.update({where:{id_registro:id_registro},data:{calificacion_num:parseFloat(-1)}});
            console.log(asig_actualizadas);
            res.send('1');
        }else{
            res.status(400).send('1');
        }
    }catch(error){
        console.log(error);
        res.status(400).send('0');
    }
});

function verificar_horario_docente(secciones,horarios,horarios_profesor){
    var doc_no = false;
    return new Promise((resolve,reject)=>{
            horarios_profesor.forEach(horario_profesor => {
                horario_profesor.forEach(horario_profesor => {
                    horarios.forEach(horarios => {
                        console.log('Dia Profesor: '+horario_profesor.id_dia);
                        console.log('Dia Nuevo: '+horarios.id_dia);
                        if(horario_profesor.id_dia === parseInt(horarios.id_dia)){
                            if(parseInt(horario_profesor.hora_inicio)<=parseInt(horarios.hora_inicio) && parseInt(horarios.hora_inicio)<parseInt(horario_profesor.hora_fin)){
                                console.log('Hora Inicio: ' + horario_profesor.hora_inicio);
                                console.log('Hora Fin: ' + horario_profesor.hora_fin);
                                doc_no = true;
                            }
                        }
                });
            });
            });
     resolve(doc_no);
    });
}

app.get('/cargar_datos_asignar_calificaciones', async (req, res, next) => {
    try{
        var user = usuario_logueado(req.cookies.token);
        const trimestre_actual = await prisma.trimestres.findFirst({where:{activo:true}});
        const secciones = await prisma.seccion.findMany({where:{id_trimestre:trimestre_actual.id_trimestre,id_profesor:user.id},include:{Asignatura:true, Usuario:true,seccion_dias:true}});
        res.json(secciones);
    }catch(error){
        console.log(error);
    }
});

app.get('/cargar_timestres', async (req, res, next) => {
    try{
        var user = usuario_logueado(req.cookies.token);
        const trimestre_actual = await prisma.trimestres.findFirst({where:{activo:true}});
        const trimestres = await prisma.tipo_Trimestres.findMany();
        const response = {
            trimestre_actual:trimestre_actual,
            trimestres:trimestres
        }
        res.json(response);
    }catch(error){
        console.log(error);
    }
});

app.get('/cargar_datos_asigs_tri_estudiantes', async (req, res, next) => {
    const id_tipo_trimestre = parseInt(req.query.id_tipo_trimestre);
    const ano_tri = req.query.ano_tri;
    try{
        var user = usuario_logueado(req.cookies.token);
        const tri_buscado = await prisma.trimestres.findFirst({where:{id_tipo_trimestre:id_tipo_trimestre,ano_trimestre:ano_tri}});
        if(tri_buscado){
            const asigs_seleccionadas = await prisma.asignaturas_Seleccionadas.findMany({where:{id_trimestre:tri_buscado.id_trimestre,id_estudiante:user.id},include:{Seccion:{include:{seccion_dias:true,Usuario:true}},Asignatura:true,Usuario:true}});
            const response = {
                asigs_seleccionadas:asigs_seleccionadas,
                trimestre:tri_buscado
            }
            res.json(response);
        }else{
            res.status(400).send('0');
        }
    }catch(error){
        console.log(error);
    }
});

app.get('/porcentaje_letras_est', async (req, res, next) => {
    const id_tipo_trimestre = parseInt(req.query.id_tipo_trimestre);
    const ano_tri = req.query.ano_tri;
    try{
        var user = usuario_logueado(req.cookies.token);
        const usuario = await prisma.usuario.findFirst({where:{id_usuario:user.id}});
        const hist_user = await prisma.asignaturas_Seleccionadas.findMany({where:{id_estudiante:user.id}});
        console.log(hist_user);
        var letras = {
            A:0,
            B:0,
            C:0,
            D:0,
            F:0,
            R:0,
            total:0, 
            indice_acad: usuario.indice_acad_est.toFixed(2)
        }
        hist_user.forEach(asig => {
            if(asig.calificacion_num != null){
                if(asig.calificacion_num >= 90){
                    letras.A++;
                }else if(asig.calificacion_num >= 80){
                    letras.B++;
                }else if(asig.calificacion_num >= 70){
                    letras.C++;
                }else if(asig.calificacion_num >= 60){
                    letras.D++;
                }else if(asig.calificacion_num >= 0){
                    letras.F++;
                }else{
                    letras.R++;
                }
                letras.total++;
            }
        });
        console.log(letras);
        res.json(letras);
    }catch(error){
        console.log(error);
    }
});

app.get('/guardar_seleccion', async (req, res, next) => {
    var user = usuario_logueado(req.cookies.token);
    const secciones_seleccionadas = req.query.asignaturas;
    const id_usuario = user.id;
    console.log(secciones_seleccionadas);

    try{
        var hor_sec_ver = [];
        for(var i=0;i<secciones_seleccionadas.length;i++){
            const hor_sec_sel = await prisma.seccion_dias.findFirst({where:{id_seccion:parseInt(secciones_seleccionadas[i])}});
            hor_sec_ver.push(hor_sec_sel);
        }
        var est_no = false;
        // Crear un array de promesas con las llamadas a verificar_horario_docente
        const promises = verificar_horario_estudiante(hor_sec_ver, hor_sec_ver);
        promises.then(function(result) {
            console.log(result);
            est_no = result;
        });
        console.log(est_no);
        if(est_no===false){
            var secs_borradas = false;
            secciones_seleccionadas.forEach(async seccion => {
                const seccion_seleccionada = await prisma.seccion.findFirst({where:{id_seccion:parseInt(seccion)},include:{Asignatura:true}});
                if(secs_borradas===false){
                    const borrar_secs = await prisma.asignaturas_Seleccionadas.deleteMany({where:{id_estudiante:parseInt(id_usuario),id_trimestre:parseInt(seccion_seleccionada.id_trimestre)}});
                    secs_borradas = true;
                }
                if(seccion_seleccionada.num_est > 0){
                const sec_actualizada = await prisma.seccion.update({where:{id_seccion:parseInt(seccion)},data:{num_est:{decrement:1}}});
                console.log('sec_actualizada');
                console.log(sec_actualizada);
                    const sec_usuario = await prisma.asignaturas_Seleccionadas.create({
                        data:{
                            id_estudiante:parseInt(id_usuario),
                            id_seccion:parseInt(seccion),
                            id_asignatura:parseInt(seccion_seleccionada.Asignatura.id_asignatura),
                            id_trimestre:parseInt(seccion_seleccionada.id_trimestre),
                        }
                    });
                    console.log('sec_usuario');
                    console.log(sec_usuario);
                }
                console.log('seccion_no_seleccionada');
            });
            res.send('0');
    }else{
        res.status(400).send('2');
    }
        // res.send('Seleccion Guardada exitosamente');
    }catch(error){
        console.log(error);
    }
    
});

function verificar_horario_estudiante(horarios,horarios_profesor){
    var est_no = false;
    return new Promise((resolve,reject)=>{
            horarios_profesor.forEach(horario_profesor => {
                    horarios.forEach(horarios => {
                        if(horario_profesor.id_dia === parseInt(horarios.id_dia) && horario_profesor.id_seccion != horarios.id_seccion){
                            if(parseInt(horario_profesor.hora_inicio)<=parseInt(horarios.hora_inicio) && parseInt(horarios.hora_inicio)<parseInt(horario_profesor.hora_fin)){
                                est_no = true;
                            }
                        }
                });
            });
     resolve(est_no);
    });
}

app.get('/verificar_fecha_sel', async (req, res, next) => {
    
    try{
        const trimestre_actual = await prisma.trimestres.findFirst({where:{activo:true}});
        const fecha_sel_act = await prisma.inicio_Fin_Seleccion.findFirst({where:{id_trimestre:trimestre_actual.id_trimestre}});
        if(fecha_sel_act != null){
        const fecha_actual = new Date();
        if(fecha_actual >= fecha_sel_act.fecha_inicio && fecha_actual <= fecha_sel_act.fecha_fin){
            console.log('entre la fecha')
            res.send('1');
        }else{
            res.send('0');
        }
    }else{
        res.send('0');
    }
    }catch(error){
        console.log(error);
    }
});

app.get('/cargar_usuario_seccion', async (req, res, next) => {
    const id_asignatura = parseInt(req.query.id_asignatura);
    const id_seccion = parseInt(req.query.id_seccion);
    console.log(id_asignatura);
    console.log(id_seccion);
    try{
        const estudiantes = await prisma.asignaturas_Seleccionadas.findMany({where:{id_asignatura:id_asignatura,id_seccion:id_seccion},include:{Usuario:true}});
        console.log(estudiantes);
        res.json(estudiantes);
    }catch(error){
        console.log(error);
    }
});

//NNNNNNNNNNNEEEEEEEEEEEEEEWWWWWWWWWWWWWWWWWWWWWWWWWWW
app.get('/guardar_notas_seccion', async (req, res, next) => {
    var seccion = req.query.id_seccion;
    console.log("AQUI LA SECCION:")
    console.log(seccion);
    var notas = JSON.parse(req.query.datos_notas);
    var err = false;
    console.log("AQUI LAS NOTAS");
    console.log(notas);
    for(var i=0;i<notas.notas.length;i++){
        try{
            const nota = await prisma.asignaturas_Seleccionadas.updateMany({
                where: {
                    id_estudiante: parseInt(notas.id_est[i]),
                    id_seccion: parseInt(seccion)
                },
                data: {
                  calificacion_num: parseInt(notas.notas[i])
                }
              });
            if(nota != null){
                console.log('nota_actualizada');
                console.log(nota);
                const sec = await prisma.seccion.update({where:{id_seccion:parseInt(seccion)},data:{notas_publicadas:true}});
                console.log(sec);
            }else{
                console.log('nota_no_actualizada');
                console.log(nota);
                err = true;
            }
        }catch(error){
            console.log(error);
            res.status(400).send('0');
        }
    }
    if(err == false){
        res.send('1');
    }else{
        res.status(400).send('0');
    }
});


app.post('/modificar-asignatura',async (req,res,next)=>{
    const user = usuario_logueado(req.cookies.token);
    const cod_viejo = req.body.cod_viejo;
    console.log(cod_viejo);
    const codigo_asignatura = req.body.txt_Cod_Asignatura;
    const creditos_asignatura = req.body.txt_Creditos_Asignatura;
    const carrera_asignatura = req.body.sel_Carrera_Pertenence;
    const nombre_asignatura = req.body.txt_Nombre_Asignatura;
    const tipo_asignatura = req.body.sel_Asignatura_Tipo;
    const asignatura_visible = req.body.sel_Asignatura_Visible==='1' ? true : false;
    console.log(codigo_asignatura);

    try{
        const asignatura = await prisma.asignatura.findFirst({where:{cod_asignatura:codigo_asignatura}});
        if(isNull(asignatura) || cod_viejo === codigo_asignatura){
        
        const new_asignatura = await prisma.asignatura.update({
            where: {cod_asignatura: cod_viejo},
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
        console.log(new_asignatura);
        res.send('20');
    }else{
        res.status(400).send('1');
    }
    }catch(error){
        console.log(error);
        res.status(500).send('2');
    }
});

app.get('/cargar-datos-perfil',async (req,res,next)=>{
    const user = usuario_logueado(req.cookies.token);
    try{
        const usuario = await prisma.usuario.findFirst({where:{id_usuario:user.id},include:{Carreras:true,Rol:true}});
        console.log(usuario);
        res.json(usuario);
    }catch(error){
        console.log(error);
    }
});

app.get('/cambiar-contrasena',async (req,res,next)=>{
    const user = usuario_logueado(req.cookies.token);
    const contrasena = req.query.Nueva_Contrasena;
    const contrasena_vieja = req.query.Contrasena_Actual;
    const password_encriptada_vieja = crypto.createHash('sha256').update(contrasena_vieja).digest('hex');
    const password_encriptada = crypto.createHash('sha256').update(contrasena).digest('hex');
    try{
        const usuario = await prisma.credenciales_Usuario.findFirst({where:{id_usuario:user.id}});
        if(usuario.hash_contrasena === password_encriptada_vieja){
        const new_usuario = await prisma.credenciales_Usuario.update({where:{id_registro:usuario.id_registro},data:{hash_contrasena:password_encriptada}});
        console.log(new_usuario);
        res.json(new_usuario);
        }else{
            console.error('contraseña incorrecta');
            res.status(400).send('0');
        }
    }catch(error){
        console.log(error);
    }
});

app.get('/calcular_indices_sistema',async (req,res,next)=>{
    const user = usuario_logueado(req.cookies.token);
   try{
        const estudiantes = await prisma.usuario.findMany({where:{id_rol:3,id_estado:1},include:{Carreras:true}});        
        console.log(estudiantes);
        estudiantes.forEach(async (estudiante)=>{
            console.log('estudiante for');
            console.log(estudiante);
            const asignaturas_seleccionadas = await prisma.asignaturas_Seleccionadas.findMany({where:{id_estudiante:estudiante.id_usuario},include:{Asignatura:true}});
            var creditos_aprobados = 0;
            var puntos_aprobados = 0;

            asignaturas_seleccionadas.forEach((asignatura)=>{
                if(asignatura.calificacion_num >=0 && asignatura.calificacion_num !== null){
                    creditos_aprobados += asignatura.Asignatura.creditos;
                    if(parseFloat(asignatura.calificacion_num) >= 90){
                        puntos_aprobados += asignatura.Asignatura.creditos*4.0;
                    }else if(parseFloat(asignatura.calificacion_num) >= 80){
                        puntos_aprobados += asignatura.Asignatura.creditos*3.0;
                    }else if(parseFloat(asignatura.calificacion_num) >= 70){
                        puntos_aprobados += asignatura.Asignatura.creditos*2.0;
                    }else if(parseFloat(asignatura.calificacion_num) >= 60){
                        puntos_aprobados += asignatura.Asignatura.creditos*1.0;
                    }else{
                        puntos_aprobados += asignatura.Asignatura.creditos*0.0;
                    }
                }
            });
            if(creditos_aprobados != 0){
                const indice = puntos_aprobados/creditos_aprobados;
                const new_indice = await prisma.usuario.update({where:{id_usuario:estudiante.id_usuario},data:{indice_acad_est:indice}});
                console.log(new_indice);
            }
        });
        res.send('1');
    }catch(error){
        console.log(error);
        res.status(500).send('0');
    }
});


app.get('/cargar-home-profesores',async (req,res,next)=>{
    const user = usuario_logueado(req.cookies.token);
    var usuarios_no_publicados=0;
    var usuarios_totales = 0;
    var secciones_totales = 0;
      try{
        const trimestre = await prisma.trimestres.findFirst({where:{activo:true},include:{Tipo_Trimestres:true}});
        const secciones = await prisma.seccion.findMany({where:{id_trimestre:trimestre.id_trimestre,id_profesor:user.id}});
        for(var i=0;i<secciones.length;i++){
            const asignaturas_seleccionadas = await prisma.asignaturas_Seleccionadas.findMany({where:{id_seccion:secciones[i].id_seccion}});
            console.log('entre')
            if(secciones[i].notas_publicadas===false){
                usuarios_no_publicados += asignaturas_seleccionadas.length;
            }
            usuarios_totales += asignaturas_seleccionadas.length;
            secciones_totales += 1;
        }
        const resp = {
            usuarios_no_publicados:usuarios_no_publicados,
            usuarios_totales:usuarios_totales,
            secciones_totales:secciones_totales,
            trimestre:trimestre
        }
        console.log(resp);
        res.json(resp);
    }catch(error){
        console.log(error);
    }
});