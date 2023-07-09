$(document).ready(function() {
    // var seccion = localStorage.getItem('secciones');
    // var secciones = JSON.parse(seccion);
    // console.log(secciones)
    // var datos_transformados =[];

    // secciones.forEach(function(elemento) {
    //     console.log(elemento);
    //     var obj_transformado={
    //         Asignatura: elemento.Asignatura.cod_asignatura + " - " + elemento.Asignatura.nombre_asignacion,
    //         Sección: elemento.num_seccion,
    //         Cantidad_Estudiantes: 40,
    //         Horario: elemento.hora_inicio + "/"+ elemento.hora_fin,
    //         Docente: elemento.Usuario.matricula + " - " + elemento.Usuario.nombre_usuario,
    //         Modalidad: elemento.Modalidad.nombre_modalidad
    //         }
    //     datos_transformados.push(obj_transformado);
    // });

    $.ajax({
      url: '/cargar_secciones',
      method: 'GET',
      dataType: 'json',
      success: function(response) {
        var tabla = $('#tabla-secciones');
        console.log(response);
        response.forEach(function(elemento) {
          var fila = $('<tr></tr>');
          var obj_transformado={
            Asignatura: elemento.Asignatura.cod_asignatura + " - " + elemento.Asignatura.nombre_asignacion,
            Sección: elemento.num_seccion,
            Cantidad_Estudiantes: 40-elemento.num_est,
            Horario: dias_sec(elemento),
            Docente: elemento.Usuario.matricula + " - " + elemento.Usuario.nombre_usuario,
            Modalidad: elemento.Modalidad.nombre_modalidad
          }
          for (var propiedad in obj_transformado) {
            if (obj_transformado.hasOwnProperty(propiedad)) {
              var td = $('<td></td>').text(obj_transformado[propiedad]);
              if(propiedad.length > 15){
                // td.css('white-space','normal');
                console.log('wrap normal con:'+propiedad);
              }else{
                td.css('white-space','nowrap');
              }
              td.on('dblclick',function() {
                $.cookie('id_seccion',fila.value);
                window.location.href = 'modificar_seccion.html';
              });
              fila.append(td);
            }
          }
          tabla.append(fila);
        });
      },
      error: function(error) {
      }
    });

    var mensaje = localStorage.getItem('mensaje');
    localStorage.removeItem("mensaje");
    men = (JSON.parse(mensaje));
    msj = parseInt(men);
    console.log(msj);
    switch (msj) {
      case 0:
        console.log("entreeeee");
        $("#dialog_seccion_creada").dialog({
          dialogClass: "custom-dialog-nueva-sec",
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
    $('.tabla-container').scroll(function() {
      var $table = $('#tabla-secciones');
      var $header = $table.find('th');
      var scrollTop = $('.tabla-container').scrollTop();
      console.log(scrollTop);
      $header.css('transform', 'translateY(' + scrollTop + 'px)');
    });
  });

  function dias_sec(elemento){
    var id_seccion = elemento.id_seccion;
    var dias = "";
    elemento.seccion_dias.forEach(function(elemento) {
        var dia = "";
        if(elemento.id_seccion == id_seccion){
            switch (elemento.id_dia) { 
                case 1:
                  dia = "Lunes";
                  break;
                case 2:
                  dia = "Martes";
                  break;
                case 3:
                  dia = "Miercoles";
                  break;
                case 4:
                  dia = "Jueves";
                  break;
                case 5:
                  dia = "Viernes";
                  break;
                case 6:
                  dia = "Sabado";
                  break;
                default:
                  break;
              }
            dias += dia + ": " + elemento.hora_inicio + " - " + elemento.hora_fin + "/";
            console.log(dia);
        }
    });
    return dias;
  }
  