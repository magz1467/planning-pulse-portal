# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/106f7ed5-6c9b-4088-ba7e-3d7443df8f58

## How can I edit this code?

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/106f7ed5-6c9b-4088-ba7e-3d7443df8f58) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
yarn install

# Step 4: Set up environment variables for local testing
# Replace with your actual Supabase service role key and URL
export SUPABASE_SERVICE_ROLE_KEY='your_service_role_key_here'
export SUPABASE_URL='your_supabase_project_url_here'

# Step 5: Run tests
yarn test
```

## Running Tests

To run tests locally, you must set the following environment variables:
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase project's service role key
- `SUPABASE_URL`: Your Supabase project's URL

These can be found in your Supabase project settings.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/106f7ed5-6c9b-4088-ba7e-3d7443df8f58) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)