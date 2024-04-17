export const EURUSD = 'https://beta.forextester.com/data/api/Metadata/bars/chunked?Broker=Advanced&Symbol=EURUSD&Timeframe=1&Start=57674&End=59113&UseMessagePack=false'

export const USDJPY = 'https://beta.forextester.com/data/api/Metadata/bars/chunked?Broker=Advanced&Symbol=USDJPY&Timeframe=1&Start=57674&End=59113&UseMessagePack=false'

interface FetchDataResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export async function fetchData<T>(url: string): Promise<FetchDataResponse<T>> {
  let call = url
  if (url === 'EURUSD') call = EURUSD 
  if (url === 'USDJPY') call = USDJPY
  
  try {
    const response = await fetch(call);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: T = await response.json();
    return { data, loading: false, error: null };
  } catch (error:any) {
    return { data: null, loading: false, error: error.message };
  }
}

export function convertTimestampToDateString(timestamp: number| null): string {
  if (!timestamp) return ""
  const date = new Date(timestamp * 1000); // JavaScript Date constructor accepts milliseconds, so multiply by 1000
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}