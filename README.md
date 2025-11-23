🐾 VirtualPaws – E-Commerce Website

A complete pet e-commerce platform built using HTML, CSS, JavaScript, Supabase, Netlify Functions, and Stripe Payments.

Live Website:
👉 https://virtualpaws.netlify.app/

GitHub Repository:
👉 https://github.com/AunZaidii/VirtualPaws-Ecom-Website

📌 Table of Contents

About the Project

Tech Stack

Project Features

How to Run the Project Locally

Requirements

Cloning the Repo

Opening in VS Code

Installing Dependencies

Running the Project

Running the Project Online

Environment Variables

Folder Structure

Author

🐶 About the Project

VirtualPaws is a fully functional e-commerce website for pet lovers. It includes:

✔ User authentication
✔ Shopping cart
✔ Pet adoption system
✔ Stripe payment integration
✔ Order tracking
✔ User profile management
✔ Admin dashboard
✔ Supabase-powered backend
✔ Netlify serverless functions

⚙️ Tech Stack

Frontend

HTML5

CSS3

JavaScript (ES Modules)

Stripe.js for card payments

Backend

Netlify Serverless Functions

Supabase Database

Deployment

Netlify Hosting

GitHub Repository

🚀 How to Run the Project Locally

Follow the complete step-by-step guide below.
This is Method 1 for running locally on your system.

✔️ 1. Requirements

Before running the project, install:

1️⃣ Node.js

Download & install from:
https://nodejs.org/en/

Verify installation:

node -v
npm -v

2️⃣ Visual Studio Code

Download & install from:
https://code.visualstudio.com/

✔️ 2. Clone the Repository
1️⃣ Open VS Code

Click Start Menu

Search for "VS Code" → Open

2️⃣ Open Terminal in VS Code

Top Menu → Terminal → New Terminal

3️⃣ Run the clone command:
git clone https://github.com/AunZaidii/VirtualPaws-Ecom-Website

4️⃣ Navigate into the project folder:
cd VirtualPaws-Ecom-Website

✔️ 3. Install Dependencies

Run each of the following commands inside the terminal:

Install Netlify CLI globally:
npm install -g netlify-cli

Install project dependencies:
npm i

Install Stripe dependency:
npm install stripe


✔️ Yes — these commands are correct and required.

✔️ 4. Run the Project Using Netlify Dev

To start the local development server:

netlify dev


This will:

Serve your HTML/CSS/JS

Run all Netlify functions

Connect to Supabase

Enable Stripe

Launch on:
👉 http://localhost:8888

You can now use the site exactly like the live version.

🌍 Running the Project Online

This is Method 2.
If you don't want to run locally, simply visit:

👉 https://virtualpaws.netlify.app/

Everything is deployed and ready to use.

🔑 Environment Variables

To run all features (Supabase + Stripe), create a .env file in the project root:

SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_anon_key

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key


Netlify automatically loads these in production via Dashboard → Environment Variables.

📁 Folder Structure
VirtualPaws-Ecom-Website/
│
├── Authentication/
├── Adoption/
├── Admin_Panel/
├── cart-and-checkout/
│     ├── checkout.html
│     ├── checkout.js
│
├── netlify/
│     └── functions/
│           ├── getCart.js
│           ├── createOrder.js
│           ├── createStripePayment.js
│           └── ...
│
├── utils/
│     ├── apiClient.js
│     ├── config.js
│     ├── authGuard.js
│
└── index.html

👨‍💻 Author

Aun Zaidi
GitHub: https://github.com/AunZaidii

Live Site: https://virtualpaws.netlify.app/
