$(document).ready(function() {
    var trimestres = $("#cb_trimestre");
    var ano = $("#cb_ano");
    var tabla = $("#tabla-secciones-elegidas");
    $.ajax({
        url: '/cargar_timestres',
        method: 'GET',
        dataType: 'json',
        success: function(data) { 
            console.log(data.trimestres); 
            triactual = data.trimestre_actual;
            if(data.trimestres){
                var tris = data.trimestres;
                console.log(tris);
                tris.forEach(function(tri) {
                  var value = tri.id_tipo_trimestre;
                  var text = tri.nombre_trimestre;
                  var option = $('<option></option>').val(value).text(text);
                  if (tri.id_tipo_trimestre === triactual.id_tipo_trimestre) {
                    option.prop('selected', true);
                }
                  trimestres.append(option);
                });
            }

            // Obtener el año actual
            var currentYear = 2023;
        
            // Número de años a mostrar
            var numberOfYears = 30; // Cambia este valor según tus necesidades
        
            // Generar los options del combobox
            for (var i = 0; i <= numberOfYears; i++) {
              var year = currentYear + i;
              var option = $("<option></option>").text(year).val(year);
        
              if (year === parseInt(triactual.ano_trimestre)) {
                console.log("entro");
                option.prop('selected', true);
            }
              ano.append(option);
            }
            
            var response = cargar_asignaturas(trimestres.val(),ano.val(),tabla);
        },
        error: function(error) {
            console.log(error);
        }
    });
    $('.tabla-container').scroll(function() {
        var $header = tabla.find('th');
        var scrollTop = $('.tabla-container').scrollTop();
        console.log(scrollTop);
        $header.css('transform', 'translateY(' + scrollTop + 'px)');
      }); 
    trimestres.change(function() {
        $("#indice_trimestral").text('N/A');
        $('#creditos_trimestre').text("0");
        $('#creditos_aprobados').text("0");
        tabla.find("tr").not(":first").empty();
        var response = cargar_asignaturas(trimestres.val(),ano.val(),tabla);
    });
    ano.change(function() {
        $("#indice_trimestral").text('N/A');
        $('#creditos_trimestre').text("0");
        $('#creditos_aprobados').text("0");
        tabla.find("tr").not(":first").empty();
        var response = cargar_asignaturas(trimestres.val(),ano.val(),tabla);
    });

});

function cargar_asignaturas(id_tri,id_ano,tabla) {
    $.ajax({
        url: '/cargar_datos_asigs_tri_estudiantes',
        method: 'GET',
        data:{
            id_tipo_trimestre: id_tri,
            ano_tri: id_ano
        },
        contentType: 'application/json',
        success: function(data) { 
            console.log('Asig_Tri');
            console.log(data);
            var puntos_totales=0;
            var cred_totales = 0;
            var creditos_tri = 0;
            data.asigs_seleccionadas.forEach(function(asig) {
                creditos_tri += asig.Asignatura.creditos;
                var fila = $('<tr></tr>');
                var asignatura = $('<td></td>').text(asig.Asignatura.cod_asignatura + ' - ' + asig.Asignatura.nombre_asignacion);
                var seccion = $('<td></td>').text(asig.Seccion.num_seccion);
                var horario = $('<td></td>');
                var horario_text = '';
                asig.Seccion.seccion_dias.forEach(function(hor) {
                    switch (hor.id_dia) {
                        case 1:
                            horario_text += 'Lunes: ';
                            break;
                        case 2:
                            horario_text += 'Martes: ';
                            break;
                        case 3:
                            horario_text += 'Miércoles: ';
                            break;
                        case 4:
                            horario_text += 'Jueves: ';
                            break;
                        case 5:
                            horario_text += 'Viernes: ';
                            break;
                        case 6:
                            horario_text += 'Sábado: ';
                            break;
                        default:
                            break;
                    }
                    horario_text += hor.hora_inicio + '/' + hor.hora_fin + '<br>';
                });
                horario.html(horario_text);
                var profesor = $('<td></td>').text(asig.Seccion.Usuario.nombre_usuario);
                var calificacion_num = $('<td></td>');
                var calificacion_let = $('<td></td>');
                var puntos  = $('<td></td>');
                var creditos = $('<td></td>').text(asig.Asignatura.creditos);
                if(asig.calificacion_num){
                    if(asig.calificacion_num <0){
                        calificacion_num.text('Retirada');
                        calificacion_let.text('R');
                        puntos.text('No Aplica');
                        fila.css('background-color','rgba(255, 127, 127, 0.596)');
                    }
                    else{
                        cred_totales += asig.Asignatura.creditos;
                        calificacion_num.text(asig.calificacion_num);
                        if(parseFloat(asig.calificacion_num) >= 90){
                            calificacion_let.css('color','green');
                            calificacion_let.text('A');
                            puntos.text(asig.Asignatura.creditos*4.0);
                            puntos_totales += asig.Asignatura.creditos*4.0;
                          }else if(parseFloat(asig.calificacion_num) >= 80){
                            calificacion_let.css('color','blue');
                            calificacion_let.text('B');
                            puntos.text(asig.Asignatura.creditos*3.0);
                            puntos_totales += asig.Asignatura.creditos*3.0;
                          }else if(parseFloat(asig.calificacion_num) >= 70){
                            calificacion_let.css('color','rgb(140, 20, 187);');
                            calificacion_let.text('C');
                            puntos.text(asig.Asignatura.creditos*2.0);
                            puntos_totales += asig.Asignatura.creditos*2.0;
                          }else if(parseFloat(asig.calificacion_num) >= 60){
                            calificacion_let.css('color','orange');
                            calificacion_let.text('D');
                            puntos.text(asig.Asignatura.creditos*1.0);
                            puntos_totales += asig.Asignatura.creditos*1.0;
                          }else{
                            calificacion_let.css('color','red');
                            calificacion_let.text('F');
                            puntos.text(asig.Asignatura.creditos*0.0);
                            puntos_totales += asig.Asignatura.creditos*0.0;
                          }
                    }
                }else{
                    calificacion_num.text('No Publicada');
                    calificacion_let.text('N/A');
                    puntos.text('N/A');
                }
                fila.append(asignatura,seccion,horario,profesor,creditos,calificacion_num,calificacion_let,puntos);
                tabla.append(fila);
            });
            if(cred_totales == 0){
                $("#indice_trimestral").text('N/A');
            }else{
                console.log(puntos_totales/cred_totales)
                $("#indice_trimestral").text((puntos_totales/cred_totales).toFixed(3));
            }
            $('#creditos_trimestre').text(creditos_tri);
            $('#creditos_aprobados').text(cred_totales);
        },
        error: function(error) {
            console.log(error);
        }
    });
}