var loggedIn = false;

$(function() {

    if ($('body').attr("user")) {
        loggedIn = true;
    }

    $( ".loginInput" ).keypress(function(e) {
        if(e.which == 13) {
            $( '#loginButton' ).click();
        }
    });

    $( '#signupButton' ).on('click', function () {
        if ($("#usernameSignup").val()) {
            $.post( "signup.php", { name: $("#usernameSignup").val(), password: $("#passwordSignup").val() })
            .done(function( data ) {
                $( '#feedback' ).empty().append(data);
                $( '#usernameSignup').val('');
                $( '#passwordSignup').val('');
            });
        }
    });

    $( '#loginButton' ).on('click', function () {
        $.post( "login.php", { name: $("#usernameLogin").val(), password: $("#passwordLogin").val() })
        .done(function( data ) {
            console.log(data);
            data = $.parseJSON(data);
            if(data['success']) {
                $( '#feedback' ).empty().append(data['success']);
                // reload
                location.reload();
            }
            else {
                $( '#feedback' ).empty().append(data['error']);
            }
        });
    });

    $( '#logoutButton' ).on('click', function () {
        $.post( "logout.php", {})
        .done(function() {
            location.reload();
        });
    });

});
