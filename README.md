# Batch PDF Invoice Generator

Batch generate PDF invoices directly in your browser console — no server, no SaaS, your data never leaves your machine.

Built on top of [gdoc.io Free Invoice Maker](https://gdoc.io/free-online-invoice-generator/).

Full writeup: [How I Made a Free Automated PDF Invoice Maker for Batch Billing All My Contractors](https://dev.to/gdoc/how-i-made-a-free-automated-pdf-invoice-maker-for-batch-billing-all-my-contractors-1jha)

## How to use

1. Open [gdoc.io Free Invoice Maker](https://gdoc.io/free-online-invoice-generator/)
2. Open browser console: `Cmd + Option + J` on Mac or `Ctrl + Shift + J` on Windows
3. Go to the **Console** tab
4. Paste the script below and hit Enter
5. Paste your data array and hit Enter — invoices will generate automatically

## Script

```js
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
```

## Example

```js
batchInvoice([
    {
        number: '001',
        currency: '$',
        date: '2026-04-11',
        dueDate: '2026-05-11',
        paymentTerms: 'Net 30',
        poNumber: 'PO-2026-001',
        from: 'Acme Corp\n100 Main St\nNew York, NY 10001',
        billTo: 'TechStart Inc\n456 Oak Ave\nBoston, MA 02101',
        items: [
            { name: 'Frontend Development', qty: 40, price: 120 },
            { name: 'Backend API',          qty: 30, price: 150 },
        ],
        discount: 15,
        discountMode: 'pct',
        tax: 10,
        amountPaid: 5000,
        notes: 'Wire: Bank of America\nAcc: 1234567890',
        terms: 'Late payments subject to 1.5% monthly interest',
    },
    {
        number: '002',
        currency: '€',
        date: '2026-04-11',
        dueDate: '2026-06-11',
        paymentTerms: 'Net 60',
        from: 'Digital Studio GmbH\nBerlinstr. 42\nBerlin, 10115',
        billTo: 'MegaShop EU\n8 Rue de Rivoli\nParis, 75001',
        items: [
            { name: 'UI/UX Design',     qty: 20, price: 95 },
            { name: 'Brand Guidelines', qty: 1,  price: 2500 },
        ],
        discount: 400,
        discountMode: 'abs',
        tax: 19,
        shipping: 50,
        notes: 'IBAN: DE89 3704 0044 0532 0130 00',
        terms: 'Payment within 60 days',
    },
]);
```

## Data fields

| Field | Type | Description |
|---|---|---|
| `number` | string | Invoice number |
| `currency` | string | Currency symbol (`$`, `€`, etc.) |
| `date` | string | Invoice date (YYYY-MM-DD) |
| `dueDate` | string | Due date (YYYY-MM-DD) |
| `paymentTerms` | string | e.g. `Net 30` |
| `poNumber` | string | Purchase order number |
| `from` | string | Sender details (use `\n` for line breaks) |
| `billTo` | string | Recipient details (use `\n` for line breaks) |
| `items` | array | Line items: `name`, `qty`, `price` |
| `discount` | number | Discount amount or percentage |
| `discountMode` | string | `abs` for fixed, `pct` for percentage |
| `tax` | number | Tax percentage |
| `shipping` | number | Shipping cost |
| `amountPaid` | number | Amount already paid |
| `notes` | string | Payment notes |
| `terms` | string | Terms and conditions |

## License

MIT
