# Easewallet - Make Cross-border payments with ease

Easewallet is a decentralized wallet application built on the **tbDEX SDK** to facilitate fast, secure, and compliant cross-border payments by integrating with a sandbox of liquidity providers (PFIs). Easewallet allows users to send and receive funds, manage their decentralized identifiers (DIDs), and securely validate their identity through Verifiable Credentials (VCs).

## Features

- **Send and Receive Funds:** Users can send and receive funds through Easewallet facilitated by PFIs using tbDEX with a wide range of supported currencies and cryptocurrencies including GHS, USDC, USD EUR, USD, KES, BTC, NGN, and more.
- **DID Management:** Users can create, export, and import their decentralized identifiers (DIDs) for use in signing transactions and getting verifiable credentials.
- **Identity Verification & Verifiable Credentials:** Easewallet integrates with **Ultimate Identity** to issue Verifiable Credentials (VCs) required by PFIs for compliance.
- **Realtime Transaction Updates:** Users can view a detailed timeline of their transactions as it moves from RFQs to Quote, to Order, check order status, and can close an exchange if they so wish.
- **PFI Ratings and Reviews:** Users can leave ratings and reviews for PFIs after completing transactions. Each PFI has a dedicated page with an aggregate rating, reviews, number of trades, and completion rate.
- **In-App Wallet:** Users can hold funds in different currencies, fund accounts, make payments using the wallet, cards or direct bank transfer to PFIs depending on the selected payment method.

## Use cases:
- Remittance 
- P2P Payments
- Payment for goods and services
- Onramp and Offramp payments
- FX exchanges etc.

## How the Application Addresses Design Considerations

### 1. **Profitability**
For now, we implemented a flat transaction fee of 1% per transaction involving payment exchange.  A fixed fee will be charged for withdrawals and wallet funding in the future to ensure that every transfer generates a profit for Easewallet. These fees are added to the amount a sender wants to payout and deducted from payments received and wallet withdrawals. In the future, we plan to have an adjusted fee structure factoring currencies involved in the transaction.
PFIs onboarded on a platform will also pay a percentage ba.sed on the transactions facilitated on our platformcurrencies involved in the transaction.

### 2. **Optionality: Handling Multiple PFIs**
Easewallet handles matching offerings by displaying all available options from multiple PFIs when a user selects a currency pair for conversion or transfer. These offerings have metrics such as exchange rates, fees, aggregate ratings, estimated settlement time, number of trades, and transaction completion rate. This allows users to make informed decisions based on their priorities, whether it’s the best rate, the fastest PFI, or the most reliable service. This multi-criteria comparison provides users with flexibility and transparency when choosing between PFIs, ensuring they can always find the best option that suits their needs.

### 3. **Customer Management: DIDs and VCs**
Easewallet integrates the creation and management of Decentralized Identifiers (DIDs) directly within the app. Users can create, import, and export their portable DIDs seamlessly. Each user’s DID is stored securely within the application, and users can use it for transactions and credential verification.
For Verifiable Credentials (VCs), Easewallet is integrated with Ultimate Identity, which issues VCs through a straightforward API call. When a user performs a transaction, their identity is verified by requesting a VC from Ultimate Identity using their DID, name, and country. The credential JWT is securely stored and reused as necessary for future transactions, ensuring the user is verified and compliant with the PFIs' identity requirements.
This design ensures users can manage their identities and credentials securely while ensuring compliance with regulatory requirements.

### 4. **Customer Satisfaction Tracking**
Easewallet tracks customer satisfaction through an integrated rating and review system. After each transaction, users are prompted to rate the PFI they used by leaving a start rating and review comment. We plan to improve the rating system by adding factors such as transaction speed, fees, and overall satisfaction in our next iteration.
The application aggregates these individual ratings into an overall star rating for each PFI, which is displayed prominently alongside other offerings when users are selecting a PFI for future transactions. In addition to ratings, we track metrics such as the number of trades and transaction completion rate to give a more comprehensive view of each PFI's performance.
This combination of user feedback and performance metrics ensures that customers have a clear understanding of each PFI's quality, while also allowing PFIs to monitor and improve their services based on customer input. The system enhances transparency and encourages PFIs to maintain high standards, thereby improving overall user satisfaction. And in cases where a PFI has been consistently falling short, we remove the PFI from our platform.



## Getting Started

To clone the repository and run the project locally:

```bash
git clone https://github.com/mcnoble1/easewallet.git
cd easewallet
npm install
npm run dev
```
To start the backend seever and functions, run
```
npx convex dev
```
The Authentication uses a Resend API key which is available in the production environment.

Developed for the Africa Bitcoin Conference: TBD Hackathon.

![tbd](https://github.com/user-attachments/assets/8471902a-b579-4137-b2c6-92eea113c1f8)

![abc](https://github.com/user-attachments/assets/a0429ece-1746-4ecd-9542-52410fe82ea5)


