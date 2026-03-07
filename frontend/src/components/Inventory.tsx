import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Search, Package, AlertTriangle, TrendingUp, Edit, Trash2, ShoppingCart } from 'lucide-react';
import { createStock, deleteStock, getAllStock, updateStock } from '../services/InventoryService';
import { getCategories } from '../services/MasterDataService';
import { formatDateISO } from '../helpers/AppointmentComponentHelper';
import { getStockStatus, getStockSummary } from '../helpers/InventoryComponentHelper';

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDialogRestockOpen, setIsDialogRestockOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  useEffect(() => {
    fetchAllInventories();
    fetchCategories();
  }, []);

  const fetchAllInventories = async () => {
    try {
      const res = await getAllStock();
      setProducts(res);
    } catch (err) {
      console.error('Error al obtener productos:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res);
    } catch (error) {
      console.error('Error al traer las categorias:', error);
    }
  };

  const handleAddProduct = async (newProduct: any) => {
    try {
      const res = await createStock(newProduct);
      setProducts(prev => [...prev, res.stock]);
    } catch (err) {
      console.error('Error al agregar producto:', err);
    }
  };
  
  const handleUpdateProduct = async (id: number, updatedProduct: any) => {
    try {
      const res = await updateStock(id, updatedProduct);
      setProducts(
        products.map((c) => (c.id === id ? res : c))
      );
    } catch (err) {
      console.error('Error al actualizar el producto:', err);
    }
  };
  
  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteStock(productId);
      setProducts(prev => prev.filter(a => a.id !== productId));
    } catch (err) {
      console.error('Error al eliminar producto:', err);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;

    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = product.currentStock <= product.minimumStock;
    } else if (stockFilter === 'normal') {
      matchesStock = product.currentStock > product.minimumStock;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const ProductForm = ({ product, onClose, onSave}: { product?: any, onClose: () => void, onSave: (data: any) => void; }) => {
  
    const [formData, setFormData] = useState({
      name: product?.name || "",
      category_id: product?.category_id || "",
      currentStock: product?.currentStock || 0,
      minimumStock: product?.minimumStock || 0,
      maxStock: product?.maxStock || 0,
      unitPrice: product?.unitPrice || 0,
      supplier: product?.supplier || "",
      lastRestock: product?.lastRestock ? formatDateISO(new Date(product.lastRestock)) : null,
      description: product?.description || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value, type } = e.target;
      setFormData(prev => ({...prev,
        [id]: type === "number" ? Number(value) : value
      }));
    };

    const handleSelectChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
      if (product) onSave({ ...formData, id: product.id });
      else onSave(formData);
      onClose();
    };
    
    return(<div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre del producto</Label>
          <Input 
            id="name" 
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre del producto"
          />
        </div>
        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select value={formData.category_id}
          onValueChange={(value: any) => handleSelectChange("category_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Input 
          id="description" 
          placeholder="Descripción del producto"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="currentStock">Stock actual</Label>
          <Input 
            id="currentStock" 
            type="number"
            placeholder="0"
            value={formData.currentStock}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="minimumStock">Stock mínimo</Label>
          <Input 
            id="minimumStock" 
            type="number"
            placeholder="0"
            value={formData.minimumStock}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="maxStock">Stock máximo</Label>
          <Input 
            id="maxStock" 
            type="number"
            placeholder="0"
            value={formData.maxStock}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="unitPrice">Precio unitario</Label>
          <Input 
            id="unitPrice" 
            type="number"
            placeholder="0"
            value={formData.unitPrice}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="supplier">Proveedor</Label>
          <Input 
            id="supplier" 
            placeholder="Nombre del proveedor"
            value={formData.supplier}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          {product ? 'Actualizar' : 'Agregar'} Producto
        </Button>
      </div>
    </div>
  );
  }

  const RestockDialog = ({ product, onClose, onUpdate }: { product: any, onClose: () => void, onUpdate: (id: number, updatedProduct: any) => Promise<void>;}) =>{

    const [formData, setFormData] = useState({
      id: product?.id || "",
      name: product?.name || "",
      category_id: product?.category_id || "",
      currentStock: product?.currentStock || 0,
      unitPrice: product?.unitPrice || 0,
      supplier: product?.supplier || "",
      lastRestock: new Date().toISOString().split("T")[0],
      quantityToAdd: 0,
      newUnitPrice: product?.unitPrice || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProduct = {
      ...product,
      currentStock: product.currentStock + Number(formData.quantityToAdd),
      unitPrice: Number(formData.newUnitPrice),
      lastRestock: formData.lastRestock,
    };

    try {
      await onUpdate(formData.id, updatedProduct);
      // alert("Stock actualizado correctamente");
      onClose();
    } catch (error) {
      console.error("Error al actualizar el stock:", error);
      // alert("Ocurrió un error al actualizar el stock");
    }
  }

  const totalCost = formData.quantityToAdd * formData.newUnitPrice;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-1">
          Stock actual: {product.currentStock}
        </p>
        <p className="text-sm text-muted-foreground mb-1">
          Stock mínimo: {product.minimumStock}
        </p>
        <p className="text-sm text-muted-foreground">
          Máximo permitido: {product.maxStock}
        </p>
      </div>

      <div>
        <Label htmlFor="quantityToAdd">Cantidad a agregar</Label>
        <Input
          id="quantityToAdd"
          type="number"
          min="0"
          value={formData.quantityToAdd}
          onChange={handleChange}
          placeholder="0"
        />
      </div>

      <div>
        <Label htmlFor="newUnitPrice">Nuevo precio unitario</Label>
        <Input
          id="newUnitPrice"
          type="number"
          min="0"
          value={formData.newUnitPrice}
          onChange={handleChange}
          placeholder="0"
        />
      </div>

      <div className="text-sm text-muted-foreground">
        Costo total de la compra: <strong>${isNaN(totalCost) ? 0 : totalCost.toFixed(2)}</strong>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="buttonAdd" type="submit">
          Registrar Reposición
        </Button>
      </div>
    </form>
  );
}

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Productos</p>
                <p className="text-2xl font-bold">{getStockSummary(products).totalProducts}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor del Inventario</p>
                <p className="text-2xl font-bold text-green-600">${getStockSummary(products).totalValue.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Productos con Stock Bajo</p>
                <p className="text-2xl font-bold text-red-600">{getStockSummary(products).lowStockCount}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestión de Inventario</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="buttonAdd">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                </DialogHeader>
                <ProductForm 
                onClose={() => setIsAddDialogOpen(false)}
                onSave={handleAddProduct} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el stock</SelectItem>
                <SelectItem value="low">Stock bajo</SelectItem>
                <SelectItem value="normal">Stock normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const stockInfo = getStockStatus(product);
              return (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base mb-1">{product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>
                      <Badge className={stockInfo.color}>
                        {stockInfo.text}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Categoría:</span>
                      <span>{product.category_name}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stock actual:</span>
                      <span className="font-medium">{product.currentStock}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stock mínimo:</span>
                      <span>{product.minimumStock}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Precio unitario:</span>
                      <span className="font-medium">${product.unitPrice}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor total:</span>
                      <span className="font-medium text-green-600">
                        ${(product.currentStock * product.unitPrice).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      
                      {product.currentStock <= product.minimumStock && (
                        <Dialog  open={isDialogRestockOpen} onOpenChange={setIsDialogRestockOpen}>
                          <DialogTrigger asChild>
                            <Button variant="buttonAdd" size="sm" className="flex-1">
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Reabastecer
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reabastecer Producto</DialogTitle>
                            </DialogHeader>
                            <RestockDialog 
                              product={product} 
                              onClose={() => setIsDialogRestockOpen(false)} 
                              onUpdate={handleUpdateProduct}
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button variant="outline" size="sm"
                        onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron productos con los filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm 
              onSave={(data) => handleUpdateProduct(data.id, data)}
              product={selectedProduct} 
              onClose={() => setSelectedProduct(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}