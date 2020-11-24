import useSWR from 'swr';
import API from './index';


export const useProjects = ()=>{
  const { data, error, mutate } = useSWR( '/projects', API.fetcher );

  return {
    projectsList: (data && data.data),
    links: data && data.links,
    meta: data && data.meta,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}