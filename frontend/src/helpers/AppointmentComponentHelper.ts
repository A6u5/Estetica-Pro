export const getStatusColor = (status: string) => {
    switch (status) {
        case 'Confirmado': return 'bg-green-100 text-green-800';
        case 'En progreso': return 'bg-blue-100 text-blue-800';
        case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
        case 'Cancelado': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export const getStatusText = (status: string) => {
    switch (status) {
        case 'Confirmado': return 'Confirmado';
        case 'En progreso': return 'En progreso';
        case 'Pendiente': return 'Pendiente';
        case 'Cancelado': return 'Cancelado';
        default: return status;
    }
};

export const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatDateISO = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getWeekDates = (currentDate) => {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    start.setDate(diff);

    const week: any = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        week.push(date);
    }
    return week;
};

export const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30'
];