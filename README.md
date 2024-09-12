# Easewallet - Make Cross-border payments with ease

Easewallet is a decentralized wallet application developed for the **Africa Bitcoin Conference: TBD Hackathon**. The wallet leverages the **tbDEX SDK** to facilitate fast, secure, and compliant cross-border payments by integrating with a sandbox of liquidity providers (PFIs). Easewallet allows users to send and receive funds, manage their decentralized identifiers (DIDs), and securely validate their identity through Verifiable Credentials (VCs).

## Features

- **Send and Receive Funds:** Users can send and receive funds through PFIs using tbDEX. Supported currency pairs include GHS to USDC, USD to EUR, USD to KES, and more.
- **DID Management:** Users can create, export, and import their decentralized identifiers (DIDs) for use in transactions.
- **Identity Verification & Verifiable Credentials:** Easewallet integrates with **Ultimate Identity** to issue Verifiable Credentials (VCs) required by PFIs for compliance.
- **Transaction History:** A detailed transactions table is provided, showing transaction status and history.
- **PFI Ratings and Reviews:** Users can leave ratings and reviews for PFIs after completing transactions. Each PFI has a dedicated page with an aggregate rating, reviews, number of trades, and completion rate.
- **Fee Structure:** A flat transaction fee of 1% is applied to all transactions, with future improvements planned for a tiered and dynamic fee model.

## Use cases:
- Remittance
Administrators can oversee and manage user 

- P2P Payments
Enable administrators to see the feedback 

- Payments for goods and services
Enable administrators to create and 

- Onramp and Offramp payments
Administrators can add and manage workers

## How the Application Addresses Design Considerations

### 1. **Profitability**
We implemented a **1% transaction fee** across all transfers, ensuring the wallet generates revenue from each transaction. In the future, we'll implement a **tiered fee structure**, offering lower fees for larger transactions to encourage high-volume users. Additional features include offering discounts for frequent users, subscription plans, and potential profit-sharing for users who provide feedback through our rating system.

### 2. **Optionality: Handling Multiple PFIs**
Easewallet displays multiple PFI offerings based on the selected currency pair. Users are presented with detailed information such as **exchange rates, transaction fees, aggregate PFI ratings, number of trades, and completion rate** to help them choose the best option. This ensures flexibility and transparency, allowing users to select a PFI based on their priorities (cost, speed, reliability).

### 3. **Customer Management: DIDs and VCs**
Easewallet handles customer management by allowing users to create, import, and export **Decentralized Identifiers (DIDs)**. For identity verification, the app integrates with **Ultimate Identity** to issue **Verifiable Credentials (VCs)**. These credentials are securely stored and reused for future transactions, ensuring compliance with PFI requirements and maintaining user privacy.

### 4. **Customer Satisfaction Tracking**
We’ve integrated a **rating and review system** that prompts users to rate PFIs after each transaction. Users can provide feedback on factors such as **transaction speed, fees, and overall experience**. These ratings are aggregated and displayed for future users when selecting a PFI. The **completion rate** and **number of trades** are also tracked to give users a fuller understanding of each PFI’s performance.

## Getting Started

To clone the repository and run the project locally:

```bash
git clone https://github.com/your-username/easewallet.git
cd easewallet
npm install
npm start
```

Developed for the Africa Bitcoin Conference: TBD Hackathon.
