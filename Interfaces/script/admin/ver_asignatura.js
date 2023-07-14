$(document).ready(function() {
    var asignaturas = localStorage.getItem('asignaturas');
    var asignatura = JSON.parse(asignaturas);
    var datos_transformados =[];

    asignatura.forEach(function(elemento) {
        console.log(elemento);
        var obj_transformado={
            Código: elemento.cod_asignatura,
            Nombre_Asignatura: elemento.nombre_asignacion,
            Tipo: elemento.Tipos_Asignatura.nombre_tipo_asignatura,
            Créditos: elemento.creditos,
            visibilidad: elemento.visible === true? 'Visible':'No Visible'
        }
        datos_transformados.push(obj_transformado);
    });

    var tabla = $('#tabla_asignatura');

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
          td.on('dblclick',function() {
            $.cookie('cod_asignatura',fila.value);   
            console.log(fila.value);
            window.location.href = 'modificar_asignatura.html';
          });
          fila.append(td);
        }
      }

      fila.value = elemento.Código;
      console.log(fila.value);
      tabla.append(fila);
    });



    var mensaje = localStorage.getItem('mensaje');
    localStorage.removeItem("mensaje");
    console.log(mensaje);
    msj = parseInt(JSON.parse(mensaje));
    console.log(msj);
    switch (msj) {
      case 10:
        console.log("entreeeee");
        $("#dialog_asignatura_creada").dialog({
          dialogClass: "custom-dialog_trimestre_cambiado",
          buttons: {
              "Aceptar": function() {
                  $(this).dialog("close"); // Cierra la ventana emergente
              }
          }
      });
        break;
      case 20:
          console.log("entreeeee");
          $("#dialog_asignatura_modificada").dialog({
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

      $('.tabla-container').scroll(function() {
        var $table = $('#tabla_asignatura');
        var $header = $table.find('th');
        var scrollTop = $('.tabla-container').scrollTop();
        console.log(scrollTop);
        $header.css('transform', 'translateY(' + scrollTop + 'px)');
      });   
      
      $('#input_filtro').on('input', function() {
        console.log("aqui")
        var filterValue = $(this).val().toLowerCase(); // Obtener el valor del input y convertirlo a minúsculas
        
        // Iterar sobre las filas de la tabla y mostrar u ocultar según los filtros
        $('#tabla_asignatura tbody tr').each(function() {
          if($(this).attr('id') != 'nope'){
          var codigo = $(this).find('td:eq(0)').text().toLowerCase(); // Obtener el valor del código en minúsculas
          var nombre = $(this).find('td:eq(1)').text().toLowerCase(); // Obtener el valor del nombre en minúsculas
          
          // Comprobar si el filtro está en blanco o si el código o el nombre coinciden con el filtro
          if (filterValue === '' || codigo.indexOf(filterValue) > -1 || nombre.indexOf(filterValue) > -1) {
            $(this).show(); // Mostrar la fila si coincide con el filtro o si el filtro está en blanco
          } else {
            $(this).hide(); // Ocultar la fila si no coincide con el filtro
          }
        }
        });
      });
  });
