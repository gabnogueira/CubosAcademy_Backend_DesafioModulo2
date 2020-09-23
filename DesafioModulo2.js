const Koa = require("koa");
const server = new Koa();
const bodyparser = require("koa-bodyparser");

server.use(bodyparser());

let listaProdutos = [
    {
        id: '001',
        nome: 'camisa',
        quantidadeDisponivel: 10,
        valor: 1500,
        deletado: false
    },
    {
        id: '002',
        nome: 'calça',
        quantidadeDisponivel: 15,
        valor: 2500,
        deletado: false
    }
];


const criarProduto = (idProd, nomeProd, quantidade, valor) => {
    let jaExiste = false;
    let novoProduto = {
        id: idProd,
        nome: nomeProd,
        quantidadeDisponivel: quantidade,
        valor,
        deletado: false
    }

    for (let i = 0; i < listaProdutos.length; i++) {
        if (listaProdutos[i].id === idProd) {
            jaExiste = true;
            console.log(`O produto já existe`);
            break;
        }
    }

    if (jaExiste === false) {
        listaProdutos.push(novoProduto);
        console.log(novoProduto);
    }
    return novoProduto;
};

const obterInfoProduto = (id) => {
    /* Um produto precisa ter nome, quantidadeDisponivel, valor. Os demais campos são opcionais, como descrição e peso. */
    let prodEncontrado = false;

    for (let i = 0; i < listaProdutos.length; i++) {
        if (id === listaProdutos[i].id && listaProdutos[i].deletado === false) {
            let infoProduto = {
                id: listaProdutos[i].id,
                nome: listaProdutos[i].nome,
                quantidadeDisponivel: listaProdutos[i].quantidadeDisponivel,
                valor: listaProdutos[i].valor,
            }
            prodEncontrado = true;
            return infoProduto;

        } else if (id === listaProdutos[i].id && listaProdutos[i].deletado === true) {
            console.log(`Produto deletado`)
            prodEncontrado = true;
            return `Produto deletado`
        }
    }
    
    if (prodEncontrado === false) {
        console.log(`Produto não encontrado!`)
        return `Produto não encontrado!`
    }
    

};

const listarProdutos = () => {
    /* Um produto precisa ter nome, quantidadeDisponivel, valor. Os demais campos são opcionais, como descrição e peso. */
    const listaDosProdutos = [];

    listaProdutos.forEach((produto) => {

        let infoProduto = {
            nome: produto.nome,
            quantidadeDisponivel: produto.quantidadeDisponivel,
            valor: produto.valor
        }
        listaDosProdutos.push(infoProduto);
    });

    return listaDosProdutos;    
};

const atualizarProduto = (id, produtos, ctx) => {
    /*Um produto marcado como deletado não pode ser atualizado.*/
    let encontrado = false;

    const nomeProd = ctx.request.body.nome;
    const qtdProd = ctx.request.body.quantidade;
    const valorProd = ctx.request.body.valor;

    for (let i = 0; i < produtos.length; i++){
        if (id === produtos[i].id && produtos[i].deletado === false) {
            
            produtos[i].nome = nomeProd;
            produtos[i].quantidadeDisponivel = qtdProd;
            produtos[i].valor = valorProd;
 
            encontrado = true;
            

            return produtos[i];

        } else if (id === produtos[i].id && produtos[i].deletado === true) {
            console.log(`Alteração não realizada. O produto foi deletado.`);
            encontrado = true;       
        };
    }

    if (encontrado === false) {
        console.log(`Produto não encontrado`)
    }
};

const deletarProduto = (id) => {
    /* Toda vez que um produto for adicionado ou removido, ou ter sua quantidade diminuida em um pedido, a propriedade quantidade associada no objeto estoque precisa ser atualizada. */
    let encontrado = false;
    
    for (let i = 0; i < listaProdutos.length; i++) {
        if (id === listaProdutos[i].id && listaProdutos[i].deletado === false) {
            listaProdutos[i].deletado = true;
            encontrado = true;
            
            return listaProdutos[i];

        } else if (id === listaProdutos[i].id && listaProdutos[i].deletado === true) {
            encontrado = true;
            return `O produto já foi deletado.`;

        }
    }

    if (encontrado === false) {
        console.log(`Produto não encontrado.`);
    }
};


let listaDePedidos = [];

const criarPedido = (idCliente) => {
    let novoPedido = {
        id: `000${listaDePedidos.length + 1}`,
        produtos: [],
        estado: `incompleto`,
        idCliente: idCliente,
        deletado: false,
        valorTotal: 0
    };
        listaDePedidos.push(novoPedido);
        console.log(novoPedido);
        return novoPedido;

}

const listarPedidos = () => {
    /* Um produto precisa ter nome, quantidadeDisponivel, valor. Os demais campos são opcionais, como descrição e peso. */
    const pedidosListados = [];

    listaDePedidos.forEach((pedido) => {
        if (pedido.deletado === false) {
            
            let infoPedido = {
                id: pedido.id,
                produtos: pedido.produtos,
                estado: pedido.estado,
                id_cliente: pedido.idCliente,
                valor_total: pedido.valorTotal
            }
            pedidosListados.push(infoPedido);
        } else {
            return `O pedido foi deletado.`
        }

    });

    return pedidosListados;    
};

const obterPedido = (id) => {
    /* Um produto precisa ter nome, quantidadeDisponivel, valor. Os demais campos são opcionais, como descrição e peso. */
    let pedidoEncontrado = false;

    for (let i = 0; i < listaDePedidos.length; i++) {
        if (id === listaDePedidos[i].id && listaDePedidos[i].deletado === false) {
            let pedido = {
                id: listaDePedidos[i].id,
                produtos: listaDePedidos[i].produtos,
                estado: listaDePedidos[i].estado,
                id_cliente: listaDePedidos[i].idCliente,
                valor: listaDePedidos[i].valorTotal,
            }
            pedidoEncontrado = true;

            return pedido;

        } else if (id === listaDePedidos[i].id && listaDePedidos[i].deletado === true) {
            console.log(`Pedido deletado`)
            pedidoEncontrado = true;
            return `Pedido deletado`
        }
    }
    
    if (pedidoEncontrado === false) {
        console.log(`Pedido não encontrado!`)
        return `Pedido não encontrado!`
    }
    

};


const listarPedidosPeloEstado = (estado) => {
    /* Um produto precisa ter nome, quantidadeDisponivel, valor. Os demais campos são opcionais, como descrição e peso. */
    const pedidosListados = [];

    listaDePedidos.forEach((pedido) => {
        if (pedido.estado === estado) {
            
            let infoPedido = {
                id: pedido.id,
                produtos: pedido.produtos,
                estado: pedido.estado,
                id_cliente: pedido.idCliente,
                valor_total: pedido.valorTotal
            }
            pedidosListados.push(infoPedido);
        } 
    });
    
    return pedidosListados;    
};

const deletarPedido = (id) => {
    /* Toda vez que um produto for adicionado ou removido, ou ter sua quantidade diminuida em um pedido, a propriedade quantidade associada no objeto estoque precisa ser atualizada. */
    let encontrado = false;
    
    for (let i = 0; i < listaDePedidos.length; i++) {
        if (id === listaDePedidos[i].id && listaDePedidos[i].deletado === false) {
            listaDePedidos[i].deletado = true;
            listaDePedidos[i].estado = `cancelado`;
            encontrado = true;
            
            return listaDePedidos[i];

        } else if (id === listaDePedidos[i].id && listaDePedidos[i].deletado === true) {
            encontrado = true;
            return `O produto já foi deletado.`;

        }
    }

    if (encontrado === false) {
        console.log(`Produto não encontrado.`);
        return `Produto não encontrado.`
    }
};

const atualizarEstadoPedido = (id, estado) => {
    /*Um produto marcado como deletado não pode ser atualizado.*/
    let encontrado = false;



    for (let i = 0; i < listaDePedidos.length; i++){
        if (id === listaDePedidos[i].id && listaDePedidos[i].deletado === false) {
            if (estado === `cancelado`) {
                listaDePedidos[i].estado = estado;
                listaDePedidos[i].deletado = true;
     
     
                encontrado = true;

            } else {
                listaDePedidos[i].estado = estado;
                encontrado = true;
            }

            return listaDePedidos[i];

        } else if (id === listaDePedidos[i].id && listaDePedidos[i].deletado === true) {
            return `Alteração não realizada. O produto foi deletado.`;
            encontrado = true;       
        };
    }

    if (encontrado === false) {
        return `Produto não encontrado`
    }
};


const checarProdutoNoPedido = (idProduto, idPedido) => {

    const pedido = obterPedido(idPedido);

    for (let i = 0; i < pedido.produtos.length; i++) {
        if (idProduto === pedido.produtos[i].id) {
            console.log(true);
            return true;
        } else {
            console.log(false);
            return false;
        }
    }
}




const adicionarProdutoAoPedido = (idProduto, idPedido, qtd) => {
    const produtoEscolhido = obterInfoProduto(idProduto);
    const quantidadeDisponivel = produtoEscolhido.quantidadeDisponivel;
    const valorProduto = produtoEscolhido.valor;
    const totalProduto = valorProduto * qtd; 
    const checarProduto = checarProdutoNoPedido(idProduto, idPedido);
    
    let produtoAdd = {
        id: produtoEscolhido.id,
        nome: produtoEscolhido.nome,
        quantidade: qtd,
        valor: produtoEscolhido.valor
    };
    
    
    for (let i = 0; i < listaDePedidos.length; i++) {
        
        if (qtd <= quantidadeDisponivel && idPedido === listaDePedidos[i].id && listaDePedidos[i].estado === 'incompleto' && !checarProduto) {
            listaDePedidos[i].produtos.push(produtoAdd);
            listaDePedidos[i].valorTotal += totalProduto;

            for (let i = 0; i < listaProdutos.length; i++){
                if (idProduto === listaProdutos[i].id) {
                    listaProdutos[i].quantidadeDisponivel -= qtd;
                }
            }
            

            console.log(listaDePedidos[i])
            return obterPedido(idPedido)
            /*return listaDePedidos[i] /*listaProdutos[i]];*/

        } else if (qtd <= quantidadeDisponivel && idPedido === listaDePedidos[i].id && listaDePedidos[i].estado === 'incompleto' && checarProduto) {
            
            let pedido = obterPedido(idPedido);           
            
            for (let i = 0; i < pedido.produtos.length; i++) {
                
                if (idProduto === pedido.produtos[i].id) {
                    let valorProd = pedido.produtos[i].valor;

                        pedido.produtos[i].quantidade += qtd
                        pedido.valor = (pedido.produtos[i].quantidade * valorProd);

                    }                    
                }
                console.log(pedido)
                return pedido
            
        } else if (qtd <= quantidadeDisponivel && idPedido === listaDePedidos[i].id && listaDePedidos[i].estado !== 'incompleto') {
            return `O pedido já foi processado.`
        } else if (qtd > quantidadeDisponivel) {
            return `Quantidade solicitada maior que o estoque disponível`
        } else if (quantidadeDisponivel === 0) {
            return `Produto fora de estoque`
        }
    }
}

server.use((ctx) => {
    const path = ctx.url;
    const method = ctx.method;
    const request = ctx.request.body
    const idUrlProd = ctx.url.substr(10,3);
    const idUrlPed = ctx.url.substr(8,4);
    const idCliente = (Math.random()*100000).toFixed(0)
    const estadoPedido = ctx.query.estado
    

    if (path === '/produtos') {

        if (method === 'GET') {
            ctx.status = 200;
            ctx.body = listarProdutos();

        } else if (method === 'POST') {
            let idProduto = request.id;
            let nomeProduto = request.nome; 
            let qtdProduto = request.quantidadeDisponivel
            let valorProduto = request.valor

            ctx.status = 201;
            ctx.body = criarProduto(idProduto, nomeProduto, qtdProduto, valorProduto);
            
        } else {
            ctx.status = 404;
            ctx.body = 'Não encontrado!'
        } 

    } else if (path.includes(`/produtos/`)) {

        if (method === 'GET') {
            ctx.status = 200;
            ctx.body = obterInfoProduto(idUrlProd);

        } else if (method === 'PUT') {
            ctx.status = 200;
            ctx.body = atualizarProduto(idUrlProd, listaProdutos, ctx);

        } else if (method === 'DELETE') {
            ctx.status = 200;
            ctx.body = deletarProduto(idUrlProd);                
        }
    } else if (path === '/orders') {

        if (method === 'POST') {
            ctx.status = 201;
            ctx.body = {
                status: 'sucesso',
                dados: criarPedido(idCliente),
            }

        } else if (method === 'GET') {
            ctx.status = 200;
            ctx.body = {
                status: 'sucesso',
                dados: listarPedidos()
            }
        } else {
            ctx.status = 400;
            ctx.body = {
                status: 'erro!',
                dados: {
                    mensagem: 'Requisição mal-formatada'
                }
            }
        }
        
    } else if (path.includes('/orders/')) {
        if (method === 'GET') {
            ctx.status = 200;
            ctx.body = {
                status: 'sucesso',
                dados: obterPedido(idUrlPed)
            }
            
        } else if (method === 'DELETE') {
            ctx.status = 200;
            ctx.body = {
                status: 'sucesso',
                dados: deletarPedido(idUrlPed)
            }

        } else if (method === 'PUT') {
            let estado = request.estado;
            let id_produto = request.id_produto;
            let qtd_produto = request.qtd_produto;

            if (estado) {
                ctx.status = 200;
                ctx.body = {
                    status: 'sucesso',
                    dados: atualizarEstadoPedido(idUrlPed, estado)
                }
            } else if (id_produto) {
                ctx.status = 200
                ctx.body = {
                    status: 'sucesso',
                    dados: adicionarProdutoAoPedido(id_produto, idUrlPed, qtd_produto)
                }
                console.log(ctx.request.body);
            }

        } else {
            ctx.status = 400;
            ctx.body = {
                status: 'erro!',
                dados: {
                    mensagem: 'Requisição mal-formatada'
                }
            }
        }

    } else if (path.includes('/orders?')) {
        if (method === 'GET') {
            ctx.status = 200;
            ctx.body = {
                status: 'sucesso',
                dados: listarPedidosPeloEstado(estadoPedido)
            }
        }
    } else {
        ctx.status = 404;
        ctx.body = {
            status: 'erro!',
            dados: {
                mensagem: 'Conteúdo não encontrado.'
            }
        }
    }

});

server.listen(8081, () => console.log('Server rodando na porta 8081.'));


