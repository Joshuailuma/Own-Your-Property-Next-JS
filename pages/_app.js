import '../styles/globals.css'
import { MoralisProvider } from 'react-moralis'
import { NotificationProvider } from '@web3uikit/core'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import Router from "next/router";
import {FidgetSpinner} from "react-loader-spinner";
import NavBar from '../components/NavBar';
import React from 'react';


const Client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/39622/own_your_property/v0.0.22",
})
function MyApp({ Component, pageProps: { session, ...pageProps }, }) {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const start = () => {
      //"start"
      setLoading(true);
    };
    const end = () => {
      //"finished
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return(
    <>
     {loading ? (
       <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={Client}>
       <NotificationProvider>
       <div className={"flex my-56 justify-center align-center"}>
        <NavBar/>
        <FidgetSpinner
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
        ballColors={['#ff0000', '#00ff00', '#0000ff']}
        backgroundColor="#F4442E"
        visible={true}
      />
      <div className={"font-serif ml-4"}>Please wait or refresh after a long time</div>
      </div>
       </NotificationProvider>
       </ApolloProvider>   
     </MoralisProvider>
        
      ) : (
        <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={Client}>
        <NotificationProvider>
    <Component {...pageProps} />
        </NotificationProvider>
        </ApolloProvider>
  </MoralisProvider>
      )}
    </>

      
    )
}

export default MyApp
