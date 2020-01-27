
var dataPoints = new Object();
var options =  new Object();

function loadStatistics() {
    $( '#statisticsBox' ).empty();

    attributes.forEach(function(attribute) {
        var attrId = attribute.id;
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
        		type: "line",
        		yValueFormatString: "#,###.##",
        		dataPoints: dataPoints[attrId]
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
                    indexLabel: value.activity
        		});
            });

            if (!attribute.today) {
                $( "#statisticsBox-" + attrId ).css("border","solid 1px red");
            }

            $("#statisticsChart-" + attrId).CanvasJSChart(options[attrId]);
        });
    });
}
