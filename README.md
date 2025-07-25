# 🚀 **CMS REST API — The Ultimate Headless Content Engine**

Manage users, publish articles, and track page views with blazing-fast, secure, and scalable REST API — all powered by TypeScript, Node.js, Express, and MongoDB.

## 🎯 Why Choose This CMS REST API?

- **Production-Ready**: Battle-tested architecture for real-world apps.
- **Secure by Design**: Robust authentication, password hashing, and rate-limiting keep your platform safe.
- **Extensible & Easy to Integrate**: RESTful API structure, perfect for any modern frontend framework.
- **Real-Time Analytics**: Track page views and understand your audience instantly.

## ✨ **Key Features**

- **User Management**  
  Effortlessly create, update, and delete users with industry-standard security.

- **JWT Authentication**  
  Login, protect routes, and manage sessions with ease.

- **Dynamic Article Publishing**  
  Write, edit, and manage articles — draft or publish in just a click.

- **Page View Insights**  
  Detailed tracking and analytics to help you grow your content.

- **Rock-Solid Security**  
  Rate limiting, CORS controls, and bcrypt password hashing out-of-the-box.

## ⚙️ **Core Tech Stack**

- **TypeScript** (static typing, safer code)
- **Node.js** & **Express** (ultra-fast service layer)
- **MongoDB** + Mongoose (flexible NoSQL database, rapid iteration)
- **JWT** for secure authentication flows
- **REST JSON APIs** scaffolded for clarity and maintainability

## 🚦 **Get Started in Minutes!**

### Prerequisites

- Node.js (v14+)
- MongoDB (v4+)
- npm **or** yarn

### Quick Install

1. **Clone & Enter the Project**
    ```bash
    git clone https://github.com/yourusername/cms-rest.git
    cd cms-rest
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**
    ```bash
    cp .env.example .env
    # Edit .env as needed
    ```

4. **Start MongoDB**  
   Most easily via Docker Compose (recommended):
    ```bash
    docker-compose up
    ```
   Or, for manual DB setup, read [MongoDB Initialization Instructions](MONGODB_INIT_INSTRUCTIONS.md).

5. **Run the Development Server**
    ```bash
    npm run dev
    # Now live at http://localhost:3000 🚀
    ```

## 🛠️ **Build & Deploy**

- **Production Build**
    ```bash
    npm run build
    ```
- **Start Production Server**
    ```bash
    npm start
    ```

## 🌱 **Database Seeder**

Quickly populate your database with sample data for development and testing:

- **Run Seeder (Development)**
    ```bash
    npm run seed
    ```
    This will clear existing data and seed the database with sample users, articles, and page views.

- **Run Seeder (Production)**
    ```bash
    npm run build
    npm run seed:prod
    ```

- **Seeding Options**
    ```bash
    # Explicitly clear existing data (default behavior)
    npm run seed:clear
    
    # Keep existing data and add seed data
    npm run seed:no-clear
    ```

### Sample Data Created

The seeder creates:

- **Users**: 5 sample users including an admin and regular users (all with password: `password123`, admin: `admin123`)
- **Articles**: 10 sample articles (mix of published and draft) distributed among users
- **Page Views**: Random page views for published articles over the last 30 days

This makes it easy to test and develop features without manually creating test data.

## 📚 **Available API Endpoints**

#### **Authentication**
- `POST /auth/login` — Login with username & password
- `POST /auth/logout` — Logout

#### **Users**
- `GET /user` — Browse all users
- `GET /user/:id` — Fetch user by ID
- `POST /user` — Create a new user (authenticated)
- `PATCH /user/:id` — Update current user profile
- `DELETE /user/:id` — Remove user account

#### **Articles**
- `GET /article` — List all published articles
- `GET /article/me` — List articles by current user
- `GET /article/:id` — Read a specific article
- `POST /article` — Publish a new article
- `PATCH /article/:id` — Edit your article
- `DELETE /article/:id` — Delete your article

#### **Page Views**
- `POST /page-view` — Record an article view
- `GET /page-view/count` — Aggregate page views
- `GET /page-view/aggregate-date` — Breakdown page views by date

## 🗃️ **Data Models at a Glance**

| 🧑‍💻 **User**     | 📄 **Article**     | 👁️ **PageView**     |
|-------------|------------------|------------------|
| id          | id               | id               |
| name        | status           | article          |
| username    | title            | viewedAt         |
| passwordHash| content          |                  |
| createdAt   | user             |                  |
| updatedAt   | createdAt        |                  |
|             | updatedAt        |                  |

## 🛡️ **Pro-Grade Security**

- **Hashed Passwords** (bcrypt)
- **JWT Auth with Expiry**
- **Rate Limiting** (anti-brute-force)
- **Flexible CORS**
- **Strict Input Validation**

## 🐳 **Effortless Docker Support**

Spin up everything in seconds:
```bash
docker-compose up
```
- **Pre-configured MongoDB**: Collections, performance indexes, sample admin & article.
- **Turnkey Demo**: Start experimenting *right away*.

See [`MONGODB_INIT_INSTRUCTIONS.md`](MONGODB_INIT_INSTRUCTIONS.md) for manual DB initialization.

## 📄 **License**

MIT — do whatever you want! See the [LICENSE](LICENSE) file.

## 💡 Ready to supercharge your next web app?
**Clone, run, and start building today!** 🚀

---