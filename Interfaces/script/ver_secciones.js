$(document).ready(function() {
    var seccion = localStorage.getItem('secciones');
    var secciones = JSON.parse(seccion);
    console.log(secciones)
    var datos_transformados =[];

    secciones.forEach(function(elemento) {
        console.log(elemento);
        var obj_transformado={
            Asignatura: elemento.Asignatura.cod_asignatura + " - " + elemento.Asignatura.nombre_asignacion,
            Sección: elemento.num_seccion,
            Cantidad_Estudiantes: 40,
            Horario: elemento.hora_inicio + "/"+ elemento.hora_fin,
            Docente: elemento.Usuario.matricula + " - " + elemento.Usuario.nombre_usuario,
            Modalidad: elemento.Modalidad.nombre_modalidad
            }
        datos_transformados.push(obj_transformado);
    });

    var tabla = $('#tabla-secciones');

    datos_transformados.forEach(function(elemento) {
      var fila = $('<tr></tr>');

      for (var propiedad in elemento) {
        if (elemento.hasOwnProperty(propiedad)) {
          var td = $('<td></td>').text(elemento[propiedad]);
          if(propiedad.length > 15){
            // td.css('white-space','normal');
            console.log('wrap normal con:'+propiedad);
          }else{
            td.css('white-space','nowrap');
          }
          fila.append(td);
        }
      }

      tabla.append(fila);
    });

    
    var mensaje = localStorage.getItem('mensaje');
    localStorage.removeItem("mensaje");
    msj = parseInt(JSON.parse(mensaje));
    console.log(msj);
    switch (msj) {
      case 0:
        console.log("entreeeee")
        $("#dialog_seccion_creada").dialog({
          dialogClass: "custom-dialog_trimestre_cambiado",
          buttons: {
              "Aceptar": function() {
                  $(this).dialog("close"); // Cierra la ventana emergente
              }
          }
      });
        break;
      default:
        break;
    }
  });
