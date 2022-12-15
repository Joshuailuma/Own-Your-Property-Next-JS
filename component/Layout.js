import Nav from './Nav'
// This makes stuff to display on all pages
const Layout = ({children}) => {
  return (
    <>
    <Nav/>
    <div >
        <main >{children}</main>
    </div>
    </>
  )
}

export default Layout