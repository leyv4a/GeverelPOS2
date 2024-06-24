const sumarSubtotales = (carritoItems) => {
    return carritoItems.reduce((total, item) => total + item.subtotal, 0);
  };

  module.exports = sumarSubtotales