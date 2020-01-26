
var dataPoints = new Object();
var options =  new Object();

function loadStatistics() {
    $( '#statisticsBox' ).empty();

    attributes.forEach(function(attrId) {
        dataPoints[attrId] = [];
        options[attrId] =  {
        	animationEnabled: true,
        	theme: "light2",
        	axisX: {
        		valueFormatString: "DD MMM YYYY",
        	},
        	axisY: {
        		includeZero: false
        	},
        	data: [{
        		type: "spline",
        		yValueFormatString: "#,###.##",
        		dataPoints: dataPoints[attrId]
        	}]
        };
        $.post( "loadStatistics.php", { attrId: attrId })
        .done(function( data ) {
            console.log(data);
            data = $.parseJSON(data);

            $( '#statisticsBox' ).append("<div id=\"statisticsBox-" + attrId + "\" class=\"col- col-md-auto myhoverable mx-4 my-3 attributeCard\">\
            <div class=\"boxTitle\">" + attributeNames[attrId] + "</div>"
            + "<div id=\"statisticsChart-" + attrId + "\" style=\"height: 370px; width: 100%;\"></div>"
            + "</div>");

            var loggedToday = false;
            $.each( data, function( key, value ) {
                dataPoints[attrId].push({
        			x: new Date(value.day),
        			y: value.value
        		});
                if (new Date(value.day).setHours(0,0,0,0) == new Date().setHours(0,0,0,0)) {
                    loggedToday = true;
                }
            });

            if (!loggedToday) {
                $( "#statisticsBox-" + attrId ).css("border","solid 1px red");
            }

            $("#statisticsChart-" + attrId).CanvasJSChart(options[attrId]);
        });
    });
}
