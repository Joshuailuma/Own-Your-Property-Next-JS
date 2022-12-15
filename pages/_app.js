import '../styles/globals.css'
import Layout from '../component/Layout'
import {SessionProvider} from 'next-auth/react'
import { MoralisProvider } from 'react-moralis'
function MyApp({ Component, pageProps: { session, ...pageProps }, }) {
  return(
    <SessionProvider session={session}>
      <MoralisProvider initializeOnMount={false}>
       <Layout> 
    <Component {...pageProps} />
  </Layout> 
  </MoralisProvider>
  </SessionProvider>
    )
}

export default MyApp
