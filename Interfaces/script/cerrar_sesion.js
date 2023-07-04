$(document).ready(function() {
  var estado = false;
  console.log("click");
  $('#btn_drpdwn_cerrar_sesion').on('click',function(){
    $('.cerrar_sesion').slideToggle();

    if (estado == true) {
      // $(this).text("⬇️");
      $('body').css({
        "overflow": "auto"
      });
      estado = false;
    } else {
      // $(this).text("⬆️");
      $('body').css({
        "overflow": "hidden"
      });
      estado = true;
    }
  });
  $('#btn_cerrar_sesion').on('click',function(){
      console.log("click");
      $('#dialog_cerrar_sesion').dialog({
        dialogClass: "custom-dialog-cerrar-sesion",
        buttons: {
          "Aceptar": 
          {
            class: "btn_aceptar",
            text: "Aceptar",
            click: function() {
              $.ajax({
                url: '/cerrar_sesion',
                method: 'GET',
                data: {
                  param1: 'valor1'
                },
                success: function(response) {
                  console.log('Respuesta del servidor:', response);
                  window.location.href = "iniciar_sesion.html";
                },
                error: function(xhr, status, error) {
                  console.error('Error en la solicitud:', error);
                }
              });      
            }
          },
          "Cancelar":
          {
            class: "btn_cancelar",
            text: "Cancelar",
            click: function() {
              $(this).dialog("close"); // Cierra la ventana emergente
              $('#btn_drpdwn_cerrar_sesion').click();
            }
          }
      }
    });
  });

  $('#btn_perfil').on('click',function(){
    window.location.href = "nav_admin?id=6";
  });
});

$.ajax({
  url: '/usuario_logueado',
  method: 'GET',
  data: {
  param1: 'valor1'
  },
  success: function(response) {
  console.log('Usuario Logueado, Puede Pasar');
  $('body').removeClass('overlay');
  },
  error: function(xhr, status, error) {
  console.error('Error en la solicitud:', error);
  var num = parseInt(xhr.responseText);
  switch (num) {
      case 0:
      window.location.href = "iniciar_sesion.html";
      break
      default:
      break
  }
  }
});
