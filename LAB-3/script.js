document.addEventListener('DOMContentLoaded', function () {
    const billTotalInput = document.getElementById('billTotal');
    const tipInput = document.getElementById('tip');
    const tipPercentageInput = document.getElementById('tipPercentage');
    const tipAmountInput = document.getElementById('tipAmount');
    const totalBillWithTipInput = document.getElementById('totalBillWithTip');

    document.getElementById('tipForm').addEventListener('input', function () {
        const billTotal = parseFloat(billTotalInput.value);
        if (isNaN(billTotal)) {
            alert('Please enter a valid number in the Bill Total.');
            return;
        }
        const tipPercentage = tipInput.value;
        const tipAmount = (billTotal * tipPercentage) / 100;
        const totalBillWithTip = billTotal + tipAmount;

        tipPercentageInput.value = tipPercentage + '%';
        tipAmountInput.value = tipAmount.toFixed(2);
        totalBillWithTipInput.value = totalBillWithTip.toFixed(2);
    });
});
