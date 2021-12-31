//this file contains tests for the file taxModel.js

const assert = require('chai').assert;
const { expect } = require('chai');
const { before, beforeEach } = require('mocha');
const Decimal = require('decimal.js');
const taxModel = require('../models/taxModel');

before(function() {
    let globalVars = {
        totalCAD: new Decimal(0),
        totalBTC: new Decimal(0),
        totalETH: new Decimal(0),
        avgCAD: new Decimal(0),
        avgBTC: new Decimal(0),
        avgETH: new Decimal(0),
        walletAddresses: 'MyWallet',
        shakepayWallet: 'MyShakepay'
    }
    taxModel.setup(globalVars);   
});

describe('purchase/sale', function(){
    it('buying BTC', function(){
        
        let transactionTime = new Date(1638144552);
        let entry = {
            'Transaction Type' : 'purchase/sale',
            'Date' : transactionTime,
            'Amount Debited': new Decimal('500'),
            'Debit Currency': 'CAD',
            'Amount Credited': new Decimal('0.01'),
            'Credit Currency': 'BTC',
            'Buy / Sell Rate': new Decimal('50000'),
            "Direction": 'purchase',
            'Source / Destination' : 'test',
            'Event': '' ,
        };
        let entry2 = {
            'Transaction Type' : 'purchase/sale',
            'Date' : transactionTime,
            'Amount Debited': new Decimal('450'),
            'Debit Currency': 'CAD',
            'Amount Credited': new Decimal('0.00798949'),
            'Credit Currency': 'BTC',
            'Buy / Sell Rate': new Decimal('56324'),
            "Direction": 'purchase',
            'Source / Destination' : 'test',
            'Event': '' ,
        };
        taxModel.purchaseSale(entry);
        expect(taxModel.getCurrencyTotals('BTC')).to.eql(new Decimal('0.01'));
        expect(taxModel.getAvgCost('BTC')).to.eql(new Decimal('50000'));
        taxModel.purchaseSale(entry2);
        expect(taxModel.getCurrencyTotals('BTC')).to.eql(new Decimal('0.01798949'));
        expect(taxModel.getAvgCost('BTC')).to.eql(new Decimal('52808.614071883082844'));
        
    });

    it('buying BTC', function(){
        
        let transactionTime = new Date(1638144552);
        let entry = {
            'Transaction Type' : 'purchase/sale',
            'Date' : transactionTime,
            'Amount Debited': new Decimal('500'),
            'Debit Currency': 'CAD',
            'Amount Credited': new Decimal('0.01'),
            'Credit Currency': 'BTC',
            'Buy / Sell Rate': new Decimal('50000'),
            "Direction": 'purchase',
            'Source / Destination' : 'test',
            'Event': '' ,
        };
        let entry2 = {
            'Transaction Type' : 'purchase/sale',
            'Date' : transactionTime,
            'Amount Debited': new Decimal('450'),
            'Debit Currency': 'CAD',
            'Amount Credited': new Decimal('0.00798949'),
            'Credit Currency': 'BTC',
            'Buy / Sell Rate': new Decimal('56324'),
            "Direction": 'purchase',
            'Source / Destination' : 'test',
            'Event': '' ,
        };
        taxModel.purchaseSale(entry);
        expect(taxModel.getCurrencyTotals('BTC')).to.eql(new Decimal('0.02798949'));
        expect(taxModel.getAvgCost('BTC')).to.eql(new Decimal('51805.160964347689079'));
        taxModel.purchaseSale(entry2);
        expect(taxModel.getCurrencyTotals('BTC')).to.eql(new Decimal('0.03597898'));
        expect(taxModel.getAvgCost('BTC')).to.eql(new Decimal('52808.614071883082844'));
        
    });

    it('selling BTC', function(){
        let transactionTime = new Date(1638144553);
        let entry = {
            'Transaction Type' : 'purchase/sale',
            'Date' : transactionTime,
            'Amount Debited': new Decimal('0.03'),
            'Debit Currency': 'BTC',
            'Amount Credited': new Decimal('3000'),
            'Credit Currency': 'CAD',
            'Buy / Sell Rate': new Decimal('100000'),
            "Direction": 'sale',
            'Source / Destination' : 'test',
            'Event': '' ,
        };   
        taxModel.purchaseSale(entry);
        expect(taxModel.getCurrencyTotals('BTC')).to.eql(new Decimal('0.00597898'));
        expect(taxModel.getAvgCost('BTC')).to.eql(new Decimal('52808.614071883082844'));
        expect(taxModel.getCurrencyTotals('CAD')).to.eql(new Decimal('3000'));
    });

});



describe('cryptoCashout', function(){

    it('transfer BTC to buy something', function(){
        let transactionTime = new Date(1638144554);
        let entry = {
            'Transaction Type' : 'crypto cashout',
            'Date' : transactionTime,
            'Amount Debited': new Decimal('0.005'),
            'Debit Currency': 'BTC',
            'Amount Credited': '',
            'Credit Currency': '',
            'Buy / Sell Rate': '',
            "Direction": 'debit',
            'Spot Rate': new Decimal('120000'),
            'Source / Destination' : 'test',
            'Event': '' ,
        };   
        taxModel.cryptoCashout(entry);
        expect(taxModel.getCurrencyTotals('BTC')).to.eql(new Decimal('0.00097898'));
    });
});