$(document).ready(function() {
    // Agregar un campo de entrada a la segunda columna
    var tabla = $('#tabla-asignar_calificaciones');
    var secciones_prof;
    $.ajax({
      url: '/cargar_datos_asignar_calificaciones',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log(data);
        var diccionario = {};
        var i = 0;
        var select = $("#cb_asignatura");
        if (data) {
          console.log(select);
          data.forEach(function(asig) {
            var value = asig.Asignatura.id_asignatura;
            console.log("VALOR ASIG")
            console.log(value);
            var text = asig.Asignatura.nombre_asignacion;
            if (!diccionario[value]) {
              diccionario[value] = true; // Marcar el tipo de asignatura como encontrado
              var option = $('<option></option>').val(value).text(text);
              select.append(option);
            }
          });
          secciones_prof = data;
          var id_asignatura = $("#cb_asignatura").val();
           var select_sec = $("#cb_seccion");
              secciones_prof.forEach(function(sec) {
              if(sec.Asignatura.id_asignatura == id_asignatura){
                var value = sec.id_seccion;
                var text = sec.num_seccion;
                var option = $('<option></option>').val(value).text(text);
                select_sec.append(option);
            }
          });
          console.log($('#cb_asignatura').val());
          console.log($('#cb_seccion').val());
          var sec_actual;
          secciones_prof.forEach(function(sec) {
            if(sec.id_seccion == $('#cb_seccion').val()){
              console.log('entre')
              sec_actual = sec;
            } 
          });
          console.log(sec_actual.notas_publicadas);
          var resp = buscar_usuarios_seccion($('#cb_asignatura').val(), $('#cb_seccion').val(),sec_actual.notas_publicadas,tabla);
          console.log(resp);
        }        
      },
      error: function(error) {
        console.log(error);
      }
    });

   

    $('#cb_asignatura').on('change', function() {
          $('#btn_Cancelar').prop('disabled',false);
          console.log('Cambio');
          var id_asignatura = $(this).val();
          var select_sec = $("#cb_seccion");
          select_sec.empty();
          secciones_prof.forEach(function(sec) {
            if(sec.Asignatura.id_asignatura == id_asignatura){
            var value = sec.id_seccion;
            var text = sec.num_seccion;
            var option = $('<option></option>').val(value).text(text);
            select_sec.append(option);
            }
          });
          console.log($('#cb_asignatura').val());
          console.log($('#cb_seccion').val());
          var sec_actual;
          secciones_prof.forEach(function(sec) {
            if(sec.id_seccion == $('#cb_seccion').val()){
              console.log('entre')
              sec_actual = sec;
            } 
          });
          // Selecciona todas las filas del cuerpo de la tabla, excepto el encabezado
          var filas = tabla.find('tr').not(':first');

          // Elimina las filas seleccionadas
          filas.remove();
          console.clear();
          var resp = buscar_usuarios_seccion($('#cb_asignatura').val(), $('#cb_seccion').val(),sec_actual.notas_publicadas,tabla);
          console.log(resp);
      });
    
      $('#cb_seccion').on('change', function() {
        $('#btn_Cancelar').prop('disabled',false);
        console.log('Cambio');
        // var id_asignatura = $('#cb_asignatura').val();
        // var select_sec = $(this);
        // select_sec.empty();
        // secciones_prof.forEach(function(sec) {
        //   if(sec.Asignatura.id_asignatura == id_asignatura){
        //   var value = sec.id_seccion;
        //   var text = sec.num_seccion;
        //   var option = $('<option></option>').val(value).text(text);
        //   select_sec.append(option);
        //   }
        // });
        console.log($('#cb_asignatura').val());
        console.log($('#cb_seccion').val());
        var sec_actual;
        secciones_prof.forEach(function(sec) {
          if(sec.id_seccion == $('#cb_seccion').val()){
            console.log('entre')
            sec_actual = sec;
          } 
        });
        // Selecciona todas las filas del cuerpo de la tabla, excepto el encabezado
        var filas = tabla.find('tr').not(':first');
    
        // Elimina las filas seleccionadas
        filas.remove();
        
        var resp = buscar_usuarios_seccion($('#cb_asignatura').val(), $('#cb_seccion').val(),sec_actual.notas_publicadas,tabla);
        console.log(resp);
    });

    $('#btn_Guardar').on('click', function() {
        console.log('Guardando');
        var notas = {
          notas: [],
          id_est: []
        }
        var novacia = true;
        var calificaciones = $('.calificacionInput');
        calificaciones.each(function() {
          var value = $(this).val();
          if(value === ''&& $(this).prop('disabled')===false){
            novacia = false;
            return false;
          }else if($(this).prop('disabled')===false){
            notas.notas.push(value);
            notas.id_est.push($(this).parent().parent().attr('value'));
          }
        });
      console.log('Guardando');
      if(novacia){
        $('#dialog_seccion_por_publicar').dialog({
          dialogClass: "custom-dialog-cerrar-sesion",
          buttons: {
            "Aceptar": 
            {
              class: "btn_aceptar",
              text: "Aceptar",
              click: function() {
                $.ajax({
                  url: '/guardar_notas_seccion',
                  method: 'GET',
                  data: {
                    datos_notas: JSON.stringify(notas),
                    // id_asignatura: $('#cb_asignatura').val(),
                    id_seccion: $('#cb_seccion').val()
                  },
                  contentType: 'application/json',
                  success: function(data) {
                      console.log("HECHOOOOOOOO");
                      alert("Se Han Guardado las Notas");
                      location.reload();
                  },
                  error: function(error) {
                      alert("No Se Ha podido guardar las notas. Intente más tarde.");
                  }
                });
              }
            },
                "Cancelar":
                {
                  class: "btn_cancelar",
                  text: "Cancelar",
                  click: function() {
                $(this).dialog("close");
                }
              }
            }});  
    }else{
      alert('No se han llenado todas las calificaciones');
    }
    });
    // $('#tabla-secciones tbody tr').each(function() {
    //   var campoEntrada = $('<input type="text">'); // Crear el campo de entrada
    //   $(this).find('td:eq(1)').append(campoEntrada); // Agregar el campo de entrada a la segunda columna
    // });
  });

  function verificar_numero(value){
    var maxValue = 100.00;
  
    // Eliminar cualquier caracter no numérico excepto puntos decimales
    value = value.replace(/[^0-9.]/g, '');
    // Limitar a 2 dígitos en la parte entera y 2 dígitos en la parte decimal
    var parts = value.split('.');
    var integerPart = parts[0] || '';
    var decimalPart = parts[1] || '';
    if(value.indexOf('.') != -1) {
      var val = decimalPart;;
      decimalPart = '.' + val;
    }
  
    // Limitar a dos dígitos antes del punto si es decimal
    if (decimalPart != '' && integerPart.length <= 2) {
      integerPart = integerPart.slice(0, 2);
    } else {
      // Limitar a tres dígitos si no hay parte decimal y el valor es mayor a 100
      if (parseInt(integerPart) > 100) {
        integerPart = '100';
      }
      if(integerPart.length >= 3){
        decimalPart = '';
      }
    }
  
    // Limitar a dos dígitos en la parte decimal
    decimalPart = decimalPart.slice(0, 3);
  
    // Formar el valor final
    value = integerPart + decimalPart;
    console.log(value);
    return value;
  }

  function buscar_usuarios_seccion(asignatura,seccion,notas_publicadas,tabla){
		return new Promise(function(resolve, reject) {
			$.ajax({
        url: '/cargar_usuario_seccion',
        method: 'GET',
        data: {
          id_asignatura: asignatura,
          id_seccion: seccion
        },
        contentType: 'application/json',
        success: function(data) {
          if(data.length != 0){
            console.log(data);
            data.forEach(function(est) {
              console.log('Agregando');
              var fila = $('<tr></tr>');
              var col_matricula = $('<td></td>').text(est.Usuario.matricula + " - " + est.Usuario.nombre_usuario);
              var col_calificacion = $('<td></td>').css('border-left','2px solid black');
              var input = $('<input type="text">').attr('name','calificacion').addClass('calificacionInput').attr('maxlength','5').attr('min','0').attr('max','100');
              var col_calificacion_letra = $('<td></td>').text('N/A').css('font-weight','bold').css('font-size','25px');
              var funcion_input =  function() {
                var value = verificar_numero($(this).val());
                if(parseFloat(value) >= 90){
                  col_calificacion_letra.css('color','green');
                  col_calificacion_letra.text('A');
                }else if(parseFloat(value) >= 80){
                  col_calificacion_letra.css('color','blue');
                  col_calificacion_letra.text('B');
                }else if(parseFloat(value) >= 70){
                  col_calificacion_letra.css('color','rgb(140, 20, 187);');
                  col_calificacion_letra.text('C');
                }else if(parseFloat(value) >= 60){
                  col_calificacion_letra.css('color','orange');
                  col_calificacion_letra.text('D');
                }else if(value == ''){
                  col_calificacion_letra.css('color','black');
                  col_calificacion_letra.text('N/A');
                }else{
                  col_calificacion_letra.css('color','red');
                  col_calificacion_letra.text('F');
                }
                $(this).val(value);
              };
              input.on('input',funcion_input);
              if(notas_publicadas){
                if(est.calificacion_num >= 0){
                  input.val(est.calificacion_num);
                }else{
                  input.off('input',funcion_input);
                  input.val('Retirada');
                }
                input.trigger('input');   
                input.prop('disabled',true);
                $('#btn_Guardar').prop('disabled',true);
              }
              fila.attr('value',est.Usuario.id_usuario)
              col_calificacion.append(input);
              fila.append(col_matricula,col_calificacion,col_calificacion_letra);
              if(est.calificacion_num === '-1'){
                console.log('No tiene calificación');
                col_calificacion_letra.text('R');
                fila.css('background-color','rgb(241, 164, 164);#FF0000');
                input.prop('disabled',true);
                input.css('background-color','rgb(223, 119, 49)');
              }      
              tabla.append(fila);
            });
            if(notas_publicadas){
              $('#dialog_seccion_publicada').dialog({
                dialogClass: "custom-dialog-cerrar-sesion",
                buttons: {
                  "Aceptar": 
                  {
                    class: "btn_aceptar",
                    text: "Aceptar",
                    click: function() {
                      $(this).dialog("close");
                    }
                  }
                }
               });
            }else{
              $('#btn_Guardar').prop('disabled',false);
            }
          }else{
            alert("No hay estudiantes en su sección");
          }
          resolve(true);
        },
        error: function(error) {
            alert("No Se Guardó");
            reject(error);
        }
      });

		});
	}