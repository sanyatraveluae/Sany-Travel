// PayPal Button Integration
paypal.Buttons({
    // Set up the transaction
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                description: 'Dubai Adventure Package - 5 Days',
                amount: {
                    value: '1299.00',
                    currency_code: 'USD'
                }
            }]
        });
    },
    
    // Finalize the transaction
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            // Show success message
            alert('Transaction completed by ' + details.payer.name.given_name + '!');
            
            // Redirect to thank you page
            window.location.href = 'thank-you.html';
        });
    },
    
    // Handle errors
    onError: function(err) {
        console.error('PayPal error:', err);
        alert('An error occurred with your payment. Please try again.');
    },
    
    // Handle cancellation
    onCancel: function(data) {
        alert('Payment cancelled. You can return to complete your booking anytime.');
    }
}).render('#paypal-button-container');
