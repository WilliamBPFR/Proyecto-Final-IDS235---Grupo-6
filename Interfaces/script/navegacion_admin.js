document.addEventListener('DOMContentLoaded', function() {
  var manejoAsignaturasBtn = document.getElementById('manejo_asignaturas');
  var manejoUsuariosBtn = document.getElementById('manejo_usuarios');
  var manejoSeccionBtn = document.getElementById('manejo_seccion');
  var inicioAdminBtn = document.getElementById('inicio_admin');
  var btnConfiguracion = document.getElementById('btn_configuracion');

  // Agrega un controlador de eventos de clic a cada botón
  manejoAsignaturasBtn.addEventListener('click', function() {
    window.location.href = 'ver_asignaturas.html';
  });

  manejoUsuariosBtn.addEventListener('click', function() {
    window.location.href = 'mac-book-air-10.html';
  });

  manejoSeccionBtn.addEventListener('click', function() {
    window.location.href = 'ver_secciones.html';
  });

  inicioAdminBtn.addEventListener('click', function() {
    window.location.href = '../pages/home_admin.html';
  });

  btnConfiguracion.addEventListener('click', function() {
    window.location.href = 'configuracion.html';
  });
});