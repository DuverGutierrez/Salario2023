var asigBasMin = 5785839;
var gastRepreMin = 10285919;
var salarioBaseGen = 0;
var subAlimentacion = 68658;
var bonifSeguro = 17311;
var auxMutuo = 5000;
var subFamNE = 37866;
var primaExp = 0;
var primaPer = 0;


$("#btnCalcular").click(() => {
    var aumento = $("#aumento").val();
    var coma = [...aumento].filter(x => x === ',').length;
    var punto = [...aumento].filter(x => x === '.').length;

    if (coma > 0 || punto > 1) {
        Swal.fire({
            icon: 'error',
            title: '¡Error en porcentaje!',
            text: 'Para separar decimales solo debe utilizar un punto "." ',
        })
        return false;
    }

    let salarioBaseGen = parseFloat(((asigBasMin + gastRepreMin) * 0.45).toFixed(2));

    salarioBaseGen += (salarioBaseGen * $("#aumento").val() / 100);

    let asigBasic = salarioBaseGen * parseFloat($("#selecGrado").val())/100;
    let primaOP = asigBasic * $("#selecOrdPub").val() / 100;
    let primaNE = asigBasic * 0.20;
    let SubFam = 0;
    let titleSubFam = "Subsidio familiar";
    let primaExp = CalculoExp(asigBasic);
    let distincion = 0;

    if ($("#selecAsisFam").val() != 0 && $("#selecSubFam").val() != 0) {
        Swal.fire({
            icon: 'error',
            title: '¡Opciones incompatibles!',
            text: 'Solo puede seleccionar una opción entre "Bonificación de asistencia familiar" y "Subsidio familiar"',
        })
        return false;
    }
    else if ($("#selecAsisFam").val() != 0) {
        SubFam = asigBasic * $("#selecAsisFam").val() / 100;
        titleSubFam = "Bonificación Asistencia familiar";
    }
    else if ($("#selecSubFam").val() != 0){
        SubFam = subFamNE * $("#selecSubFam").val();
    }

    $("#tablaDevengos tbody").empty();
    $("#tablaDescuentos tbody").empty();
    $("#tablaTotal tbody").empty();

    $("#tablaDevengos tbody").append(
        `<tr><td>Asignación básica</td><td style="text-align: right" id="asigBasic">${ConvertirEnString(asigBasic)}</td></tr>
         <tr><td>Subsidio alimentación (valor 2022)</td><td style="text-align: right" id="subAlim">${ConvertirEnString(subAlimentacion)}</td></tr>
         <tr><td>Bonificación seguro de vida (valor 2022)</td><td style="text-align: right" id="bonSegVida">${ConvertirEnString(bonifSeguro)}</td></tr>
         <tr><td>Prima nivel ejecutivo</td><td style="text-align: right" id="primaNE">${ConvertirEnString(primaNE)}</td></tr>`
    );

    if (primaOP > 0) {

        $("#tablaDevengos tbody").append(
            `<tr><td>Prima orden público</td><td style="text-align: right" id="primaExp">${ConvertirEnString(primaOP)}</td></tr>`
        );
    }

    if (primaExp > 0) {

        $("#tablaDevengos tbody").append(
            `<tr><td>Prima retorno a la experiencia</td><td style="text-align: right" id="primaExp">${ConvertirEnString(primaExp)}</td></tr>`
        );
    }

    if (SubFam > 0) {
        
        $("#tablaDevengos tbody").append(
            `<tr><td id="tituloSubFam">${titleSubFam}</td><td style="text-align: right" id="SubFam">${ConvertirEnString(SubFam)}</td></tr>`
        );
    }

    if ($("#selecGrado").val() == 25.3733 && $("#distincion").val() != 0) {
        distincion = asigBasic * $("#distincion").val() / 100;
        $("#tablaDevengos tbody").append(
            `<tr><td>Distinción patrulleros</td><td style="text-align: right" id="primaExp">${ConvertirEnString(distincion)}</td></tr>`
        );
    }

    if ($("#distincion").val() != 0) {
        distincion = asigBasic * $("#distincion").val() / 100;
        $("#tablaDevengos tbody").append(
            `<tr><td>Bonificación de permanencia</td><td style="text-align: right" id="primaExp">${ConvertirEnString(distincion)}</td></tr>`
        );
    }

    if ($("#selecPrimaPer").val() != 0 && $("#selecGrado").val() != 25.3733) {
        primaPer = CalculoPer(asigBasic);
        $("#tablaDevengos tbody").append(
            `<tr><td>Bonificación de permanencia</td><td style="text-align: right" id="primaPer">${ConvertirEnString(primaPer)}</td></tr>`
        );
    }

    let sanidad = asigBasic * 4 / 100;
    let casur = asigBasic * 6 / 100;
    let cajaHonor = asigBasic * $("#selecCajaHonor").val() / 100;

    $("#tablaDescuentos tbody").append(
        `<tr><td>Auxilio mutuo (valor promedio)</td><td style="text-align: right" id="auxDibie">${ConvertirEnString(auxMutuo)}</td></tr>
         <tr><td>Bonificación seguro de vida (valor 2022)</td><td style="text-align: right" id="seguro">${ConvertirEnString(bonifSeguro)}</td></tr>
         <tr><td>Sanidad</td><td style="text-align: right" id="sanidad">${ConvertirEnString(sanidad)}</td></tr>
         <tr><td>Cotización caja sueldos retiro</td><td style="text-align: right" id="casur">${ConvertirEnString(casur)}</td></tr>`
    );

    if (cajaHonor > 0) {
        $("#tablaDescuentos tbody").append(
            `<tr><td>Ahorro obligatorio CAPROVIMPO</td><td style="text-align: right" id="cajaHonor">${ConvertirEnString(cajaHonor)}</td></tr>`
        );
    }

    let devengado = asigBasic + primaOP + primaNE + SubFam + primaExp + distincion;
    let descuentos = sanidad + casur + cajaHonor + auxMutuo + bonifSeguro;
    let total = devengado - descuentos;

    $("#tablaTotal tbody").append(
        `<tr><td>Total devengado</td><td style="text-align: right" id="totalDeveng">${ConvertirEnString(devengado)}</td></tr>
        <tr><td>Total descuentos</td><td style="text-align: right" id="totalDesc">${ConvertirEnString(descuentos)}</td></tr>
        <tr><td style="font-weight: 700">Total a pagar</td><td style="text-align: right; font-weight: 700" id="totalNeto">${ConvertirEnString(total)}</td></tr>`
    );
    $("#contenedorDatos").hide(500);
    $("#contenedorSalario").show(500);
});

function GuardarMensaje() {
    let DatosPorEnviar = {
        'id': $("#id").val(),
        'messagetext': $("#messagetext").val(),
    }
    $.ajax({
        type: "POST",
        url: "https://gfc8f6952f1e582-car.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/message/message",
        dataType: "application/json",
        data: JSON.stringify(DatosPorEnviar),

        success: function (response) {
            alert("El Mensaje Ha sido agregado con Exito");
            TraerDatosMensaje();
            pintarDatos("Error de petición");

        },
        error: function (response, xrh) {
            alert("Error en ejecución");

        }
    });
}

function ConvertirEnFloat(valor) {//Recibe numero string con signo pesos y devuelve float para operarlo
    valor = parseFloat(valor.replace("$ ", "").replace(/\./g, '').replace(',', '.'));
    return valor;
}

function ConvertirEnString(valor) {// recibe numero float y lo devuelve en formato con puntos y comas y el signo $

    if (valor - Math.trunc(valor) > 0)
        valor = valor.toFixed(2);

    valor = "$ " + parseFloat(valor).toLocaleString('es-CO');
    return valor;
}

function CalculoExp(asigBasic) {
    
    if ($("#selecGrado").val() == 52.7816) {
        if ($("#selectExp").val() > 23) {
            primaExp = asigBasic * 12 / 100;
        } else {
            primaExp = asigBasic * ($("#selectExp").val() * 0.5) / 100;
        }
    }
    else if ($("#selecGrado").val() == 44.8164) {
        if ($("#selectExp").val() > 18) {
            primaExp = asigBasic * 9.5 / 100;
        } else {
            primaExp = asigBasic * ($("#selectExp").val() * 0.5) / 100;
        }
    }
    else if ($("#selecGrado").val() == 42.6660) {
        primaExp = asigBasic * 7 / 100;
    }
    else if ($("#selecGrado").val() == 40.5007) {
        if ($("#selectExp").val() > 7) {
            primaExp = asigBasic * 7 / 100;
        } else {
            primaExp = asigBasic * $("#selectExp").val() / 100;
        }
    }
    else if ($("#selecGrado").val() == 31.8202) {
        if ($("#selectExp").val() > 7) {
            primaExp = asigBasic * 7 / 100;
        } else {
            primaExp = asigBasic * $("#selectExp").val() / 100;
        }
    }
    else if ($("#selecGrado").val() == 25.3733 && $("#selectExp").val() > 4) {
        primaExp = asigBasic * $("#selectExp").val() / 100;
    }
    else {
        primaExp = 0;
    }

    return primaExp;
}

function CalculoPer(asigBasic) {

    if ($("#selecGrado").val() == 52.7816) {
        primaPer = asigBasic * 10 / 100;
    }
    else if ($("#selecGrado").val() == 44.8164) {
        primaPer = asigBasic * 25 / 100;
    }
    else if ($("#selecGrado").val() == 42.6660) {
        primaExp = asigBasic * 30 / 100;
    }
    else if ($("#selecGrado").val() == 40.5007) {
        primaPer = asigBasic * 35 / 100;
    }
    else if ($("#selecGrado").val() == 31.8202) {
        primaPer = asigBasic * 40 / 100;
    }
    else {
        primaPer = 0;
    }

    return primaPer;
}

$("#selecGrado").change(() => {
    if ($("#selecGrado").val() == 25.3733) {
        $("#mostrarSelecDistincion").css("display", "block");
        $("#mostrarSelecPrimaPer").css("display", "none");
    }
    else {
        $("#mostrarSelecDistincion").css("display", "none");
        $("#mostrarSelecPrimaPer").css("display", "block");
    }
});

$("#btnRegresar").click(() => {
    $("#contenedorDatos").show(500);
    $("#contenedorSalario").hide(500);
});

