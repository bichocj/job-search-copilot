# Job Search Copilot

Una herramienta que uso para mi propia búsqueda de trabajo: guardo cada
vacante a la que aplico, y un agente IA analiza qué tan bien calza contra
mi perfil real (no el que me gustaría tener — el real).

## Cómo funciona

1. Agregas una vacante (empresa, rol, URL) desde el dashboard.
2. Le pides al agente que la analice ("Analyze fit").
3. El agente (`AgentService` + `job-analysis.mcp-server.ts`) usa dos
   herramientas: `fetch_job_posting` (trae y limpia el HTML de la vacante)
   y `get_candidate_profile` (mi perfil real, en `src/profile/profile.data.ts`).
4. El resultado — stack detectado, skills que sí calzan, gaps reales, y un
   flag de ubicación/remoto si aplica — se guarda junto a la vacante.

## Por qué es honesto por diseño

`profile.data.ts` incluye una lista explícita de `noExperience` (blockchain,
Ruby on Rails, RabbitMQ, Azure, etc.) — cosas que NO debo reclamar tener.
El system prompt del agente le pide explícitamente no inventar experiencia.
Esto refleja el mismo criterio que hemos usado en cada vacante real que
analizamos manualmente: mejor un "no tengo esto" honesto que una mentira
que se cae en la entrevista.

**Actualiza `profile.data.ts` conforme aprendas cosas nuevas** (ej. cuando
termines Terraform, sube los años de esa skill) — es la fuente de verdad
que el agente usa.

## Cómo correrlo

### Backend

```bash
cd job-search-copilot   # la raíz de este proyecto
npm install
cp .env.example .env
# pega tu ANTHROPIC_API_KEY, y configura PostgreSQL (local o Docker)

npm run start:dev
```
- API: `http://localhost:3000`
- Swagger docs: `http://localhost:3000/docs`

### Frontend

```bash
cd web
npm install
cp .env.example .env

npm run dev
```
- Dashboard: `http://localhost:3001`

## Despliegue en AWS con Terraform

La infraestructura vive en `infra/`. La estrategia es simple a propósito
(para aprender Terraform sin perderte en configuración de redes avanzada):
**una sola instancia EC2** que corre los 3 servicios (API, web, Postgres)
con Docker Compose.

### 1. Sube tu propio código a GitHub

Terraform no sube archivos — la instancia clona tu repo por su cuenta al
arrancar. Crea un repo en GitHub (puede ser privado si usas un token, o
público si no te importa) y sube este proyecto tal cual está.

### 2. Configura las variables

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# edita terraform.tfvars con tu URL de repo real y tu ANTHROPIC_API_KEY
```

### 3. Despliega

```bash
terraform init
terraform plan   # revisa qué se va a crear antes de aplicar
terraform apply
```

Terraform te va a mostrar al final:
- `web_dashboard_url` — abre esto en tu navegador (dale ~2-3 minutos
  después de `apply` para que la instancia termine de instalar Docker y
  levantar los contenedores).
- `api_docs_url` — el Swagger de la API.
- `ssh_command` — para entrar a la instancia y revisar logs si algo falla
  (`docker compose logs -f` dentro de la carpeta `app`).

### 4. Cuando termines de probarlo

```bash
terraform destroy
```

Esto es importante — una instancia EC2 corriendo genera costo mientras
exista. Bájala cuando no la estés usando activamente para portafolio.

### Notas de seguridad (léelas antes de compartir esto públicamente)

- `allowed_ssh_cidr` por defecto permite SSH desde cualquier IP
  (`0.0.0.0/0`) — para un proyecto real, cámbialo a tu IP específica.
- La llave privada SSH se genera automáticamente y se guarda como
  `infra/job-search-copilot-key.pem` — ya está en `.gitignore`, pero
  verifica que nunca la subas a un repo público.
- Postgres corre sin backups ni réplica — perfecto para demo/portafolio,
  no para datos que te importe perder.



- Desplegar ambos (API + web) con Terraform, igual que el proyecto anterior.
- Agregar autenticación si lo vas a compartir o exponer públicamente.
- Extender el agente para que también sugiera un borrador de cover letter
  automáticamente al guardar una vacante nueva.
