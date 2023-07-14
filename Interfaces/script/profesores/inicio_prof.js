$(document).ready(function(){
    $.ajax({
        url: '/cargar-home-profesores',
        method: 'GET',
        dataType: 'json',
        success: function(data) { 
            console.log(data);
            $('#label_calif_por_entregar').html(data.usuarios_no_publicados);
            $('#label_estudiantes_totales').html(data.usuarios_totales);
            $('#label_asignaturas_totales').html(data.asignaturas_totales);
            $('#label_secciones_totales').html(data.secciones_totales);
            $('#tipo_trimestre').html(data.trimestre.Tipo_Trimestres.nombre_trimestre);
            $('#ano_trimestre').html(data.trimestre.ano_trimestre);
        },
        error: function(error) {
            console.log(error);
        }
    });  
});