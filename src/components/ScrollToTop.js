import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname, search } = useLocation();
    const prevLocationRef = useRef();

    useEffect(() => {
        const currentLocation = pathname + search;
        
        // Only scroll if the location actually changed
        if (prevLocationRef.current !== currentLocation) {
            // Small delay to ensure DOM is ready, then scroll to top
            const timer = setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'auto'
                });
            }, 0);
            
            prevLocationRef.current = currentLocation;
            return () => clearTimeout(timer);
        }
    }, [pathname, search]);

    return null;
};

export default ScrollToTop; 