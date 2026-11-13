// `PATCH /api/v1/admin/orders/:id/status` accesible solo para el rol `ADMIN`.
//     2. Verificación previa: Si el pedido se encuentra en `ENTREGADO` o `CANCELADO`, rechazar la actualización respondiendo HTTP `400 Bad Request` ("El pedido está en un estado final e inmutable").
//     3. Validar que la transición siga el flujo estricto (`PENDIENTE` -> `EN_PREPARACION` -> `LISTO` -> `ENTREGADO` / `CANCELADO`).
//     4. Disparar e-mail automático al cliente cuando el estado sea actualizado a `LISTO`.

export {};
