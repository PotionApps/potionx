alias <%= @app_module %>.Repo
alias <%= @app_module %>.Users.User

Repo.insert! %User{
  email: <%= @email %>
}
