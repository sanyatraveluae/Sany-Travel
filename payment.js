// PayPal Button Integration with Custom Amount
paypal.Buttons({
    // Set up the transaction with dynamic amount
    createOrder: function(data, actions) {
        // Get the amount entered by user
        const amountInput = document.getElementById('payment-amount');
        const customerName = document.getElementById('customer-name').value;
        const numTravelers = document.getElementById('num-travelers').value;
        const errorMessage = document.getElementById('error-message');
        
        // Get and validate the amount
        let amount = parseFloat(amountInput.value);
        
        // Validation
        if (!amount || amount < 100) {
            errorMessage.textContent = 'Please enter a valid amount (minimum $100.00)';
            errorMessage.style.display = 'block';
            return false;
        }
        
        // Hide error message if validation passes
        errorMessage.style.display = 'none';
        
        // Round to 2 decimal places
        amount = amount.toFixed(2);
        
        // Create description with customer details
        let description = 'Dubai Adventure Package - 5 Days';
        if (numTravelers > 1) {
            description += ` (${numTravelers} travelers)`;
        }
        if (customerName) {
            description += ` - ${customerName}`;
        }
        
        // Create the order with dynamic amount
        return actions.order.create({
            purchase_units: [{
                description: description,
                custom_id: customerName || 'Guest-' + Date.now(), // For tracking
                amount: {
                    value: amount,
                    currency_code: 'USD'
                }
            }]
        });
    },
    
    // Finalize the transaction
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            // Get payment details
            const amount = details.purchase_units[0].amount.value;
            const customerName = details.payer.name.given_name;
            
            console.log('Payment completed:', details);
            
            // Store details in sessionStorage to display on thank you page
            sessionStorage.setItem('paymentAmount', amount);
            sessionStorage.setItem('customerName', customerName);
            sessionStorage.setItem('transactionId', details.id);
            
            // Show success message
            alert(`Thank you ${customerName}! Payment of $${amount} completed successfully.`);
            
            // Redirect to thank you page
            window.location.href = 'thank-you.html';
        });
    },
    
    // Handle errors
    onError: function(err) {
        console.error('PayPal error:', err);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Payment error occurred. Please try again.';
        errorMessage.style.display = 'block';
    },
    
    // Handle cancellation
    onCancel: function(data) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Payment cancelled. You can try again when ready.';
        errorMessage.style.display = 'block';
    },
    
    // Optional: Disable button if amount is not entered
    onInit: function(data, actions) {
        const amountInput = document.getElementById('payment-amount');
        
        // Disable button initially
        actions.disable();
        
        // Enable button when valid amount is entered
        amountInput.addEventListener('input', function() {
            const amount = parseFloat(this.value);
            if (amount && amount >= 100) {
                actions.enable();
            } else {
                actions.disable();
            }
        });
    }
}).render('#paypal-button-container');
