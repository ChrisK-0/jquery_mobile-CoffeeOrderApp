// JSON object for coffee choices
let choiceObject = {
    // "Juice": "Apple"
};

// disables flickering, but also useful because during transition, the loader page will be used
// so it actually looks like its loading something
// $(document).on('pagechange', function(){
//     $.mobile.defaultPageTransition = "none";
// });

// variables for choice format, ex:
//      { choiceName: choiceValue }
let choiceName = "";
let choiceValue = "";

// get label tag's FOR attribute
let labelFor;

// labelFor (label for = input id) is equal to input ID, which can be gotten with jQuery .attr() function
let inputValue;

// FUNCTIONS VVV -----------------------------------

// empties the choiceObject
function emptyChoiceObject() {
    choiceObject = {};
};

// Leaving the page or manually typing an address, take back to login and reset choiceObject
$(window).trigger("unload", function () {
    emptyChoiceObject();
    $('body').pagecontainer("change", "#login")
});



// on call remove last choice from choiceObject
function removeLastFromObject() {

    let objectLast = Object.keys(choiceObject)[Object.keys(choiceObject).length - 1];
    delete choiceObject[`${objectLast}`];

    // console.log('---------------------------');
    // console.log("last choiceObject '"+objectLast+"' removed.");
    // console.log(choiceObject);
    // console.log('---------------------------');
};

// label click - on call add (label) choice to choiceObject
function createAndAddToObject() {
    choiceName = $(`#${labelFor}`).attr('data-choiceType');
    choiceValue = inputValue;

    // add new key with value to choiceObject
    choiceObject[choiceName] = choiceValue;
};

// Milk balance slider value
let milkBalanceSliderValueSpan = $('#milk_balance_span-value');
let milkBalanceSliderValue = 50;

function getMilkBalanceSliderValue() {
    milkBalanceSliderValueSpan = $('#milk_balance_span-value');
    milkBalanceSliderValue = $('#milk_balance-slider').val();

    // milk balance OK button
    let milkBalanceSubmit = document.getElementById('milk_balance');

    milkBalanceSliderValueSpan.html(milkBalanceSliderValue + "%");

    milkBalanceSubmit.value = milkBalanceSliderValue;

    // add balance % to the object
    balanceChoiceType = $('#milk_balance-slider').attr('data-choiceType');
    choiceValue = milkBalanceSliderValue;

    choiceObject[balanceChoiceType] = choiceValue + "%";
    // console.log(choiceObject);
};

// Milk foam slider
let milkFoamSliderValueSpan = $('#milk_foam_span-value');
let milkFoamSliderValue = 50;

function getMilkFoamSliderValue() {
    milkFoamSliderValueSpan = $('#milk_foam_span-value');
    milkFoamSliderValue = $('#milk_foam-slider').val();

    // milk foam OK button
    let milkFoamSubmit = document.getElementById('milk_foam');

    milkFoamSliderValueSpan.html(milkFoamSliderValue + "%");

    milkFoamSubmit.value = milkFoamSliderValue;

    // add foam % to the object
    foamChoiceType = $('#milk_foam-slider').attr('data-choiceType');
    choiceValue = milkFoamSliderValue;

    choiceObject[foamChoiceType] = choiceValue + "%";
    // console.log(choiceObject);
}



// Replaces my awesome code i spent a lot of time on. Simply goes page back.
// Also removes last choice made from choiceObject
function onclickGoBack() {
    removeLastFromObject();
    history.back();
}

// Depending on chosen coffee type, milk selection will take back to coffee type selection
// for classic, milk selection go back will take to Classic type
// forcustom, milk selection go back will take to Custom type
function milkGoBack() {
    if (chosenCoffeeType === "Classic") {
        // $.mobile.pageContainer.pagecontainer("change", "#coffee-classic-type");
        $('body').pagecontainer("change", "#coffee-classic-type")
    } else if (chosenCoffeeType === "Custom") {
        // $.mobile.pageContainer.pagecontainer("change", "#coffee-custom-shot");
        $('body').pagecontainer("change", "#coffee-custom-shot");
    }
}

// Function to process payment
function processPayment() {
    $('body').pagecontainer("change", "#pay-process", {transition: "fade"});
    setTimeout(function () {
        $('body').pagecontainer("change", "#pay-finished", {transition: "pop"});
    }, 2000);
}

// Initial loader
function loadOnVisit() {
    
    $('body').pagecontainer("change", "#loader");
    setTimeout(function () {
        $('body').pagecontainer("change", "#login");
    }, 1000);
}
// Trigger the loadOnVisit() with one(), so it wont trigger again when refreshing the page
$(document).one('load', loadOnVisit());

// Document eventlistener on most functions
$(document).ready(function () {



    $("#milk_balance_slider-wrapper").change(function () {
        getMilkBalanceSliderValue();
    });

    $("#milk_foam_slider-wrapper").change(function () {
        getMilkFoamSliderValue();
    });

    // applies base values if slider is untouched
    $('#milk_balance').on('click touchend', function () {
        getMilkBalanceSliderValue();
        console.log(choiceObject);
    });
    $('#milk_foam').on('click touchend', function () {
        getMilkFoamSliderValue();
        console.log(choiceObject);
    });

    // reset choiceObject when going back to coffee type choosing page
    $(document).on('click touchend', "#coffee_type-goto, #login", function () {
        emptyChoiceObject();
    });

    // on label click get input VALUE with NAME
    // call createAndAddToObject to add data to the choiceObject
    $(document).on('click touchend', "label", function () {

        // get chosen coffee type
        // If classic, redirect to classic coffee types
        // If custom, redirect to custom espresso shots
        if ($(this).hasClass("coffee_type")) {
            let chosenCoffeeLabelFor = $(this).attr('for');
            let chosenCoffeeType = $(`#${chosenCoffeeLabelFor}`).attr('value');

            // Depending on chosen coffee type, size will either direct to Classic selection or Custom selection
            // for Classic, direct to Coffee selection
            // for Custom, direct to Espresso selection
            $('input[name="coffee-size"]').each(function () {
                $(this).on('click touchend', function () {
                    // POTENTIAL LAG PROBLEM, IF CHOOSING CLASSIC AND GOING BACK AND CHOOSING CUSTOM
                    // AFTER CHOOSING SIZE IT REDIRECTS TO THE FIRSTLY CLICKED COFFEE TYPE PAGE AND THEN
                    // TO THE LATTER CHOICE COFFEE TYPE PAGE.

                    if (chosenCoffeeType === "Classic") {
                        // $.mobile.pageContainer.pagecontainer("change", "#coffee-classic-type");
                        $('body').pagecontainer("change", "#coffee-classic-type");
                    } else if (chosenCoffeeType === "Custom") {
                        // $.mobile.pageContainer.pagecontainer("change", "#coffee-custom-shot");
                        $('body').pagecontainer("change", "#coffee-custom-shot");
                    }
                })

            });

            // Depending on chosen coffee type, milk will either direct to final order or further
            // for Classic, milk will direct to final order, Go back will take back to classic
            // for Custom, milk will direct to milk balance, Go back will take back to Custom
            $('input[name="milk_type"]').each(function () {


                $(this).on('click touchend', function () {

                    if (chosenCoffeeType === "Classic") {
                        // Creates final order view for Classic coffee
                        $('#final_order').html("");
                        for (let [key, value] of Object.entries(choiceObject)) {
                            $('#final_order').append(`<li>${key} - ${value}</li>`);
                        }

                        // $.mobile.pageContainer.pagecontainer("change", "#final-order");
                        $('body').pagecontainer("change", "#final-order");
                    } else if (chosenCoffeeType === "Custom") {
                        // $.mobile.pageContainer.pagecontainer("change", "#milk-balance");
                        $('body').pagecontainer("change", "#milk-balance");

                    }
                })
            });

            // Creates final order view for Custom coffee
            $('input[name="additives"]').each(function () {
                $(this).on('click touchend', function () {
                    // Clears final order before making a new list view
                    $('#final_order').html("");

                    // Object.keys(choiceObject)

                    for (let [key, value] of Object.entries(choiceObject)) {
                        $('#final_order').append(`<li>"${key}": "${value}"</li>`);
                    }

                    // $.mobile.pageContainer.pagecontainer("change", "#final-order");
                    $('body').pagecontainer("change", "#final-order");
                })

            });
        };

        // get input ID, which is same as NAME with label's FOR attribute
        labelFor = $(this).attr('for');

        // used label FOR attribute, which is tied to input and is the same as it's id,
        // which can be used for getting that input's value
        inputValue = $(`#${labelFor}`).attr('value');

        // adds the clicked label choice to choiceObject
        if ($(`#${labelFor}`).attr('data-choiceType')) {
            createAndAddToObject();
        };

        console.log(choiceObject);
    });

    // On PAY button click, process payment
    $(document).on('click touchend', "#to_pay", function () {
        processPayment();
    });

}); // DOCUMENT READY END