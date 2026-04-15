// Batch PDF Invoice Generator
// Built on top of gdoc.io Free Invoice Maker: https://gdoc.io/free-online-invoice-generator/
// Full writeup: https://dev.to/gdoc/how-i-made-a-free-automated-pdf-invoice-maker-for-batch-billing-all-my-contractors-1jha
//
// Usage:
// 1. Open https://gdoc.io/free-online-invoice-generator/
// 2. Open browser console: Cmd+Option+J (Mac) or Ctrl+Shift+J (Windows)
// 3. Paste this script and hit Enter
// 4. Paste your batchInvoice([...]) call and hit Enter

(() => {
    const { store, invoice } = window.invoiceAPI;
    window.batchInvoice = async (invoices) => {
        for (const inv of invoices) {
            invoice.new();
            store.set({
                'inv.number': inv.number,
                'currency': inv.currency,
                'date.value': inv.date,
                'dueDate.value': inv.dueDate,
                'paymentTerms.value': inv.paymentTerms,
                'poNumber.value': inv.poNumber,
                'from.value': inv.from,
                'billTo.value': inv.billTo,
                'notes.value': inv.notes,
                'terms.value': inv.terms,
                'tax.enabled': inv.tax != null ? '1' : '0',
                'tax.value': inv.tax || 0,
                'discount.enabled': inv.discount != null ? '1' : '0',
                'discount.value': inv.discount || 0,
                'discount.mode': inv.discountMode || 'abs',
                'shipping.enabled': inv.shipping != null ? '1' : '0',
                'shipping.value': inv.shipping || 0,
                'amountPaid.value': inv.amountPaid || 0,
            });
            inv.items.forEach(item => {
                const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
                store.set({
                    [`items.${id}.name`]: item.name,
                    [`items.${id}.qty`]: item.qty,
                    [`items.${id}.price`]: item.price,
                });
            });
            invoice.save();
            await invoice.pdf();
        }
        console.log(`✅ ${invoices.length} invoices generated`);
    };
    return '🌋 gdoc.io Invoice Volcano activated! Feed batchInvoice([...]) and watch it erupt';
})();
