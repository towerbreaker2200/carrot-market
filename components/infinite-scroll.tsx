import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface ResponseData<T> {
  ok: boolean;
  list: T[];
}

const usePage = <T = any,>(api: string) => {
  const [page, setPage] = useState(1);
  const [mergedData, setMergedData] = useState<T[]>([]);
  const { data } = useSWR<ResponseData<T>>(`${api}?page=${page}`);
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      setPage((prev) => prev + 1);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setPage, page]);
  const router = useRouter();
  const goback = api.slice(4);
  useEffect(() => {
    if (data) setMergedData((prev) => prev?.concat(data?.list));
  }, [data]);
  useEffect(() => {
    if (data?.ok === false) {
      router.push(`${goback}`);
    }
  }, [data, router]);
  return mergedData;
};

export default usePage;
