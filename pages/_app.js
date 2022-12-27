import '../styles/globals.css'
import Layout from '../component/Layout'
import { MoralisProvider } from 'react-moralis'
import { NotificationProvider } from '@web3uikit/core'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/39622/own_your_property/v0.0.16",
})
function MyApp({ Component, pageProps: { session, ...pageProps }, }) {
  return(
      <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={client}>
        <NotificationProvider>
        <Layout> 
    <Component {...pageProps} />
  </Layout> 
        </NotificationProvider>
        </ApolloProvider>
  </MoralisProvider>
    )
}

export default MyApp
