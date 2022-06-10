/* 
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth } from '../utils.js';
import mercadopago from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();
mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN
})
//----> DEV_ACCESS_TOKEN = TEST-6493413234713799-032915-ecbe1d24b7ba19bc2819dcaa33ef00ee-535186645

const mercadoPagoRouter = express.Router()
mercadoPagoRouter.post('/mercadoPago', async (req, res, next) => {

    try {
        const { email, items } = req.body
        const items_ml = items.map(i => ({
            title: i.title,
            unit_price: i.price,
            quantity: i.quantity,
        }))
        console.log(items_ml)
        let preference = {
            items: items_ml,
            external_reference: email,
            payment_methods: {
                excluded_payment_types: [
                    {
                        id: "atm"
                    }
                ],
                installments: 3  //Cantidad máximo de cuotas
            },
            back_urls: {
                success: 'http://localhost:3001/mercadoPago/pagos',
            },
        };

        mercadopago.preferences.create(preference)
            .then(function (response) {
                
                //Este valor reemplazará el string"<%= global.id %>" en tu HTML
                global.id = response.body.id;
                global.init_point = response.body.sandbox_init_point;
                //console.log(response.body);
                res.send({id: global.id, url: global.init_point}); 

            })
            .catch(function (error) {
                console.log(error);
            })

            
    } catch (error) {
        next(error)
    }
})

mercadoPagoRouter.get('/mercadoPago/pagos', async (req, res, next) => {
    try {

      const payment_id= req.query.payment_id
      const payment_status= req.query.status
      const external_reference = req.query.external_reference
      const merchant_order_id= req.query.merchant_order_id 
      //Aquí edito el status de mi orden
      Payment.create({
            payment_id: payment_id,
            payment_status: payment_status,
            merchant_order_id : merchant_order_id,
            cartId: external_reference
        })
     
        return res.redirect("http://localhost:3000/pagoexitoso")
   
    } catch (error) {
      console.log("error  :",error)
      res.sendStatus(404)
    }
  })

export default mercadoPagoRouter;  */