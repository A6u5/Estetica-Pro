import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus, 
  Search, 
  Package, 
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Edit,
  Trash2,
  ShoppingCart
} from 'lucide-react';

// Mock data
const products = [
  {
    id: 1,
    name: 'Crema hidratante facial',
    category: 'Facial',
    currentStock: 2,
    minimumStock: 5,
    maxStock: 20,
    unitPrice: 850,
    supplier: 'Belleza Natural SA',
    lastRestock: '2024-01-15',
    description: 'Crema hidratante para todo tipo de piel'
  },
  {
    id: 2,
    name: 'Aceite esencial de lavanda',
    category: 'Aromaterapia',
    currentStock: 1,
    minimumStock: 3,
    maxStock: 10,
    unitPrice: 1200,
    supplier: 'Esencias del Valle',
    lastRestock: '2024-01-10',
    description: 'Aceite puro de lavanda para relajación'
  },
  {
    id: 3,
    name: 'Toallas desechables',
    category: 'Higiene',
    currentStock: 15,
    minimumStock: 20,
    maxStock: 100,
    unitPrice: 45,
    supplier: 'Distribuidora Clean',
    lastRestock: '2024-01-20',
    description: 'Toallas desechables premium'
  },
  {
    id: 4,
    name: 'Mascarilla de arcilla',
    category: 'Facial',
    currentStock: 8,
    minimumStock: 5,
    maxStock: 25,
    unitPrice: 680,
    supplier: 'Tierra Natural',
    lastRestock: '2024-01-18',
    description: 'Mascarilla purificante de arcilla verde'
  },
  {
    id: 5,
    name: 'Cera depilatoria',
    category: 'Depilación',
    currentStock: 12,
    minimumStock: 8,
    maxStock: 30,
    unitPrice: 520,
    supplier: 'Depi Pro',
    lastRestock: '2024-01-22',
    description: 'Cera tibia para depilación'
  },
  {
    id: 6,
    name: 'Esmalte de uñas',
    category: 'Manicure',
    currentStock: 25,
    minimumStock: 15,
    maxStock: 50,
    unitPrice: 280,
    supplier: 'Color Express',
    lastRestock: '2024-01-16',
    description: 'Esmalte de larga duración'
  },
];

const categories = ['Todos', 'Facial', 'Aromaterapia', 'Higiene', 'Depilación', 'Manicure'];

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [stockFilter, setStockFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todos' || product.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = product.currentStock <= product.minimumStock;
    } else if (stockFilter === 'normal') {
      matchesStock = product.currentStock > product.minimumStock;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockCount = products.filter(p => p.currentStock <= p.minimumStock).length;
  const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0);
  const totalProducts = products.reduce((sum, p) => sum + p.currentStock, 0);

  const getStockStatus = (product: typeof products[0]) => {
    if (product.currentStock <= product.minimumStock) {
      return { status: 'low', color: 'bg-red-100 text-red-800', text: 'Stock Bajo' };
    } else if (product.currentStock <= product.minimumStock * 1.5) {
      return { status: 'medium', color: 'bg-yellow-100 text-yellow-800', text: 'Stock Medio' };
    } else {
      return { status: 'good', color: 'bg-green-100 text-green-800', text: 'Stock Bueno' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const ProductForm = ({ product, onClose }: { product?: typeof products[0], onClose: () => void }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre del producto</Label>
          <Input 
            id="name" 
            placeholder="Nombre del producto"
            defaultValue={product?.name}
          />
        </div>
        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select defaultValue={product?.category}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.filter(c => c !== 'Todos').map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
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
          defaultValue={product?.description}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="currentStock">Stock actual</Label>
          <Input 
            id="currentStock" 
            type="number"
            placeholder="0"
            defaultValue={product?.currentStock}
          />
        </div>
        <div>
          <Label htmlFor="minimumStock">Stock mínimo</Label>
          <Input 
            id="minimumStock" 
            type="number"
            placeholder="0"
            defaultValue={product?.minimumStock}
          />
        </div>
        <div>
          <Label htmlFor="maxStock">Stock máximo</Label>
          <Input 
            id="maxStock" 
            type="number"
            placeholder="0"
            defaultValue={product?.maxStock}
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
            defaultValue={product?.unitPrice}
          />
        </div>
        <div>
          <Label htmlFor="supplier">Proveedor</Label>
          <Input 
            id="supplier" 
            placeholder="Nombre del proveedor"
            defaultValue={product?.supplier}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onClose}>
          {product ? 'Actualizar' : 'Agregar'} Producto
        </Button>
      </div>
    </div>
  );

  const RestockDialog = ({ product, onClose }: { product: typeof products[0], onClose: () => void }) => (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">Stock actual: {product.currentStock}</p>
        <p className="text-sm text-muted-foreground">Stock mínimo: {product.minimumStock}</p>
      </div>

      <div>
        <Label htmlFor="quantity">Cantidad a agregar</Label>
        <Input 
          id="quantity" 
          type="number"
          placeholder="0"
          defaultValue={product.maxStock - product.currentStock}
        />
      </div>

      <div>
        <Label htmlFor="cost">Costo total de la compra</Label>
        <Input 
          id="cost" 
          type="number"
          placeholder="0"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onClose}>
          Registrar Reposición
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Productos</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
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
                <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                </DialogHeader>
                <ProductForm onClose={() => setIsAddDialogOpen(false)} />
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
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
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
                      <span>{product.category}</span>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex-1">
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
                              onClose={() => {}} 
                            />
                          </DialogContent>
                        </Dialog>
                      )}
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
              product={selectedProduct} 
              onClose={() => setSelectedProduct(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}