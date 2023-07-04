-- Creando la Base de Datos
USE master;

DROP DATABASE IF EXISTS BD_App_Mi_Indice_Academico;
GO
CREATE DATABASE BD_App_Mi_Indice_Academico
GO
--Usando la Base de Datos
USE BD_App_Mi_Indice_Academico
GO

--Creando las Tablas
CREATE TABLE Usuario(
	id_usuario int identity(1,1),
	nombre_usuario nvarchar(200) NOT NULL,
	id_rol int NOT NULL,
	matricula int NOT NULL,
	fecha_nac datetime NOT NULL,
	id_estado int NOT NULL,
	email nvarchar(150) NOT NULL,
	fecha_creacion datetime NOT NULL,
	id_carrera_est int NOT NULL,
	indice_acad_est decimal (5,3) NOT NULL
);


CREATE TABLE Credenciales_Usuario(
	id_registro int identity(1,1),
	id_usuario int NOT NULL,
	hash_contrasena nvarchar(max) NOT NULL,
	fecha_creacion datetime NOT NULL
);


CREATE TABLE Carreras(
	id_carrera int identity(1,1),
	nombre_carrera nvarchar(200) NOT NULL,
	fecha_creacion datetime NOT NULL
);


CREATE TABLE Rol(
	id_rol int identity(1,1),
	nombre_rol nvarchar(200) NOT NULL,
	fecha_creacion datetime NOT NULL
);


CREATE TABLE Asignatura(
	id_asignatura int identity(1,1),
	cod_asignatura nvarchar(7) NOT NULL,
	nombre_asignacion nvarchar(200) NOT NULL,
	id_tipo_asignatura int NOT NULL,
	creditos int NOT NULL,
	visible bit NOT NULL,
	fecha_creacion datetime NOT NULL,
	id_carrera int NOT NULL
);


CREATE TABLE Seccion(
	id_seccion int identity(1,1),
	id_asignatura int NOT NULL,
	id_modalidad int NOT NULL,
	id_profesor int NOT NULL,
	num_seccion int NOT NULL,
	hora_inicio nvarchar(20) NOT NULL,
	id_trimestre int,
	hora_fin nvarchar(20) NOT NULL,
	fecha_creacion datetime NOT NULL
);


CREATE TABLE Tipos_Asignatura(
	id_tipo_asignatura int identity(1,1),
	nombre_tipo_asignatura nvarchar(200) NOT NULL,
	fecha_creacion datetime NOT NULL
);


CREATE TABLE Notas_Letras(
	id_registro int identity(1,1),
	limit_superior int NOT NULL,
	limit_inferior int NOT NULL,
	letra_equivalencia nvarchar(3) NOT NULL,
	fecha_creacion datetime NOT NULL
);


CREATE TABLE Modalidad(
	id_modalidad int identity(1,1),
	nombre_modalidad nvarchar(200) NOT NULL,
	fecha_creacion datetime NOT NULL
);


CREATE TABLE Asignaturas_Seleccionadas(
	id_registro int identity(1,1),
	id_seccion int NOT NULL,
	id_asignatura int NOT NULL,
	id_estudiante int NOT NULL,
	id_trimestre int NOT NULL,
	fecha_creacion datetime NOT NULL,
	calificacion_num decimal(4,2) NOT NULL
);

CREATE TABLE Trimestres(
	id_trimestre int identity(1,1),
	id_tipo_trimestre int NOT NULL,
	ano_trimestre nvarchar(6) NOT NULL,
	activo bit NOT NULL,
	fecha_creacion datetime NOT NULL
);

CREATE TABLE Inicio_Fin_Seleccion(
	id_seleccion int identity(1,1),
	fecha_inicio datetime NOT NULL,
	fecha_fin datetime NOT NULL,
	id_trimestre int NOT NULL,
	fecha_creacion datetime NOT NULL
);


CREATE TABLE Tipo_Trimestres(
	id_tipo_trimestre int identity(1,1),
	nombre_trimestre nvarchar(200) NOT NULL,
	fecha_creacion datetime NOT NULL
);


CREATE TABLE Estado(
	id_estado int identity(1,1),
	nombre_estado nvarchar(200) NOT NULL,
	fecha_creacion datetime NOT NULL
);



--ALTERS DE LOS PK, FK, UNIQUES Y DEFAULTS
--Tabla Modalidad
ALTER TABLE Modalidad ADD CONSTRAINT PK_modalidad PRIMARY KEY (id_modalidad);
ALTER TABLE Modalidad ADD CONSTRAINT DF_modalidad_fecha_creacion DEFAULT GETDATE() FOR fecha_creacion;

--Tabla Notas_Letras
ALTER TABLE Notas_Letras ADD CONSTRAINT PK_notas_letras PRIMARY KEY (id_registro);
ALTER TABLE Notas_Letras ADD CONSTRAINT DF_notas_letras_fecha_creacion DEFAULT GETDATE() FOR fecha_creacion;

--Tabla Tipos_Asignatura
ALTER TABLE Tipos_Asignatura ADD CONSTRAINT PK_tipos_asignatura PRIMARY KEY (id_tipo_asignatura);
ALTER TABLE Tipos_Asignatura ADD CONSTRAINT DF_tipos_asignatura_fecha_creacion DEFAULT GETDATE() FOR fecha_creacion;

--Tabla Carreras
ALTER TABLE Carreras ADD CONSTRAINT PK_carreras PRIMARY KEY (id_carrera);
ALTER TABLE Carreras ADD CONSTRAINT DF_carreras_fecha_creacion DEFAULT GETDATE() FOR fecha_creacion;

--Tabla Rol
ALTER TABLE Rol ADD CONSTRAINT PK_rol PRIMARY KEY (id_rol);
ALTER TABLE Rol ADD CONSTRAINT DF_rol_fecha_creacion DEFAULT GETDATE() FOR fecha_creacion;

--Tabla Tipo_Trimestres
ALTER TABLE Tipo_Trimestres ADD CONSTRAINT PK_tipo_trimestres PRIMARY KEY (id_tipo_trimestre);
ALTER TABLE Tipo_Trimestres ADD CONSTRAINT DF_tipo_trimestres_fecha_creacion DEFAULT GETDATE() FOR fecha_creacion;

--Tabla Trimestres
ALTER TABLE Trimestres ADD CONSTRAINT PK_trimestres PRIMARY KEY (id_trimestre);
ALTER TABLE Trimestres ADD CONSTRAINT FK_trimestres_id_tipo_trimestre FOREIGN KEY (id_tipo_trimestre) REFERENCES Tipo_Trimestres(id_tipo_trimestre);
ALTER TABLE Trimestres ADD CONSTRAINT DF_trimestres_fecha_creacion DEFAULT GETDATE() FOR fecha_creacion;

--Tabla Estado
ALTER TABLE Estado ADD CONSTRAINT PK_estado PRIMARY KEY (id_estado);
ALTER TABLE Estado ADD CONSTRAINT DF_estado_fecha_creacion DEFAULT GETDATE() FOR fecha_creacion;

--Tabla Usuario
ALTER TABLE Usuario ADD CONSTRAINT PK_usuario PRIMARY KEY (id_usuario);
ALTER TABLE Usuario ADD CONSTRAINT FK_usuario_id_rol FOREIGN KEY (id_rol) REFERENCES Rol(id_rol);
ALTER TABLE Usuario ADD CONSTRAINT FK_usuario_id_estado FOREIGN KEY (id_estado) REFERENCES Estado(id_estado);
ALTER TABLE Usuario ADD CONSTRAINT FK_usuario_id_carrera_est FOREIGN KEY (id_carrera_est) REFERENCES Carreras(id_carrera);
ALTER TABLE Usuario ADD CONSTRAINT DF_usuario_fecha_ingreso DEFAULT GETDATE() FOR fecha_creacion;
ALTER TABLE Usuario ADD CONSTRAINT UQ_usuario_matricula UNIQUE (matricula);

--Tabla Credenciales_Usuario
ALTER TABLE Credenciales_Usuario ADD CONSTRAINT PK_credenciales_usuario PRIMARY KEY (id_registro);
ALTER TABLE Credenciales_Usuario ADD CONSTRAINT FK_credenciales_usuario_id_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario);
ALTER TABLE Credenciales_Usuario ADD CONSTRAINT DF_credenciales_usuario_fecha_creacion DEFAULT GETDATE() FOR fecha_creacion;

--Tabla Asignatura
ALTER TABLE Asignatura ADD CONSTRAINT PK_asignatura PRIMARY KEY (id_asignatura);
ALTER TABLE Asignatura ADD CONSTRAINT FK_asignatura_id_tipo_asignatura FOREIGN KEY (id_tipo_asignatura) REFERENCES Tipos_Asignatura(id_tipo_asignatura);
ALTER TABLE Asignatura ADD CONSTRAINT FK_asignatura_id_carrera FOREIGN KEY (id_carrera) REFERENCES Carreras(id_carrera);
ALTER TABLE Asignatura ADD CONSTRAINT DF_asignatura_fecha_creacion DEFAULT GETDATE() FOR fecha_creacion;
ALTER TABLE Asignatura ADD CONSTRAINT UQ_asignatura_cod_asignatura UNIQUE (cod_asignatura);


--Tabla Seccion
ALTER TABLE Seccion ADD CONSTRAINT PK_seccion PRIMARY KEY (id_seccion);
ALTER TABLE Seccion ADD CONSTRAINT FK_seccion_id_asignatura FOREIGN KEY (id_asignatura) REFERENCES Asignatura(id_asignatura);
ALTER TABLE Seccion ADD CONSTRAINT FK_seccion_id_modalidad FOREIGN KEY (id_modalidad) REFERENCES Modalidad(id_modalidad);
ALTER TABLE Seccion ADD CONSTRAINT FK_seccion_id_profesor FOREIGN KEY (id_profesor) REFERENCES Usuario(id_usuario);
ALTER TABLE Seccion ADD CONSTRAINT FK_seccion_id_trimestre FOREIGN KEY (id_trimestre) REFERENCES Trimestres(id_trimestre);
ALTER TABLE Seccion ADD CONSTRAINT DF_seccion_fecha_creacion DEFAULT GETDATE() FOR fecha_creacion;
ALTER TABLE Seccion ADD CONSTRAINT UQ_seccion_num_seccion UNIQUE (id_asignatura,num_seccion);

--Tabla Inicio_Fin_Seleccion
ALTER TABLE Inicio_Fin_Seleccion ADD CONSTRAINT PK_inicio_fin_trimestres PRIMARY KEY (id_seleccion);
ALTER TABLE Inicio_Fin_Seleccion ADD CONSTRAINT DF_inicio_fin_trimestres_fecha_creacion DEFAULT GETDATE() FOR fecha_creacion;

--Tabla Asignaturas_Seleccionadas
ALTER TABLE Asignaturas_Seleccionadas ADD CONSTRAINT PK_asignaturas_seleccionadas PRIMARY KEY (id_registro);
ALTER TABLE Asignaturas_Seleccionadas ADD CONSTRAINT FK_asignaturas_seleccionadas_id_seccion FOREIGN KEY (id_seccion) REFERENCES Seccion(id_seccion);
ALTER TABLE Asignaturas_Seleccionadas ADD CONSTRAINT FK_asignaturas_seleccionadas_id_asignatura FOREIGN KEY (id_asignatura) REFERENCES Asignatura(id_asignatura);
ALTER TABLE Asignaturas_Seleccionadas ADD CONSTRAINT FK_asignaturas_seleccionadas_id_estudiante FOREIGN KEY (id_estudiante) REFERENCES Usuario(id_usuario);
ALTER TABLE Asignaturas_Seleccionadas ADD CONSTRAINT FK_asignaturas_seleccionadas_id_trimestre FOREIGN KEY (id_trimestre) REFERENCES Trimestres(id_trimestre);
ALTER TABLE Asignaturas_Seleccionadas ADD CONSTRAINT DF_asignaturas_seleccionadas_fecha_creacion DEFAULT GETDATE() FOR fecha_creacion;



GO


--INSERTS INICIALES
INSERT INTO Estado (nombre_estado) VALUES ('Activo'),('Inactivo');
GO
INSERT INTO Carreras (nombre_carrera) VALUES ('No Aplica');
INSERT INTO Carreras (nombre_carrera) VALUES ('Ingeniería Civil'); 
INSERT INTO Carreras (nombre_carrera) VALUES ('Arquitectura'); 
INSERT INTO Carreras (nombre_carrera) VALUES ('Medicina'); 
INSERT INTO Carreras (nombre_carrera) VALUES ('Derecho'); 
INSERT INTO Carreras (nombre_carrera) VALUES ('Administración de Empresas'); 
INSERT INTO Carreras (nombre_carrera) VALUES ('Psicología'); 
INSERT INTO Carreras (nombre_carrera) VALUES ('Contabilidad'); 
INSERT INTO Carreras (nombre_carrera) VALUES ('Comunicación Social'); 
INSERT INTO Carreras (nombre_carrera) VALUES ('Ingeniería de Sistemas'); 
INSERT INTO Carreras (nombre_carrera) VALUES ('Enfermería');
GO
INSERT INTO Modalidad (nombre_modalidad) VALUES ('Presencial');
INSERT INTO Modalidad (nombre_modalidad) VALUES ('Semipresencial');
INSERT INTO Modalidad (nombre_modalidad) VALUES ('Virtual');

INSERT INTO Rol (nombre_rol) VALUES ('Administrador'),('Profesor'),('Estudiante');
GO
INSERT INTO Tipo_Trimestres (nombre_trimestre) VALUES ('Febrero-Abril'),('Mayo-Julio'),('Agosto-Octubre'),('Noviembre-Enero');
GO
INSERT INTO Tipos_Asignatura(nombre_tipo_asignatura) VALUES ('Ingeniería'),('Lenguas'),('Física'),('Matemática'),('Investigación'),('Laboratorio');
GO

INSERT INTO Asignatura (cod_asignatura, nombre_asignacion, id_tipo_asignatura, creditos, visible, id_carrera) VALUES ('MAT101', 'Cálculo I', 1, 4, 1, 1); 
INSERT INTO Asignatura (cod_asignatura, nombre_asignacion, id_tipo_asignatura, creditos, visible, id_carrera) VALUES ('FIS101', 'Física I', 1, 3, 1, 1); 
INSERT INTO Asignatura (cod_asignatura, nombre_asignacion, id_tipo_asignatura, creditos, visible, id_carrera) VALUES ('INF101', 'Introducción a la Programación', 2, 3, 1, 1); 
INSERT INTO Asignatura (cod_asignatura, nombre_asignacion, id_tipo_asignatura, creditos, visible, id_carrera) VALUES ('QUI101', 'Química General', 1, 3, 1, 1); 
INSERT INTO Asignatura (cod_asignatura, nombre_asignacion, id_tipo_asignatura, creditos, visible, id_carrera) VALUES ('ADM101', 'Introducción a la Administración', 2, 3, 1, 1); 
INSERT INTO Asignatura (cod_asignatura, nombre_asignacion, id_tipo_asignatura, creditos, visible, id_carrera) VALUES ('PSI101', 'Psicología General', 1, 3, 1, 1);
INSERT INTO Asignatura (cod_asignatura, nombre_asignacion, id_tipo_asignatura, creditos, visible, id_carrera) VALUES ('CON101', 'Contabilidad Básica', 2, 3, 1, 1); 
INSERT INTO Asignatura (cod_asignatura, nombre_asignacion, id_tipo_asignatura, creditos, visible, id_carrera) VALUES ('COM101', 'Comunicación Oral y Escrita', 2, 3, 1, 1); 
INSERT INTO Asignatura (cod_asignatura, nombre_asignacion, id_tipo_asignatura, creditos, visible, id_carrera) VALUES ('SIS101', 'Fundamentos de Sistemas de Información', 2, 3, 1, 1); 
INSERT INTO Asignatura (cod_asignatura, nombre_asignacion, id_tipo_asignatura, creditos, visible, id_carrera) VALUES ('ENF101', 'Anatomía y Fisiología Humana', 1, 4, 1, 1);

--USUARIO INICIAL
INSERT INTO Usuario(nombre_usuario,id_rol,matricula,fecha_nac,id_estado,email,id_carrera_est,indice_acad_est) 
	   VALUES ('USUARIO GENERAL DE LA APP', 1,9999999,'1990-01-01 00:00:00.000',1,'emailgenerico@gmail.com',1,4);
GO

INSERT INTO Credenciales_Usuario (id_usuario,hash_contrasena)
	   VALUES (1,'15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225');
GO

INSERT INTO Trimestres (id_tipo_trimestre,ano_trimestre,activo) VALUES (1,'2023',1);
GO

SELECT * FROM Usuario