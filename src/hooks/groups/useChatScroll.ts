import { useCallback, useRef, useEffect } from "react";

interface UseChatScrollProps {
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

export function useChatScroll({
  onLoadMore,
  isLoadingMore,
  hasMore,
}: UseChatScrollProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousScrollTop = useRef<number>(0);
  const previousScrollHeight = useRef<number>(0);

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !onLoadMore || isLoadingMore || !hasMore)
      return;

    const container = containerRef.current;
    const threshold = 50;

    if (container.scrollTop <= threshold) {
      // Store scroll position before loading
      previousScrollTop.current = container.scrollTop;
      previousScrollHeight.current = container.scrollHeight;
      onLoadMore();
    }
  }, [onLoadMore, isLoadingMore, hasMore]);

  // Restore scroll position after loading more messages
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // When loading finishes, maintain scroll position
    if (!isLoadingMore && previousScrollHeight.current > 0) {
      const newScrollHeight = container.scrollHeight;
      const heightDifference = newScrollHeight - previousScrollHeight.current;
      
      if (heightDifference > 0) {
        container.scrollTop = previousScrollTop.current + heightDifference;
      }
      
      // Reset stored values
      previousScrollTop.current = 0;
      previousScrollHeight.current = 0;
    }
  }, [isLoadingMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { containerRef, scrollToBottom };
}