$(document).ready(function() {
    // Agregar un campo de entrada a la segunda columna
    var tabla = $('#tabla-asignar_calificaciones');

    $.ajax({
      url: '/cargar_datos_asignar_calificaciones',
      method: 'GET',
      dataType: 'json',
      success: function(data) {  

      },
      error: function(error) {

      }
    });


    for(i=0;i<10;i++){
    console.log('Agregando');
    var fila = $('<tr></tr>');
    var col_matricula = $('<td></td>').text('1104228 - William Ferreira');
    var col_calificacion = $('<td></td>');
    var input = $('<input type="text">').attr('name','calificacion');
    var col_calificacion_letra = $('<td></td>').text('N/A');
    col_calificacion.append(input);
    fila.append(col_matricula,col_calificacion,col_calificacion_letra);
    tabla.append(fila);
    // $('#tabla-secciones tbody tr').each(function() {
    //   var campoEntrada = $('<input type="text">'); // Crear el campo de entrada
    //   $(this).find('td:eq(1)').append(campoEntrada); // Agregar el campo de entrada a la segunda columna
    // });
    }
  });
  
  
  