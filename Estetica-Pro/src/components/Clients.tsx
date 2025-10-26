import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Search, Phone, Mail, User, DollarSign, Edit } from 'lucide-react';
import { getClients, addClient, updateClient } from "../services/ClientService";

export function Clients() {
  const [clientsData, setClientsData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // 🚀 Cargar clientes desde el backend
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await getClients();
      setClientsData(res);
    } catch (err) {
      console.error('Error al obtener clientes:', err);
    }
  };

  // ➕ Agregar nuevo cliente
  const handleAddClient = async (newClient: any) => {
    try {
      const res = await addClient(newClient);
      setClientsData([...clientsData, res]);
    } catch (err) {
      console.error('Error al agregar cliente:', err);
    }
  };

  // 🔄 Actualizar cliente existente
  const handleUpdateClient = async (id: number, updatedClient: any) => {
    try {
      const res = await updateClient(id, updatedClient);
      setClientsData(
        clientsData.map((c) => (c.id === id ? res : c))
      );
    } catch (err) {
      console.error('Error al actualizar cliente:', err);
    }
  };

  const filteredClients = clientsData?.filter((client) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  // 🧾 Formulario reutilizable (Agregar / Editar)
  const ClientForm = ({
    client,
    onClose,
    onSave
  }: {
    client?: any;
    onClose: () => void;
    onSave: (data: any) => void;
  }) => {
    const [formData, setFormData] = useState({
      name: client?.name || '',
      email: client?.email || '',
      phone: client?.phone || '',
      birthDate: client?.birthDate || '',
      preferences: client?.preferences || '',
    });

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = () => {
      if (client) {
        onSave({ ...formData, id: client.id });
      } else {
        onSave(formData);
      }
      onClose();
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre completo</Label>
            <Input id="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="birthDate">Fecha de nacimiento</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" value={formData.phone} onChange={handleChange} />
          </div>
        </div>

        <div>
          <Label htmlFor="preferences">Preferencias y notas</Label>
          <Textarea
            id="preferences"
            value={formData.preferences}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {client ? 'Actualizar' : 'Guardar'} Cliente
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 🔍 Header */}
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
            <Button variant="buttonAdd">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <ClientForm
              onClose={() => setIsAddDialogOpen(false)}
              onSave={handleAddClient}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* 🧍‍♀️ Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients?.map((client) => (
          <Card
            key={client.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{client.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Última visita:{' '}
                      {client.lastVisit
                        ? formatDate(client.lastVisit)
                        : 'Sin registro'}
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
                  <span className="font-medium">
                    ${client.totalSpent?.toLocaleString() || 0}
                  </span>
                </div>
                <Badge variant="secondary">
                  {client.services?.length || 0} servicios
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🧾 Editar cliente (Dialog) */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <ClientForm
              client={selectedClient}
              onClose={() => setSelectedClient(null)}
              onSave={(data) => handleUpdateClient(data.id, data)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}