import assert from 'node:assert';
import Pagamentos from '../src/pagamentos.js';
import { it } from 'node:test';

describe('Testes da classe Pagamentos', function () {
  it('Deve realizar um pagamento com categoria cara quando valor for maior que 100', function () {
    const pagamentos = new Pagamentos();

    pagamentos.pagarConta('0987-7656-3475', 'Samar', 156.87);

    const ultimoPagamento = pagamentos.consultarUltimoPagamento();

    assert.deepStrictEqual(ultimoPagamento, {
      codigoDeBarras: '0987-7656-3475',
      empresa: 'Samar',
      valor: 156.87,
      categoria: 'cara'
    });
  });

  it('Deve realizar um pagamento com categoria padrão quando valor for igual a 100', function () {
    const pagamentos = new Pagamentos();
    
    pagamentos.pagarConta('1234-5678-9999', 'Celesc', 100);

    const ultimoPagamento = pagamentos.consultarUltimoPagamento();

    assert.deepStrictEqual(ultimoPagamento, {
      codigoDeBarras: '1234-5678-9999',
      empresa: 'Celesc',
      valor: 100,
      categoria: 'padrão'
    });
  });

  it('Deve realizar um pagamento com categoria padrão quando valor for menor que 100', function () {
    const pagamentos = new Pagamentos();
    
    pagamentos.pagarConta('1234-5678-9999', 'Celesc', 80.50);

    const ultimoPagamento = pagamentos.consultarUltimoPagamento();

    assert.deepStrictEqual(ultimoPagamento, {
      codigoDeBarras: '1234-5678-9999',
      empresa: 'Celesc',
      valor: 80.50,
      categoria: 'padrão'
    });
  });

  it('Deve exibir um erro quando o valor for menor ou igual a zero', function () {
    const pagamentos = new Pagamentos();  

    pagamentos.pagarConta('0000-0000-0000', 'Empresa X', -50);

    const ultimoPagamento = pagamentos.consultarUltimoPagamento();  
    assert.strictEqual(ultimoPagamento, undefined);
  });

  it('Deve consultar apenas o último pagamento realizado', function () {
    const pagamentos = new Pagamentos();

    pagamentos.pagarConta('1111', 'Empresa A', 50);
    pagamentos.pagarConta('2222', 'Empresa B', 200);

    const ultimoPagamento = pagamentos.consultarUltimoPagamento();

    assert.deepStrictEqual(ultimoPagamento, {
      codigoDeBarras: '2222',
      empresa: 'Empresa B',
      valor: 200,
      categoria: 'cara'
    });
  });
});