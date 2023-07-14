$(document).ready(function() {
  // Aquí va el código jQuery que deseas ejecutar al cargar la página
  console.log('La página se ha cargado completamente');
  var carrera = localStorage.getItem('carreras');
  var tipo_asignatura = localStorage.getItem('tipoasignatura');
  if(carrera){
    var carreras = JSON.parse(carrera);
    var select = $("#sel_Carrera_Pertenence");
    console.log(select);
    carreras.forEach(function(carr) {
      var value = carr.id_carrera;
      var text = carr.nombre_carrera;
      var option = $('<option></option>').val(value).text(text);
      select.append(option);
    });
}
    if(tipo_asignatura){
      var tipos = JSON.parse(tipo_asignatura);
      var select = $("#sel_Asignatura_Tipo");
      console.log(select);
      tipos.forEach(function(tipo) {
        var value = tipo.id_tipo_asignatura;
        var text = tipo.nombre_tipo_asignatura;
        var option = $('<option></option>').val(value).text(text);
        select.append(option);
      });
  }
  $("#bt_Cancelar").click(function() {
    window.location.href = '/nav_admin?id=1';
  });
  // Código jQuery adicional...
});


$(document).ready(function() {
  const form = $('#form_crear_asignatura');
  const errorDiv = $('#div_mensaje_error');
  const labelerror = $('#label_error');
  var url = '';
  form.on('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores del formulario
    const formData = form.serializeArray();
    const data = {};

    $.each(formData, function(index, field) {
      data[field.name] = field.value;
    });

    var cod_asignatura = localStorage.getItem('cod_asignatura');
    localStorage.removeItem('cod_asignatura');
    data['cod_viejo'] = cod_asignatura;

    if(form.attr('name') ==='modificar'){
    // Enviar los datos al backend utilizando AJAX
      url = '/modificar-asignatura';
    }else{
      url = '/crear-asignatura';
    }
    // Enviar los datos al backend utilizando AJAX
    $.ajax({
      url: url,
      method: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(response) {
          var mensaje = response;
          localStorage.setItem('mensaje', mensaje);
          console.log(response);
          window.location.href = 'nav_admin?id=1';
      },
      error: function(xhr, status, error) {
        console.log("entreeeeeeeeeeeeeeeeeeeeeeeee")
        var resp = parseInt(xhr.responseText);
        switch (resp) {
          case 1:
            labelerror.text("Código de Asignatura ya existe");
            errorDiv.css('width',"520px");
            errorDiv.css('left',"540px");
            errorDiv.show();
          break;
            case 2:
              labelerror.text("Error al crear la asignatura");
              errorDiv.css('width',"700px");
              errorDiv.css('left',"430px");
              errorDiv.show();
              break;
            case 2:
                labelerror.text("Error al crear la asignatura");
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
