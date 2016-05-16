function initializeControls() {
    $.ajax({
        url: "/get/controlJSON",
        cache: false,
        type: "GET",
        dataType: "json",
        success: function(initialControlData) {
            jQuery.each(initialControlData, function(i, val) {
                if (val == "ON") {
                    $("#" + i).toggleClass("btn-danger");
                    $("#" + i).toggleClass("btn-success");
                }
                if (val == "External") {
                    $("#" + i).toggleClass("btn-primary");
                    $("#" + i).toggleClass("btn-warning");
                }
                if (val == "ACTIVE") {
                    $("#" + i).toggleClass("btn-danger");
                    $("#" + i).toggleClass("btn-success");
                }
                switch (i) {
                    // General status options first
                    case "RackPowerSupplyStatus":
                        $("#" + i).html(val);
                        if (val == "ON")
                            $("#TimerDiv").hide();
                        else if (val == "OFF") {
                            $("#GeneralTriggerStatus").prop("disabled", true);
                            $("#HVPowerSupplyStatus").prop("disabled", true);
                            $("#TimerDiv").hide();
                        }
                        break;
                    case "TriggerMode":
                    case "HVPowerSupplyStatus":
                    case "OilPumpStatus":
                    case "FlourinetPumpStatus":
                    case "GeneralTriggerStatus":
                    case "Kicker_Status_1":
                    case "Kicker_Status_2":
                    case "Kicker_Status_3":
                        $("#" + i).html(val);
                        break;
                    // Now number configuration options
                    case "CAP1_Time":
                    case "CAP2_Time":
                    case "CAP3_Time":
                    case "CAP1-SCR1_Delay":
                    case "CAP2-SCR2_Delay":
                    case "CAP3-SCR3_Delay":
                    case "SCR1-THYR1_Delay":
                    case "SCR2-THYR2_Delay":
                    case "SCR3-THYR3_Delay":
                    // case "THYR1-THYR2_Delay":
                    // case "THYR2-THYR3_Delay":
                    case "Fill_Spacing_Time":
                    case "Bunch_Spacing_Time":
                    case "Cycle_Spacing_Time":
                        $("#" + i).val(parseInt(val));
                        break;
                    case "VoltageOut1":
                        hv1Slider.slider('setValue', parseFloat(val), true, true);
                        break;
                    case "VoltageOut2":
                        hv2Slider.slider('setValue', parseFloat(val), true, true);
                        break;
                    case "VoltageOut3":
                        hv3Slider.slider('setValue', parseFloat(val), true, true);
                        break;
                    case "Driver_Warmup_Time":
                        $("#" + i).val(parseFloat(val));
                        break;
                }
            });
        }
    });
}

function updateControlInfo() {
    // This number is calibrated according to the measured circuit
    var VoltageOut1 = (hv1Slider.slider('getValue')+0.618307)/3.45386;

    var controlData = {
        "TriggerMode" : $("#TriggerMode").html(),
        "RackPowerSupplyStatus" : $("#RackPowerSupplyStatus").html(),
        "HVPowerSupplyStatus" : $("#HVPowerSupplyStatus").html(),
        "OilPumpStatus" : $("#OilPumpStatus").html(),
        "FlourinetPumpStatus" : $("#FlourinetPumpStatus").html(),
        "GeneralTriggerStatus" : $("#GeneralTriggerStatus").html(),
        "CAP1_Time" : Number($("#CAP1_Time").val()),
        "CAP2_Time" : Number($("#CAP2_Time").val()),
        "CAP3_Time" : Number($("#CAP3_Time").val()),
        "CAP1-SCR1_Delay" : Number($("#CAP1-SCR1_Delay").val()),
        "CAP2-SCR2_Delay" : Number($("#CAP2-SCR2_Delay").val()),
        "CAP3-SCR3_Delay" : Number($("#CAP3-SCR3_Delay").val()),
        "SCR1-THYR1_Delay" : Number($("#SCR1-THYR1_Delay").val()),
        "SCR2-THYR2_Delay" : Number($("#SCR2-THYR2_Delay").val()),
        "SCR3-THYR3_Delay" : Number($("#SCR3-THYR3_Delay").val()),
        // "THYR1-THYR2_Delay" : Number($("#THYR1-THYR2_Delay").val()),
        // "THYR2-THYR3_Delay" : Number($("#THYR2-THYR3_Delay").val()),
        "Fill_Spacing_Time" : Number($("#Fill_Spacing_Time").val()),
        "Bunch_Spacing_Time" : Number($("#Bunch_Spacing_Time").val()),
        "Cycle_Spacing_Time" : Number($("#Cycle_Spacing_Time").val()),
        "VoltageOut1" : (3.2 - VoltageOut1).toFixed(2),
        "VoltageOut2" : (3.2 - hv2Slider.slider('getValue')).toFixed(2),
        "VoltageOut3" : (3.2 - hv3Slider.slider('getValue')).toFixed(2),
        "Kicker_Status_1" : $("#Kicker_Status_1").html(),
        "Kicker_Status_2" : $("#Kicker_Status_2").html(),
        "Kicker_Status_3" : $("#Kicker_Status_3").html(),
        "Driver_Warmup_Time" : Number($("#Driver_Warmup_Time").val())
        };

    $.ajax({
        url: "/post/json",
        type: "POST",
        //cache: false,
        data: JSON.stringify(controlData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        complete: function(data) {
            setTimeout(updateControlInfo, 1000);
        }
    });
}

function initializeCharts() {

    chartdata2 = {
        labels: labels,
        datasets: [
            {
                label: "data1",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: dataHeaterCurrent1
            },
            {
                label: "data2",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: dataHeaterVoltage1
            }
        ]
    };

    var ctx = $("#myChart").get(0).getContext("2d");
    myLineChart = new Chart(ctx).Line(chartdata2, {
        responsive: true,
        animation: false,
        scaleOverride: true,
        scaleStartValue: 0.0,
        scaleSteps: 5.0,
        scaleStepWidth: 1.0
    });

    var ctx2 = $("#myChart2").get(0).getContext("2d");
    myLineChart2 = new Chart(ctx2).Line(chartdata2, {
        responsive: true,
        animation: false
    });

}

function updateMonitoringInfo() {
    $.ajax({
        url: "/get/json",
        type: "GET",
        //cache: false,
        dataType: "json",
        success: function(monitorData) {
            var obj = JSON.parse(monitorData);

            // This calibration comes from measuring the linearity of the circuit
            // Depends on each circuit, needs to be accurate
            var Kicker_Voltage_1 = (obj["Kicker_Voltage_1"] - 0.0435)/0.1779;

            if (Math.abs(obj["Kicker_Voltage_1"] - hv1Slider.slider('getValue')) > Math.abs(0.1*hv1Slider.slider('getValue'))) {
                $("#Kicker_Voltage_1").removeClass("label-success");
                $("#Kicker_Voltage_1").addClass("label-danger");
            }
            else {
                $("#Kicker_Voltage_1").removeClass("label-danger");
                $("#Kicker_Voltage_1").addClass("label-success");
            }

            if (Math.abs(obj["Kicker_Voltage_2"] - hv2Slider.slider('getValue')) > Math.abs(0.1*hv2Slider.slider('getValue'))) {
                $("#Kicker_Voltage_2").removeClass("label-success");
                $("#Kicker_Voltage_2").addClass("label-danger");
            }
            else {
                $("#Kicker_Voltage_2").removeClass("label-danger");
                $("#Kicker_Voltage_2").addClass("label-success");
            }
            if (Math.abs(obj["Kicker_Voltage_3"] - hv3Slider.slider('getValue')) > Math.abs(0.1*hv3Slider.slider('getValue'))) {
                $("#Kicker_Voltage_3").removeClass("label-success");
                $("#Kicker_Voltage_3").addClass("label-danger");
            }
            else {
                $("#Kicker_Voltage_3").removeClass("label-danger");
                $("#Kicker_Voltage_3").addClass("label-success");
            }

            if ($("#Kicker_Status_1").html() == "INACTIVE" || $("#HVPowerSupplyStatus").html() == "OFF") {
                $("#Kicker_Voltage_1").html("OFF");
                $("#Kicker_Voltage_1").removeClass("label-success label-danger");
                $("#Kicker_Voltage_1").addClass("label-default");
            }
            else {
                $("#Kicker_Voltage_1").html(Kicker_Voltage_1.toFixed(1) + " V");
            }

            if ($("#Kicker_Status_1").html() == "INACTIVE") {
                hv1Slider.slider('disable');
                $("#CAP1_Time, #CAP1-SCR1_Delay, #SCR1-THYR1_Delay").prop('disabled', true).css("color", "#C0C0C0");
            }
            else {
                hv1Slider.slider('enable');
                $("#CAP1_Time, #CAP1-SCR1_Delay, #SCR1-THYR1_Delay").prop('disabled', false).css("color", "#000000");
            }

            if ($("#Kicker_Status_2").html() == "INACTIVE" || $("#HVPowerSupplyStatus").html() == "OFF") {
                $("#Kicker_Voltage_2").html("OFF");
                $("#Kicker_Voltage_2").removeClass("label-danger label-success");
                $("#Kicker_Voltage_2").addClass("label-default");
            }
            else {
                $("#Kicker_Voltage_2").html(obj["Kicker_Voltage_2"].toFixed(1) + " V");
            }

            if ($("#Kicker_Status_2").html() == "INACTIVE") {
                hv2Slider.slider('disable');
                $("#CAP2_Time, #CAP2-SCR2_Delay, #SCR2-THYR2_Delay").prop('disabled', true).css("color", "#C0C0C0");
            }
            else {
                hv2Slider.slider('enable');
                $("#CAP2_Time, #CAP2-SCR2_Delay, #SCR2-THYR2_Delay").prop('disabled', false).css("color", "#000000");
            }

            if ($("#Kicker_Status_3").html() == "INACTIVE" || $("#HVPowerSupplyStatus").html() == "OFF") {
                $("#Kicker_Voltage_3").html("OFF");
                $("#Kicker_Voltage_3").removeClass("label-danger label-success");
                $("#Kicker_Voltage_3").addClass("label-default");
            }
            else {
                $("#Kicker_Voltage_3").html(obj["Kicker_Voltage_3"].toFixed(1) + " V");
            }

            if ($("#Kicker_Status_3").html() == "INACTIVE") {
                hv3Slider.slider('disable');
                $("#CAP3_Time, #CAP3-SCR3_Delay, #SCR3-THYR3_Delay").prop('disabled', true).css("color", "#C0C0C0");
            }
            else {
                hv3Slider.slider('enable');
                $("#CAP3_Time, #CAP3-SCR3_Delay, #SCR3-THYR3_Delay").prop('disabled', false).css("color", "#000000");
            }

            // dataHeaterCurrent1.shift();
            // dataHeaterCurrent1.push((obj["heaterCurrent1"]*5.0/1024.0).toFixed(2));
            // dataHeaterVoltage1.shift();
            // dataHeaterVoltage1.push((obj["heaterVoltage1"]*5.0/1024.0).toFixed(2));
            // labels.shift();
            date = new Date();
            // labels.push("");
            datePrint = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
            // labels.push(("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2));
            $("#chart1Label").html(datePrint);
            $("#chart2Label").html(datePrint);

            myLineChart.addData([(obj["heaterCurrent1"]*5.0/1024.0).toFixed(2), (obj["heaterVoltage1"]*5.0/1024.0).toFixed(2)], "");
            myLineChart.removeData();

            myLineChart2.addData([(obj["heaterCurrent1"]*5.0/1024.0).toFixed(2), (obj["heaterVoltage1"]*5.0/1024.0).toFixed(2)], "");
            myLineChart2.removeData();

            $("#NoConnectionDiv").hide();

        },
        error: function(data) {
            $("#NoConnectionDiv").show();
        },
        complete: function(data) {
            setTimeout(updateMonitoringInfo, 1000);
        }
    });
}

$(document).ready(function() {

    function stopTimer(duration, display) {

        if (typeof timerManager != 'undefined')
            clearInterval(timerManager);

        minutes = parseInt(duration / 60, 10);
        seconds = parseInt(duration % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text("Time to enable: " + minutes + ":" + seconds);

        $("#TimerDiv").hide();

    }

    function startTimer(duration, display) {
        var timer = duration * 60, minutes, seconds;
        timerManager = setInterval(function () {

            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.text("Time to enable: " + minutes + ":" + seconds);

            if (--timer < 0) {
                timer = duration * 60;
                stopTimer(duration * 60, display);
                $("#GeneralTriggerStatus").prop("disabled", false);
            }
        }, 1000);
    }

    dataHeaterVoltage1 = [];
    dataHeaterCurrent1 = [];
    labels = [];
    for (i = 0; i < 20; i++) {
        dataHeaterCurrent1.push(0.0);
        dataHeaterVoltage1.push(0.0);
        labels.push("");
    }

    function formatFunc(value) { return 'Current value: ' + value.toFixed(1); }

    hv1Slider = $("#HV1CONFIG").slider({ formatter: formatFunc })
    .on("change", function(changeEvt) { $("#HV1CONFIGVALUE").text(changeEvt.value.newValue.toFixed(1)); });

    hv2Slider = $("#HV2CONFIG").slider({ formatter: formatFunc })
    .on("change", function(changeEvt) { $("#HV2CONFIGVALUE").text(changeEvt.value.newValue.toFixed(1)); });

    hv3Slider = $("#HV3CONFIG").slider({ formatter: formatFunc })
    .on("change", function(changeEvt) { $("#HV3CONFIGVALUE").text(changeEvt.value.newValue.toFixed(1)); });

    $("#RackPowerSupplyStatus").click(function() {
        if ($(this).html() == "OFF") {
            var timerDuration = $("#Driver_Warmup_Time").val(), display = $("#Timer");
            startTimer(timerDuration, display);
            $("#TimerDiv").show();
            $("#HVPowerSupplyStatus").prop("disabled", false);
        }
        else if ($(this).html() == "ON") {
            $("#GeneralTriggerStatus").prop("disabled", true);
            $("#HVPowerSupplyStatus").prop("disabled", true);
            var timerDuration = $("#Driver_Warmup_Time").val(), display = $("#Timer");
            stopTimer(timerDuration * 60, display);
            $("#GeneralTriggerStatus").prop("disabled", true);

            if ($("#GeneralTriggerStatus").html() == "ON")
                $("#GeneralTriggerStatus").trigger("click");
            if ($("#HVPowerSupplyStatus").html() == "ON")
                $("#HVPowerSupplyStatus").trigger("click");
        }
    });

    $("#RackPowerSupplyStatus, #HVPowerSupplyStatus, #OilPumpStatus, #FlourinetPumpStatus, #GeneralTriggerStatus").click(function() {
        $(this).toggleClass("btn-danger");
        $(this).toggleClass("btn-success");
        if ($(this).html() == "ON")
            $(this).html("OFF");
        else
            $(this).html("ON");
    });
    $("#TriggerMode").click(function() {
        $(this).toggleClass("btn-primary");
        $(this).toggleClass("btn-warning");
        if (document.getElementById("TriggerMode").innerHTML == "Internal")
            document.getElementById("TriggerMode").innerHTML = "External";
        else
            document.getElementById("TriggerMode").innerHTML = "Internal";
    });

    $("#Kicker_Status_1, #Kicker_Status_2, #Kicker_Status_3").click(function() {
        $(this).toggleClass("btn-danger");
        $(this).toggleClass("btn-success");
        if ($(this).html() == "ACTIVE")
            $(this).html("INACTIVE");
        else
            $(this).html("ACTIVE");

    });



    setTimeout(initializeCharts, 1000);
    setTimeout(initializeControls, 1000);
    setTimeout(updateControlInfo, 2000);
    setTimeout(updateMonitoringInfo, 3000);

}); // end document ready function