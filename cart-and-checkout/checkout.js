document.addEventListener('DOMContentLoaded', function() {
    const inputFields = document.querySelectorAll('.input-field');
    
    inputFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.style.borderColor = '#16a34a';
            this.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
        });
        
        field.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = '#E5E5E5';
                this.style.boxShadow = 'none';
            }
        });
    });

    const cardInputs = document.querySelectorAll('input[placeholder="Card number"]');
    cardInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue.substring(0, 19); 
        });
    });

    const expiryInputs = document.querySelectorAll('input[placeholder*="Expiration"]');
    expiryInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    });

    const securityInputs = document.querySelectorAll('input[placeholder*="Security"]');
    securityInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
    });

    const zipInputs = document.querySelectorAll('input[placeholder*="ZIP"]');
    zipInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        });
    });

    const payButton = document.querySelector('.button-primary');
    if (payButton) {
        payButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const requiredFields = [
                document.querySelector('input[placeholder*="Email"]'),
                document.querySelector('input[placeholder*="Last name"]'),
                document.querySelector('input[placeholder*="Address"]'),
                document.querySelector('input[placeholder*="City"]'),
                document.querySelector('input[placeholder*="ZIP"]'),
                document.querySelector('input[placeholder*="Card number"]'),
                document.querySelector('input[placeholder*="Expiration"]'),
                document.querySelector('input[placeholder*="Security"]'),
                document.querySelector('input[placeholder*="Name on card"]')
            ].filter(field => field !== null);
            
            let isValid = true;
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#ef4444';
                    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    isValid = false;
                } else {
                    field.style.borderColor = '#E5E5E5';
                    field.style.boxShadow = 'none';
                }
            });
            
            if (isValid) {
                alert('Payment processed successfully! (This is a demo)');
              
            } else {
                alert('Please fill in all required fields');
            }
        });
    }

    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            console.log(this.id + ' is ' + (this.checked ? 'checked' : 'unchecked'));
        });
    });

    console.log('Checkout page initialized');
});
