$(document).ready(function() {
    getCountries();

    let saveBtn = $("#save");
    saveBtn.click(save);
    profileChange();

    let browseFile = $(".readBytesButtons");
    if(browseFile){
        browseFile.on("click", function(evt){
            if (evt.target.tagName.toLowerCase() == 'button') {
                var startByte = evt.target.getAttribute('data-startbyte');
                var endByte = evt.target.getAttribute('data-endbyte');
                readBlob(startByte, endByte);
            }
        });
    }

    $('#add-profile-btn').click(clearForm);
});

function readBlob(opt_startByte, opt_stopByte) {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }

        var files = document.getElementById('files').files;
        if (!files.length) {
            alert('Please select a file!');
            return;
        }

        var file = files[0];
        var start = parseInt(opt_startByte) || 0;
        var stop = parseInt(opt_stopByte) || file.size - 1;

        var reader = new FileReader();

        // If we use onloadend, we need to check the readyState.
        reader.onloadend = function(evt) {
            if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                let fileContent = $('#byte_content').textContent = evt.target.result;
                let json = $.parseJSON( fileContent.toString());

                setProfileInfo(new Profile(json.profile_name, json.firstname, json.lastname, json.email,
                    json.phone_number, json.address1, json.address2, json.country, json.state, json.city, json.zipcode,
                    json.card_holder, json.card_number, json.date, json.cvv));
            }
        };


        var blob = file.slice(start, stop + 1);
        reader.readAsBinaryString(blob);
}

const SECRET_KEY = '09876543v1asger1251';
let profiles = [];

class Profile {
    constructor(profileNameField, firstName, lastName, email, phoneNumber,
                address1, address2, country, state, city, zipcode, cardHolder, cardNumber,
                date, cvv) {
        this.profileName = profileNameField;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address1 = address1;
        this.address2 = address2;
        this.country = country;
        this.state = state;
        this.city = city;
        this.zipcode = zipcode;
        this.cardHolder = cardHolder;
        this.cardNumber = cardNumber;
        this.date = date;
        this.cvv = cvv;
    }
}

function isValidateProfile(selectedProfile) {
    for(let i = 0; i < profiles.length; i++) {
        if(selectedProfile.profileName === profiles[i].profileName || selectedProfile.cardNumber === profiles[i].cardNumber) {
            return true;
        }
    }
    return false;
}

function setProfileInfo(profile) {
        $('#profile_name').val(profile.profileName);
        $( "#first_name" ).val(profile.firstName);
        $( "#last_name" ).val(profile.lastName);
        $( "#email" ).val(profile.email);
        $( "#phone_number" ).val(profile.phoneNumber);
        $( "#address1" ).val(profile.address1);
        $( "#address2" ).val(profile.address2);
        $( "#country-select option:selected" ).text(profile.country); // take selected item
        $( "#state" ).val(profile.state);
        $( "#city" ).val(profile.city);
        $( "#zipcode" ).val(profile.zipcode);
        $( "#card_holder" ).val(profile.cardHolder);
        $( "#card_number" ).val(profile.cardNumber);
        $( "#date" ).val(profile.date);
        $( "#cvv" ).val(profile.cvv);

        setSelectProfile(profile);
}

function saveJSON(profile) {
    //Encrypt
    //let cardHolder = CryptoJS.AES.encrypt(profile.cardHolder, SECRET_KEY);
    //Then cardHolder.toString() to card_holder key
    let fileContent = { 'profile_name': profile.profileName, 'firstname': profile.firstName,
        'lastname': profile.lastName, 'email': profile.email, 'phone_number': profile.phoneNumber,
        'address1': profile.address1, 'address2': profile.address2, 'country': profile.country,
        'state': profile.state, 'city': profile.city, 'zipcode': profile.zipcode,
        'card_holder': profile.cardHolder,
        'card_number': profile.cardNumber, 'date': profile.date, 'cvv': profile.cvv };
    let bb = new Blob([JSON.stringify(fileContent)], { type: 'text/plain' });
    let a = document.createElement('a');
    a.download = 'profile.json';
    a.href = window.URL.createObjectURL(bb);
    a.click();
}

function save(e) {
    e.preventDefault();

    let profileNameField = $("#profile_name").val();
    let firstName = $( "#first_name" ).val();
    let lastName = $( "#last_name" ).val();
    let email = $( "#email" ).val();
    let phoneNumber = $( "#phone_number" ).val();
    let address1 = $( "#address1" ).val();
    let address2 = $( "#address2" ).val();
    let country = $( "#country-select option:selected" ).text(); // take selected item
    let state = $( "#state" ).val();
    let city = $( "#city" ).val();
    let zipcode = $( "#zipcode" ).val();
    let cardHolder = $( "#card_holder" ).val();
    let cardNumber = $( "#card_number" ).val();
    let date = $( "#date" ).val();
    let cvv = $( "#cvv" ).val();

    let errors = [];

    //If has error !trim does mean if field is empty
    if(profileNameField.length > 15 || !profileNameField.trim()) {
        let profileNameErr = '<div class=\'profile-err\'>* A profile name is required or your name is longer than 15 characters</div>';
        errors.push(profileNameErr);
    }
    if(firstName.length > 15 || !firstName.trim()) {
        let firstNameError = '<div class=\'profile-err\'>* A First name is required or your name is longer than 15 characters</div>';
        errors.push(firstNameError);
    }
    if(lastName.length > 15 || !lastName.trim()) {
        let lastNameErr = '<div class=\'profile-err\'>* A Last name is required or your last name is longer than 15 characters</div>';
        errors.push(lastNameErr);
    }
    if(!email.trim()) {
        let emailErr = '<div class=\'profile-err\'>* Email address is required</div>';
        errors.push(emailErr);
    }
    if(!validatePhone(phoneNumber)) {
        let phoneErr = '<div class=\'profile-err\'>* Phone number is required</div>';
        errors.push(phoneErr);
    }
    if(!address1.trim()) {
        let address1Err = '<div class=\'profile-err\'>* Address 1 is required</div>';
        errors.push(address1Err);
    }
    if(!city.trim()) {
        let city = '<div class=\'profile-err\'>* City is required</div>';
        errors.push(city);
    }
    if(!zipcode.trim() || zipcode.length <= 3) {
        let zipcode = "<div class='profile-err'>* State is required and can't be less than 3</div>";
        errors.push(zipcode);
    }
    if(!cardHolder.trim()) {
        let cardHolderErr = "<div class='profile-err'>* Card Holder is required</div>";
        errors.push(cardHolderErr);
    }
    if(!validateCardNumber(cardNumber)) {
        //Credit card number is without spaces
        let cardNumberErr = "<div class='profile-err'>* Card Number is required</div>";
        errors.push(cardNumberErr);
    }
    if(date.length > 5 || !isValidDate(date.toString()) || !date.trim()) {
        let dateErr = "<div class='profile-err'>* Date is required</div>";
        errors.push(dateErr);
    }
    if(cvv.length > 3 || cvv.length < 3 || !cvv.trim()) {
        let cvvErr = "<div class='profile-err'>* CVV is required and can't be different except 3</div>";
        errors.push(cvvErr);
    }

    //Check if exists errors
    if(errors.length > 0) {
        clearErrs();

        errors.forEach(async function(profileErr) {
            $("#select-profile").append(profileErr);
        });
    }else {
        clearErrs();
        //Add profile to the array
        let newProfile = new Profile(profileNameField, firstName, lastName, email,
            phoneNumber, address1, address2, country, state, city, zipcode,
            cardHolder, cardNumber, date, cvv);

        //set new select profile
        setSelectProfile(newProfile);

        //Save File
        saveJSON(newProfile);

        //Clear Form
        clearForm();
    }

}

function setSelectProfile(profile) {
    let isValProf = isValidateProfile(profile);
    if(isValProf) {
        //If profile exist do something
        alert("The account already exists in our system, try again");
    }else {
        clearErrs();
        profiles.push(profile);

        let profileName = $("<div>");
        profileName.addClass("profile-name");
        profileName.text(profile.profileName);
        let cardNumberDiv = $("<div>");
        cardNumberDiv.addClass("profile-card-number");

        //Convert card number
        let convertedCardNumber = convertCardNumber(profile.cardNumber);
        for (let i = 1; i <= 12; i++) {
            let hiddenCardNumberDiv = $("<span>");
            hiddenCardNumberDiv.addClass("hidden-card-number");
            cardNumberDiv.append(hiddenCardNumberDiv);
            if (i === 4 || i === 8 || i === 12) {
                hiddenCardNumberDiv.after("   &nbsp;   ");
            }

        }
        cardNumberDiv.append(convertedCardNumber);

        let prof = $("<div>");
        prof.addClass("profile active");
        prof.attr('id', profiles.length - 1);
        prof.append(profileName);
        prof.append(cardNumberDiv);

        $("#select-profile").append(prof);
    }
}

function clearErrs() {
       $('.profile-err').remove();
}

function profileChange() {
    $(document).on('click', '.profile', function(){
        //toggleClass and remove class from all other elements
        let thisProfile = $(this);
        thisProfile.toggleClass('active').siblings().removeClass('active');

        let profileId = $(this).attr('id');

            if(thisProfile.attr('class').split(" ")[1] === 'active') {
                getProfileBySelectedProfileId(profileId);
            }else {
                clearForm();
            }
    });
}

function getProfileBySelectedProfileId(profileId) {
    $('#profile_name').val(profiles[profileId].profileName);
    $( "#first_name" ).val(profiles[profileId].firstName);
    $( "#last_name" ).val(profiles[profileId].lastName);
    $( "#email" ).val(profiles[profileId].email);
    $( "#phone_number" ).val(profiles[profileId].phoneNumber);
    $( "#address1" ).val(profiles[profileId].address1);
    $( "#address2" ).val(profiles[profileId].address2);
    $( "#country-select option:selected" ).text(profiles[profileId].country); // take selected item
    $( "#state" ).val(profiles[profileId].state);
    $( "#city" ).val(profiles[profileId].city);
    $( "#zipcode" ).val(profiles[profileId].zipcode);
    $( "#card_holder" ).val(profiles[profileId].cardHolder);
    $( "#card_number" ).val(profiles[profileId].cardNumber);
    $( "#date" ).val(profiles[profileId].date);
    $( "#cvv" ).val(profiles[profileId].cvv);
}

function convertCardNumber(cardNumber) {
                    cardNumber,
        vis = cardNumber.slice(-4),
        countNum = '';

        return vis;
}


function isValidDate(s) {
    var bits = s.split('/');
    var d = new Date(bits[2] + '/' + bits[1]);
    return !!(d && (d.getMonth() + 1) == bits[1]);
}

function validateCardNumber(number) {
    //check regex
    var regex = new RegExp("^[0-9]{16}$");
    if (!regex.test(number))
        return false;

    return luhnCheck(number);
}

function luhnCheck(val) {
    //Check is real card number combination
    var sum = 0;
    for (var i = 0; i < val.length; i++) {
        var intVal = parseInt(val.substr(i, 1));
        if (i % 2 == 0) {
            intVal *= 2;
            if (intVal > 9) {
                intVal = 1 + (intVal % 10);
            }
        }
        sum += intVal;
    }
    return (sum % 10) == 0;
}

function validatePhone(txtPhone) {
    var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
    if (filter.test(txtPhone)) {
        return true;
    }
    else {
        return false;
    }
}

function clearForm() {
    $("#profile_name").val('');
    $( "#first_name" ).val('');
    $( "#last_name" ).val('');
    $( "#email" ).val('');
    $( "#phone_number" ).val('');
    $( "#address1" ).val('');
    $( "#address2" ).val('');
    $( "#country-select option:selected" ).text(''); // take selected item
    $( "#state" ).val('');
    $( "#city" ).val('');
    $( "#zipcode" ).val('');
    $( "#card_holder" ).val('');
    $( "#card_number" ).val('');
    $( "#date" ).val('');
    $( "#cvv" ).val('');
}
function getCountries() {
    var countryOptions;
    $.getJSON('countries.json', function (result) {
        $.each(result, function (i, country) {
            //<option value='countrycode'>contryname</option>
            countryOptions += "<option value='"
                + country.code +
                "'>"
                + country.name +
                "</option>";
        });
        $('#country-select').html(countryOptions);
    });
}

function autocardShopify() {
    // $.post('/cart/add.js', {
    //     items: [
    //         {
    //             quantity: 1,
    //             id: 794864229,
    //             properties: {
    //                 'First name': 'Caroline'
    //             }
    //         },
    //         {
    //             quantity: 2,
    //             id: 826203268,
    //             properties: {
    //                 'First name': 'Mike'
    //             }
    //         }
    //     ]
    // });
}