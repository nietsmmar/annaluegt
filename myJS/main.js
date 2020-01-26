var attributes = new Array();
var attributeNames = new Array();

var dataPoints = new Object();
var options =  new Object();

$(function() {
    //init
    if (loggedIn) {
        loadAttributes();
        loadCategoryFormats();
    }

    var zeroToTen = "<input class=\"attrSlider attrInput\" type=\"text\" data-slider-min=\"0\" data-slider-max=\"10\" data-slider-step=\"1\" data-slider-value=\"10\"/>";
    var anyNumber = "<input class=\"attrInput\" type=\"number\" value=\"0\" min=\"0\"/>";
    var zeroTo23 = "<input class=\"attrSlider attrInput\" type=\"text\" data-slider-min=\"0\" data-slider-max=\"23\" data-slider-step=\"1\" data-slider-value=\"10\"/>";

    $( '#saveNewCategory' ).on('click', function () {
        $.post( "addNewCategory.php", { name: $('#newCategoryName').val(), description: $('#newCategoryDescription').val(), format: $('#newCategoryFormat').val()})
        .done(function( data ) {
            console.log(data);
            loadAttributes();
            $('#newCategory').modal('hide');
        });
    });

    function updateElements() {
        $('.attrSlider').slider();
        $('.boxDatepicker').datepicker({
                    inline: true,
                    todayHighlight: true,
                    todayBtn: "linked",
                    dateFormat: 'yy-mm-dd'
                });

        initializeLogButtons();
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

            var attrBox = $(this).parent();
            attrBox.css('opacity', '0.3');

            $.post( "log.php", { attrId: id, value: value, date: date })
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

                attrBox.animate({opacity: 1}, 1000);

            });
        });
    }

    function loadAttributes() {
        attributes = [];
        attributeNames = [];
        $( '#attributesBox' ).empty();
        $.post( "loadAttributes.php", { })
        .done(function( data ) {
            console.log(data);
            data = $.parseJSON(data);
            $.each( data, function( key, value ) {
                attributes.push(value.id);
                attributeNames[value.id] = value.name;
                var inputElement = anyNumber;
                if (value.format == 2) {
                    inputElement = zeroToTen;
                }
                else if (value.format == 3) {
                    inputElement = zeroTo23;
                }
                $( '#attributesBox' ).append("<div class=\"col- col-md-auto myhoverable mx-4 my-3 attributeCard\">\
                <div class=\"boxTitle\">" + value.name + "</div>"
                + "<div class=\"boxDescription\">" + value.description + "</div>"
                + "<div class=\"boxInput\">" + inputElement + "</div>"
                + "<div id=\"boxDatepicker-" + value.id + "\" class='boxDatepicker'></div>"
                + "<input class=\"logButton\" type=\"button\" value=\"Log\"  attrId=\"" + value.id + "\">"
                + "</div>");
            });
            updateElements();
            if ($('body').attr("statistics")) {
                loadStatistics();
            }
        });
    }

});
