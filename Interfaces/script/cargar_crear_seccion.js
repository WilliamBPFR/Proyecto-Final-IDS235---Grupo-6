$(document).ready(function() {
    // Aquí va el código jQuery que deseas ejecutar al cargar la página
    console.log('La página se ha cargado completamente');
    var asignatura = localStorage.getItem('asignaturas');
    var docente = localStorage.getItem('docentes');
    var modalidad = localStorage.getItem('modalidades')
    
    if(asignatura){
      var asignaturas = JSON.parse(asignatura);
      var select = $("#cb_Asignatura");
      console.log(select);
      asignaturas.forEach(function(asig) {
        var value = asig.id_asignatura;
        var text = asig.nombre_asignacion;
        var option = $('<option></option>').val(value).text(text);
        select.append(option);
      });
  }
      if(docente){
        var docentes = JSON.parse(docente);
        var select = $("#cb_Docente");
        console.log(select);
        docentes.forEach(function(docente) {
          var value = docente.id_usuario;
          var text = docente.matricula + ' - '+ docente.nombre_usuario;
          var option = $('<option></option>').val(value).text(text);
          select.append(option);
        });
    }

    if(modalidad){
        var modalidades = JSON.parse(modalidad);
        var select = $("#cb_Modalidad");
        console.log(select);
        modalidades.forEach(function(mod) {
          var value = mod.id_modalidad;
          var text = mod.nombre_modalidad;
          var option = $('<option></option>').val(value).text(text);
          select.append(option);
        });
    }
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
  
      // Enviar los datos al backend utilizando AJAX
      $.ajax({
        url: '/crear_seccion',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(response) {
          // Procesar la respuesta exitosa, si es necesario
          // ...
  
          // Borrar los campos del formulario, si es necesario
          // ...
  
          // Mostrar el div de éxito, si es necesario
          // ...
        },
        error: function(xhr, status, error) {
          console.log("entreeeeeeeeeeeeeeeeeeeeeeeee")
          var resp = parseInt(xhr.responseText);
          switch (resp) {
            case 1:
              labelerror.text("Hora de Inicio y Fin Inválidas");
              errorDiv.show();
              break;
              case 2:
                labelerror.text("Número de Sección ya existe");
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
  

  