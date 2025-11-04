export const getStockStatus = (product: any) => {
    if (product.currentStock <= product.minimumStock) {
        return { 
            status: 'low', 
            color: 'bg-red-100 text-red-800', 
            text: 'Stock Bajo' 
        };
    } else if (product.currentStock <= product.minimumStock * 1.5) {
        return { 
            status: 'medium', 
            color: 'bg-yellow-100 text-yellow-800', 
            text: 'Stock Medio' 
        };
    } else {
        return { 
            status: 'good', 
            color: 'bg-green-100 text-green-800', 
            text: 'Stock Bueno' 
        };
    }
};

export const getStockSummary = (products: any) => {
  if (!Array.isArray(products) || products.length === 0) {
    return {
      lowStockCount: 0,
      totalValue: 0,
      totalProducts: 0
    };
  }

  const lowStockCount = products.filter(p => p.currentStock <= p.minimumStock).length;
  const totalValue = products.reduce((sum, p) => sum + (p.currentStock * (p.unitPrice || 0)), 0);
  const totalProducts = products.reduce((sum, p) => sum + (p.currentStock || 0), 0);

  return {
    lowStockCount,
    totalValue,
    totalProducts
  };
};