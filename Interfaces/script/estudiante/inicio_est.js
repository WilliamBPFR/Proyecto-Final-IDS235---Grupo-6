$(document).ready(function() {
    var usuario = localStorage.getItem('usuario');
    var users = JSON.parse(usuario);
    var canvas = document.getElementById("myChart")
    $('#nombre_est').text(users.nombre_usuario);
    $('#matricula').text(users.matricula);
    $('#carrera').text(users.Carreras.nombre_carrera);

    $.ajax({
      url: '/porcentaje_letras_est',
      method: 'GET',
      dataType: 'json',
      success: function(data) { 
          console.log(data);
          if(data.total!=0){
            console.log(data.total);
            var porcentaje_A = data.A/data.total*100;
            var porcentaje_B = data.B/data.total*100;
            var porcentaje_C = data.C/data.total*100;
            var porcentaje_D = data.D/data.total*100;
            var porcentaje_F = data.F/data.total*100;
            var porcentaje_R = data.R/data.total*100;

            $('#porcentaje_A').text(porcentaje_A.toFixed(2)+'%');
            $('#porcentaje_B').text(porcentaje_B.toFixed(2)+'%');
            $('#porcentaje_C').text(porcentaje_C.toFixed(2)+'%');
            $('#porcentaje_D').text(porcentaje_D.toFixed(2)+'%');
            $('#porcentaje_F').text(porcentaje_F.toFixed(2)+'%');
            $('#porcentaje_R').text(porcentaje_R.toFixed(2)+'%');
            var ctx = canvas.getContext("2d");
            var chart = new Chart(ctx, {
              type: "pie",
              data: {
                labels: ["Porcentaje de A", "Porcentaje de B", "Porcentaje de C", "Porcentaje de D", "Porcentaje de F", "Porcentaje de R"],
                datasets: [{
                  label: "Porcentaje de calificaciones",
                  data: [data.A, data.B,data.C,data.D,data.F,data.R],
                  backgroundColor: ["#e41e2f", "#0070ce", "#5da832","#ffdb2d","#d52dff","#f5841a"]
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false
              }
            });
          }
        $('#indice_acad').text(data.indice_acad);
        if(data.indice_acad>=3.8){
          $('#tipo_honor').text('Summa Cum Laude');
        }else if(data.indice_acad>=3.5){
          $('#tipo_honor').text('Magna Cum Laude');
        }else if(data.indice_acad>=3.2){
          $('#tipo_honor').text('Cum Laude');
        }else{
          $('#tipo_honor').text('No tiene honores');
        }
      },
      error: function(error) {
          console.log(error);
      }
  });  
});