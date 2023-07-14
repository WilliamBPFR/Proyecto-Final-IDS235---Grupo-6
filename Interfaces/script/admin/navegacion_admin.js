document.addEventListener('DOMContentLoaded', function() {
  var manejoAsignaturasBtn = document.getElementById('manejo_asignaturas');
  var perfil = document.getElementById('btn_perfil');
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

  perfil.addEventListener('click', function() {
    window.location.href = 'nav_admin?id=6';
  });
});
