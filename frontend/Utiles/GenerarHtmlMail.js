const generarHtml = ({ nombre, productos, total, metodoPago, fecha }) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Gracias por tu compra</title>
    </head>
    <body style="margin:0; padding:0; background-color:#0d0d0d; font-family:'Segoe UI', sans-serif; color:#ffffff;">
      <div style="max-width: 600px; margin: auto; background-color:#1a1a1a; border: 1px solid #333; border-radius: 10px; padding: 20px; box-shadow: 0 0 15px #9500ff;">

        <!-- LOGO -->
        <div style="text-align:center; margin-bottom: 25px;">
          <img src="https://imgur.com/a/IUnlS2x" alt="NiTecno" style="max-width: 180px; border-radius: 8px;" />
        </div>

        <!-- TÍTULO -->
        <h2 style="color: #ff3c3c; text-align:center;">🧾 ¡Gracias por tu compra, ${nombre}!</h2>
        <p style="text-align:center; color: #ccc;">Tu pedido ha sido confirmado correctamente.</p>

        <!-- INFO DE PEDIDO -->
        <div style="margin: 25px 0; padding: 18px; background-color: #222; border-radius: 10px;">
          <p><strong>📅 Fecha:</strong> ${fecha}</p>
          <p><strong>💳 Método de pago:</strong> ${metodoPago}</p>
          <p><strong>📦 Productos:</strong></p>
          <ul style="padding-left: 20px;">
            ${productos.map(p => `<li>${p}</li>`).join('')}
          </ul>
          <p style="margin-top: 10px;"><strong>💰 Total:</strong> ${total}</p>
        </div>

        <!-- MENSAJE -->
        <p style="margin-top: 20px;">Adjuntamos tu factura en PDF. Si tenés alguna duda o necesitás asistencia, podés responder este correo o escribirnos directamente por WhatsApp.</p>

        <!-- BOTÓN -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="https://wa.me/5493518684217" style="background:linear-gradient(90deg, #ff3c3c, #9500ff); color:#fff; padding: 12px 25px; border-radius: 30px; font-weight: bold; text-decoration: none; display: inline-block;">📱 Contactar por WhatsApp</a>
        </div>

        <!-- PIE -->
        <p style="text-align:center; color:#aaa; font-size: 0.9em;">Gracias por confiar en <strong>NiTecno</strong> 💻⚡<br/>Nos vemos pronto.</p>
      </div>
    </body>
    </html>
  `;
};
