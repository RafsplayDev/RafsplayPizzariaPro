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
            // Mostra todos os produtos novamente
            mostrarTodosProdutos();
        }, 300); // 300ms é a duração da animação
    });

    // Função para filtrar produtos
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        filtrarProdutos(searchTerm);
    });
});

function filtrarProdutos(searchTerm) {
    // Seleciona todos os cards de produtos
    const produtos = document.querySelectorAll('.item-cardapio');
    
    produtos.forEach(produto => {
        const nome = produto.querySelector('.name').textContent.toLowerCase();
        const descricao = produto.querySelector('.description').textContent.toLowerCase();
        
        // Verifica se o termo de busca está presente no nome ou descrição
        if (nome.includes(searchTerm) || descricao.includes(searchTerm)) {
            // Mostra o produto e sua categoria
            produto.style.display = 'block';
            mostrarCategoriaDoProduto(produto);
        } else {
            // Esconde o produto
            produto.style.display = 'none';
        }
    });

    // Se o termo de busca estiver vazio, mostra todos os produtos
    if (searchTerm === '') {
        mostrarTodosProdutos();
    }

    // Esconde categorias vazias
    esconderCategoriasVazias();
}

function mostrarCategoriaDoProduto(produto) {
    // Encontra o container da categoria pai
    const categoriaContainer = produto.closest('.container-group');
    if (categoriaContainer) {
        categoriaContainer.style.display = 'block';
    }
}

function esconderCategoriasVazias() {
    // Seleciona todos os containers de categoria
    const categorias = document.querySelectorAll('.container-group');
    
    categorias.forEach(categoria => {
        // Conta quantos produtos visíveis existem na categoria
        const produtosVisiveis = categoria.querySelectorAll('.item-cardapio[style="display: block;"]').length;
        
        // Se não houver produtos visíveis, esconde a categoria
        if (produtosVisiveis === 0) {
            categoria.style.display = 'none';
        } else {
            categoria.style.display = 'block';
        }
    });
}

function mostrarTodosProdutos() {
    // Mostra todas as categorias
    document.querySelectorAll('.container-group').forEach(categoria => {
        categoria.style.display = 'block';
    });

    // Mostra todos os produtos
    document.querySelectorAll('.item-cardapio').forEach(produto => {
        produto.style.display = 'block';
    });
} 