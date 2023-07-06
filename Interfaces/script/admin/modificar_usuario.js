$(document).ready(function() {
    // // Asociar el controlador de eventos al botón
    // $('#btn_Agregar_Usuario').click(function() {
    //   // Aquí puedes ejecutar la función que deseas cuando se hace clic en el botón
    //   window.location.href = 'cargar_crear_usuario/';
    // });
    console.log('La página se ha cargado completamente');
    $.ajax({
      url: '/cargar_modificar_usuario',
      method: 'GET',
      data: {
        matricula: $.cookie('id_usuario')
        },
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
        $('#txt_ID').val(response.matricula);
        $('#txt_Nombre_Usuario').val(response.nombre_usuario);
        $('#txt_Email').val(response.email);
        $('#cb_rol').find('option').each(function() {
          if (parseInt($(this).val()) === response.Rol.id_rol) {
            console.log('entre en rol');
            console.log('entre');
            $(this).prop('selected', true); // Seleccionar la opción correspondiente
          }
        });
        $('#cb_carrera').find('option').each(function() {
          console.log('entre en carrera');
          if (parseInt($(this).val()) === response.Carreras.id_carrera) {
            console.log('entre en carreraa');
            $(this).prop('selected', true); // Seleccionar la opción correspondiente
          }
        });
        $('#cb_estado').find('option').each(function() {
          console.log('entre en estado');
          if (parseInt($(this).val()) === response.Estado.id_estado) {
            console.log('entre en estado');
            $(this).prop('selected', true); // Seleccionar la opción correspondiente
          }
        });
        var fecha_nac= new Date(response.fecha_nac);
        $("#txt_Fecha").val(fecha_nac.toISOString().slice(0,10));
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
});