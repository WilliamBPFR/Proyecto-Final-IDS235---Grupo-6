  $(document).ready(function() {
    // Aquí va el código jQuery que deseas ejecutar al cargar la página
    console.log('La página se ha cargado completamente');

    $.ajax({
      url: '/cargar_crear_seccion',
      method: 'GET',
      dataType: 'json',
      success: function(data) {      
        console.log(data);
        asignaturas = data.asignaturas;
        console.log(asignaturas);
        docentes = data.docente;
        modalidades = data.modalidades;

        if(asignaturas){
          var select = $("#cb_Asignatura");
          console.log(select);
          asignaturas.forEach(function(asig) {
            var value = asig.id_asignatura;
            var text = asig.nombre_asignacion;
            var option = $('<option></option>').val(value).text(text);
            select.append(option);
          });
      }
          if(docentes){
            var select = $("#cb_Docente");
            console.log(select);
            docentes.forEach(function(docente) {
              var value = docente.id_usuario;
              var text = docente.matricula + ' - '+ docente.nombre_usuario;
              var option = $('<option></option>').val(value).text(text);
              select.append(option);
            });
        }
    
        if(modalidades){
            var select = $("#cb_Modalidad");
            console.log(select);
            modalidades.forEach(function(mod) {
              var value = mod.id_modalidad;
              var text = mod.nombre_modalidad;
              var option = $('<option></option>').val(value).text(text);
              select.append(option);
            });
        }
      },
      error: function(error) {
        console.log(error);
      }
    });
    
    
    $("#btn_Cancelar").click(function() {
      window.location.href = '/nav_admin?id=3';
    });

    // Código jQuery adicional...
  });



$(document).ready(function() {
    const form = $('#component-46');
    const errorDiv = $('#div_mensaje_error');
    const labelerror = $('#label_error');
  
    form.on('submit', function(event) {
      event.preventDefault(); // Evitar el envío del formulario
  
      // Obtener los valores del formulario
      const formData = form.serializeArray();
      const data = {};
  
      $.each(formData, function(index, field) {
        data[field.name] = field.value;
      });

      var obj = [];
      
      $('#tabla-secciones tr').each(function() {
        var obj2 = {};
        obj2['id_dia'] = $(this).attr('value');
        if(obj2['id_dia'] != undefined){
        obj2['hora_inicio'] = $(this).find('td select[name="hora_inicio"]').val();
        obj2['hora_fin'] = $(this).find('td select[name="hora_fin"]').val(); 
        obj.push(obj2);
        }
      });
      console.log(obj);
      data['horarios'] = obj;
      // Enviar los datos al backend utilizando AJAX
      $.ajax({
        url: '/crear_seccion',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(response) {
          var mensaje = '0';
          localStorage.setItem('mensaje', mensaje);
          window.location.href = 'nav_admin?id=3';
        },
        error: function(xhr, status, error) {
          console.log("entreeeeeeeeeeeeeeeeeeeeeeeee")
          var resp = parseInt(xhr.responseText);
          switch (resp) {
            case 1:
              labelerror.text("Hora de Inicio y Fin Inválidas");
              errorDiv.css('width',"520px");
              errorDiv.css('left',"540px");
              errorDiv.show();
              break;
              case 2:
                labelerror.text("Número de Sección ya existe");
                errorDiv.css('width',"520px");
                errorDiv.css('left',"540px");
                errorDiv.show();
                break;
              case 3:
                labelerror.text("Numero de Sección Inválido");
                errorDiv.css('width',"520px");
                errorDiv.css('left',"540px");
                errorDiv.show();
                break;
                case 4:
                  labelerror.text("Docente No Disponible en ese Horario");
                  errorDiv.css('width',"700px");
                  errorDiv.css('left',"430px");
                  errorDiv.show();
                  break;
            default:
              console.log('Error desconocido')
              break;
          }
          setTimeout(function() {
            errorDiv.fadeOut();
          }, 5000);
        }
      });
    });
  });

  $(document).ready(function() {
    $('input[name="diaSemana"]').change(function() {
      console.log('Cambio de estado');
      if($(this).is(':checked')) {
        var value = $(this).val();
        var dia = $('<td></td>').text($(this).attr('id').charAt(0).toUpperCase() + $(this).attr('id').slice(1));
        var tabla = $("#tabla-secciones");
        var fila = $('<tr></tr>');
        var col_hora_inicio = $('<td></td>').addClass('combobox-column');
        var col_hora_fin = $('<td></td>').addClass('combobox-column');
        var cb_hora_inicio = $('<select></select>').attr('name','hora_inicio');;
        var cb_hora_fin = $('<select></select>').attr('name','hora_fin');

        cb_hora_fin.append('<option value="8">08 hrs (08 a.m.)</option>');
        cb_hora_fin.append('<option value="9">09 hrs (09 a.m.)</option>');
        cb_hora_fin.append('<option value="10">10 hrs (10 a.m.)</option>');
        cb_hora_fin.append('<option value="11">11 hrs (11 a.m.)</option>');
        cb_hora_fin.append('<option value="12">12 hrs (12 p.m.)</option>');
        cb_hora_fin.append('<option value="13">13 hrs (01 p.m.)</option>');
        cb_hora_fin.append('<option value="14">14 hrs (02 p.m.)</option>');
        cb_hora_fin.append('<option value="15">15 hrs (03 p.m.)</option>');
        cb_hora_fin.append('<option value="16">16 hrs (04 p.m.)</option>');
        cb_hora_fin.append('<option value="17">17 hrs (05 p.m.)</option>');
        cb_hora_fin.append('<option value="18">18 hrs (06 p.m.)</option>');
        cb_hora_fin.append('<option value="19">19 hrs (07 p.m.)</option>');
        cb_hora_fin.append('<option value="20">20 hrs (08 p.m.)</option>');
        cb_hora_fin.append('<option value="21">21 hrs (09 p.m.)</option>');
        cb_hora_fin.append('<option value="22">22 hrs (10 p.m.)</option>');

        cb_hora_inicio.append('<option value="8">08 hrs (08 a.m.)</option>');
        cb_hora_inicio.append('<option value="9">09 hrs (09 a.m.)</option>');
        cb_hora_inicio.append('<option value="10">10 hrs (10 a.m.)</option>');
        cb_hora_inicio.append('<option value="11">11 hrs (11 a.m.)</option>');
        cb_hora_inicio.append('<option value="12">12 hrs (12 p.m.)</option>');
        cb_hora_inicio.append('<option value="13">13 hrs (01 p.m.)</option>');
        cb_hora_inicio.append('<option value="14">14 hrs (02 p.m.)</option>');
        cb_hora_inicio.append('<option value="15">15 hrs (03 p.m.)</option>');
        cb_hora_inicio.append('<option value="16">16 hrs (04 p.m.)</option>');
        cb_hora_inicio.append('<option value="17">17 hrs (05 p.m.)</option>');
        cb_hora_inicio.append('<option value="18">18 hrs (06 p.m.)</option>');
        cb_hora_inicio.append('<option value="19">19 hrs (07 p.m.)</option>');
        cb_hora_inicio.append('<option value="20">20 hrs (08 p.m.)</option>');
        cb_hora_inicio.append('<option value="21">21 hrs (09 p.m.)</option>');
        cb_hora_inicio.append('<option value="22">22 hrs (10 p.m.)</option>');

        col_hora_inicio.append(cb_hora_inicio);
        col_hora_fin.append(cb_hora_fin);
        fila.append(dia,col_hora_inicio,col_hora_fin);
        fila.attr('value', value);
        tabla.append(fila);
      }else{
        console.log('Eliminando');
        var value = $(this).val();
        console.log(value);
        var tabla = $("#tabla-secciones");
        var fila = tabla.find('tr').filter(function() {
          console.log($(this).attr('value'));
          return $(this).attr('value') === value;
        });
        console.log(fila);
        fila.remove();
      }
    });
  });
  

  