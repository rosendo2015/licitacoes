async function carregarLicitacoes() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado!");
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:3333/licitacoes", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Erro ao carregar licitações");

    const licitacoes = await response.json();
    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    licitacoes.forEach(l => {
      const card = document.createElement("div");
      card.className = "card";

      const statusClass = `status-${l.status}`;
      card.innerHTML = `
        <div class="status-indicator ${statusClass}"></div>
        <h3>${l.orgao}</h3>
        <p><strong>Data:</strong> ${new Date(l.data).toLocaleDateString()}</p>
        <p><strong>Horário:</strong> ${l.horarioInicio}</p>
        <p><strong>Estado:</strong> ${l.estado}</p>
        <p><strong>Pregão:</strong> ${l.pregao}</p>
        <p><strong>Serviço:</strong> ${l.servico}</p>
        <p><strong>UASG:</strong> ${l.uasg}</p>
        <p><strong>Status:</strong> ${l.status}</p>
      `;
      card.addEventListener("click", () => abrirModal(l));
      container.appendChild(card);
    });
  } catch (error) {
    alert(error.message);
  }
}

function abrirModal(licitacao) {
  document.getElementById("editModal").style.display = "flex";
  document.getElementById("editId").value = licitacao.id;
  document.getElementById("editData").value = licitacao.data.split("T")[0];
  document.getElementById("editHorario").value = licitacao.horarioInicio;
  document.getElementById("editEstado").value = licitacao.estado;
  document.getElementById("editOrgao").value = licitacao.orgao;
  document.getElementById("editPregao").value = licitacao.pregao;
  document.getElementById("editServico").value = licitacao.servico;
  document.getElementById("editUasg").value = licitacao.uasg;
  document.getElementById("editStatus").value = licitacao.status;
  document.getElementById("editObservacoes").value = licitacao.observacoes || "";
}

function fecharModal() {
  document.getElementById("editModal").style.display = "none";
}

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const id = document.getElementById("editId").value;

  const body = {
    data: document.getElementById("editData").value,
    horarioInicio: document.getElementById("editHorario").value,
    estado: document.getElementById("editEstado").value,
    orgao: document.getElementById("editOrgao").value,
    pregao: document.getElementById("editPregao").value,
    servico: document.getElementById("editServico").value,
    uasg: document.getElementById("editUasg").value,
    status: document.getElementById("editStatus").value,
    observacoes: document.getElementById("editObservacoes").value,
  };

  try {
    const response = await fetch(`http://localhost:3333/licitacoes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Erro ao atualizar licitação");

    alert("Licitação atualizada com sucesso!");
    fecharModal();
    carregarLicitacoes(); // recarrega os cards
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

document.getElementById("btnCadastrar").addEventListener("click", () => {
  window.location.href = "cadastrar.html";
});
document.getElementById("btnExcluir").addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const id = document.getElementById("editId").value;

  if (!confirm("Tem certeza que deseja excluir esta licitação?")) return;

  try {
    const response = await fetch(`http://localhost:3333/licitacoes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Erro ao excluir licitação");

    alert("Licitação excluída com sucesso!");
    fecharModal();
    carregarLicitacoes(); // recarrega os cards
  } catch (error) {
    alert(error.message);
  }
});

// Inicializa carregamento
carregarLicitacoes();