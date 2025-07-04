const { User, Menu, Order, OrderMenu, UserProfile } = require('../models/index')
const { Op } = require('sequelize');
const easyinvoice = require('easyinvoice');
const fs = require('fs').promises
const { formatRupiah, generateInvoice } = require('../helpers/helper')

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

            await orderMenu.update({ quantity })

            res.redirect('/orders?success=Quantity updated')
        } catch(error) {
            console.log(error, '<== error handler edit')
        }
    }

    static async handlerDelete(req, res) {
        try {
            const { menuId } = req.params

            const orderMenu = await OrderMenu.findByPk(menuId)

            const orderId = orderMenu.OrderId

            await orderMenu.destroy()

            const sisaItem = await OrderMenu.findAll({
                where: { OrderId: orderId }
            })

            if (sisaItem.length === 0) {
                await Order.destroy({ where: { id: orderId } })
            }

            res.redirect('/orders?success=Item berhasil dihapus');
        } catch (error) {
            console.log(error, '<== error handler delete')
            res.send(error);
        }
    }


    static async payOrder(req, res) {
        try {
            const { menuId } = req.params;

            const order = await Order.findByPk(menuId, {
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
            
            await order.update(
                { 
                    statusOrder: 'completed' 
                })
            
            const invoiceFile = await generateInvoice(order, order.OrderMenus)
            
            await generateInvoice(order, order.OrderMenus)
            
            res.download(invoiceFile)

            res.redirect('/orders?success=Pembayaran berhasil!');
        } catch (error) {
            console.log(error, "<== error payOrder")
            res.send(error)
        }
    }

    static async downloadInvoice (req, res) {
        try {
            const { orderId } = req.params;
            const fileName = `invoices/invoice_${orderId}.pdf`;
            res.download(fileName, `invoice_order_${orderId}.pdf`, (err) => {
            if (err) {
                console.error('Download error:', err);
                res.send('Invoice tidak ditemukan');
            }
        });
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = OrderController