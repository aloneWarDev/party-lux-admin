import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import './FullPageLoader.css';
import ContentLoader from 'react-content-loader'

function FullPageLoader() {
    useEffect(() => {
        AOS.init();
    }, [])

    return (
        <React.Fragment>
            <div className="fullpage-loader-holder">
                <div className="fullpage-loader">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="shadow"></div>
                    <div className="shadow"></div>
                    <div className="shadow"></div>
                </div>
            </div>
        </React.Fragment>
        // <ContentLoader height="500" width="1000" viewBox="0 0 265 230" {...rest}>
        //     <rect x="15" y="15" rx="4" ry="4" width="350" height="25" />
        //     <rect x="15" y="50" rx="2" ry="2" width="350" height="150" />
        //     <rect x="15" y="230" rx="2" ry="2" width="170" height="20" />
        //     <rect x="60" y="230" rx="2" ry="2" width="170" height="20" />
        // </ContentLoader>
    );
};

export default FullPageLoader;