import * as orderService from '../../services/order';

function createOrder(request, response, next) {
  const userId = request.user && request.user.id;
  const payload = request.body;
  if (userId) payload.customer.user = userId;

  orderService.createOrder(payload)
    .then((data) => {
      response.json({
        message: 'Pemesanan telah masuk',
        order: data,
      });
    })
    .catch(next);
}

function getOrders(request, response, next) {
  return orderService.getOrders({ page: request.query.page })
    .then((data) => response.json(data))
    .catch(next);
}

export default {
  createOrder,
  getOrders,
};
