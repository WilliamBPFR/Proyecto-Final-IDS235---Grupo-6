$(document).ready(function() {
    // // Asociar el controlador de eventos al botón
    // $('#btn_Agregar_Usuario').click(function() {
    //   // Aquí puedes ejecutar la función que deseas cuando se hace clic en el botón
    //   window.location.href = 'cargar_crear_usuario/';
    // });
    console.log('La página se ha cargado completamente');
    console.log('aaaaaaaaaaaaaaaaaaaaaaaa')
    $.ajax({
      url: '/cargar_modificar_asignatura',
      method: 'GET',
      data: {
        cod_asig: $.cookie('cod_asignatura') 
        },
      contentType: 'application/json',
      success: function(response) {
        console.log('entre');
        console.log(response);
        $('#txt_Cod_Asignatura').val(response.cod_asignatura);
        localStorage.setItem('cod_asignatura', response.cod_asignatura);
        $('#txt_Nombre_Asignatura').val(response.nombre_asignacion);
        $('#txt_Creditos_Asignatura').val(response.creditos);
        $('#sel_Carrera_Pertenence').find('option').each(function() {
            if (parseInt($(this).val()) === response.id_carrera) {
              $(this).prop('selected', true); // Seleccionar la opción correspondiente
            }
        });

        $('#sel_Asignatura_Visible').find('option').each(function() {
            if(response.visible == true && parseInt($(this).val()) == 1){
                $(this).prop('selected', true); // Seleccionar la opción correspondiente
            }else if(response.visible == false && parseInt($(this).val()) == 0){
                $(this).prop('selected', true); // Seleccionar la opción correspondiente
            }
        });

        $('#sel_Asignatura_Tipo').find('option').each(function() {
            if (parseInt($(this).val()) === response.Tipos_Asignatura.id_tipo_asignatura) {
              $(this).prop('selected', true); // Seleccionar la opción correspondiente
            }
        });
      },
      error: function(xhr, status, error) {
        var resp = parseInt(xhr.responseText);
        switch (resp) {
          case 0:
            labelerror.text("Matrícula o ID ya Existente");
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

    $('#btn_Modificar_Asignatura').click(function() {

    });
});