document.addEventListener('DOMContentLoaded', function() {
  var manejoAsignaturasBtn = document.getElementById('manejo_asignaturas');
  var manejoUsuariosBtn = document.getElementById('manejo_usuarios');
  var manejoSeccionBtn = document.getElementById('manejo_seccion');
  var inicioAdminBtn = document.getElementById('inicio_admin');
  var btnConfiguracion = document.getElementById('btn_configuracion');

  // Agrega un controlador de eventos de clic a cada botón
  manejoAsignaturasBtn.addEventListener('click', function() {
    window.location.href = 'nav_admin?id=1';
  });

  manejoUsuariosBtn.addEventListener('click', function() {
    window.location.href = 'nav_admin?id=2';
  });

  manejoSeccionBtn.addEventListener('click', function() {
    window.location.href = 'nav_admin?id=3';
  });

  inicioAdminBtn.addEventListener('click', function() {
    window.location.href = 'nav_admin?id=4';
  });

  btnConfiguracion.addEventListener('click', function() {
    window.location.href = 'nav_admin?id=5';
  });
});
