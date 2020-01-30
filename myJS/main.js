var attributes = new Array();

var dataPoints = new Object();
var options =  new Object();

var activities = new Array();

$(function() {
    //init
    if (loggedIn) {
        loadActivities();
        loadCategoryFormats();
    }

    var zeroToTen = "<input class=\"attrSlider attrInput\" type=\"text\" data-slider-min=\"0\" data-slider-max=\"10\" data-slider-step=\"1\" data-slider-value=\"10\"/>";
    var anyNumber = "<input class=\"attrInput text-light bg-dark grayBorder\" type=\"number\" value=\"0\" min=\"0\"/>";
    var zeroTo23 = "<input class=\"attrSlider attrInput text-light bg-dark grayBorder\" type=\"text\" data-slider-min=\"0\" data-slider-max=\"23\" data-slider-step=\"1\" data-slider-value=\"10\"/>";

    $( '#saveNewCategory' ).on('click', function () {
        $.post( "addNewCategory.php", { name: $('#newCategoryName').val(), description: $('#newCategoryDescription').val(), format: $('#newCategoryFormat').val()})
        .done(function( data ) {
            console.log(data);
            $('#newCategoryName').val('');
            $('#newCategoryDescription').val('');
            loadAttributes();
            $('#newCategory').modal('hide');
        });
    });

    $( '#saveNewActivity' ).on('click', function () {
        $.post( "addNewActivity.php", { name: $('#newActivityName').val()})
        .done(function( data ) {
            console.log(data);
            $('#newActivityName').val('');
            loadActivities();
            $('#newActivity').modal('hide');
        });
    });

    function updateElements() {
        $('.attrSlider').slider();
        $('.boxDatepicker').datepicker({
                    inline: true,
                    todayHighlight: true,
                    dateFormat: 'yy-mm-dd'
                });

        initializeLogButtons();
        initializeNotTodayButtons();
    }

    function initializeNotTodayButtons() {
        $( '.nottodayButton' ).on('click', function () {
            var attrId = $(this).attr("attrId");
            $(this).hide();
            $("#boxDatepicker-" + attrId).show();
        });
    }

    function loadCategoryFormats() {
        $.post( "loadCategoryFormats.php", { })
        .done(function( data ) {
            console.log(data);
            data = $.parseJSON(data);
            $.each( data, function( key, value ) {
                $( "#newCategoryFormat" ).append("<option value=\"" + value.id + "\">" + value.description + "</option>");
            });
        });
    }

    function initializeLogButtons() {
        $( '.logButton' ).on('click', function () {
            var id = $(this).attr('attrId');
            var value = $(this).parent().find('.attrInput').val();
            var date = $( "#boxDatepicker-" + id).data('datepicker').getFormattedDate('yyyy-mm-dd');
            if (date == null || date == undefined || date == '') {
                date = new Date();
                date = date.getFullYear() + "-" + date.getMonth()+1 + "-" + date.getDate();
            }
            var activity = $("#attributeActivity-" + id).val();

            var attrBox = $(this).parent();
            attrBox.css('opacity', '0.3');

            $.post( "log.php", { attrId: id, value: value, date: date, activity: activity })
            .done(function( data ) {
                console.log(data);

                $(this).parent().find('.attrInput').val('0');
                $( "#boxDatepicker-" + id).datepicker("clearDates");

                if ($('#logAlert').is(":hidden")) {
                    $('#logAlert').fadeIn();
                    setTimeout(function(){
                       $('#logAlert').fadeOut();
                    }, 5000);
                }

                attrBox.css("border","solid 1px green");
                attrBox.animate({opacity: 1}, 1000);

            });
        });
    }

    function loadAttributes() {
        var options = "";
        activities.forEach(function(activity) {
            options = options + "<option value=\"" + activity.id + "\">" + activity.name + "</option>";
        });
        console.log(options);

        attributes = [];
        $( '#attributesBox' ).empty();
        $.post( "loadAttributes.php", { })
        .done(function( data ) {
            console.log(data);
            data = $.parseJSON(data);
            $.each( data, function( key, value ) {
                attributes.push({id: value.id, name: value.name, today: value.today});
                var inputElement = anyNumber;
                if (value.format == 2) {
                    inputElement = zeroToTen;
                }
                else if (value.format == 3) {
                    inputElement = zeroTo23;
                }
                $( '#attributesBox' ).append("<div id=\"attributeBox-" + value.id + "\" class=\"col- col-md-auto myhoverable mx-4 my-3 attributeCard\">\
                <div class=\"boxTitle\">" + value.name + "</div>"
                + "<div class=\"boxDescription\">" + value.description + "</div>"
                + "<div class=\"boxInput\">" + inputElement + "</div>"
                + "<div id=\"boxDatepicker-" + value.id + "\" class='boxDatepicker'></div>"
                + "<input class=\"nottodayButton btn btn-dark\" attrId=\"" + value.id + "\" type=\"button\" value=\"Not today?\">"
                + "<select class=\"form-control text-light bg-dark grayBorder\" id=\"attributeActivity-" + value.id + "\">"
                + "<option value=\"-1\" selected>Not linked to any activity</option>"
                + options
                + "</select>"
                + "<input class=\"logButton btn btn-dark\" type=\"button\" value=\"Log\"  attrId=\"" + value.id + "\">"
                + "</div>");

                if (!value.today) {
                    $( "#attributeBox-" + value.id ).css("border","solid 3px darkred");
                }
            });
            updateElements();
            if ($('body').attr("statistics")) {
                loadStatistics();
            }
        });
    }

    function loadActivities() {
        activities = [];
        $.post( "loadActivities.php", { })
        .done(function( data ) {
            console.log(data);
            data = $.parseJSON(data);
            $.each( data, function( key, value ) {
                activities.push(value);
            });
            loadAttributes();
        });
    }

});
