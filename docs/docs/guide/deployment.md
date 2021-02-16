# Deployment

## Render.com
> The following assumes you have already created an account over at Render.com
1. Create a Postgres database with a username other than "postgres"
2. Copy the "Internal Connection String"
3. Create an web service with Elixir as the environment
4. Link your Gitlab or Github repository
5. Open the "Environment" tab
6. Paste the "Internal Connection String" copied from step #2 into an environment variable called "DATABASE_URL"
7. Create an environment variable called "ELIXIR_VERSION" and set the value to "1.11.3"
8. Open a terminal in your local project and run "mix phx.gen.secret"
9. Back in the environment area, paste the result of step #8 into a variable called "SECRET_KEY_BASE"
10. Manually deploy your code by clicking the "Manual Deploy" button or make a change to your code and push

Render.com's Instructions can be found here: https://render.com/docs/deploy-phoenix

## Kubernetes
Coming soon...
