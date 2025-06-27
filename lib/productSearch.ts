import axios from 'axios';

export async function searchProduct(query: string): Promise<any[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY;
  const cx = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID;
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${cx}&key=${apiKey}`;
  const res = await axios.get(url);
  return res.data.items.map((item: any) => ({
    title: item.title,
    link: item.link,
    image: item.pagemap?.cse_image?.[0]?.src || '',
    description: item.snippet,
    price: '—',
  }));
}
