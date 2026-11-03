"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Heart, Menu, ShoppingCart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AccountDropdown } from "@/components/account-dropdown";
import { useStore } from "@/lib/store";

const imageOffsets = ["-1.12%", "-1.56%", "-1.99%", "-0.25%", "-0.25%", "-6.56%", "-1.99%", "-1.34%", "-1.56%", "-1.77%", "-0.25%", "-2.42%"];
const products = Array.from({ length: 12 }, (_, index) => ({
  name: index === 0 ? "Oversized Sheer Knitted Jumper" : "Slim V Neck Limited Pique Polo",
  price: "N40, 000 ($44)",
  image: `/images/catalog-${index + 1}.png`,
  imageOffset: imageOffsets[index],
}));

function getPage(rawPage: string | null) {
  const parsedPage = rawPage ? Number(rawPage) : 1;
  return Number.isInteger(parsedPage) && parsedPage >= 1 && parsedPage <= 100 ? parsedPage : 1;
}

function CatalogPagination() {
  const searchParams = useSearchParams();
  const page = getPage(searchParams.get("page"));
  const changePage = (nextPage: number) => {
    const safePage = Math.min(100, Math.max(1, nextPage));
    const params = new URLSearchParams(searchParams.toString());
    if (safePage === 1) params.delete("page");
    else params.set("page", String(safePage));
    const query = params.toString();
    window.history.pushState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  };

  return <nav className="catalog-pagination" aria-label="Product pages">
    <Button variant="outline" className="catalog-page-button" onClick={() => changePage(page - 1)} disabled={page === 1} aria-label="Go to previous product page" aria-controls="product-list"><ChevronLeft aria-hidden="true" />Previous</Button>
    <div className="catalog-page-count"><span id="pagination-status" className="sr-only" role="status" aria-live="polite" aria-atomic="true">Page {page} of 100. Showing the same 12 products.</span><Button variant="outline" aria-current="page" aria-label={`Page ${page}, current page`} aria-describedby="pagination-status">{page}</Button><span aria-hidden="true">of</span><span className="sr-only">100</span><span aria-hidden="true">100</span></div>
    <Button className="catalog-page-button catalog-next" onClick={() => changePage(page + 1)} disabled={page === 100} aria-label="Go to next product page" aria-controls="product-list">Next<ChevronRight aria-hidden="true" /></Button>
  </nav>;
}

function PaginationFallback() {
  return <nav className="catalog-pagination" aria-label="Product pages"><span className="sr-only" role="status">Loading page navigation</span></nav>;
}

export default function ProductsCatalog() {
  const { cartCount, wishlistProductIds, toggleWishlist } = useStore();
  const [sort, setSort] = useState("featured");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const displayedProducts = [...products].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "price-low" || sort === "price-high") return 0;
    return 0;
  });

  return <>
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <header className="site-header catalog-header" id="top">
      <div className="header-top" onKeyDown={(event) => { if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuButtonRef.current?.focus(); } }}>
        <Button ref={menuButtonRef} className="mobile-menu" variant="ghost" size="icon" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="catalog-navigation" onClick={() => setMenuOpen(!menuOpen)}><Menu aria-hidden="true" /></Button>
        <Link className="brand" href="/" aria-label="Urban Styles home"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>URBAN<sup>TM</sup></span></Link>
        <nav id="catalog-navigation" className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation"><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link><Link href="/#about" onClick={() => setMenuOpen(false)}>About</Link><Link href="/products" aria-current="page" onClick={() => setMenuOpen(false)}>Product</Link><Link href="/#products" onClick={() => setMenuOpen(false)}>Wishlist{wishlistProductIds.length > 0 && <span className="cart-count nav-count" aria-hidden="true">( {wishlistProductIds.length} )</span>}</Link><Link href="/#contact" onClick={() => setMenuOpen(false)}>Contact us</Link></nav>
      </div>
      <div className="header-tools">
        <form className="search-form" role="search" action="/search" method="get"><label className="sr-only" htmlFor="catalog-search">Search products</label><Image className="search-icon" src="/images/search.svg" alt="" width={24} height={24} aria-hidden="true" /><input id="catalog-search" type="search" placeholder="Search" name="q" /></form>
        <Button variant="ghost" className="header-cart" aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}><ShoppingCart aria-hidden="true" /><span className="cart-count" aria-hidden="true">( {cartCount} )</span></Button>
        <AccountDropdown />
      </div>
    </header>

    <main id="main-content" className="catalog-main" tabIndex={-1}>
      <section className="catalog-section" aria-labelledby="products-title">
        <div className="catalog-heading">
          <h1 id="products-title" tabIndex={-1}>All products</h1>
          <div className="catalog-sort"><label className="sr-only" htmlFor="sort-products">Sort products</label><select id="sort-products" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Sort By</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select><ChevronDown aria-hidden="true" /></div>
        </div>
        <ul id="product-list" className="catalog-grid" aria-label="All products">
          {displayedProducts.map((product, index) => {
            const id = `${product.name}-${product.image}`;
            const isSaved = wishlistProductIds.includes(id);
            return <li className="catalog-card" key={product.image}>
              <div className="catalog-image-wrap">
                <Link className="catalog-image-link" href="/product/oversized-bear-vest" aria-label={`View ${product.name} product details`}><Image src={product.image} alt={`image of ${product.name}`} width={675} height={1013} sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" priority={index < 3} style={{ position: "absolute", width: "100%", height: "135.72%", top: product.imageOffset, objectFit: "fill" }} /></Link>
                <Button variant="outline" size="icon" className={`catalog-wishlist${isSaved ? " is-saved" : ""}`} aria-label={`${isSaved ? "Remove" : "Add"} ${product.name} ${isSaved ? "from" : "to"} wishlist`} aria-pressed={isSaved} onClick={() => toggleWishlist(id, product.name, product.price)}><Heart aria-hidden="true" fill={isSaved ? "currentColor" : "none"} /></Button>
              </div>
              <div className="catalog-card-info"><div><h2><Link href="/product/oversized-bear-vest">{product.name}</Link></h2><p>{product.price}</p></div></div>
            </li>;
          })}
        </ul>
        <Suspense fallback={<PaginationFallback />}><CatalogPagination /></Suspense>
      </section>
    </main>

    <footer className="site-footer catalog-footer" id="contact"><div className="footer-logo-row"><span /><Link className="brand footer-brand" href="/" aria-label="Urban Styles home"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>URBAN<sup>TM</sup></span></Link><span /></div><nav className="footer-nav" aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/#about">About</Link><Link href="/products" aria-current="page">Product</Link><Link href="/#products">Wishlist</Link><Link href="/#products">Cart</Link><Link href="/#contact">Contact us</Link></nav><div className="footer-info"><section><h2>Contact</h2><address>Email: Support@Urbanstyles.Com<br />Phone: (555) 555-5555, (222) 222-2222<br />No 22, Lekki Ajah Complex Hall</address></section><section><h2>Socials</h2><a href="https://twitter.com">Twitter</a><a href="https://instagram.com">Instagram</a><a href="https://facebook.com">Facebook</a></section><section><h2>Business Hours</h2><p>Monday to Friday: 9:00 AM to 6:00 PM (EST)<br />Saturday: 12:00 AM to 6:00 PM (EST)<br />Closed on Sunday</p></section></div><div className="footer-terms"><Link href="/#contact">Terms &amp; Condition</Link></div></footer>
  </>;
}

