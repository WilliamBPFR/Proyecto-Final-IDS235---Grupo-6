$(document).ready(function() {
    // Agregar un campo de entrada a la segunda columna
    var tabla = $('#tabla-asignar_calificaciones');
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
          console.log($('#cb_asignatura').val());
          console.log($('#cb_seccion').val());
          $.ajax({
            url: '/cargar_usuario_seccion',
            method: 'GET',
            data: {
              id_asignatura: $('#cb_asignatura').val(),
              id_seccion: $('#cb_seccion').val()
            },
            contentType: 'application/json',
            success: function(data) {
              if(data){
                console.log(data);
                data.forEach(function(est) {
                  console.log('Agregando');
                  var fila = $('<tr></tr>');
                  var col_matricula = $('<td></td>').text(est.Usuario.matricula + " - " + est.Usuario.nombre_usuario);
                  var col_calificacion = $('<td></td>');
                  var input = $('<input type="text">').attr('name','calificacion');
                  var col_calificacion_letra = $('<td></td>').text('N/A');
                  col_calificacion.append(input);
                  fila.append(col_matricula,col_calificacion,col_calificacion_letra);
                  tabla.append(fila);
                });
              }else{
                alert("No hay estudiantes en su sección");
              }
            },
            error: function(error) {
                alert("No Se Guardó");

            }
          });
        }        
      },
      error: function(error) {

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
          $.ajax({
            url: '/cargar_usuario_seccion',
            method: 'GET',
            data: {
              id_asignatura: $('#cb_asignatura').val(),
              id_seccion: $('#cb_seccion').val()
            },
            contentType: 'application/json',
            success: function(data) {
                if(data){
                  console.log(data);
                  $('#tabla-asignar_calificaciones tr').not(':first').remove();

                  data.forEach(function(est) {
                    console.log('Agregando');
                    var fila = $('<tr></tr>');
                    var col_matricula = $('<td></td>').text(est.Usuario.matricula + " - " + est.Usuario.nombre_usuario);
                    var col_calificacion = $('<td></td>');
                    var input = $('<input type="text">').attr('name','calificacion');
                    var col_calificacion_letra = $('<td></td>').text('N/A');
                    fila.attr('value',est.id_estudiante)
                    col_calificacion.append(input);
                    fila.append(col_matricula,col_calificacion,col_calificacion_letra);
                    tabla.append(fila);
                  });
                }else{
                  alert("No hay estudiantes en su sección");
                }
            },
            error: function(error) {
                alert("No Se Guardó");

            }
          });
      });
    

    for(i=0;i<10;i++){
   
    // $('#tabla-secciones tbody tr').each(function() {
    //   var campoEntrada = $('<input type="text">'); // Crear el campo de entrada
    //   $(this).find('td:eq(1)').append(campoEntrada); // Agregar el campo de entrada a la segunda columna
    // });
    }
  });
  
  
  