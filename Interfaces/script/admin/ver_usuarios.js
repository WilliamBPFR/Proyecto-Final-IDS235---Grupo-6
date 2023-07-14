$(document).ready(function() {
    var users = localStorage.getItem('usuarios');
    var usuarios = JSON.parse(users);
    var datos_transformados =[];

    usuarios.forEach(function(elemento) {
        console.log(elemento);
        var obj_transformado={
            Matrícula_o_ID: elemento.matricula,
            Nombre: elemento.nombre_usuario,
            Tipo_de_Usuario: elemento.Rol.nombre_rol,
            Estado: elemento.Estado.nombre_estado
        }
        datos_transformados.push(obj_transformado);
    });

    var tabla = $('#tabla_usuario');

    datos_transformados.forEach(function(elemento) {
      var fila = $('<tr></tr>');

      for (var propiedad in elemento) {
        if (elemento.hasOwnProperty(propiedad)) {
          var td = $('<td></td>').text(elemento[propiedad]);
          if(propiedad.length > 18){
            // td.css('white-space','normal');
            console.log('wrap normal con:'+propiedad);
          }else{
            td.css('white-space','nowrap');
          }
          td.on('dblclick',function() {
            $.cookie('id_usuario',fila.value);            
            window.location.href = 'modificar_usuarios_sistema.html';
          });
          fila.append(td);
        }
      }
      fila.value = elemento.Matrícula_o_ID;
      tabla.append(fila);
    });
    
    $("#btn_Cancelar").click(function() {
        window.location.href = '/nav_admin?id=2';
      });
    $("#btn_Agregar_Usuario").click(function() {
        window.location.href = 'crear_usuario.html';
    });
    $('.tabla-container').scroll(function() {
      var $table = $('#tabla_usuario');
      var $header = $table.find('th');
      var scrollTop = $('.tabla-container').scrollTop();
      console.log(scrollTop);
      $header.css('transform', 'translateY(' + scrollTop + 'px)');
    });   

    var mensaje = localStorage.getItem('mensaje');
    localStorage.removeItem("mensaje");
    men = (JSON.parse(mensaje));
    msj = parseInt(men);
    console.log(msj);
    switch (msj) {
      case 10:
        console.log("entreeeee");
        $("#dialog_usuario_creado").dialog({
          dialogClass: "custom-dialog-nuevo-user",
          buttons: {
              "Aceptar": function() {
                  $(this).dialog("close"); // Cierra la ventana emergente
              }
          }
      });
      break;
      case 20:
        console.log("entreeeee");
        $("#dialog_usuario_modificado").dialog({
          dialogClass: "custom-dialog-nuevo-user",
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

    $('#input_filtro').on('input', function() {
      console.log("aqui")
      var filterValue = $(this).val().toLowerCase(); // Obtener el valor del input y convertirlo a minúsculas
      
      // Iterar sobre las filas de la tabla y mostrar u ocultar según los filtros
      $('#tabla_usuario tbody tr').each(function() {
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
