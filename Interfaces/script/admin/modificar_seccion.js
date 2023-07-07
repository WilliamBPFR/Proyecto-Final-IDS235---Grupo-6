$(document).ready(function() {
    console.log('La página se ha cargado completamente');
    
    $.ajax({
      url: '/cargar_modificar_seccion',
      method: 'GET',
      data: {
        seccionId: $.cookie('seccionId')
      },
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
        
        // Asignar los valores de la respuesta a los campos correspondientes en el formulario
        $('#txt_ID_Seccion').val(response.id_seccion);
        $('#txt_Num_Seccion').val(response.num_seccion);
        
        // // Iterar sobre las asignaturas seleccionadas y mostrarlas en algún lugar de la interfaz
        // for (var i = 0; i < response.Asignaturas_Seleccionadas.length; i++) {
        //   var asignaturaSeleccionada = response.Asignaturas_Seleccionadas[i];
        //   // Mostrar la asignaturaSeleccionada en la interfaz
        // }
        
        $('#cb_Asignatura').find('option').each(function() {
          if (parseInt($(this).val()) === response.Asignatura.id_asignatura) {
            $(this).prop('selected', true);
          }
        });
        $('#cb_Modalidad').find('option').each(function() {
          if (parseInt($(this).val()) === response.Modalidad.id_modalidad) {
            $(this).prop('selected', true);
          }
        });
        $('#cb_Profesor').find('option').each(function() {
          if (parseInt($(this).val()) === response.Usuario.id_usuario) {
            $(this).prop('selected', true);
          }
        });
        
        var fechaCreacion = new Date(response.fecha_creacion);
        $("#txt_Fecha_Creacion").val(fechaCreacion.toISOString().slice(0,10));
        
      },
      error: function(xhr, status, error) {
        var resp = parseInt(xhr.responseText);
        switch (resp) {
          case 0:
            labelerror.text("ID ya Existente");
            errorDiv.show();
            break;
          default:
            break;
        }
        setTimeout(function() {
          errorDiv.fadeOut();
        }, 5000);
      }
    });
  });
  