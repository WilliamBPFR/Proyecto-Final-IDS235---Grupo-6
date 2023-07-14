$(document).ready(function(){
	var asignaturas_estudiante = null;
	var asignaturas_elegir = [];
	var div_arriba = $('[name="div_arriba"]');
	var div_ant = null;
	var adentro = false;
		$(document).on('click', '.component-76', function() {
		  var parent = $(this).closest('.rectangle-parent');
		  var seccionToggle = parent.find('.seccionToggle');
		  var alturaToggle = seccionToggle.outerHeight();

		  var seccionToggleAbierta = $('.component-76.active');

		  console.log(div_ant);
		  if(div_ant != null){
			console.log($(this).hasClass('active'));
			console.log(adentro);
			console.log(seccionToggleAbierta.length);
			if($(this).hasClass('active')==false && adentro == false && seccionToggleAbierta.length > 0){
				console.log("hola");
				adentro = true
				div_ant.removeClass('active');
				div_ant.click();
				adentro = false;
				div_ant = $(this);
				div_ant.addClass('active');
			}else if(adentro == true){
				console.log("hola3");
				div_ant.removeClass('active');
				div_ant = null;
			}else if(adentro == false){
				console.log("hola4");
				div_ant.removeClass('active');
				div_ant = null;
			}
		}else{
			console.log("hola2");
			$(this).addClass('active');
			div_ant = $(this);
		}
		  
		  seccionToggle.slideToggle({
			progress: function() {
			  adjustDiv2Position(parent.nextAll('.rectangle-parent'), seccionToggle);
			}
		  });
		});
	


		if(asignaturas_estudiante == null){
		buscar_asignaturas().then(function(data){
			asignaturas_estudiante = data.asig_actualizadas;
			asignaturas_elegir = data.secciones;
			asig_tomadas = data.asig_tomadas;
			llenar_div_asignaturas(asignaturas_elegir,asignaturas_estudiante);
			if(asignaturas_estudiante.length > 0){
				asignaturas_estudiante.forEach(element => {
					$('.component-2-inner').each(function() {
						if($(this).attr('value') == element.id_seccion){
							console.log($(this).prop('disabled'));
							if($(this).prop('disabled') == false){
								$(this).click();

							}
						}
					});
				});
			}
			if(asig_tomadas.length > 0){
					asig_tomadas.forEach(element => {
						$('.rectangle-parent').each(function() {
							if(parseInt($(this).attr('value')) == element.id_asignatura){
								$(this).find('.component-76-child').css('background-color', 'rgba(255, 231, 123, 0.5);');
								$(this).find('.component-76').prop('disabled', true);
							}
						});
					});
					}
		});
		}
});
	  
	  function adjustDiv2Position(div2, div3) {
		const div3Height = div3.outerHeight();
		div2.css('margin-top', div3Height + 'px');
	  }
	  
	  function buscar_asignaturas(){
		return new Promise(function(resolve, reject) {
			$.ajax({
				url: '/cargar_secciones',
				method: 'GET',
				dataType: 'json',
				success: function(data) {  
					console.log(data);
					resolve(data);
				},
				error: function(error) {
					console.log(error);
					reject(error);
				}
			});
		});
	}

	function llenar_div_asignaturas(asignaturas_elegir, asignaturas_estudiante){
		var div_asignatura = $('#id_asignatura');
		var tabla = $('#tabla-secciones-elegidas');
			var i = 0;
			asignaturas_elegir.forEach(element => {
				console.log(element);
				var rectangleParent = $('<div>').addClass('rectangle-parent');
				var instanceChild = $('<div>').addClass('instance-child');
				var button = $('<button>').addClass('component-76').attr('id', 'btn_asignatura_calif');
				var btnToggle = $('<div>').addClass('component-76-child').attr('id', 'btn-toggle').attr('name', 'div_arriba');
				var asignatura = $('<div>').addClass('asignatura').attr('id', 'asignatura').text(element.Asignatura.cod_asignatura + " - " + element.Asignatura.nombre_asignacion + " - Sec " + element.num_seccion + " / Profesor: " + element.Usuario.nombre_usuario);
				var polygonIcon = $('<img>').addClass('component-76-item').attr('src', './../../public/polygon-1.svg');
				var imageIcon = $('<img>').addClass('image-10-icon').attr('src', './../../public/image-10@2x.png');
				var divSalienteAsignatura = $('<div>').addClass('div_saliente_asignatura');
				var seccionToggle = $('<section>').addClass('seccionToggle').attr('id', 'seccionToggle1');
				var boton = $('<button>').addClass('component-2-inner').attr('id', 'boton').text('Seleccionar').val(element.id_seccion).attr('name', element.Asignatura.id_asignatura);
				var labelHorario = $('<label>').addClass('label_Horario').attr('id', 'label_Horario').text('Horario');
				var contenido = "";
				element.seccion_dias.forEach(element2 => {
					switch(element2.id_dia){
						case 1:
							contenido += "Lunes: ";
							break;
						case 2:
							contenido += "Martes: ";
							break;
						case 3:
							contenido += "Miercoles: ";
							break;
						case 4:
							contenido += "Jueves: ";
							break;
						case 5:
							contenido += "Viernes: ";
							break;
						case 6:
							contenido += "Sabado: ";
							break;
					}
					contenido += element2.hora_inicio + ":00 - " + element2.hora_fin + ":00<br>";
				});
				var labelHoraInicio = $('<label>').addClass('label_hora_inicio').attr('id', 'label_hora_inicio').html(contenido);
				// var labelHoraFin = $('<label>').addClass('label_hora_fin').attr('id', 'label_hora_fin').text('Hora de Fin: ' + element.hora_fin + ":00");
				var labelTituloModalidad = $('<label>').addClass('label_titulo_modalidad').text('Modalidad');
				var labelModalidad = $('<label>').addClass('label_modalidad').attr('id', 'label_modalidad').text(element.Modalidad.nombre_modalidad);
				var labelTituloDocente = $('<label>').addClass('label_titulo_docente').text('Docente');
				var labelDocente = $('<label>').addClass('label_docente').attr('id', 'label_docente').text(element.Usuario.nombre_usuario);
				var main = $('<div>').addClass('main');
				var wrap = $('<div>').addClass('wrap');
				


				seccionToggle.append(boton, labelHorario, labelHoraInicio, labelTituloModalidad, labelModalidad, labelTituloDocente, labelDocente);
				main.append(wrap);
				divSalienteAsignatura.append(seccionToggle, main);
				button.append(btnToggle, asignatura, polygonIcon, imageIcon);
				rectangleParent.attr('value', element.Asignatura.id_asignatura)
				rectangleParent.append(instanceChild, button, divSalienteAsignatura);
				rectangleParent.css('top', i * 33 + '%');
				i++;
				boton.click(function(){
					if(button.hasClass('active')==true){
						button.click();
					}
					var fila = $('<tr></tr>');
					var asignatura = $('<td></td>').text(element.Asignatura.cod_asignatura + " - " + element.Asignatura.nombre_asignacion);
					var seccion = $('<td></td>').text(element.num_seccion);
					var cupos = $('<td></td>').text(element.num_est);
					var  horario = $('<td></td>').html(contenido);
					var docente = $('<td></td>').text(element.Usuario.nombre_usuario);
					var modalidad = $('<td></td>').text(element.Modalidad.nombre_modalidad);
					var imagen = $('<img>').attr('src', './../../public/borrar (2).png').attr('alt', 'Botón Eliminar');
					var btn_eliminar = $('<button></button>').addClass('btn_eliminar_tabla');
					var eliminar = $('<td></td>');
					btn_eliminar.append(imagen);
					eliminar.append(btn_eliminar);
					eliminar.on('click', '.btn_eliminar_tabla', function() {
						// Lógica para manejar el evento de clic del botón
						$('.rectangle-parent').each(function() {
							if(parseInt($(this).attr('value')) == element.Asignatura.id_asignatura){
								$(this).find('.component-76-child').css('background-color', '#FFFFFF');
								$(this).find('.component-76').prop('disabled', false);
							}
						});
						fila.remove();
					  });
					fila.append(asignatura,seccion,cupos,horario,docente,modalidad,eliminar);
					fila.attr('value', element.id_seccion);
					tabla.append(fila);
					$('.rectangle-parent').each(function() {
						if(parseInt($(this).attr('value')) == element.Asignatura.id_asignatura){
							$(this).find('.component-76-child').css('background-color', '#9aeca1d5');
							$(this).find('.component-76').prop('disabled', true);
						}
					});
					// btnToggle.css('background-color', '#9aeca1d5');
					button.prop('disabled', true);
				});
				div_asignatura.append(rectangleParent);
			});
	};

	$(document).ready(function(){
		$('#btn_Cancelar').click(function(){
			alert("Se ha cancelado la selección. Recargando la página");
			window.location.href = "/seleccionar_asignatura.html";
		});
		$('#btn_Guardar').click(function(){
			console.log("hola");
			var asignaturas = [];
			$('#tabla-secciones-elegidas tr').each(function() {
				if($(this).attr('value') != undefined){
				console.log($(this).attr('value'));
				asignaturas.push($(this).attr('value'));
				}
			});
			if(asignaturas.length == 0){
				alert("No ha seleccionado ninguna asignatura, Seleccione al menos una para almacenar");
			}else{
				console.log(asignaturas);
				$.ajax({
					url: '/guardar_seleccion',
					method: 'GET',
					data:{
						asignaturas: asignaturas
					},
					contentType: 'application/json',
					success: function(data) {  
						alert("Secciones Guardadas Correctamente, te redigiremos al inicio");
						window.location.href = "/inicio_est.html";
					},
					error: function(xhr,error) {
						var resp = parseInt(xhr.responseText);
						switch(resp){
							case 1:
								alert("No hay Cupos Disponibles. Elija otra seccón");
								break;
							case 2:
								alert("Revise la seleccion, pues hay asignaturas cuyos horarios chocan");
							break;
						}
					}
				});
			}	
		});
	});

	$.ajax({
		url: '/verificar_fecha_sel',
		method: 'GET',
		dataType: 'json',
		success: function(data) {  
			var resp = parseInt(data);
			switch(resp){
				case 1:
					break;
				case 0:
					alert("No se encuentra en el periodo de selección de asignaturas");
					window.location.href = "/inicio_est.html";
				break;
			}
		},
		error: function(error) {
			console.log(error);
			reject(error);
		}
	});
	