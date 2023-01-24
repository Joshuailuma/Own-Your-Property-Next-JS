# Own Your Property

## Overview

Own Your Property (OYP) is a decentralized web application that allows users to:

- store their property on the blockchain and access them in a decentralized manner

- tell the public that a property belongs to you and it is authetic

- solve the problem of properties being acquired illegally or stolen.

- Properties that could be stored include anything that has a serial number. E.g electronic devices(phones, laptops), cars, etc.

## Technologies used

- The front end was built using Next Js and Tailwind CSS

- The [smart contract](https://github.com/Joshuailuma/Own_your_property_hardhat) was developed using Solidity, tested compiled and deployed to **Goerli Testnet** with Hardhat

- Images and metadata are stored on IPFS and pinned to IPFS using Pinata pinning service

- The user properties stored in the blockchain are queried using [TheGraph protocol](https://github.com/Joshuailuma/Graph_Transfer_Property)

## Live site

Please note that your wallet must be connected to **Goerli Testnet** before accessing the project

Here is the live site https://own-your-property-next-js.vercel.app

## How to run the project locally

1. First, install NodeJs from https://nodejs.org

2. In your terminal run `npm install yarn`

3. Run `yarn` to install the packages used in the project

4. Finally, run the development server:

```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to use the project

### How to store a Property

1. Connect your wallet. Note that the **wallet must be connected to Goerli Testnet**
2. Get some GoerliETH from [Goerlifaucet](https://goerlifaucet.com/)
3. Navigate to `My Properties` page
4. Click on Add a Property

![screenshot1](https://github.com/Joshuailuma/Own-Your-Property-Next-JS/blob/main/screenshot1.png?raw=true)

5. Follow the intructions on the page by filling in the necessary details, uploading an image of the property and clicking the buttons below accordingly.

![screenshot2](https://github.com/Joshuailuma/Own-Your-Property-Next-JS/blob/main/screenshot2.2.png?raw=true)

- After clicking `Upload to blockchain` button, please wait for confirmation from the blockhain. This might take more than 2 minutes

![screenshot3](https://github.com/Joshuailuma/Own-Your-Property-Next-JS/blob/main/screenshot3.3.png?raw=true)

6. Navigate to `My Properties` page and refresh the page to see the new stored property
   ![screenshot4](https://github.com/Joshuailuma/Own-Your-Property-Next-JS/blob/main/screenshot4.png?raw=true)

### How to transfer a Property to a buyer or new owner

1. Connect your wallet. Note that the **wallet must be connected to Goerli Testnet**
2. Navigate to `My Properties` page
3. Click on the property you want to transfer
4. Click on "Get approval" to enable you transfer the property
5. Click on the transfer button and input the address of the new owner or buyer.

![screenshot5](https://github.com/Joshuailuma/Own-Your-Property-Next-JS/blob/main/screenshot5.png?raw=true)

## License

MIT
