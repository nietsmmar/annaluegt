var attributes = new Array();
var activities = new Array();
var dataPoints = new Object();
var options =  new Object();

$(function() {
    //init
    if (loggedIn) {
        loadActivities();
        loadCategoryFormats();
    } else {
        $( "#navbar-toggler" ).click();
    }

    var inputElements = new Array();
    inputElements.push("<input class=\"attrInput text-light bg-dark grayBorder\" type=\"number\" value=\"0\" min=\"0\"/>");
    inputElements.push("<input class=\"attrSlider attrInput\" type=\"text\" data-slider-min=\"1\" data-slider-max=\"10\" data-slider-step=\"1\" data-slider-value=\"10\"/>");
    inputElements.push("<input class=\"attrSlider attrInput text-light bg-dark grayBorder\" type=\"text\" data-slider-min=\"0\" data-slider-max=\"23\" data-slider-step=\"1\" data-slider-value=\"9\"/>");
    inputElements.push("<div class=\"onoffswitch\">\
        <input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox attrInput\" id=\"myonoffswitch\" value=\"0\">\
        <label class=\"onoffswitch-label\" for=\"myonoffswitch\">\
            <span class=\"onoffswitch-inner\"></span>\
            <span class=\"onoffswitch-switch\"></span>\
        </label>\
    </div>");

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

    $( '#saveEditCategory' ).on('click', function () {
        alert("test");
        $.post( "editCategory.php", { attrId: $('#editCategory').attr('attrId'), name: $('#editCategoryName').val(), description: $('#editCategoryDescription').val(), format: $('#editCategoryFormat').val()})
        .done(function( data ) {
            console.log(data);
            loadAttributes();
            $('#editCategory').modal('hide');
        });
    });

    $( '#executeRemoveCategory' ).on('click', function () {
        $.post( "removeCategory.php", { attrId: $('#removeCategory').attr('attrId')})
        .done(function( data ) {
            console.log(data);
            loadAttributes();
            $('#removeCategory').modal('hide');
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

        $( '.onoffswitch-label' ).on('click', function () {
            var checkBox = $(this).parent().children().first();
            if (checkBox.val() == '1') {
                checkBox.val('0');
            }
            else {
                checkBox.val('1');
            }
        });

        $( '.editButton' ).on('click', function() {
            var attrId = $(this).parent().parent().attr('attrId');
            $("#editCategory").attr('attrId', attrId);
            $("#editCategoryName").val(attributes[attrId].name);
            $("#editCategoryDescription").val(attributes[attrId].description);
            $("#editCategoryFormat").val(attributes[attrId].format);
        });

        $( '.deleteButton' ).on('click', function() {
            var attrId = $(this).parent().parent().attr('attrId');
            $("#removeCategory").attr('attrId', attrId);
            $("#removeCategoryTitle").html("Remove Category: " + attributes[attrId].name);
        });
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
                $( "#editCategoryFormat" ).append("<option value=\"" + value.id + "\">" + value.description + "</option>");
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
                date = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getDate();
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

                attrBox.css("border","solid 3px darkgreen");
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
                attributes[value.id] = {id: value.id, description: value.description, format: value.format, name: value.name, today: value.today};
                var inputElement = inputElements[value.format-1];

                $( '#attributesBox' ).append("<div id=\"attributeBox-" + value.id + "\" class=\"col- col-md-auto myhoverable mx-4 my-3 attributeCard\" attrId=\"" + value.id + "\">\
                <div class=\"editAttributeBar\"><i class=\"fas fa-edit editButton\" data-toggle=\"modal\" data-target=\"#editCategory\"></i>&nbsp;&nbsp;<i class=\"fas fa-trash-alt deleteButton\" data-toggle=\"modal\" data-target=\"#removeCategory\"></i></div>\
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

                if (value.format == 4) { // give unique id's to toggleswitch
                    $("#attributeBox-" + value.id).find( ".boxInput" ).find(".onoffswitch-checkbox").attr("id","onoffswitch-" + value.id);
                    $("#attributeBox-" + value.id).find( ".boxInput" ).find(".onoffswitch-label").attr("for","onoffswitch-" + value.id);
                }

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
