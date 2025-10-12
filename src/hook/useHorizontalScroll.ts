import { useEffect, useRef } from "react";

export default function useHorizontalScroll(containerId: string) {
  const currentSectionRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const scrollThrottleRef = useRef(false);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const sections = container.querySelectorAll("section");
    const totalSections = sections.length;

    // ✅ FIX: Chặn scroll của body/html
    const preventBodyScroll = () => {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.documentElement.style.height = "100vh";
    };

    const restoreBodyScroll = () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.height = "";
    };

    preventBodyScroll();

    const scrollToSection = (sectionIndex: number) => {
      if (isAnimatingRef.current) return;

      // ✅ Clamp TRƯỚC và dùng luôn
      sectionIndex = Math.max(0, Math.min(sectionIndex, totalSections - 1));

      // Không làm gì nếu đã ở section này
      if (sectionIndex === currentSectionRef.current) {
        scrollThrottleRef.current = false;
        return;
      }

      isAnimatingRef.current = true;

      const targetScroll = sectionIndex * window.innerWidth;
      const startScroll = currentSectionRef.current * window.innerWidth;
      const distance = targetScroll - startScroll;
      const duration = 800; // Giảm xuống cho responsive hơn
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-in-out cubic)
        const easeProgress =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const currentScroll = startScroll + distance * easeProgress;
        container.style.transform = `translateX(-${currentScroll}px)`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          currentSectionRef.current = sectionIndex;
          isAnimatingRef.current = false;
          scrollThrottleRef.current = false; // ✅ Reset ngay sau animation
        }
      };

      requestAnimationFrame(animate);
    };

    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();

      // Bỏ qua nếu đang animate hoặc đang throttle
      if (isAnimatingRef.current || scrollThrottleRef.current) return;

      // Kích hoạt throttle NGAY
      scrollThrottleRef.current = true;

      // Xác định hướng scroll
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSection = currentSectionRef.current + direction;

      // ✅ Scroll luôn, scrollToSection sẽ tự clamp
      scrollToSection(nextSection);
    };

    // Hỗ trợ phím mũi tên
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current || scrollThrottleRef.current) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollThrottleRef.current = true;
        scrollToSection(currentSectionRef.current + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollThrottleRef.current = true;
        scrollToSection(currentSectionRef.current - 1);
      }
    };

    // Touch swipe
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (isAnimatingRef.current || scrollThrottleRef.current) return;

      const swipeDistance = touchStartX - touchEndX;
      const minSwipeDistance = 50;

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        scrollThrottleRef.current = true;
        const direction = swipeDistance > 0 ? 1 : -1;
        scrollToSection(currentSectionRef.current + direction);
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [containerId]);
}
