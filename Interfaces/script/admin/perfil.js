$(document).ready(function () {
    var nombre_est = $('#nombre_est');
    var matricula = $('#matricula');
    var carrera = $('#carrera');
    var rol = $('#rol');
    $.ajax({
        url: '/cargar-datos-perfil',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            console.log('Asignacion');
            nombre_est.text(data.nombre_usuario);
            matricula.text(data.matricula);
            carrera.text(data.Carreras.nombre_carrera);
            rol.text(data.Rol.nombre_rol);
        },
        error: function (xhr, status) {
            console.log(status)
        }
    });
    
    $('#btn_Cambiar_Contraseña').on('click', function () {
        $('#Contraseña_Actual').prop('disabled', false);
        $('#Nueva_Contraseña').prop('disabled', false);
        $('#Repetir_Contraseña').prop('disabled', false);
        $('#btn_Cambiar_Contraseña').prop('disabled', true);
        $('#btn_Cancelar_Cambio').prop('disabled', false);
        $('#btn_Guardar_Contraseña').prop('disabled', false);
    });

    $('#btn_Cancelar_Cambio').on('click', function () {
        $('#Contraseña_Actual').prop('disabled', true);
        $('#Nueva_Contraseña').prop('disabled', true);
        $('#Repetir_Contraseña').prop('disabled', true);
        $('#btn_Cambiar_Contraseña').prop('disabled', false);
        $('#btn_Cancelar_Cambio').prop('disabled', true);
        $('#btn_Guardar_Contraseña').prop('disabled', true);
    });

    $('#btn_Guardar_Contraseña').on('click', function () {
        var Contrasena_Actual = $('#Contraseña_Actual').val();
        var Nueva_Contrasena = $('#Nueva_Contraseña').val();
        var Repetir_Contrasena = $('#Repetir_Contraseña').val();
        $('#dialog_confirmar_modificar').dialog({
            dialogClass: "custom-dialog-cerrar-sesion",
            buttons: {
              "Aceptar": 
              {
                class: "btn_aceptar",
                text: "Aceptar",
                click: function() {
                    if (Nueva_Contrasena == Repetir_Contrasena && Nueva_Contrasena != '' && Repetir_Contrasena != '' && Contrasena_Actual != '') {
                        $.ajax({
                            url: '/cambiar-contrasena',
                            type: 'GET',
                            dataType: 'json',
                            data: {
                                Contrasena_Actual: Contrasena_Actual,
                                Nueva_Contrasena: Nueva_Contrasena
                            },
                            success: function (data) {
                                $('#dialog_contrasena_modificada').dialog({
                                    dialogClass: "custom-dialog-contrasena-modificada",
                                    buttons: {
                                      "Aceptar": 
                                      {
                                        class: "btn_aceptar",
                                        text: "Aceptar",
                                        click: function() {
                                            $('#Contraseña_Actual').val('');
                                            $('#Nueva_Contraseña').val('');
                                            $('#Repetir_Contraseña').val('');
                                            $('#btn_Cancelar_Cambio').click();
                                            $(this).dialog("close"); // Cierra la ventana emergente
                                        }
                                      }
                                  }
                                });
                            },
                            error: function (xhr, status) {
                                console.log(status)
                            }
                        });
                        $(this).dialog("close"); // Cierra la ventana emergente
                    } else {
                        alert('Las contraseñas actuales no coinciden');
                    }
                    $(this).dialog("close"); // Cierra la ventana emergente
                }
              },
              "Cancelar":
              {
                class: "btn_cancelar",
                text: "Cancelar",
                click: function() {
                    $('#Contraseña_Actual').val('');
                    $('#Nueva_Contraseña').val('');
                    $('#Repetir_Contraseña').val('');
                    $('#btn_Cancelar_Cambio').click();
                  $(this).dialog("close"); // Cierra la ventana emergente
                }
              }
          }
        });
        
    });
});