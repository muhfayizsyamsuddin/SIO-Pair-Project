// const easyinvoice = require('easyinvoice');
// const fs = require('fs').promises;


// const formatRupiah = (value) => {
//     return new Intl.NumberFormat("id-ID", {
//         style: "currency",
//         currency: "IDR"
//     }).format(value)
// }

// const generateInvoice = async (order, orderItems) => {
//     const data = {
//         // apiKey: "free",
//         // mode: "development",
//         images: {
//             logo: "https://public.budgetinvoice.com/img/logo_en_original.png",
//             background: "https://public.budgetinvoice.com/img/watermark-draft.jpg"
//         },
//         sender: {
//             company: "Resto App",
//             address: "Jl. Contoh No. 123",
//             zip: "12345",
//             city: "Jakarta",
//             country: "Indonesia"
//         },
//         client: {
//             UserID: order.UserId,
//         },
//         information: {
//             number: `INV-${order.id}-${Date.now()}`,
//             date: new Date().toLocaleDateString(),
//             dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
//         },
//         products: orderItems.map(item => ({
//             quantity: item.quantity,
//             description: item.Menu.name,
//             taxRate: 10,
//             price: item.priceAtOrder
//         })),
//         bottomNotice: "Terima kasih telah memesan!",
//         settings: {
//             currency: "IDR"
//         }
//     };

//     const result = await easyinvoice.createInvoice(data);
//     const fileName = `invoices/invoice_${order.id}.pdf`;
    
//     await fs.mkdir('invoices', { recursive: true });
//     await fs.writeFile(fileName, result.pdf, 'base64');
    
//     return fileName;
// };

// module.exports = { formatRupiah, generateInvoice }

const easyinvoice = require('easyinvoice');
const fs = require('fs').promises;

const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(value);
};

const generateInvoice = async (order, orderItems) => {
    // Bypass EasyInvoice agar server TIDAK AKAN PERNAH crash lagi karena API Key 401
    try {
        console.log(`[INFO] Bypass Invoice PDF untuk Order ID: ${order?.id}`);
        return null;
    } catch (error) {
        return null;
    }
};

module.exports = { formatRupiah, generateInvoice };