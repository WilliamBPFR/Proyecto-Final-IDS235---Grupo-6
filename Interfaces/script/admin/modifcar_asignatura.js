$(document).ready(function() {
    // // Asociar el controlador de eventos al botón
     $('#btn_Agregar_Usuario').click(function() {
    //   // Aquí puedes ejecutar la función que deseas cuando se hace clic en el botón
       window.location.href = 'cargar_crear_usuario/';
     });
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
        $('txt_ID').val(response.matricula);
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