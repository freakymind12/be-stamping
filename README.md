# 🖥 IoT Stamping (Backend)

**_IoT Stamping_** is a web-based application designed for realtime monitoring production line and monitoring shot control kanagata.

## Features

- ⚙ **PLC Polling** : Polling data from PLC using jsmodbus for resource data.
- 📅 **Production Plan** : CRUD production plan and visualize with calendar timeline.
- 📝 **Master Data** : CRUD for management master data such as machine, product, pca data.
- 📊 **Reporting Chart** : Graphic visualization to report production data with daily,monthly, yearly timeline.
- 🕔 **Realtime Production & Shot Monitoring** : Dashboard for realtime monitoring line status & kanagata shot

## Getting Started

### Clone Repository

```bash
git clone https://github.com/freakymind12/be-stamping.git
cd backend-booking
```

### Install dependencies

```bash
npm install
```

### Setup MySQL Database

Execute the `init.sql` file in your MySQL database to initialize the database and table schema.

### Environtment Variable

See `.env.example` for template making your environtment variable on file `.env`

### Run Application

Development Mode

```bash
npm run dev
```

Run with docker-compose

```bash
docker compose up -d
```

Access the REST API with your port config based on `.env` file you've been making

## Requirements

- NodeJS v20 or latest
- MySQL Database
