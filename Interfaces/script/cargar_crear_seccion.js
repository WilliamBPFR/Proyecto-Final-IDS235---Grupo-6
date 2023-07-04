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
  

  