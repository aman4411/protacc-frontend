import { useEffect } from 'react';

const useScrollToTop = (dependencies = []) => {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto' // Instant scroll for better UX
        });
    }, dependencies);
};

export default useScrollToTop; 