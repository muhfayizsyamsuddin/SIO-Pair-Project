const { User, Menu, Order, OrderMenu, UserProfile } = require('../models/index')
// const { Op } = require('sequelize');
// const fs = require('fs').promises
const { formatRupiah, generateInvoice } = require('../helpers/helper')
const path = require("path");

class OrderController {
    static async getOrders(req, res) {
        try {
            const { success } = req.query
            const userId = req.session.userId
            const orders = await Order.findAll({
                where: { 
                    UserId: userId 
                },
                include: {
                    model: OrderMenu,
                    include: Menu
                },
                order: [['createdAt', 'DESC']]
            })
            res.render('orders', { orders, formatRupiah, success})
        } catch(error) {
            console.log(error, '<== error get order')
            res.send(error)
        }
    }

    static async postOrder(req, res) {
        try {
            const UserId = req.session.userId;
            const MenuId = +req.params.menuId;
            const quantity = 1
            const menu = await Menu.findByPk(MenuId);
            if (!menu) {
                return res.status(404).send("Menu tidak ditemukan");
            }
            const order = await Order.create({
                UserId,
                statusOrder: "active"
            })
            await OrderMenu.create({
                OrderId: order.id,
                MenuId,
                quantity,
                priceAtOrder: menu.price
            })
            res.redirect('/menus?success=Order berhasil!');
        } catch (error) {
            console.log(error, '<== error post order')
            res.send(error)
        }
    }

    static async handlerEdit(req, res) {
        try {
            const { menuId } = req.params
            const { quantity } = req.body
            const orderMenu = await OrderMenu.findByPk(menuId, {
                include: Order
            })
            if (!orderMenu) {
                return res.status(404).send("Order tidak ditemukan");
            }
            await orderMenu.update({ quantity })
            res.redirect('/orders?success=Quantity updated')
        } catch(error) {
            console.log(error, "<== error handler edit");
            res.status(500).send(error.message);
        }
    }

    static async handlerDelete(req, res) {
        try {
            const { menuId } = req.params
            const orderMenu = await OrderMenu.findByPk(menuId)
            if (!orderMenu) {
                return res.status(404).send("Item order tidak ditemukan");
            }
            const orderId = orderMenu.OrderId
            await orderMenu.destroy()
            const count = await OrderMenu.count({
                where: {
                    OrderId: orderId
                }
            });
            if (count === 0) {
                await Order.destroy({
                    where: {
                        id: orderId
                    }
                });
            }
            res.redirect('/orders?success=Item berhasil dihapus');
        } catch (error) {
            console.log(error, '<== error handler delete')
            res.send(error);
        }
    }


    static async payOrder(req, res) {
        try {
            const { orderId } = req.params;
            const order = await Order.findOne({
                where: {
                    id: orderId,
                    UserId: req.session.userId
                },
                include: [
                    {
                        model: OrderMenu,
                        include: Menu
                    },
                    {
                        model: User,
                        include: UserProfile
                    }
                ]
            })
            if (!order) {
                return res.status(404).send("Order tidak ditemukan");
            }
            if (order.statusOrder === "completed") {
                return res.redirect("/orders?success=Order sudah dibayar");
            }
            await order.update({
                statusOrder: "completed"
            });
            const invoiceFile = await generateInvoice(
                order,
                order.OrderMenus
            );
            return res.download(
                invoiceFile,
                `invoice_order_${order.id}.pdf`
            );
        } catch (error) {
            console.log(error, "<== error payOrder");
            res.status(500).send(error.message);
        }
    }

    static async downloadInvoice (req, res) {
        try {
            const { orderId } = req.params;
            const fileName = path.join(
                __dirname,
                "../invoices",
                `invoice_${orderId}.pdf`
            );
            const order = await Order.findOne({
                where: {
                    id: orderId,
                    UserId: req.session.userId
                }
            });
            if (!order) {
                return res.status(404).send("Invoice tidak ditemukan");
            }
            res.download(fileName, `invoice_order_${orderId}.pdf`, (err) => {
                if (err) {
                    console.error(err);

                    if (!res.headersSent) {
                        return res.status(404).send("Invoice tidak ditemukan");
                    }
                }
            });
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = OrderController