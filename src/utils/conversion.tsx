import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { filterOfferings, PFIs } from '../utils/helpers';
import { DidDht } from '@web5/dids'
import { VerifiableCredential, PresentationExchange } from "@web5/credentials";
import { useNavigate } from 'react-router-dom';
import { Close, Order, Rfq, TbdexHttpClient } from '@tbdex/http-client'

export const requestQuote = async () => {
    setLoading(true);
    // Call getQuote function here with formData details
    const result = await createExchange(selectedOffering, formData.amount, { 
      address: formData.payoutDetails }, formData.payinMethod);
    const exchanges = await fetchExchanges(selectedOffering.metadata.from)
    console.log('Exchanges:', exchanges)
    setLoading(false);
    setStep(2);
  };
  
  export const handleOrder = () => {
    addOrder(quoteDetails.exchangeId, quoteDetails.pfiDid);
    toast.success('Order placed successfully');
    onNext(); // Proceed to the next step
  };
  
  // display the date in words format like August 12, 2024
  export const formatDatetime = (datetimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(datetimeString));
    const formattedTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(datetimeString));
    return (`${formattedDate} at ${formattedTime}`);
  };
  
  
  export const handleClose = () => {
      addClose(quoteDetails.exchangeId, quoteDetails.pfiDid, reason);
      setPopupOpen(false);
      toast.success('Exchange closed successfully');
      window.location.reload();
  };  
  
  export const createExchange = async (offering, amount, payoutPaymentDetails, payinMethod) => {
    // TODO 3: Choose only needed credentials to present using PresentationExchange.selectCredentials
    const userDid = await DidDht.import({ portableDid: JSON.parse(did) });
    const selectedCredentials = PresentationExchange.selectCredentials({
      vcJwts: credentials,
      presentationDefinition: offering.data.requiredClaims,
    })
  
    console.log(selectedOffering)
  
    // TODO 4: Create RFQ message to Request for a Quote
    const rfq = Rfq.create({
      metadata: {
        from: userDid?.uri,
        to: offering.metadata.from,
        protocol: '1.0'
      },
      data: {
        offeringId: selectedOffering.metadata.id,
        payin: {
          amount: amount.toString(),
          kind: payinMethod,
          paymentDetails: {
            accountNumber: '1234567890123456',
            routingNumber: '12345',
          }
        },
        payout: {
          kind: offering.data.payout.methods[0].kind,
          paymentDetails: payoutPaymentDetails
        },
        claims: selectedCredentials
      },
    })
  
    try{
      // TODO 5: Verify offering requirements with RFQ - rfq.verifyOfferingRequirements(offering)
      rfq.verifyOfferingRequirements(offering)
    } catch (e) {
      // handle failed verification
      console.log('Offering requirements not met', e)
    }
  
    // TODO 6: Sign RFQ message
    await rfq.sign(userDid)
  
    console.log('RFQ:', rfq)
  
    try {
      // TODO 7: Submit RFQ message to the PFI .createExchange(rfq)
      await TbdexHttpClient.createExchange(rfq)
      console.log("creating exchange");
    }
    catch (error) {
      console.error('Failed to create exchange:', error);
    }
  }
  
  // createExchange(selectedOffering, 100, {
  //   address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  // });
  
  export const generateExchangeStatusValues = (exchangeMessage) => {
    if (exchangeMessage instanceof Close) {
      if (exchangeMessage.data.reason?.toLowerCase().includes('complete') || exchangeMessage.data.reason?.toLowerCase().includes('success') ) {
        return 'completed'
      } else if (exchangeMessage.data.reason?.toLowerCase().includes('expired')) {
        return exchangeMessage.data.reason.toLowerCase()
      } else if (exchangeMessage.data.reason?.toLowerCase().includes('cancelled')) {
        return 'cancelled'
      } else {
        return 'failed'
      }
    }
    return exchangeMessage.kind
  }
  
  
  export const formatMessages = (exchanges) => {
    console.log(exchanges);
    const formattedMessages = exchanges.map(exchange => {
        const latestMessage = exchange[exchange.length - 1]
        const rfqMessage = exchange.find(message => message.kind === 'rfq')
        const quoteMessage = exchange.find(message => message.kind === 'quote')
        console.log('Quote Message:', quoteMessage);
        const status = generateExchangeStatusValues(latestMessage)
        const fee = quoteMessage?.data['payin']?.['fee']
        const payinAmount = quoteMessage?.data['payin']?.['amount']
        const payoutPaymentDetails = rfqMessage.privateData?.payout.paymentDetails
        setQuoteDetails({ 
          id: latestMessage.metadata.exchangeId,
          payinAmount: (fee ? Number(payinAmount) + Number(fee) : Number(payinAmount)).toString() || rfqMessage.data['payinAmount'],
          payinCurrency: quoteMessage.data['payin']?.['currencyCode'] ?? null,
          payoutAmount: quoteMessage?.data['payout']?.['amount'] ?? null,
          payoutCurrency: quoteMessage.data['payout']?.['currencyCode'],
          status,
          exchangeId: latestMessage.metadata.exchangeId,
          createdTime: rfqMessage.createdAt,
          ...latestMessage.kind === 'quote' && {expirationTime: quoteMessage.data['expiresAt'] ?? null},
          from: 'You',
          to: payoutPaymentDetails?.address || payoutPaymentDetails?.accountNumber + ', ' + payoutPaymentDetails?.bankName || payoutPaymentDetails?.phoneNumber + ', ' + payoutPaymentDetails?.networkProvider || 'Unknown',
          pfiDid: rfqMessage.metadata.to
        })
        return {
          id: latestMessage.metadata.exchangeId,
          payinAmount: (fee ? Number(payinAmount) + Number(fee) : Number(payinAmount)).toString() || rfqMessage.data['payinAmount'],
          payinCurrency: quoteMessage.data['payin']?.['currencyCode'] ?? null,
          payoutAmount: quoteMessage?.data['payout']?.['amount'] ?? null,
          payoutCurrency: quoteMessage.data['payout']?.['currencyCode'],
          status,
          createdTime: rfqMessage.createdAt,
          ...latestMessage.kind === 'quote' && {expirationTime: quoteMessage.data['expiresAt'] ?? null},
          from: 'You',
          to: payoutPaymentDetails?.address || payoutPaymentDetails?.accountNumber + ', ' + payoutPaymentDetails?.bankName || payoutPaymentDetails?.phoneNumber + ', ' + payoutPaymentDetails?.networkProvider || 'Unknown',
          pfiDid: rfqMessage.metadata.to
        }
      })
  
      return formattedMessages;
  }
  
  export const fetchExchanges = async (pfiUri) => {
    const userDid = await DidDht.import({ portableDid: JSON.parse(did) });
    try {
      // TODO 8: get exchanges from the PFI
      const exchanges = await TbdexHttpClient.getExchanges({
        pfiDid: pfiUri,
        did: userDid
      });
  
      const mappedExchanges = formatMessages(exchanges)
      console.log("mapped exchanges", mappedExchanges)
      return mappedExchanges
    } catch (error) {
      console.error('Failed to fetch exchanges:', error);
    }
  }
  
  export const addClose = async (exchangeId, pfiUri, reason) => {
    const userDid = await DidDht.import({ portableDid: JSON.parse(did) });
  
    // TODO 9: Create Close message, sign it, and submit it to the PFI
    const close = Close.create({
      metadata: {
        from: userDid.uri,
        to: pfiUri,
        exchangeId,
      },
      data: {
        reason
      }
    })
  
    await close.sign(userDid)
    try {
      // send Close message
      const response = await TbdexHttpClient.submitClose(close);
      console.log(response);
    }
    catch (error) {
      console.error('Failed to close exchange:', error);
    }
  }
  
  export const addOrder = async (exchangeId, pfiUri) => {
    const userDid = await DidDht.import({ portableDid: JSON.parse(did) });
    // TODO 10: Create Order message, sign it, and submit it to the PFI
    const order = Order.create({
      metadata: {
        from: userDid.uri,
        to: pfiUri,
        exchangeId
      }
    })
  
    await order.sign(userDid)
    try {
      // Send order message
      const response = await TbdexHttpClient.submitOrder(order);
      console.log(response);
      return response;
    } catch (error) {
      console.error('Failed to submit order:', error);
    }
  };
  
  export const updateExchanges = (newTransactions) => {
    const existingExchangeIds = transactions.map(tx => tx.id);
    const updatedExchanges = [...transactions];
  
    newTransactions.forEach(newTx => {
      const existingTxIndex = updatedExchanges.findIndex(tx => tx.id === newTx.id);
      if (existingTxIndex > -1) {
        // Update the existing transaction
        updatedExchanges[existingTxIndex] = newTx;
      } else {
        // Add the new transaction
        updatedExchanges.push(newTx);
      }
    });
  
    // Sort the transactions if needed
    // updatedTransactions.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
  
    // Update the state with the new transactions
    setTransactions(updatedExchanges);
  };
  
  export const pollExchanges = () => {
    const fetchAllExchanges = async () => {
      const userDid = await DidDht.import({ portableDid: JSON.parse(did) });
      console.log('Polling exchanges again...');
      if(!userDid) return
      const allExchanges = []
      try {
        for (const pfi of PFIs) {
          const exchanges = await fetchExchanges(selectedOffering.metadata.from);
          allExchanges.push(...exchanges)
        }
        console.log('All exchanges:', allExchanges);
        updateExchanges(allExchanges.reverse());
        setTransactionsLoading(false);  
      } catch (error) {
        console.error('Failed to fetch exchanges:', error);
      }
    };
  
    // Run the function immediately
    fetchAllExchanges();
  
    // Set up the interval to run the function periodically
    setInterval(fetchAllExchanges, 3000); // Poll every 5 seconds
  };
  // useEffect(() => {
  //   pollExchanges();
  // }, []);