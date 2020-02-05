
var dataPoints = new Object();
var options =  new Object();

function setActivities() {
    var options = "<option value=\"-1\" selected>Not linked to any activity</option>";
    activities.forEach(function(activity) {
        options = options + "<option value=\"" + activity.id + "\">" + activity.name + "</option>";
    });

    $('#saveEditLogActivity').html(options);
}


$( '#saveEditLog' ).on('click', function () {
    var format = $('#editLog').attr('format');
    var value;
    if (format == 1) {
        value = $('#editLogInput').children().eq(0).val();
    } else if (format == 2 || format == 3) {  // needed beacause .find('attrInput') somehow not working here
        value = $('#editLogInput').children().eq(1).val();
    } else if (format == 4) {
        value = $('#editLogInput').children().eq(0).children().eq(0).val();
    }
    var logId = $('#editLog').attr('logId');
    var date = $( "#editLogDatepicker").data('datepicker').getFormattedDate('yyyy-mm-dd');
    if (date == null || date == undefined || date == '') {
        date = new Date();
        date = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getDate();
    }
    var activityId = $('#saveEditLogActivity').val();
    $.post( "editLog.php", { id: logId, value: value, date: date, activityId: activityId})
    .done(function( data ) {
        console.log(data);
        loadStatistics();
        $('#editLog').modal('hide');
    });
});

function editLog(e) {
    var datapoint = e['dataPoint'];
    var logId = datapoint['logId'];
    var format = datapoint['format'];
    var activityId = datapoint['activityId'];
    var value = datapoint.y;
    var day = datapoint.x;
    var inputElement = inputElements[format-1];

    $('#editLog').attr("logId", logId);
    $('#editLog').attr("format", format);

    if (activityId != -1) {
        $('#saveEditLogActivity').val(activityId);
    }
    else {
        $('#saveEditLogActivity').val(-1);
    }

    $('#editLogInput').html(inputElement);

    if (format == 1) {  // needed beacause .find('attrInput') somehow not working here
        $('#editLogInput').children().eq(0).val(value);
    } else if (format == 2 || format == 3) {
        $('#editLogInput').children().eq(0).attr('data-slider-value', value);
    } else if (format == 4) {
        if (value == 1) {
            $('#toggleSwitch').click();
            $('#toggleSwitch').val('1');
        }
    }

    updateElements();
    $("#editLogDatepicker").show();
    $("#editLogDatepicker").datepicker('update', day);

    $('#editLog').modal('show');
}

function loadStatistics() {
    $( '#statisticsBox' ).empty();

    attributes.forEach(function(attribute) {
        var attrId = attribute.id;
        dataPoints[attrId] = [];
        options[attrId] =  {
        	animationEnabled: true,
        	theme: "dark1",
        	axisX: {
        		valueFormatString: "DD MMM YYYY",
        	},
        	axisY: {
        		includeZero: false
        	},
        	data: [{
        		type: "line",
        		yValueFormatString: "#,###.##",
        		dataPoints: dataPoints[attrId],
                click: editLog
        	}]
        };
        $.post( "loadStatistics.php", { attrId: attrId })
        .done(function( data ) {
            console.log(data);
            data = $.parseJSON(data);

            $( '#statisticsBox' ).append("<div id=\"statisticsBox-" + attrId + "\" class=\"col- col-md-auto myhoverable mx-4 my-3 attributeCard\">\
            <div class=\"boxTitle\">" + attribute.name + "</div>"
            + "<div id=\"statisticsChart-" + attrId + "\" style=\"height: 370px; width: 100%;\"></div>"
            + "</div>");

            $.each( data, function( key, value ) {
                dataPoints[attrId].push({
        			x: new Date(value.day),
        			y: value.value,
                    indexLabel: value.activity,
                    logId: value.id,
                    format: attribute.format,
                    activityId: value.activityId
        		});
            });

            if (!attribute.today) {
                $( "#statisticsBox-" + attrId ).css("border","solid 3px darkred");
            }

            $("#statisticsChart-" + attrId).CanvasJSChart(options[attrId]);
        });
    });

    setActivities();
}
