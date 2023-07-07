document.addEventListener('DOMContentLoaded', function() {
    var estudiantesBtn = document.getElementById('btn_estudiante');
    var calificacionesBtn = document.getElementById('btn_calificaciones');
    var sel_asignaturaBtn = document.getElementById('btn_sel_asignatura');
    var ret_asignaturaBtn = document.getElementById('btn_ret_asignatura');
  
    // Agrega un controlador de eventos de clic a cada botón
    estudiantesBtn.addEventListener('click', function() {
      window.location.href = 'nav_estudiante?id=1';
    });
  
    calificacionesBtn.addEventListener('click', function() {
      window.location.href = 'nav_estudiante?id=2';
    });
  
    sel_asignaturaBtn.addEventListener('click', function() {
      window.location.href = 'nav_estudiante?id=3';
    });
  
    ret_asignaturaBtn.addEventListener('click', function() {
      window.location.href = 'nav_estudiante?id=4';
    });
  
  });