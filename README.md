VirtualPaws – E-Commerce Website
Option 1: Run on Localhost

Install Node.js and VS Code

Open VS Code → Terminal → New Terminal

Clone the repository:

git clone https://github.com/AunZaidii/VirtualPaws-Ecom-Website


Go into the project folder:

cd VirtualPaws-Ecom-Website


Install dependencies:

1. npm install -g netlify-cli

2. npm i

3. npm install stripe

Environment Variables (.env)

Create a .env file in the project root and paste the following code:

SUPABASE_URL=""
SUPABASE_ANON_KEY=""

STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""

---code ends here---

Run the project locally by running this command in terminal:

4. netlify dev


The app will open at:
http://localhost:8888

--------------------------------------------------------------------------


Option 2: Run Online (Live Website)

Open the deployed website:
https://virtualpaws.netlify.app

