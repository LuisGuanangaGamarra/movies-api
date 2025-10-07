# 🎬 movies-api — Clean Architecture con NestJS + PostgreSQL

## 📖 Descripción general

**movies-api** es un backend modular y escalable desarrollado con **NestJS**, siguiendo los principios de **Domain-Driven Design (DDD)**, **Clean Architecture** y **SOLID**.  
Su objetivo principal es exponer una API RESTful para la gestión de películas (**Movies**) que puede integrarse con servicios externos como **SWAPI (Star Wars API)** y sincronizar información en una base de datos **PostgreSQL**.

La arquitectura está diseñada para mantener una alta cohesión y bajo acoplamiento, lo que facilita las pruebas unitarias, la evolución del sistema y su posible transición a microservicios.

---

## ⚙️ Tecnologías principales

| Capa | Tecnología |
|------|-------------|
| Framework principal | [NestJS](https://nestjs.com/) |
| ORM | [TypeORM](https://typeorm.io/) |
| Base de datos | PostgreSQL |
| Contenedores | Docker / Docker Compose |
| Validaciones | class-validator / class-transformer |
| Documentación | Swagger (OpenAPI) |
| Arquitectura | Clean Architecture + DDD |
| Testing | Jest (unit) |
| Mapeo de datos | morphism |
| Estilo de código | ESLint + Prettier |

---

## 🧱 Estructura del proyecto

```
movies-api/
│
├── src/
│   ├── movies/                         # Contexto de dominio principal
│   │   ├── application/                # Casos de uso (Use Cases)
│   │   ├── domain/                     # Entidades y repositorios de dominio
│   │   ├── infra/                      # Implementaciones concretas (TypeORM, mappers)
│   │   └── presentation/               # Controladores, DTOs, validaciones
│   │       
│   ├── auth/                           # Contexto de dominio principal
│   │   ├── application/                # Casos de uso (Use Cases)
│   │   ├── domain/                     # Entidades y repositorios de dominio
│   │   ├── infra/                      # Implementaciones concretas (TypeORM, mappers)
│   │   └── presentation/               # Controladores, DTOs, validaciones
│   │
│   ├── users/                           # Contexto de dominio principal
│   │   ├── application/                # Casos de uso (Use Cases)
│   │   ├── domain/                     # Entidades y repositorios de dominio
│   │   ├── infra/                      # Implementaciones concretas (TypeORM, mappers)
│   │   └── presentation/               # Controladores, DTOs, validaciones
│   │
│   ├── shared/                         # Elementos comunes reutilizables
│   │   ├── domain/                     # Excepciones y tipos compartidos
│   │   ├── infra/                      # Filtros globales, logging, interceptores y data source
│   │   └── presentation/               # Validadores y DTOs genéricos
│   │
│   ├── app.module.ts                   # Módulo raíz de la aplicación
│   └── main.ts                         # Punto de entrada de NestJS
│
├── test/                               # Carpeta de pruebas
│   ├── unit/                           # Tests unitarios
│   |   |── mocks                       # Datos de pruebas 
├── compose.yml                         # Orquestación de contenedores
├── Dockerfile                          # Imagen multi-stage de la app
├── .env.example                        # Variables de entorno base
└── README.md
```

---

## 📋 Requisitos mínimos

| Recurso | Versión mínima               |
|----------|------------------------------|
| Node.js | 22.x                         |
| npm | 10.x                         |
| Docker | 24.x                         |
| Docker Compose | 2.x                          |
| PostgreSQL | 15.x                         |
| Sistema operativo | Linux / macOS / Windows WSL2 |

---

## 🔑 Variables de entorno (.env)

Ejemplo de archivo `.env` necesario en la raíz del proyecto:

```bash
# NestJS
PORT=3000
NODE_ENV=development

# Database
DB_HOST=tv.movies-api.com
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=movies_db

# Admin user Inicial
USER_ADMIN=admin@localhost.com
PASSWORD_ADMIN=admin123

# JWT
JWT_SECRET=mysecretkey
JWT_EXPIRES=3600s
JWT_ISSUER=movies-api
JWT_AUDIENCE=movies-client
CORS_ORIGIN=http://localhost:8080

# External API
SWAPI_BASE_URL=https://www.swapi.tech/api
```

> 💡 Copia este contenido en un archivo llamado `.env` antes de levantar los contenedores.

---

## 🐳 Levantar el proyecto con Docker y Docker Compose

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/LuisGuanangaGamarra/movies-api.git
cd movies-api
```

### 2️⃣ Crear el archivo `.env`
Copia el ejemplo y ajusta las credenciales:
```bash
cp .env.example .env
```
### 3️⃣ Ajustar variables de entorno DB en `compose.yml`
```bash
    environment:
      POSTGRES_USER: <POSTGRES_USER>
      POSTGRES_PASSWORD: <POSTGRES_PASSWORD>
      POSTGRES_DB: <POSTGRES_DB>
```
recordar que estos valores deben ser iguales a los del archivo `.env`

### 4️⃣ Levantar los contenedores
Ejecuta:
```bash
docker-compose up -d --build
```

Esto levantará:
- `movies-api`: servidor NestJS (puerto 3000)
- `postgres`: base de datos PostgreSQL (puerto 5432)

Verifica que ambos estén corriendo:
```bash
docker ps
```

---

## 🧩 Ejecutar migraciones de TypeORM

de manera local se puede hacerlo con el comando 
```bash
npm run migration:local:run
```

Una vez que el contenedor esté corriendo:

```bash
docker exec -it movies-api npm run migration:run
```

> Esto aplicará todas las migraciones dentro de `src/migrations/` en la base de datos PostgreSQL definida en el `.env`.

Si necesitas revertir una migración:

```bash
docker exec -it movies-api npm run migration:revert
```

---

## 🧪 Ejecutar pruebas unitarias y coverage

Para correr los tests locales:

```bash
npm run test
```

Para generar reporte de cobertura:

```bash
npm run test:cov
```

Los reportes se guardan en:
```
coverage/unit/
```

---

## 📘 Documentación Swagger

Una vez levantado el proyecto, puedes acceder a la documentación interactiva:

```
http://localhost:3000/docs
```

---

## 🚀 Endpoints principales

| Método   | Endpoint                 | Descripción                                        |
|----------|--------------------------|----------------------------------------------------|
| `GET`    | `/movies`                | Listar todas las películas                         |
| `GET`    | `/movies?page=1&limit=5` | Lista y divide en paginas las películas            |
| `POST`   | `/movies/sync`           | Sincroniza las películas desde la Star Wars API    |
| `POST`   | `/movies`                | Crear una nueva película                           |
| `PATCH`  | `/movies`                | Actualizar película existente                      |
| `DELETE` | `/movies/:id`            | Eliminar una película                              |
| `POST`   | `/auth/login`            | Login en el sistema                                |
| `POST`   | `/users/register`        | registro de usuarios normales en el sistema        |
| `POST`   | `/users/register-admin`  | registro de usuarios administradores en el sistema |

---

## 🧠 Arquitectura (Clean + DDD)

El proyecto está dividido en capas **bien delimitadas**:

| Capa | Responsabilidad |
|------|------------------|
| `domain/` | Contiene las entidades de dominio, interfaces y lógica pura de negocio |
| `application/` | Orquesta casos de uso (use cases), sin depender de frameworks |
| `infra/` | Implementaciones concretas (ORM, mappers, persistencia, integraciones externas) |
| `presentation/` | Controladores, validaciones y DTOs expuestos a HTTP |
| `shared/` | Excepciones, validadores, utilidades y filtros globales |

---

## 🧹 Comandos útiles

| Acción | Comando |
|--------|----------|
| Iniciar en modo desarrollo | `npm run start:dev` |
| Compilar a producción | `npm run build` |
| Ejecutar la app compilada | `npm run start:prod` |
| Ejecutar tests unitarios | `npm run test` |
| Generar cobertura | `npm run test:cov` |
| Crear migración nueva | `npm run migration:generate --name <nombre>` |

---

## 🧔 Autor

**Luis Guananga Gamarra**  
Full Stack Developer — NestJS / Vue / React / DDD / Clean Architecture  
📧 [luisgamarra_97@hotmail.com](mailto:luisgamarra_97@hotmail.com)  
🌐 [LinkedIn](https://www.linkedin.com/in/luis-virgilio-guananga-gamarra) · [GitHub](https://github.com/LuisGuanangaGamarra)

---

## 🧾 Licencia

Este proyecto está licenciado bajo la **MIT License**.  
Puedes usarlo, modificarlo y distribuirlo libremente citando al autor.
