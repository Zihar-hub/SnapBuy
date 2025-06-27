import { useState } from 'react';
import Head from 'next/head';
import { uploadImageToStorage, analyzeImage } from '@/lib/imageProcessor';
import { searchProduct } from '@/lib/productSearch';
import { useUser } from '@/lib/useUser';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { user, signIn, signOut } = useUser();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setLoading(true);
    const imageUrl = await uploadImageToStorage(file);
    const productInfo = await analyzeImage(imageUrl);
    const matches = await searchProduct(productInfo);
    setResults(matches);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4">
      <Head>
        <title>SnapBuy</title>
      </Head>

      <header className="flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold">SnapBuy</h1>
        <button onClick={user ? signOut : signIn} className="text-sm underline">
          {user ? 'Logout' : 'Login with Google'}
        </button>
      </header>

      <main className="flex flex-col items-center">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="my-4" />
        {loading && <p className="text-lg">Analyzing image...</p>}
        <div className="grid gap-4 mt-8 w-full max-w-4xl">
          {results.map((product, i) => (
            <div key={i} className="bg-[#1e1e1e] p-4 rounded-xl shadow">
              <img src={product.image} alt="product" className="w-full rounded mb-2" />
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-sm text-gray-400">{product.description}</p>
              <p className="text-lg font-bold mt-2">${product.price}</p>
              <a href={product.link} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-400 underline">
                View Product
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
