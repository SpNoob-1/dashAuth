// 1. Endpoint `POST /api/v1/orders` protegido para clientes autenticados.//
//  2. Guardado en snapshot de la dirección del cliente y del detalle de ítems (con precios al momento de la compra).//
//  3. Registro dinámico de exclusiones de ingredientes en la tabla `exclusiones_detalle`//
// 4. Disparo automático del e-mail de **Confirmación de Pedido**.

export {};
