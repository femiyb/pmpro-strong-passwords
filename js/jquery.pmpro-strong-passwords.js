/*
TODO: detect width of password field and set progressbar width same
TODO: set pmprosp-progressbar-status box shadow width to larger than progressbar
? TODO: Add additional checks for upper & lowercase, numbers and special characters and combine with strength check
TODO: Filter in blacklist array
TODO: Mismatch styling?
?: Hide and autofill confirm password field?
?: Add toggle show password?
?: Generate Password + button?
?: Auto Generate PW and show?
*/

function checkPasswordStrength( 
	$password_field_1,
    $password_field_2,
    $strengthResult,
    $submitButton,
    blacklistArray
	 ) {

    var password_field_1 = $password_field_1.val();
    var password_field_2 = $password_field_2.val();
 
    // Reset the form & meter
    $submitButton.attr( 'disabled', true );
	$strengthResult.removeClass( 'short bad good strong' );
 
    // Get the password strength
    var strength = wp.passwordStrength.meter( password_field_1, blacklistArray, password_field_2 );
 
    // Add the strength meter results
    switch ( strength ) {
        case 2:
            $strengthResult.addClass( 'bad' ).html( pwsL10n.bad );
            jQuery(".pmprosp-progressbar-status").css("width", 50 + "%");
            break;

        case 3:
            $strengthResult.addClass( 'good' ).html( pwsL10n.good );
            jQuery(".pmprosp-progressbar-status").css("width", 70 + "%");
            break;
 
        case 4:
            $strengthResult.addClass( 'strong' ).html( pwsL10n.strong );
            jQuery(".pmprosp-progressbar-status").css("width", 100 + "%");
            break;
 
        case 5:
            $strengthResult.addClass( 'short' ).html( pwsL10n.mismatch );
            jQuery(".pmprosp-progressbar-status").css("width", 20 + "%");
            break;
 
        default:
            $strengthResult.addClass( 'short' ).html( pwsL10n.short );
            jQuery(".pmprosp-progressbar-status").css("width", 20 + "%");
 
    }
 
    // The meter function returns a result even if password_field_2 is empty,
    // enable only the submit button if the password is strong and
    // both passwords are filled up
    if ( pwsL10n.allow_weak == 1 && '' !== password_field_2.trim() && 5 != strength ) {
        $submitButton.removeAttr( 'disabled' );
    } else if ( 4 == strength && '' !== password_field_2.trim() ) {
        $submitButton.removeAttr( 'disabled' );
    }
    return strength;
}
 
jQuery( document ).ready( function( $ ) {

    // Move the message and bar to just below the PMPro password 1 field.
    jQuery('#pmprosp-container').insertAfter('.pmpro_checkout-field-password');

    // add disabled attribute to submit button on page load.
    jQuery('#pmpro_btn-submit').attr('disabled', true);
    
    // Binding to trigger checkPasswordStrength
    jQuery( 'body' ).on( 'keyup', 'input[name=password], input[name=password2]',
        function( event ) {
            checkPasswordStrength(
                jQuery('.pmpro_form input[name=password]'),         // First password field
                jQuery('.pmpro_form input[name=password2]'), // Second password field
                jQuery('.pmpro_form #pmprosp-password-strength'),           // Strength meter
                jQuery('.pmpro_form #pmpro_btn-submit'),           // Submit button
                ['black', 'listed', 'word']        // Blacklisted words
            );
        }
    );
});
