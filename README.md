<h1 align="center">
💅 Sistema de Gestión para Centro de Estética
</h1>

<p align="center">
Aplicación web full-stack para administrar clientes, turnos, servicios, pagos y control de stock.
</p>

<p align="center">
💻 Proyecto Full-Stack · ⚛️ React · 🟢 Node.js · 🐘 PostgreSQL
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js" />
  <img src="https://img.shields.io/badge/Express-API-000000?logo=express" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql" />
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?logo=vite" />
  <img src="https://img.shields.io/badge/license-MIT-blue"/>
</p>

![App Preview](docs/screenshots/Dashboard.png)


## 📝 Descripción

Aplicación web full-stack para la administración de un centro de estética.  
Permite gestionar clientes, turnos, servicios, pagos y control de stock de productos.

El objetivo del proyecto es ofrecer una herramienta simple para organizar la agenda del negocio y registrar las operaciones diarias.

---

## ✨ Funcionalidades

- Gestión de clientes
- Registro y administración de turnos
- Gestión de servicios
- Registro de pagos
- Control de stock de productos
- Administración de proveedores
- Alertas de stock mínimo
- Interfaz web intuitiva

---

## 🛠️ Tecnologías utilizadas

### 🎨 Frontend

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" title="React"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" width="40" title="Vite"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="40" title="CSS3"/>
</p>

### 🧠 Backend

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="40" title="Node.js"/>
  <img src="https://cdn.simpleicons.org/express/ffffff" width="40"/>
</p>

### 🗄️ Base de datos

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="40" title="PostgreSQL"/>
</p>

### 🔧 Otras herramientas

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="40" title="Git"/>
  <img src="https://cdn.simpleicons.org/github/ffffff" width="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="40" title="pgAdmin"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" width="40" title="Figma"/>
</p>

---

## 🏗️ Arquitectura del proyecto

El proyecto está dividido en dos partes principales:

- **/frontend** → aplicación web desarrollada con React
- **/backend** → API REST y conexión a base de datos PostgreSQL

---

### 🖥️ Frontend

Estructura simplificada:
```
frontend
├─ public
│ ├─ favicon.png
├─ src
│ ├─ components
│ ├─ pages
│ ├─ services
│ ├─ assets
│ └─ App.jsx
├─ index.html
└─ package.json
```
El frontend se encarga de:

- interfaz de usuario
- gestión del estado
- consumo de la API REST
- visualización de datos

---

### ⚙️ Backend

Estructura simplificada:
```
backend
├─ src
│ ├─ controllers
│ ├─ routes
│ ├─ database
│ │ ├─ db.js
│ │ └─ initDB.js
│ └─ index.js
└─ package.json
```

El backend expone una API REST para manejar:

- clientes
- turnos
- servicios
- pagos
- productos
- proveedores

---
## 📦 Instalación

### 1. Clonar el repositorio
```git clone https://github.com/A6u5/sistema-gestion-estetica.git```

---

### 2. Backend
- ```cd backend```
- ```npm install```

Crear archivo `.env`:
- `PGUSER=postgres`
- `PGPASSWORD=tu_password`
- `PGHOST=localhost`
- `PGPORT=5432`
- `PGDATABASE=estetica`

Ejecutar el servidor:
- `node src/index.js`

---

### 3. Frontend
- `cd frontend`
- `npm install`
- `npm run dev`

La aplicación estará disponible en:
- `http://localhost:5173`

---

## 📸 Capturas de pantalla

### 📊 Dashboard
![Dashboard](docs/screenshots/Dashboard.png)
---

### 👩‍💼 Gestión de clientes
![Clientes](docs/screenshots/Clientes.png)
---

### 📅 Turnos
![Turnos](docs/screenshots/Turnos.png)
---

### 💳 Pagos
![Pagos](docs/screenshots/Pagos.png)
---

### 📦 Control de stock
![Stock](docs/screenshots/Stock.png)
---

### 📈 Resumen
![Resumen](docs/screenshots/Resumen.png)

## 🚀 Posibles mejoras futuras

- Autenticación de usuarios
- Panel de estadísticas
- Recordatorios automáticos de turnos
- Sistema de roles (administrador / empleado)
- Deploy en la nube

---

## 👨‍💻 Autores

Desarrollado por Agustín Torres, Selene Mailén Ojeda y Melani Mauri.

Proyecto realizado como práctica de desarrollo full-stack utilizando React, Node.js y PostgreSQL.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

Puedes consultar el archivo LICENSE para más información.
