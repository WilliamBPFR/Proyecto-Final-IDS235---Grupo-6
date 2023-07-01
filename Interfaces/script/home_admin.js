$(document).ready(function() {
    var usuario = localStorage.getItem('usuario');
    var users = JSON.parse(usuario);

    $('#nombre_est').text(users.nombre_usuario);
    $('#matricula').text(users.matricula);
    $('#carrera').text(users.Carreras.nombre_carrera);
  });