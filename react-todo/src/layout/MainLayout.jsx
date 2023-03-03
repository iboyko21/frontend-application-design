import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = (props) => {
    return (
        <>
            <Header />
            <main>
                {props.children}
            </main>
            <Footer />
        </>
    );
}

export default MainLayout;