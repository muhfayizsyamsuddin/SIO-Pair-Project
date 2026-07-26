const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
};

const generateInvoice = async (order, orderItems) => {
  const invoiceDir = path.join(__dirname, "../invoices");

  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir);
  }

  const fileName = path.join(invoiceDir, `invoice_${order.id}.pdf`);

  const doc = new PDFDocument();

  const stream = fs.createWriteStream(fileName);

  doc.pipe(stream);

  doc.fontSize(22).text("INVOICE", {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(14).text(`Invoice : INV-${order.id}`);
  doc.text(`Tanggal : ${new Date().toLocaleDateString("id-ID")}`);
  doc.text(`Customer : ${order.User.username}`);

  doc.moveDown();

  let total = 0;

  orderItems.forEach((item) => {
    const subtotal = item.quantity * item.priceAtOrder;
    total += subtotal;

    doc.text(
      `${item.Menu.name}  x${item.quantity}  = ${formatRupiah(subtotal)}`
    );
  });

  doc.moveDown();

  doc.fontSize(16).text(`TOTAL : ${formatRupiah(total)}`);

  doc.moveDown();

  doc.fontSize(12).text("Terima kasih atas pesanan Anda.");

  doc.end();

  return new Promise((resolve) => {
    stream.on("finish", () => resolve(fileName));
  });
};

module.exports = {
  formatRupiah,
  generateInvoice,
};