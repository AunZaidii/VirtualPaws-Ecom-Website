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

SUPABASE_URL="https://oekreylufrqvuzgoyxye.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8"

STRIPE_SECRET_KEY="sk_test_51MwKmeIyVqcljaI7PRlUq65iCRl5V55knaYj8mwgC7oy9JKy2NwKsPad3OosfP6Z4JGkapulAodYoVYkQCDzqlUk00GwC8vQTP"
STRIPE_PUBLISHABLE_KEY="pk_test_51MwKmeIyVqcljaI7hC8SzLAxF82lYjfMjSq071Wg4a6NcqZFxslRLOXR9zPnO4d3ioU2R8A7udA0Vgap6WqWrJ8k003PkW1sMt"

---code ends here---

Run the project locally by running this command in terminal:

4. netlify dev


The app will open at:
http://localhost:8888

--------------------------------------------------------------------------


Option 2: Run Online (Live Website)

Open the deployed website:
https://virtualpaws.netlify.app

