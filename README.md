- check continuaity, meaning Parter is always partner or did we use at some point person?
- disaply somewhere the overview of total income this month, total saving, total investment, total money to spend and always in relatoin to total income
- think about how to set all this per month and create months and be able to restore momths

# Contigos - Fair Household Calculator

A Next.js 16 web application for couples to calculate fair financial contributions to a shared household account based on income ratios.

## 🚀 Tech Stack

- **Next.js 16** with App Router
- **React 19.2**
- **Tailwind CSS** for styling
- **Neon Postgres** for database
- **Prisma** as ORM
- **TypeScript** for type safety

## 📋 Features

- **Fair Distribution**: Calculate contributions based on income ratios
- **Expense Tracking**: Add, edit, and delete household expenses
- **Real-time Calculations**: Instant updates as you change values
- **Shared Account Management**: Track what goes into the joint account
- **Previous Month Balance**: Consider leftover money from previous months

## 🏗️ Development Status

This project is currently under development. See [PROJECT_SPEC.md](./PROJECT_SPEC.md) for detailed requirements and specifications.

## 🛠️ Setup

```bash
# Clone the repository
git clone https://github.com/pa2si/contigos.git
cd contigos

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with the Neon connection strings from the Vercel integration.
# DATABASE_URL must use Neon’s pooled connection URL.
# DIRECT_URL must use Neon’s direct, non-pooled connection URL.

# Apply the existing Prisma migration history to the new database
npx prisma migrate deploy

# Run development server
npm run dev
```

## Migrate Existing Data to Neon

For a new, empty Neon database, copy the existing PostgreSQL schema and data
before replacing your local connection strings. Use direct (non-pooled) URLs for
both databases:

```bash
export OLD_DIRECT_URL='your_supabase_direct_postgres_url'
export NEON_DIRECT_URL='your_neon_direct_postgres_url'

pg_dump --format=custom --no-owner --no-acl --dbname="$OLD_DIRECT_URL" --file=contigos.backup
pg_restore --clean --if-exists --no-owner --no-acl --dbname="$NEON_DIRECT_URL" contigos.backup
```

Then set `DATABASE_URL` and `DIRECT_URL` in `.env.local` to the Neon URLs and
add those same variables to the Vercel project. Confirm the migration history
and schema with:

```bash
npx prisma migrate status
```

Keep `contigos.backup` private and delete it after verifying the deployment.

## 📖 How It Works

1. **Enter Incomes**: Input both partners' monthly incomes
2. **Add Expenses**: List all household expenses with who paid
3. **Calculate Contributions**: The app calculates fair transfers to the joint account
4. **Track Balances**: See what each partner has left for personal use

## 🤝 Contributing

This is a personal project, but feel free to open issues for suggestions or improvements.

## 📄 License

MIT License - see LICENSE file for details.
