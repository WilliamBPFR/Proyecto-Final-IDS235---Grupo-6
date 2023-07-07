document.addEventListener('DOMContentLoaded', function() {
    var inicioProfesorBtn = document.getElementById('inicio_profesor');
    var calificacionesBtn = document.getElementById('btn_calificaciones');
    var manejo_seccionesBtn = document.getElementById('btn_manejo_secciones');
  
    // Agrega un controlador de eventos de clic a cada botón
    inicioProfesorBtn.addEventListener('click', function() {
      window.location.href = 'nav_profesores?id=1';
    });
  
    calificacionesBtn.addEventListener('click', function() {
      window.location.href = 'nav_profesores?id=2';
    });
  
    manejo_seccionesBtn.addEventListener('click', function() {
      window.location.href = 'nav_profesores?id=3';
    });
  
  });
  