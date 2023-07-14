$(document).ready(function(){
    // var div_ant = null;
    // var adentro = false;
    // $(document).on('click', '.component-76', function() {
    //     var parent = $(this).closest('.rectangle-parent');
    //     var seccionToggle = parent.find('.seccionToggle');
    //     var alturaToggle = seccionToggle.outerHeight();

    //     var seccionToggleAbierta = $('.component-76.active');

    //     console.log(div_ant);
    //     if(div_ant != null){
    //       console.log($(this).hasClass('active'));
    //       console.log(adentro);
    //       console.log(seccionToggleAbierta.length);
    //       if($(this).hasClass('active')==false && adentro == false && seccionToggleAbierta.length > 0){
    //           console.log("hola");
    //           adentro = true
    //           div_ant.removeClass('active');
    //           div_ant.click();
    //           adentro = false;
    //           div_ant = $(this);
    //           div_ant.addClass('active');
    //       }else if(adentro == true){
    //           console.log("hola3");
    //           div_ant.removeClass('active');
    //           div_ant = null;
    //       }else if(adentro == false){
    //           console.log("hola4");
    //           div_ant.removeClass('active');
    //           div_ant = null;
    //       }
    //   }else{
    //       console.log("hola2");
    //       $(this).addClass('active');
    //       div_ant = $(this);
    //   }
        
    //     seccionToggle.slideToggle({
    //       progress: function() {
    //         adjustDiv2Position(parent.nextAll('.rectangle-parent'), seccionToggle);
    //       }
    //     });
    //   });
    
    var tabla = $('#tabla-secciones-elegidas');
    var num_est = $('#num_estudiantes');
    var seccion = $('#texto_seccion');
    var horario = $('#texto_horario');
    var secciones_prof;
    $.ajax({
      url: '/cargar_datos_asignar_calificaciones',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log(data);
        var diccionario = {};
        var i = 0;
        var select = $("#cb_asignatura");
        if (data) {
          console.log(select);
          data.forEach(function(asig) {
            var value = asig.Asignatura.id_asignatura;
            console.log("VALOR ASIG")
            console.log(value);
            var text = asig.Asignatura.nombre_asignacion;
            if (!diccionario[value]) {
              diccionario[value] = true; // Marcar el tipo de asignatura como encontrado
              var option = $('<option></option>').val(value).text(text);
              select.append(option);
            }
          });
          secciones_prof = data;
          var id_asignatura = $("#cb_asignatura").val();
           var select_sec = $("#cb_seccion");
              secciones_prof.forEach(function(sec) {
              if(sec.Asignatura.id_asignatura == id_asignatura){
                var value = sec.id_seccion;
                var text = sec.num_seccion;
                var option = $('<option></option>').val(value).text(text);
                select_sec.append(option);
            }
          });
          var sec_actual;
          var contenido = "";
          secciones_prof.forEach(function(sec) {
            if(sec.id_seccion == $('#cb_seccion').val()){
              console.log('entre')
              sec.seccion_dias.forEach(element2 => {
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
                contenido += element2.hora_inicio + "/" + element2.hora_fin + "<br>";
              });
              horario.html(contenido);
              sec_actual = sec;
            } 
          });
          console.log(sec_actual);
          if(parseInt(sec_actual.num_seccion)<10)
          {
            seccion.text('0'+sec_actual.num_seccion);
          }else{
            seccion.text(sec_actual.num_seccion);
          }
          console.log(sec_actual.notas_publicadas);

          var resp = buscar_usuarios_seccion($('#cb_asignatura').val(), $('#cb_seccion').val(),sec_actual.notas_publicadas,tabla,num_est);

          console.log(resp);
        }
      },
    error: function(error) {
      console.log(error);
    }
  });

  $('#cb_asignatura').on('change', function() {
    console.log('Cambio');
    var id_asignatura = $(this).val();
    var select_sec = $("#cb_seccion");
    select_sec.empty();
    secciones_prof.forEach(function(sec) {
      if(sec.Asignatura.id_asignatura == id_asignatura){
      var value = sec.id_seccion;
      var text = sec.num_seccion;
      var option = $('<option></option>').val(value).text(text);
      select_sec.append(option);
      }
    });
    console.log($('#cb_asignatura').val());
    console.log($('#cb_seccion').val());
    var sec_actual;
    var contenido = "";
    secciones_prof.forEach(function(sec) {
      if(sec.id_seccion == $('#cb_seccion').val()){
        console.log('entre')
        sec.seccion_dias.forEach(element2 => {
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
          contenido += element2.hora_inicio + "/" + element2.hora_fin + "<br>";
        });
        horario.html(contenido);
        sec_actual = sec;
      } 
    });
    console.log(sec_actual);
    if(parseInt(sec_actual.num_seccion)<10)
    {
      seccion.text('0'+sec_actual.num_seccion);
    }else{
      seccion.text(sec_actual.num_seccion);
    }
    // Selecciona todas las filas del cuerpo de la tabla, excepto el encabezado
    var filas = tabla.find('tr').not(':first');

    // Elimina las filas seleccionadas
    filas.remove();
    
    var resp = buscar_usuarios_seccion($('#cb_asignatura').val(), $('#cb_seccion').val(),sec_actual.notas_publicadas,tabla,num_est);
    console.log(resp);
});

$('#cb_seccion').on('change', function() {
    console.log('Cambio');
    // var id_asignatura = $('#cb_asignatura').val();
    // var select_sec = $(this);
    // select_sec.empty();
    // secciones_prof.forEach(function(sec) {
    //   if(sec.Asignatura.id_asignatura == id_asignatura){
    //   var value = sec.id_seccion;
    //   var text = sec.num_seccion;
    //   var option = $('<option></option>').val(value).text(text);
    //   select_sec.append(option);
    //   }
    // });
    console.log($('#cb_asignatura').val());
    console.log($('#cb_seccion').val());
    // Selecciona todas las filas del cuerpo de la tabla, excepto el encabezado
    var filas = tabla.find('tr').not(':first');

    // Elimina las filas seleccionadas
    filas.remove();
    console.log(sec_actual);
    var sec_actual;
    var contenido = "";
    secciones_prof.forEach(function(sec) {
      if(sec.id_seccion == $('#cb_seccion').val()){
        console.log('entre')
        sec.seccion_dias.forEach(element2 => {
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
          contenido += element2.hora_inicio + "/" + element2.hora_fin + "<br>";
        });
        horario.html(contenido);
        sec_actual = sec;
      } 
    });
    console.log(sec_actual);
    if(parseInt(sec_actual.num_seccion)<10)
    {
      seccion.text('0'+sec_actual.num_seccion);
    }else{
      seccion.text(sec_actual.num_seccion);
    }
    var resp = buscar_usuarios_seccion($('#cb_asignatura').val(), $('#cb_seccion').val(),sec_actual.notas_publicadas,tabla,num_est);
    console.log(resp);
});
});

function buscar_usuarios_seccion(asignatura,seccion,notas_publicadas,tabla,num_est){
    return new Promise(function(resolve, reject) {
      var num_estu = 0;
    $.ajax({
    url: '/cargar_usuario_seccion',
    method: 'GET',
    data: {
      id_asignatura: asignatura,
      id_seccion: seccion
    },
    contentType: 'application/json',
    success: function(data) {
      if(data.length != 0){
        console.log("AQUI LA DATA");
        console.log(data);
        data.forEach(function(est) {
          num_estu++;
          console.log('Agregando');
          var fila = $('<tr></tr>');
          var col_matricula = $('<td></td>').text(est.Usuario.matricula).css('font-size','25px');;
          var col_nombre = $('<td></td>').text(est.Usuario.nombre_usuario).css('font-size','25px');;
          var col_calificacion_letra = $('<td></td>').css('font-weight','bold').css('font-size','25px');
          var col_calificacion = $('<td></td>').css('font-size','25px');
          if(est.calificacion_num){
            if(parseFloat(est.calificacion_num) <0){
                col_calificacion.text('Retirada');
            }else{
                col_calificacion.text(est.calificacion_num);
                if(parseFloat(est.calificacion_num) >= 90){
                    col_calificacion_letra.css('color','green');
                    col_calificacion_letra.text('A');
                  }else if(parseFloat(est.calificacion_num) >= 80){
                    col_calificacion_letra.css('color','blue');
                    col_calificacion_letra.text('B');
                  }else if(parseFloat(est.calificacion_num) >= 70){
                    col_calificacion_letra.css('color','rgb(140, 20, 187);');
                    col_calificacion_letra.text('C');
                  }else if(parseFloat(est.calificacion_num) >= 60){
                    col_calificacion_letra.css('color','orange');
                    col_calificacion_letra.text('D');
                  }else{
                    col_calificacion_letra.css('color','red');
                    col_calificacion_letra.text('F');
                  }
            }
          }else{
            col_calificacion.text('Nota No Publicada');
            col_calificacion_letra.text('N/A');
          }
          fila.attr('value',est.Usuario.id_usuario)
          fila.append(col_matricula,col_nombre,col_calificacion,col_calificacion_letra);
          if(est.calificacion_num === '-1'){
            console.log('No tiene calificación');
            col_calificacion_letra.text('R');
            fila.css('background-color','rgb(241, 164, 164);#FF0000');
          }      
          tabla.append(fila);
        });
        if(notas_publicadas){
          $('#dialog_seccion_publicada').dialog({
            dialogClass: "custom-dialog-cerrar-sesion",
            buttons: {
              "Aceptar": 
              {
                class: "btn_aceptar",
                text: "Aceptar",
                click: function() {
                  $(this).dialog("close");
                }
              }
            }
           });
        }
      }else{
        alert("No hay estudiantes en su sección");
      }
      num_est.text(num_estu);
      resolve(true);
    },
    error: function(error) {
        alert("No Se Guardó");
        reject(error);
    }
  });

    });
}

// function adjustDiv2Position(div2, div3) {
//     const div3Height = div3.outerHeight();
//     div2.css('margin-top', div3Height + 'px');
//   }

// function llenar_div_asignaturas(asignaturas_elegir, asignaturas_estudiante){
//     var div_asignatura = $('#id_asignatura');
//     var tabla = $('#tabla-secciones-elegidas');
//         var i = 0;
//         asignaturas_elegir.forEach(element => {
//             console.log(element);
//             var rectangleParent = $('<div>').addClass('rectangle-parent');
//             var instanceChild = $('<div>').addClass('instance-child');
//             var button = $('<button>').addClass('component-76').attr('id', 'btn_asignatura_calif');
//             var btnToggle = $('<div>').addClass('component-76-child').attr('id', 'btn-toggle').attr('name', 'div_arriba');
//             var asignatura = $('<div>').addClass('asignatura').attr('id', 'asignatura').text(element.Asignatura.cod_asignatura + " - " + element.Asignatura.nombre_asignacion + " - Sec " + element.num_seccion + " / Profesor: " + element.Usuario.nombre_usuario);
//             var polygonIcon = $('<img>').addClass('component-76-item').attr('src', './../../public/polygon-1.svg');
//             var imageIcon = $('<img>').addClass('image-10-icon').attr('src', './../../public/image-10@2x.png');
//             var divSalienteAsignatura = $('<div>').addClass('div_saliente_asignatura');
//             var seccionToggle = $('<section>').addClass('seccionToggle').attr('id', 'seccionToggle1');
//             var boton = $('<button>').addClass('component-2-inner').attr('id', 'boton').text('Seleccionar').val(element.id_seccion);
//             var labelHorario = $('<label>').addClass('label_Horario').attr('id', 'label_Horario').text('Horario');
//             var contenido = "";
//             element.seccion_dias.forEach(element2 => {
//                 switch(element2.id_dia){
//                     case 1:
//                         contenido += "Lunes: ";
//                         break;
//                     case 2:
//                         contenido += "Martes: ";
//                         break;
//                     case 3:
//                         contenido += "Miercoles: ";
//                         break;
//                     case 4:
//                         contenido += "Jueves: ";
//                         break;
//                     case 5:
//                         contenido += "Viernes: ";
//                         break;
//                     case 6:
//                         contenido += "Sabado: ";
//                         break;
//                 }
//                 contenido += element2.hora_inicio + ":00 - " + element2.hora_fin + ":00<br>";
//             });
//             var labelHoraInicio = $('<label>').addClass('label_hora_inicio').attr('id', 'label_hora_inicio').html(contenido);
//             // var labelHoraFin = $('<label>').addClass('label_hora_fin').attr('id', 'label_hora_fin').text('Hora de Fin: ' + element.hora_fin + ":00");
//             var labelTituloModalidad = $('<label>').addClass('label_titulo_modalidad').text('Modalidad');
//             var labelModalidad = $('<label>').addClass('label_modalidad').attr('id', 'label_modalidad').text(element.Modalidad.nombre_modalidad);
//             var labelTituloDocente = $('<label>').addClass('label_titulo_docente').text('Docente');
//             var labelDocente = $('<label>').addClass('label_docente').attr('id', 'label_docente').text(element.Usuario.nombre_usuario);
//             var main = $('<div>').addClass('main');
//             var wrap = $('<div>').addClass('wrap');
            


//             seccionToggle.append(boton, labelHorario, labelHoraInicio, labelTituloModalidad, labelModalidad, labelTituloDocente, labelDocente);
//             main.append(wrap);
//             divSalienteAsignatura.append(seccionToggle, main);
//             button.append(btnToggle, asignatura, polygonIcon, imageIcon);
//             rectangleParent.attr('value', element.Asignatura.id_asignatura)
//             rectangleParent.append(instanceChild, button, divSalienteAsignatura);
//             rectangleParent.css('top', i * 33 + '%');
//             i++;
//             boton.click(function(){
//                 if(button.hasClass('active')==true){
//                     button.click();
//                 }
//                 var fila = $('<tr></tr>');
//                 var asignatura = $('<td></td>').text(element.Asignatura.cod_asignatura + " - " + element.Asignatura.nombre_asignacion);
//                 var seccion = $('<td></td>').text(element.num_seccion);
//                 var cupos = $('<td></td>').text(element.num_est);
//                 var  horario = $('<td></td>').text(element.hora_inicio + "/" + element.hora_fin);
//                 var docente = $('<td></td>').text(element.Usuario.nombre_usuario);
//                 var modalidad = $('<td></td>').text(element.Modalidad.nombre_modalidad);
//                 var imagen = $('<img>').attr('src', './../../public/borrar (2).png').attr('alt', 'Botón Eliminar');
//                 var btn_eliminar = $('<button></button>').addClass('btn_eliminar_tabla');
//                 var eliminar = $('<td></td>');
//                 btn_eliminar.append(imagen);
//                 eliminar.append(btn_eliminar);
//                 eliminar.on('click', '.btn_eliminar_tabla', function() {
//                     // Lógica para manejar el evento de clic del botón
//                     alert('Haz hecho clic en el botón');
//                     $('.rectangle-parent').each(function() {
//                         if(parseInt($(this).attr('value')) == element.Asignatura.id_asignatura){
//                             $(this).find('.component-76-child').css('background-color', '#FFFFFF');
//                             $(this).find('.component-76').prop('disabled', false);
//                         }
//                     });
//                     fila.remove();
//                   });
//                 fila.append(asignatura,seccion,cupos,horario,docente,modalidad,eliminar);
//                 fila.attr('value', element.id_seccion);
//                 tabla.append(fila);
//                 $('.rectangle-parent').each(function() {
//                     if(parseInt($(this).attr('value')) == element.Asignatura.id_asignatura){
//                         $(this).find('.component-76-child').css('background-color', '#9aeca1d5');
//                         $(this).find('.component-76').prop('disabled', true);
//                     }
//                 });
//                 // btnToggle.css('background-color', '#9aeca1d5');
//                 button.prop('disabled', true);
//             });
//             div_asignatura.append(rectangleParent);
//         });
// };