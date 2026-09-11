const API_URL = "http://localhost:3333/api";

let products = [];
let currentMovementType = null;


// ======================================================
// ELEMENTOS DA INTERFACE
// ======================================================

const pages = document.querySelectorAll(".page");
const menuButtons = document.querySelectorAll(".menu-button");

const pageTitle = document.getElementById("page-title");
const pageSubtitle = document.getElementById("page-subtitle");

const productsTable =
    document.getElementById("products-table");

const productFormContainer =
    document.getElementById("product-form-container");

const productForm =
    document.getElementById("product-form");

const movementFormContainer =
    document.getElementById("movement-form-container");

const movementForm =
    document.getElementById("movement-form");

const movementProduct =
    document.getElementById("movement-product");

const alertsContainer =
    document.getElementById("alerts-container");

const toast =
    document.getElementById("toast");


// ======================================================
// NAVEGAÇÃO
// ======================================================

function showPage(pageName) {

    pages.forEach(page => {

        page.classList.remove("active");

    });


    const selectedPage =
        document.getElementById(`page-${pageName}`);


    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    menuButtons.forEach(button => {

        button.classList.remove("active");


        if (button.dataset.page === pageName) {

            button.classList.add("active");

        }

    });


    // Títulos das páginas

    if (pageName === "dashboard") {

        pageTitle.textContent = "Início";

        pageSubtitle.textContent =
            "Controle do estoque da confeitaria";

    }


    if (pageName === "produtos") {

        pageTitle.textContent = "Produtos";

        pageSubtitle.textContent =
            "Consulte e gerencie seus ingredientes";

    }


    if (pageName === "movimentacao") {

        pageTitle.textContent = "Movimentação";

        pageSubtitle.textContent =
            "Registre entradas, saídas e perdas";

    }


    if (pageName === "alertas") {

        pageTitle.textContent = "Estoque crítico";

        pageSubtitle.textContent =
            "Produtos que precisam de atenção";

    }


    // Carrega os dados da página

    if (pageName === "produtos") {

        loadProducts();

    }


    if (pageName === "movimentacao") {

        loadProductsForMovement();

    }


    if (pageName === "alertas") {

        loadCriticalStock();

    }


    if (pageName === "dashboard") {

        loadDashboard();

    }

}


// Eventos dos menus

menuButtons.forEach(button => {

    button.addEventListener("click", () => {

        const pageName =
            button.dataset.page;


        if (pageName) {

            showPage(pageName);

        }

    });

});


// ======================================================
// TOAST
// ======================================================

function showToast(message) {

    if (!toast) {

        return;

    }


    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


// ======================================================
// PRODUTOS
// ======================================================

async function loadProducts() {

    try {

        const response =
            await fetch(`${API_URL}/insumos`);


        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar os produtos."
            );

        }


        products =
            await response.json();


        renderProducts();


    } catch (error) {

        console.error(error);

        showToast(error.message);

    }

}


// ======================================================
// RENDERIZAR PRODUTOS
// ======================================================

function renderProducts() {

    productsTable.innerHTML = "";


    if (products.length === 0) {

        productsTable.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhum produto cadastrado.
                </td>
            </tr>
        `;

        return;

    }


    products.forEach(product => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${product.nome}
                </strong>
            </td>

            <td>
                ${product.unidade_medida}
            </td>

            <td>
                <strong>
                    ${product.estoque_atual}
                    ${product.unidade_medida}
                </strong>
            </td>

            <td>
                ${product.estoque_minimo}
                ${product.unidade_medida}
            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="secondary-button"
                        onclick="editProduct(${product.id})"
                    >
                        ✏️ Editar
                    </button>

                    <button
                        class="danger-button"
                        onclick="deleteProduct(${product.id})"
                    >
                        🗑️ Excluir
                    </button>

                </div>

            </td>

        `;


        productsTable.appendChild(row);

    });

}


// ======================================================
// FORMULÁRIO DE PRODUTO
// ======================================================

function openProductForm(product = null) {

    productFormContainer.classList.remove("hidden");

    productFormContainer.style.display = "block";


    const formTitle =
        document.getElementById("form-title");


    if (product) {

        if (formTitle) {

            formTitle.textContent =
                "Editar produto";

        }


        document.getElementById("product-id").value =
            product.id;

        document.getElementById("product-name").value =
            product.nome;

        document.getElementById("product-unit").value =
            product.unidade_medida;

        document.getElementById("product-minimum").value =
            product.estoque_minimo;

    } else {

        if (formTitle) {

            formTitle.textContent =
                "Cadastrar produto";

        }


        productForm.reset();


        document.getElementById("product-id").value = "";

    }

}


// ======================================================
// FECHAR FORMULÁRIO DE PRODUTO
// ======================================================

function closeProductForm() {

    productFormContainer.classList.add("hidden");

    productFormContainer.style.display = "none";


    productForm.reset();


    document.getElementById("product-id").value = "";

}


// ======================================================
// BOTÃO NOVO PRODUTO
// ======================================================

const btnNewProduct =
    document.getElementById("btn-new-product");


if (btnNewProduct) {

    btnNewProduct.addEventListener("click", () => {

        openProductForm();

    });

}


// ======================================================
// BOTÃO CANCELAR FORMULÁRIO
// ======================================================

const btnCancelForm =
    document.getElementById("btn-cancel-form");


if (btnCancelForm) {

    btnCancelForm.addEventListener("click", () => {

        closeProductForm();

    });

}


// ======================================================
// CADASTRAR / EDITAR PRODUTO
// ======================================================

productForm.addEventListener("submit", async event => {

    event.preventDefault();


    console.log(
        "FORMULÁRIO DE PRODUTO ENVIADO"
    );


    const id =
        document.getElementById("product-id").value;


    const nome =
        document.getElementById(
            "product-name"
        ).value.trim();


    const unidade_medida =
        document.getElementById(
            "product-unit"
        ).value;


    const estoque_minimo =
        Number(
            document.getElementById(
                "product-minimum"
            ).value
        );


    console.log(
        "Dados do produto:",
        {
            id,
            nome,
            unidade_medida,
            estoque_minimo
        }
    );


    // Validações

    if (!nome) {

        showToast(
            "Informe o nome do produto."
        );

        return;

    }


    if (!unidade_medida) {

        showToast(
            "Selecione a unidade de medida."
        );

        return;

    }


    if (
        Number.isNaN(estoque_minimo) ||
        estoque_minimo < 0
    ) {

        showToast(
            "Informe um estoque mínimo válido."
        );

        return;

    }


    const data = {

        nome,

        unidade_medida,

        estoque_minimo

    };


    console.log(
        "Enviando para API:",
        data
    );


    try {

        let response;


        // ==================================================
        // EDITAR
        // ==================================================

        if (id) {

            response =
                await fetch(
                    `${API_URL}/insumos/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)

                    }
                );

        }


        // ==================================================
        // CADASTRAR
        // ==================================================

        else {

            response =
                await fetch(
                    `${API_URL}/insumos`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)

                    }
                );

        }


        console.log(
            "Status da API:",
            response.status
        );


        const result =
            await response
                .json()
                .catch(() => null);


        console.log(
            "Resposta da API:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result?.message ||
                "Não foi possível salvar o produto."
            );

        }


        // Mensagem de sucesso

        if (id) {

            showToast(
                "Produto atualizado com sucesso!"
            );

        } else {

            showToast(
                "Produto cadastrado com sucesso!"
            );

        }


        // Fecha formulário

        closeProductForm();


        // Atualiza produtos

        await loadProducts();


        // Atualiza dashboard

        await loadDashboard();


        // Atualiza estoque crítico

        await loadCriticalStock();


    } catch (error) {

        console.error(
            "Erro ao cadastrar produto:",
            error
        );


        showToast(
            error.message
        );

    }

});


// ======================================================
// EDITAR PRODUTO
// ======================================================

window.editProduct = function (id) {

    const product =
        products.find(
            product => product.id === id
        );


    if (!product) {

        showToast(
            "Produto não encontrado."
        );

        return;

    }


    openProductForm(product);

};


// ======================================================
// EXCLUIR PRODUTO
// ======================================================

window.deleteProduct = async function (id) {

    const product =
        products.find(
            product => product.id === id
        );


    if (!product) {

        showToast(
            "Produto não encontrado."
        );

        return;

    }


    const confirmed =
        confirm(
            `Deseja realmente excluir "${product.nome}"?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/insumos/${id}`,
                {
                    method: "DELETE"
                }
            );


        console.log(
            "Status da exclusão:",
            response.status
        );


        const result =
            await response
                .json()
                .catch(() => null);


        console.log(
            "Resposta da exclusão:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result?.message ||
                result?.error ||
                "Não foi possível excluir o produto."
            );

        }


        showToast(
            "Produto excluído com sucesso!"
        );


        await loadProducts();

        await loadDashboard();

        await loadCriticalStock();


    } catch (error) {

        console.error(
            "Erro ao excluir produto:",
            error
        );


        showToast(
            error.message
        );

    }

};


// ======================================================
// MOVIMENTAÇÃO
// ======================================================

const movementCards =
    document.querySelectorAll(
        ".movement-card"
    );


movementCards.forEach(card => {

    card.addEventListener("click", () => {

        currentMovementType =
            card.dataset.type;


        movementFormContainer.classList.remove(
            "hidden"
        );


        movementFormContainer.style.display =
            "block";


        loadProductsForMovement();

    });

});


// ======================================================
// CARREGAR PRODUTOS PARA MOVIMENTAÇÃO
// ======================================================

async function loadProductsForMovement() {

    try {

        const response =
            await fetch(
                `${API_URL}/insumos`
            );


        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar os produtos."
            );

        }


        const data =
            await response.json();


        movementProduct.innerHTML = `
            <option value="">
                Selecione um produto
            </option>
        `;


        data.forEach(product => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                product.id;


            option.textContent =
                `${product.nome} (${product.estoque_atual} ${product.unidade_medida})`;


            movementProduct.appendChild(
                option
            );

        });


    } catch (error) {

        console.error(error);

        showToast(
            error.message
        );

    }

}


// ======================================================
// CANCELAR MOVIMENTAÇÃO
// ======================================================

const btnCancelMovement =
    document.getElementById(
        "btn-cancel-movement"
    );


if (btnCancelMovement) {

    btnCancelMovement.addEventListener(
        "click",
        () => {

            movementFormContainer.classList.add(
                "hidden"
            );


            movementFormContainer.style.display =
                "none";


            movementForm.reset();


            currentMovementType = null;

        }
    );

}


// ======================================================
// REGISTRAR MOVIMENTAÇÃO
// ======================================================

movementForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!currentMovementType) {

            showToast(
                "Selecione o tipo de movimentação."
            );

            return;

        }


        const insumo_id =
            Number(
                movementProduct.value
            );


        const quantidade =
            Number(
                document.getElementById(
                    "movement-quantity"
                ).value
            );


        const motivo =
            document.getElementById(
                "movement-reason"
            ).value.trim();


        if (!insumo_id) {

            showToast(
                "Selecione um produto."
            );

            return;

        }


        if (
            !quantidade ||
            quantidade <= 0
        ) {

            showToast(
                "Informe uma quantidade válida."
            );

            return;

        }


        if (!motivo) {

            showToast(
                "Informe o motivo da movimentação."
            );

            return;

        }


        const data = {

            insumo_id,

            tipo:
                currentMovementType,

            quantidade,

            motivo

        };


        try {

            const response =
                await fetch(
                    `${API_URL}/movimentacoes_estoque`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            const result =
                await response
                    .json()
                    .catch(() => null);


            if (!response.ok) {

                throw new Error(
                    result?.message ||
                    "Não foi possível registrar a movimentação."
                );

            }


            showToast(
                "Movimentação registrada com sucesso!"
            );


            movementForm.reset();


            movementFormContainer.classList.add(
                "hidden"
            );


            movementFormContainer.style.display =
                "none";


            currentMovementType = null;


            // Atualiza dados

            await loadProducts();

            await loadDashboard();

            await loadCriticalStock();

        } catch (error) {

            console.error(error);

            showToast(
                error.message
            );

        }

    }
);


// ======================================================
// ESTOQUE CRÍTICO
// ======================================================

async function loadCriticalStock() {

    try {

        const response =
            await fetch(
                `${API_URL}/insumos/critical`
            );


        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar o estoque crítico."
            );

        }


        const alerts =
            await response.json();


        renderCriticalStock(
            alerts
        );


    } catch (error) {

        console.error(error);

        showToast(
            error.message
        );

    }

}


// ======================================================
// RENDERIZAR ESTOQUE CRÍTICO
// ======================================================

function renderCriticalStock(alerts) {

    alertsContainer.innerHTML = "";


    if (alerts.length === 0) {

        alertsContainer.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    ✅
                </div>

                <h3>
                    Nenhum produto em estoque crítico
                </h3>

                <p>
                    Todos os produtos estão acima
                    do estoque mínimo.
                </p>

            </div>
        `;

        return;

    }


    alerts.forEach(product => {

        const card =
            document.createElement(
                "div"
            );


        card.classList.add(
            "alert-card"
        );


        card.innerHTML = `

            <div class="alert-card-header">

                <div>

                    <span class="alert-icon">
                        🚨
                    </span>

                    <strong>
                        ${product.nome}
                    </strong>

                </div>

            </div>


            <div class="alert-card-content">

                <div>

                    <span>
                        Estoque atual
                    </span>

                    <strong>
                        ${product.estoque_atual}
                        ${product.unidade_medida}
                    </strong>

                </div>


                <div>

                    <span>
                        Estoque mínimo
                    </span>

                    <strong>
                        ${product.estoque_minimo}
                        ${product.unidade_medida}
                    </strong>

                </div>

            </div>

        `;


        alertsContainer.appendChild(
            card
        );

    });

}


// ======================================================
// DASHBOARD
// ======================================================

async function loadDashboard() {

    try {

        // Produtos

        const response =
            await fetch(
                `${API_URL}/insumos`
            );


        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar os produtos."
            );

        }


        products =
            await response.json();


        document.getElementById(
            "total-products"
        ).textContent =
            products.length;


        // Estoque crítico

        const criticalResponse =
            await fetch(
                `${API_URL}/insumos/critical`
            );


        if (!criticalResponse.ok) {

            throw new Error(
                "Não foi possível carregar o estoque crítico."
            );

        }


        const critical =
            await criticalResponse.json();


        document.getElementById(
            "total-critical"
        ).textContent =
            critical.length;


    } catch (error) {

        console.error(error);

    }

}


// ======================================================
// ATUALIZAR PRODUTOS
// ======================================================

const btnRefreshProducts =
    document.getElementById(
        "btn-refresh-products"
    );


if (btnRefreshProducts) {

    btnRefreshProducts.addEventListener(
        "click",
        () => {

            loadProducts();

        }
    );

}


// ======================================================
// ATUALIZAR ALERTAS
// ======================================================

const btnRefreshAlerts =
    document.getElementById(
        "btn-refresh-alerts"
    );


if (btnRefreshAlerts) {

    btnRefreshAlerts.addEventListener(
        "click",
        () => {

            loadCriticalStock();

        }
    );

}


// ======================================================
// CARDS DE AÇÃO DO DASHBOARD
// ======================================================

const actionCards =
    document.querySelectorAll(
        ".action-card"
    );


actionCards.forEach(card => {

    card.addEventListener("click", () => {

        const pageName =
            card.dataset.page;


        const action =
            card.dataset.action;


        if (pageName) {

            showPage(pageName);

        }


        // Cadastrar produto diretamente

        if (
            pageName === "produtos" &&
            action === "novo"
        ) {

            setTimeout(() => {

                openProductForm();

            }, 100);

        }

    });

});


// ======================================================
// INICIALIZAÇÃO
// ======================================================

showPage("dashboard");

loadDashboard();