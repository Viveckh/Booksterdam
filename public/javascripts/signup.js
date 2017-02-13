// Client Side Javascript associated with the sign up page

$(document).ready(function() {
    
    // Set signup form validation rules using the Jquery validation plugin
    $('#signup').validate({
        rules: {
            userEmail: "required",
            userPassword: "required",
            userConfirmPassword: "required",
            userFname: "required",
            userLname: "required",
            userSchool: "required",
            userPhone: "required",
            agreeToTerms: "required"
        },
        messages: {
            userEmail: "Oops! A valid email is required.",
            userPassword: "Need that password, brah!",
            userConfirmPassword: "Woah, password mismatch.",
            userFname: "Please enter your first name.",
            userLname: "Please enter your last name.",
            userSchool: "We really need to know your school.",
            userPhone: "Do you mind if I asked for yo numbah?",
            agreeToTerms: "Required "
        },
        submitHandler: function(form) {
            $.ajax({
                type: 'POST',
                url: '/register',
                data: $(form).serialize()
            })
                .done(function (gottie) {
                    console.log(gottie);
                    $(form).hide();
                });
            return false;
        }
    });
/*
    $('#signup').submit(function() {
        if ($('#signup').valid()) {
            window.location.href='/';
        }
        //$('#signup').hide();
    }); */
});

/*
$('#signupSubmit').on('click', function() {
    if ($('#signupSubmit').valid()) {
        console.log("valid form");
    }
    else {
        console.log("invalid form");
    }
});
*/
