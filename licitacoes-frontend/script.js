// Validação simples de login
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Login realizado com sucesso!");
});

// Validação simples de cadastro
document.getElementById("registerForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }
  alert("Cadastro realizado com sucesso!");
});