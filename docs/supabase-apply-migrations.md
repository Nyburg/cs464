# Apply Migrations

## Local

To apply migrations to your development supabase installation, run the following commands:

```bash
npm run db:start
npm run db:migrate
npm run db:restart
```

This ensures supabase is running, applies migrations, then restarts the supabase instance to apply changes to the supabase config.

## Remote

1. Use the Supabase CLI to login & link the project. You can generate the following command by clicking "CLI setup commands" in the dashboard "Copy" menu (make sure to remove `supabase init` and add `npx` before each command). Alternatively, your project "ref" is the path component after `/project/` in the web URL; you can replace `<your-project-ref>` with it and proceed.
  - This will prompt you to enter your web browser and login to Supabase; make sure you login to the correct account and follow the CLI instructions.

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
```

2. Push unapplied migrations. Answer `Y` if prompted.

```bash
npx supabase db push
```