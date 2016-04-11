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
                }
            });
        }
    });
}

function updateControlInfo() {
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
        "VoltageOut1" : Number(hv1Slider.slider('getValue').toFixed(1)),
        "VoltageOut2" : Number(hv2Slider.slider('getValue').toFixed(1)),
        "VoltageOut3" : Number(hv3Slider.slider('getValue').toFixed(1))
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

            if (Math.abs(obj["kickerVoltage1"] - hv1Slider.slider('getValue')) > Math.abs(0.1*hv1Slider.slider('getValue'))) {
                $("#kickerVoltage1").removeClass("label-success");
                $("#kickerVoltage1").addClass("label-danger");
            }
            else {
                $("#kickerVoltage1").removeClass("label-danger");
                $("#kickerVoltage1").addClass("label-success");
            }

            if (Math.abs(obj["kickerVoltage2"] - hv2Slider.slider('getValue')) > Math.abs(0.1*hv2Slider.slider('getValue'))) {
                $("#kickerVoltage2").removeClass("label-success");
                $("#kickerVoltage2").addClass("label-danger");
            }
            else {
                $("#kickerVoltage2").removeClass("label-danger");
                $("#kickerVoltage2").addClass("label-success");
            }
            if (Math.abs(obj["kickerVoltage3"] - hv3Slider.slider('getValue')) > Math.abs(0.1*hv3Slider.slider('getValue'))) {
                $("#kickerVoltage3").removeClass("label-success");
                $("#kickerVoltage3").addClass("label-danger");
            }
            else {
                $("#kickerVoltage3").removeClass("label-danger");
                $("#kickerVoltage3").addClass("label-success");
            }

            $("#kickerVoltage1").html(obj["kickerVoltage1"].toFixed(1) + " V");
            $("#kickerVoltage2").html(obj["kickerVoltage2"].toFixed(1) + " V");
            $("#kickerVoltage3").html(obj["kickerVoltage3"].toFixed(1) + " V");

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


            // chartdata2 = {
            //     labels: labels,
            //     datasets: [
            //         {
            //             label: "data1",
            //             fillColor: "rgba(220,220,220,0.2)",
            //             strokeColor: "rgba(220,220,220,1)",
            //             pointColor: "rgba(220,220,220,1)",
            //             pointStrokeColor: "#fff",
            //             pointHighlightFill: "#fff",
            //             pointHighlightStroke: "rgba(220,220,220,1)",
            //             data: dataHeaterCurrent1
            //         },
            //         {
            //             label: "data2",
            //             fillColor: "rgba(151,187,205,0.2)",
            //             strokeColor: "rgba(151,187,205,1)",
            //             pointColor: "rgba(151,187,205,1)",
            //             pointStrokeColor: "#fff",
            //             pointHighlightFill: "#fff",
            //             pointHighlightStroke: "rgba(151,187,205,1)",
            //             data: dataHeaterVoltage1
            //         }
            //     ]
            // };

            // var ctx = $("#myChart").get(0).getContext("2d");
            // myLineChart = new Chart(ctx).Line(chartdata2, {
            //     responsive: true,
            //     animation: false,
            //     scaleOverride: true,
            //     scaleStartValue: 0.0,
            //     scaleSteps: 5.0,
            //     scaleStepWidth: 1.0
            // });

            // var ctx2 = $("#myChart2").get(0).getContext("2d");
            // myLineChart2 = new Chart(ctx2).Line(chartdata2, {
            //     responsive: true,
            //     animation: false
            // });
        },
        complete: function(data) {
            setTimeout(updateMonitoringInfo, 1000);
        }
    });
}

$(document).ready(function() {

    function stopTimer() {
        clearInterval(timerManager);
    }

    function startTimer(duration, display) {
        var timer = duration, minutes, seconds;
        timerManager = setInterval(function () {

            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.text("Time to enable: " + minutes + ":" + seconds);

            if (--timer < 0) {
                timer = duration;
                $("#TimerDiv").hide();
                $("#GeneralTriggerStatus").prop("disabled", false);
                stopTimer();
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

    function formatFunc(value) { return 'Current value: ' + value; }

    hv1Slider = $("#HV1CONFIG").slider({ formatter: formatFunc })
    .on("change", function(changeEvt) { $("#HV1CONFIGVALUE").text(changeEvt.value.newValue); });

    hv2Slider = $("#HV2CONFIG").slider({ formatter: formatFunc })
    .on("change", function(changeEvt) { $("#HV2CONFIGVALUE").text(changeEvt.value.newValue); });

    hv3Slider = $("#HV3CONFIG").slider({ formatter: formatFunc })
    .on("change", function(changeEvt) { $("#HV3CONFIGVALUE").text(changeEvt.value.newValue); });

    $("#RackPowerSupplyStatus").click(function() {
        if ($(this).html() == "OFF") {
            $("#TimerDiv").show();
            var tenMinutes = 6*1, display = $("#Timer");
            startTimer(tenMinutes, display);
            $("#HVPowerSupplyStatus").prop("disabled", false);
        }
        else if ($(this).html() == "ON") {
            $("#GeneralTriggerStatus").prop("disabled", true);
            $("#HVPowerSupplyStatus").prop("disabled", true);
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

    setTimeout(initializeCharts, 1000);
    setTimeout(initializeControls, 1000);
    setTimeout(updateControlInfo, 2000);
    setTimeout(updateMonitoringInfo, 3000);

}); // end document ready function

var chartdata = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
        label: "My First dataset",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
        label: "My Second dataset",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};