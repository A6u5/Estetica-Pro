import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  User,
  Calendar,
  DollarSign,
  Edit
} from 'lucide-react';

// Mock data
const clients = [
  {
    id: 1,
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+54 11 1234-5678',
    birthDate: '1985-03-15',
    preferences: 'Prefiere tratamientos naturales',
    totalSpent: 4500,
    lastVisit: '2024-01-20',
    services: [
      { date: '2024-01-20', service: 'Limpieza facial', price: 800 },
      { date: '2024-01-10', service: 'Manicure', price: 600 },
      { date: '2023-12-28', service: 'Masaje relajante', price: 1200 },
    ]
  },
  {
    id: 2,
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@email.com',
    phone: '+54 11 2345-6789',
    birthDate: '1990-07-22',
    preferences: 'Le gusta probar nuevos tratamientos',
    totalSpent: 3200,
    lastVisit: '2024-01-18',
    services: [
      { date: '2024-01-18', service: 'Depilación', price: 900 },
      { date: '2024-01-05', service: 'Tratamiento capilar', price: 1500 },
    ]
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos.lopez@email.com',
    phone: '+54 11 3456-7890',
    birthDate: '1988-11-08',
    preferences: 'Prefiere masajes deportivos',
    totalSpent: 2800,
    lastVisit: '2024-01-15',
    services: [
      { date: '2024-01-15', service: 'Masaje deportivo', price: 1400 },
      { date: '2024-01-01', service: 'Limpieza facial', price: 800 },
    ]
  },
];

export function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const ClientForm = ({ client, onClose }: { client?: typeof clients[0], onClose: () => void }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre completo</Label>
          <Input 
            id="name" 
            placeholder="Nombre completo"
            defaultValue={client?.name}
          />
        </div>
        <div>
          <Label htmlFor="birthDate">Fecha de nacimiento</Label>
          <Input 
            id="birthDate" 
            type="date"
            defaultValue={client?.birthDate}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="email@ejemplo.com"
            defaultValue={client?.email}
          />
        </div>
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input 
            id="phone" 
            placeholder="+54 11 1234-5678"
            defaultValue={client?.phone}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="preferences">Preferencias y notas</Label>
        <Textarea 
          id="preferences" 
          placeholder="Preferencias del cliente, alergias, notas especiales..."
          defaultValue={client?.preferences}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onClose}>
          {client ? 'Actualizar' : 'Guardar'} Cliente
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <ClientForm onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{client.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Última visita: {formatDate(client.lastVisit)}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedClient(client)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {client.email}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {client.phone}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">${client.totalSpent.toLocaleString()}</span>
                </div>
                <Badge variant="secondary">
                  {client.services.length} servicios
                </Badge>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setSelectedClient(client)}
              >
                Ver Historial
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Client Detail Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              {selectedClient?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedClient && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4">
                <ClientForm 
                  client={selectedClient} 
                  onClose={() => setSelectedClient(null)} 
                />
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${selectedClient.totalSpent.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">Total gastado</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedClient.services.length}
                      </div>
                      <p className="text-sm text-muted-foreground">Servicios totales</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatDate(selectedClient.lastVisit)}
                      </div>
                      <p className="text-sm text-muted-foreground">Última visita</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Historial de Servicios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedClient.services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{service.service}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(service.date)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">
                              ${service.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}