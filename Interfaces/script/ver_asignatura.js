$(document).ready(function() {
    var asignaturas = localStorage.getItem('asignaturas');
    var asignatura = JSON.parse(asignaturas);
    var datos_transformados =[];

    asignatura.forEach(function(elemento) {
        console.log(elemento);
        var obj_transformado={
            Código: elemento.cod_asignatura,
            Nombre_Asignatura: elemento.nombre_asignacion,
            Tipo: elemento.Tipos_Asignatura.nombre_tipo_asignatura,
            Créditos: elemento.creditos,
            visibilidad: elemento.visible === true? 'Visible':'No Visible'
        }
        datos_transformados.push(obj_transformado);
    });

    var tabla = $('#tabla_asignatura');

    datos_transformados.forEach(function(elemento) {
      var fila = $('<tr></tr>');

      for (var propiedad in elemento) {
        if (elemento.hasOwnProperty(propiedad)) {
          var td = $('<td></td>').text(elemento[propiedad]);
          if(propiedad.length > 15){
            // td.css('white-space','normal');
            console.log('wrap normal con:'+propiedad);
          }else{
            td.css('white-space','nowrap');
          }
          fila.append(td);
        }
      }

      tabla.append(fila);
    });
  });