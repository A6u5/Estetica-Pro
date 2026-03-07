export const getUniqueClientsCount = (appointments: any[]) => {
  const uniqueClientIds = new Set(appointments.map(a => a.client_id));
  return uniqueClientIds.size;
};

export const getNewClientsCount = (todayAppointments: any[], pastAppointments: any[]) => {
  const todayClientIds = new Set(todayAppointments.map(a => a.client_id));
  const pastClientIds = new Set(pastAppointments.map(a => a.client_id));

  const newClients = [...todayClientIds].filter(id => !pastClientIds.has(id));
  return newClients.length;
};