$(window).on('load',function() {
$.ajax({
    url: '/usuario_logueado',
    method: 'GET',
    data: {
    param1: 1
    },
    success: function(response) {
        $('#body').css('display','block');
    console.log('Usuario Logueado, Puede Pasar');
    },
    error: function(xhr, status, error) {
    console.error('Error en la solicitud:', error);
    var num = parseInt(xhr.responseText);
    console.log(num);
    switch (num) {
        case 2:
            localStorage.removeItem("login_status");
            alert("No tiene permisos para acceder a esta página");
            window.history.back();
            // localStorage.setItem("login_status", "3");
            break;
        case 0:
            localStorage.setItem("login_status", "4");
            window.location.href = "iniciar_sesion.html";
            break;
        default:
        break
    }
    }
  });
});