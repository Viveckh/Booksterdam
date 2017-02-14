// Client Side Javascript associated with the sign up page

$(document).ready(function() {
    
    // Set signup form validation rules using the Jquery validation plugin
    $('#signup').validate({
        rules: {
            userEmail: "required",
            userPassword: {
                required: true,
                minlength: 5,
                maxlength: 30
            },
            userConfirmPassword: {
                equalTo: "#userPassword"
            },
            userFname: {
                required: true,
                minlength: 2
            },
            userLname: {
                required: true,
                minlength: 2
            },
            userCity: {
                required: true,
                minlength: 2
            },
            userZip: {
                required: true,
                minlength: 5,
                maxlength: 5
            },
            userState: "required",
            userCountry: "required",
            userSchool: "required",
            userPhone: {
                required: true,
                minlength: 10,
                maxlength: 10
            },
            agreeToTerms: "required"
        },
        messages: {
            userEmail: "Oops! A valid email is required.",
            userPassword: "Need that password, brah!",
            userConfirmPassword: "Woah, password mismatch.",
            userFname: "Please enter your first name.",
            userLname: "Please enter your last name.",
            userCity: "Invalid city",
            userZip: "Invalid ZipCode",
            userState: "Required",
            userSchool: "We really need to know your school.",
            userPhone: "What's yo numbah?",
            agreeToTerms: "Required "
        },
        submitHandler: function(form) {
            $.ajax({
                type: 'POST',
                url: '/register',
                data: $(form).serialize()
            })
                .done(function (msg) {
                    console.log(msg);
                    if (msg == "success") {
                        $(form).hide();
                        $("#alertbox").html("Registration Successful! You can login to your account now.");
                    }
                    else {
                        $("#alertbox").html(msg);
                        window.scrollTo(0, 0);
                    }
                });
            return false;
        }
    });
});
