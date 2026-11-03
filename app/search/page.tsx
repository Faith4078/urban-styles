import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const products = [
  { name: "Slim V Neck Limited Pique Polo", price: "₦40,000", image: "/images/product-1.png" },
  { name: "Everyday Essential Polo", price: "₦40,000", image: "/images/product-2.png" },
  { name: "Classic Fit Pique Polo", price: "₦40,000", image: "/images/product-3.png" },
  { name: "Urban Signature Shirt", price: "₦52,000", image: "/images/product-4.png" },
  { name: "Relaxed Weekend Shirt", price: "₦48,000", image: "/images/product-5.png" },
  { name: "City Walk Sneakers", price: "₦65,000", image: "/images/product-6.png" },
  { name: "Everyday Leather Loafers", price: "₦72,000", image: "/images/product-7.png" },
  { name: "Essential Streetwear", price: "₦55,000", image: "/images/product-8.png" },
];

async function SearchResults({ searchParams }: PageProps<"/search">) {
  const { q = "" } = await searchParams;
  const query = (Array.isArray(q) ? q[0] ?? "" : q).trim();
  const results = query ? products.filter((product) => product.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())) : [];

  return <main className="search-results" id="main-content">
    <Link href="/#main-content" className="text-link">Back to Urban Styles</Link>
    <h1>Search results</h1>
    <p className="search-query">{query ? `Results for “${query}”` : "Enter a product name in the search field."}</p>
    {query && results.length === 0 ? <p role="status">No products matched “{query}”. Try another search.</p> : <ul className="product-grid" aria-label={`Products matching ${query}`}>
      {results.map((product) => <li className="product-card" key={product.name}><Link href="/product/oversized-bear-vest" aria-label={`View ${product.name} product details`}><div className="product-image"><Image src={product.image} alt={`image of ${product.name}`} fill sizes="(max-width: 600px) 48vw, 23vw" /></div><div className="product-details"><div><h2>{product.name}</h2><p className="product-price">{product.price}</p></div></div></Link></li>)}
    </ul>}
  </main>;
}

export default function SearchPage(props: PageProps<"/search">) {
  return <Suspense fallback={<main className="search-results" id="main-content"><p role="status">Loading search results…</p></main>}><SearchResults {...props} /></Suspense>;
}
