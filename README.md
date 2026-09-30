# 🚚 CHOWRA LOGISTICS AND COURIERS LIMITED

Modern responsive logistics and courier website built with React, TypeScript, Vite and Tailwind CSS.

## 🌐 URLs

- **Local:** http://localhost:3000
- **Production:** https://chowra.work.gd
- **GitHub:** https://github.com/venugopalareddy46/chowra

## ✨ Features

- Shipment tracking demo
- Domestic and international courier services
- Express delivery
- E-commerce logistics
- Freight and cargo
- Door-to-door pickup
- Corporate logistics
- Network coverage
- Rate calculator
- Booking demo
- Responsive UI
- Docker/Nginx deployment
- Kubernetes manifests

> **Demo notice:** Tracking, booking, pricing and operational data are simulated for this technical assignment.

## 🛠️ Technology

React · TypeScript · Vite · Tailwind CSS · Lucide React · Motion · Docker · Nginx · Docker Compose · Kubernetes · GitHub Actions · Prometheus

## 📁 Project Structure

```text
chowra/
├── src/
├── public/
├── k8s/
├── monitoring/
├── deploy/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
├── .env.development
├── .env.production
└── README.md
```

# 💻 Run Locally

### 1. Clone

```bash
git clone https://github.com/venugopalareddy46/chowra.git
cd chowra
```

### 2. Install

```bash
npm install
```

### 3. Start

```bash
npm run dev
```

Open **http://localhost:3000**.

Local configuration is stored in `.env.development`:

```env
VITE_APP_URL=http://localhost:3000
VITE_APP_ENV=development
```

# 🏗️ Production Build

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

Production configuration: `.env.production`

```env
VITE_APP_URL=https://chowra.work.gd
VITE_APP_ENV=production
```

# 🐳 Docker

### Build

```bash
docker build -t chowra-logistics:latest .
```

### Run

```bash
docker run -d --name chowra-logistics -p 3000:3000 chowra-logistics:latest
```

Open **http://localhost:3000**.

### Docker Compose

```bash
docker compose up -d --build
```

Check containers:

```bash
docker compose ps
docker compose logs -f chowra-web
```

Stop:

```bash
docker compose down
```

# 🌍 Production Deployment

Production domain:

**https://chowra.work.gd**

On the production server:

```bash
git clone https://github.com/venugopalareddy46/chowra.git
cd chowra
docker compose up -d --build
```

The application listens on server port `3000`. Nginx on the host can proxy the public domain to `127.0.0.1:3000`.

Example host Nginx configuration is available at:

```text
deploy/chowra.work.gd.nginx.conf
```

## DNS

Create an A record at your DNS provider:

```text
Type:  A
Name:  chowra
Value: <SERVER_PUBLIC_IP>
```

The DNS flow is:

```text
chowra.work.gd → Server Public IP → Host Nginx → Docker :3000
```

## HTTPS

Use a valid SSL certificate for `chowra.work.gd` (for example, Let's Encrypt/Certbot). Configure the host Nginx to listen on `443` and redirect port `80` to HTTPS.

Verify:

```bash
curl -I https://chowra.work.gd
curl https://chowra.work.gd/healthz
```

Expected health response:

```text
OK - Chowra Logistics Web Operational
```

# ☸️ Kubernetes

The Kubernetes manifests are in `k8s/`. They use the namespace `logistics-production`, the `chowra-logistics:latest` image, a ClusterIP service, Nginx Ingress and HPA.

### Build the image

Build and make `chowra-logistics:latest` available to your Kubernetes nodes. For a multi-node cluster, push the image to a registry accessible by all nodes and update `k8s/deployment.yaml` accordingly.

### Apply

```bash
kubectl apply -f k8s/
```

Check:

```bash
kubectl get pods -n logistics-production
kubectl get svc -n logistics-production
kubectl get ingress -n logistics-production
kubectl get hpa -n logistics-production
```

The Ingress is configured for:

```text
https://chowra.work.gd
```

For HTTPS with Kubernetes, cert-manager and an Nginx Ingress Controller must already be installed and configured with the `letsencrypt-prod` ClusterIssuer.

## 🩺 Health & Metrics

```text
/healthz
/metrics
```

Prometheus configuration is in `monitoring/prometheus.yml`. The Docker Compose stack exposes Prometheus on port `9090`.

## 🔒 Security

Never commit real API keys, passwords, tokens, cloud credentials or private keys. Use environment variables/secrets for sensitive values.

## 👨‍💻 Assignment

**Project:** Logistics Website Homepage  
**Company:** CHOWRA LOGISTICS AND COURIERS LIMITED  
**Purpose:** Technical Assignment  
**Developer:** Venu Gopala Reddy Eppala

## 📄 License

Technical assignment and demonstration project.


## Docker Production

Build and run the production container:

```bash
docker build -t chowra-logistics:latest .
docker run -d --name chowra-logistics -p 3000:3000 --restart unless-stopped chowra-logistics:latest
```

Verify:

```bash
curl http://localhost:3000/healthz
```

Production domain:

```text
https://chowra.work.gd
```

The container serves the application on port `3000`. Host-level Nginx/reverse proxy should terminate HTTPS and proxy `chowra.work.gd` to `127.0.0.1:3000`.
