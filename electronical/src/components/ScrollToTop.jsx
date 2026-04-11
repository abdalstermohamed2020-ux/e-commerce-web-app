import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // كود يخلي الصفحة تطلع فوق خالص بأول ما الـ pathname يتغير
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // المكون ده مش بيعرض حاجة، هو بينفذ وظيفة بس
};

export default ScrollToTop;