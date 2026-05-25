import { error } from "node:console";

class Pagamentos {

    #pagamentos;
    
    constructor() {
        this.#pagamentos = [];
    }

    pagarConta(codigoDeBarras, empresa, valor) {
        let categoria = "padrão";
        if (valor <= 0) {
            throw new Error("Valor deve ser maior que zero.");
        }else if (valor > 100) {
            categoria = "cara";
        }    
        this.#pagamentos.push({ codigoDeBarras, empresa, valor, categoria }); 
    }

    consultarUltimoPagamento() {
    return this.#pagamentos[this.#pagamentos.length - 1];
    }
}

export default Pagamentos;