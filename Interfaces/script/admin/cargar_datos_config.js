
$(document).ready(function() {
    var trimestres = localStorage.getItem('trimestres');
    var trimestre = localStorage.getItem('trimestre');
    var fecha_sel = localStorage.getItem('fecha_sel');
    var fecha = JSON.parse(fecha_sel);
    var triactual = JSON.parse(trimestre);
    console.log(fecha);
    if(fecha){
        console.log("entre a la fechaaaaaaaaaaaaa");
        var fecha_inicio = new Date(fecha.fecha_inicio);
        var fecha_fin = new Date(fecha.fecha_fin);
        console.log(fecha);
        $("#txt_Fecha_Inicio").val(fecha_inicio.toISOString().slice(0,16));
        $("#txt_Fecha_Fin").val(fecha_fin.toISOString().slice(0,16));
    }else{
        $("#dialog_no_fecha_sel").dialog({
            dialogClass: "custom-dialog_no_fecha_sel",
            buttons: {
                "Aceptar": function() {
                    $(this).dialog("close"); // Cierra la ventana emergente
                }
            }
        });
    }
    if(trimestres){
        var tris = JSON.parse(trimestres);
        console.log(tris);
        var select = $("#cb_trimestre");
        console.log(select);
        tris.forEach(function(tri) {
          var value = tri.id_tipo_trimestre;
          var text = tri.nombre_trimestre;
          var option = $('<option></option>').val(value).text(text);

          if (tri.id_tipo_trimestre === triactual.id_tipo_trimestre) {
            option.prop('selected', true);
        }
          select.append(option);
        });
    }

    var yearSelect = $("#cb_ano");

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
      yearSelect.append(option);
    }

    $("#btn_Modificar_Trimestre").click(function() {
        $("#cb_ano").prop('disabled', false);
        $("#cb_trimestre").prop('disabled', false);
        $("#btn_Modificar_Trimestre").prop('disabled', true);        
        $("#btn_Guardar").prop('disabled', false);
        $("#btn_Cancelar").prop('disabled', false);
    });

    $("#btn_Modificar_Fecha").click(function() {
        $("#txt_Fecha_Inicio").prop('disabled', false);
        $("#txt_Fecha_Fin").prop('disabled', false);
        $("#btn_Modificar_Fecha").prop('disabled', true);        
        $("#btn_Guardar_Fecha").prop('disabled', false);
        $("#btn_Cancelar_Fecha").prop('disabled', false);
    });

    $("#btn_Cancelar_Fecha").click(function() {
        $("#txt_Fecha_Inicio").prop('disabled', true);
        $("#txt_Fecha_Fin").prop('disabled', true);
        $("#btn_Modificar_Fecha").prop('disabled', false);        
        $("#btn_Guardar_Fecha").prop('disabled', true);
        $("#btn_Cancelar_Fecha").prop('disabled', true);
    });

    $("#btn_Guardar").click(function() {
        console.log("klkkkkk");
        $("#dialog_confirmar").dialog({
                dialogClass: "custom-dialog",
                buttons: {
                  "Aceptar": function() {
                    $(this).dialog("close"); // Cierra la ventana emergente
                    $.ajax({
                        url: "/modificar_trimestre",
                        type: "GET",
                        data: {
                            trimestre: $("#cb_trimestre").val(),
                            ano: $("#cb_ano").val()
                        },
                        success: function(response) {
                            // Aquí puedes procesar la respuesta del servidor
                            console.log(response);
                
                            // Por ejemplo, podrías mostrar la respuesta en una ventana emergente
                            $("#dialog_modificado_trimestre").dialog({
                                dialogClass: "custom-dialog_trimestre_cambiado",
                                buttons: {
                                    "Aceptar": function() {
                                        $(this).dialog("close"); // Cierra la ventana emergente
                                        window.location.href='/nav_admin?id=5';
                                    }
                                }
                            });
                            $("#cb_ano").prop('disabled', true);
                            $("#cb_trimestre").prop('disabled', true);
                            $("#btn_Modificar_Trimestre").prop('disabled', false);        
                            $("#btn_Guardar").prop('disabled', true);
                            $("#btn_Cancelar").prop('disabled', true);
                        },
                        error: function(error) {
                            $("#dialog_no_modificado_trimestre").dialog({
                                dialogClass: "custom-dialog_trimestre_cambiado",
                                buttons: {
                                    "Aceptar": function() {
                                        $(this).dialog("close"); // Cierra la ventana emergente
                                    }
                                }
                            });
                            // Si hay un error en la solicitud, puedes manejarlo aquí
                            console.log(error);
                        }
                    });
                  },
                  "Cancelar": function() {
                    $(this).dialog("close"); // Cierra la ventana emergente
                  }
                }
            });
    });

    $("#btn_Guardar_Fecha").click(function() {
        console.log("klkkkkk");
        $("#dialog_confirmar_seleccion").dialog({
                dialogClass: "custom-dialog",
                buttons: {
                  "Aceptar": function() {
                    $(this).dialog("close"); // Cierra la ventana emergente
                    $.ajax({
                        url: "/modificar_fecha_sel",
                        type: "GET",
                        data: {
                            fecha_inicio: $("#txt_Fecha_Inicio").val(),
                            fecha_fin: $("#txt_Fecha_Fin").val()
                        },
                        success: function(response) {
                            // Aquí puedes procesar la respuesta del servidor
                            console.log(response);
                
                            // Por ejemplo, podrías mostrar la respuesta en una ventana emergente
                            $("#dialog_sel_modificada").dialog({
                                dialogClass: "custom-dialog_trimestre_cambiado",
                                buttons: {
                                    "Aceptar": function() {
                                        $(this).dialog("close"); // Cierra la ventana emergente
                                        window.location.href='/nav_admin?id=5';
                                    }
                                }
                            });
                            $("#txt_Fecha_Inicio").prop('disabled', true);
                            $("#txt_Fecha_Fin").prop('disabled', true);
                            $("#btn_Modificar_Fecha").prop('disabled', false);        
                            $("#btn_Guardar_Fecha").prop('disabled', true);
                            $("#btn_Cancelar_Fecha").prop('disabled', true);
                        },
                        error: function(error) {
                            $("#dialog_no_modificado_sel").dialog({
                                dialogClass: "custom-dialog_trimestre_cambiado",
                                buttons: {
                                    "Aceptar": function() {
                                        $(this).dialog("close"); // Cierra la ventana emergente
                                    }
                                }
                            });
                            // Si hay un error en la solicitud, puedes manejarlo aquí
                            console.log(error);
                        }
                    });
                  },
                  "Cancelar": function() {
                    $(this).dialog("close"); // Cierra la ventana emergente
                  }
                }
            });
        });
    $("#btn_Cancelar").click(function() {
        $("#cb_ano").prop('disabled', true);
        $("#cb_trimestre").prop('disabled', true);
        $("#btn_Modificar_Trimestre").prop('disabled', false);        
        $("#btn_Guardar").prop('disabled', true);
        $("#btn_Cancelar").prop('disabled', true);
        window.location.href='/nav_admin?id=5';
    });
    
    $("#btn_Calcular_Indice").click(function() {
        $("#dialog_conf_calc_indice").dialog({
            dialogClass: "custom-dialog",
            buttons: {
              "Aceptar": function() {
                $.ajax({
                    url: "/calcular_indices_sistema",
                    type: "GET",
                    dataType: "json",
                    success: function(response) {
                        // Aquí puedes procesar la respuesta del servidor
                        console.log(response);
            
                        // Por ejemplo, podrías mostrar la respuesta en una ventana emergente
                        $("#dialog_indices_calculados").dialog({
                            dialogClass: "custom-dialog_trimestre_cambiado",
                            buttons: {
                                "Aceptar": function() {
                                    $(this).dialog("close"); // Cierra la ventana emergente
                                }
                            }
                        });
                    },
                    error: function(error) {
                        $("#dialog_no_modificado_sel").dialog({
                            dialogClass: "custom-dialog_trimestre_cambiado",
                            buttons: {
                                "Aceptar": function() {
                                    $(this).dialog("close"); // Cierra la ventana emergente
                                }
                            }
                        });
                        // Si hay un error en la solicitud, puedes manejarlo aquí
                        console.log(error);
                    }
                });
                $(this).dialog("close"); // Cierra la ventana emergente
              },
              "Cancelar": function() {
                $(this).dialog("close"); // Cierra la ventana emergente
              }
            }
        });
    });
});