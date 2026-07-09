import { useEffect } from 'react';

const useScrollToTop = (dependencies = []) => {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto' // Instant scroll for better UX
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
};

export default useScrollToTop; 