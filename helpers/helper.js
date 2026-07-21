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