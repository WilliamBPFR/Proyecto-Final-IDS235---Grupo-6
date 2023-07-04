$(document).ready(function() {
    var informacion = localStorage.getItem('info_home_admin');
    var info = JSON.parse(informacion);

    console.log(info);
    $('#usuarios_totales').text(info.cant_usuarios);
    $('#asignaturas_totales').text(info.cant_asignaturas);
    $('#secciones_totales').text(info.cant_secciones);
    $('#tipo_trimestre').text(info.trimestre_actual.Tipo_Trimestres.nombre_trimestre);
    $('#ano_trimestre').text(info.trimestre_actual.ano_trimestre);
    
    // var estado = false;
    // console.log("click");
    // $('#btn_drpdwn_cerrar_sesion').on('click',function(){
    //   console.log("click");
    //   $('.cerrar_sesion').slideToggle();
  
    //   if (estado == true) {
    //     // $(this).text("⬇️");
    //     $('body').css({
    //       "overflow": "auto"
    //     });
    //     estado = false;
    //   } else {
    //     // $(this).text("⬆️");
    //     $('body').css({
    //       "overflow": "hidden"
    //     });
    //     estado = true;
    //   }
    // });
  });