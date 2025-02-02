document.addEventListener('DOMContentLoaded', () => {
    const btnPesquisar = document.getElementById('btnPesquisar');
    const btnFecharPesquisa = document.getElementById('btnFecharPesquisa');
    const searchContainer = document.getElementById('searchContainer');
    const containerMenu = document.querySelector('.container-menu');
    const searchInput = document.getElementById('searchInput');

    btnPesquisar.addEventListener('click', () => {
        containerMenu.classList.add('searching');
        searchContainer.classList.remove('hidden');
        // Pequeno delay para permitir que a transição seja visível
        setTimeout(() => {
            searchContainer.classList.add('show');
            btnPesquisar.classList.add('hidden');
            searchInput.focus();
        }, 10);
    });

    btnFecharPesquisa.addEventListener('click', () => {
        searchContainer.classList.remove('show');
        // Aguarda a animação terminar antes de esconder completamente
        setTimeout(() => {
            containerMenu.classList.remove('searching');
            searchContainer.classList.add('hidden');
            btnPesquisar.classList.remove('hidden');
            searchInput.value = '';
        }, 300); // 300ms é a duração da animação
    });

    // Adicione aqui a lógica de pesquisa quando o usuário digitar
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // Implemente aqui a lógica de filtro dos itens
    });
}); 